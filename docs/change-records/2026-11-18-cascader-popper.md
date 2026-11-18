# 2026-11-18 Cascader 能力补齐与浮层统一配置

## 背景

crmx-web 有一个自研外壳 `crmGroupSelect`，内部已经在用 `HzqCascaderPanel`，但外壳自己实现了触发器、标签、弹层与搜索。要把外壳收敛掉，hzq-cascader 需要先补齐几项通用能力；同时主应用 + micro-app 场景下浮层存在被裁切、被遮盖、被推回的问题，根因是浮层的挂载容器与边界元素没有统一入口。

本次改动分两部分：**Cascader 四项能力**、**浮层统一配置**。

## 一、Cascader

### change 事件新增第二参 nodes

```js
// 之前
@change="(value) => {}"
// 之后
@change="(value, nodes) => {}"   // nodes: 选中节点对应的原始 option 数组
```

- 多选：`panel.getCheckedNodes(leafOnly)` 取得节点后取 `node.data`，`leafOnly = !checkStrictly`。
- 单选：`getNodeByValue` 取到节点返回 `[node.data]`。
- 无选中、清空：`[]`。
- `panel` 未初始化时安全返回 `[]`。
- 外部直接改 value 导致 panel 内部值慢一拍时，退化为按末级值反查，保证与第一参顺序一致。

第一参 `value` 语义不变。

### value-compat 属性

后端通常只存叶子 id，直接传给 value 会回显为空。开启 `value-compat` 后：

```html
<hzq-cascader v-model="value" :options="options" value-compat />
```

- 多选：一维数组视为末级值数组，逐项补全为 `emitPath` 路径；任一节点查不到则整体透传，不做部分补全。
- 单选：仅当「长度 1 + 是叶子 + 完整路径更长」时补全。
- `props.emitPath === false`、`panel` 未就绪、非数组：一律原值透传，不清空、不报错。
- `mounted`、`value` watcher、`options` watcher（异步 options 到达）三处统一走 `syncValue()`。
- 只有归一化结果与当前 `checkedValue` 不同才赋值，因此最多正常 emit 一次 `input` / `change`，不会成环。

:::warning 接入注意
开启后组件在 mounted 阶段可能 emit 一次 `input` / `change`（把完整路径写回 v-model）。若调用方用 `change` 判断「用户主动改过」，需要忽略首次 emit。
:::

### popover-trigger 属性

```html
<hzq-cascader ref="cascader" popover-trigger="manual" />
```

- 默认 `click`，行为与之前完全一致。
- `manual`：点击输入框、箭头、Enter、方向键都不再切换下拉层，只能外部调用 `toggleDropDownVisible(visible?)`。
- `v-clickoutside`、`esc` / `tab`、选中后自动关闭仍然保留。

### remove-tag 新增 index

```js
@remove-tag="(value, index) => {}"
```

第一参保持原语义（`checkedValue.find(...)` 的结果，可能为 `undefined`，未顺手修改）。

## 二、浮层统一配置

### 为什么需要

| 问题 | 原实现 |
| --- | --- |
| 挂载点硬编码 | `vue-popper.js` 里 `document.body.appendChild` |
| 边界无处配置 | 只能由各组件自己往 `popperOptions` 里塞，10 个 `PopperMixin` 使用者各写各的 |
| tooltip 服务绕过 mixin | `tooltip-service.vue` 直接 `new Popper`，连 `popperOptions` 都不走 |
| 微前端容器晚于安装 | 容器由主应用注入，装插件时可能还不存在 |

### 用法

```js
Vue.use(HZQUI, {
  popper: {
    appendTo: 'micro-app-body',      // 挂载容器：选择器 / 元素 / 函数，默认 'body'
    boundariesElement: 'viewport',   // 边界：关键字 / 选择器 / 元素 / 函数，默认 'viewport'
    boundariesPadding: 8,            // 边界留白，不设则沿用组件或 popper 默认
    zIndex: 3000                     // 层级起始值，默认 2000
  }
});
```

不走全量注册的接入方（如只注册部分组件的宿主）可单独调用：

```js
import { setPopperConfig } from 'hzq-ui';

setPopperConfig({ appendTo: () => document.querySelector('.app-container') });
```

### 优先级

1. 组件自身 `popper-options`
2. 全局 `popper` 配置
3. 库内 popper `DEFAULTS`

### 实时解析

`appendTo` 与 `boundariesElement` 都是**每次创建浮层时**才解析，不缓存元素。字符串按选择器查找，函数每次调用，解析失败回落到 `document.body` / `'viewport'`。

### 两种配置入口的一致性

`opts.zIndex`（旧写法）与 `opts.popper.zIndex` 同时给出时以后者为准；install 内统一走一次 `setPopperConfig` 写入 `PopupManager.zIndex`，`$HZQ.zIndex` 取同一个值，不会两处各存一份。

## 三、修复的两个真实问题

### 1. boundariesElement 解析失败会静默失效

原实现选择器未命中时把字符串原样透传。查 vendored popper 的 `_getBoundaries`：它只认 `'window'` / `'viewport'` 两个关键字或真实元素，其它一律走 `getOffsetRect(element)`，对字符串取 `offsetWidth` / `offsetLeft` 全得 `undefined`，边界算成 `NaN`。结果是**不报错但完全不约束位置**——配置者以为生效了。

已改为回落 `'viewport'`。

### 2. beforeDestroy 只在父节点是 body 时清理

```js
if (this.popperElm && this.popperElm.parentNode === document.body) { ...removeChild... }
```

挂到自定义容器后这个判断不成立，DOM 不会被移除，长时间使用会堆积。已改为判断 `parentNode` 是否存在。

## 四、兼容性

- 所有新属性默认关闭或保持原行为，现有调用方无需改动。
- `remove-tag` 第一参语义不变；新增第二参不破坏已有监听器。
- `createPopper` 改为克隆 `popperOptions` 后再合并，不再原地改写组件实例上的对象。原先 `placement` / `offset` / `arrowOffset` 写在 `options` 上的行为保持不变（现在写在克隆上）。
- 未改 vendored `src/utils/popper.js`。

## 五、已知限制

- `$tooltip` 服务使用全局单例，只在首次调用时挂载，之后再改 `appendTo` 不会迁移已有实例。
- `tooltip-service.vue` 自身的 `boundariesPadding: 10` 视为组件自身值，优先于全局配置；仅在全局显式设置 `boundariesPadding` 时覆盖。
- 多个子应用各自持有独立 `PopupManager` 与计数器，均从 2000 起，共享同一 document 时会撞号。需要错开时，各子应用在 `Vue.use` 里给不同 `zIndex`。

## 六、涉及文件

新增：

- `src/utils/popper-config.js`
- `test/unit/specs/util.popper-config.spec.js`
- `docs/change-records/2026-11-18-cascader-popper.md`

修改：

- `packages/cascader/src/cascader.vue`
- `types/cascader.d.ts`
- `src/utils/vue-popper.js`
- `packages/tooltip/src/tooltip-service.js`
- `packages/tooltip/src/tooltip-service.vue`
- `build/bin/build-entry.js`、`src/index.js`（后者由脚本重新生成）
- `types/element-ui.d.ts`
- `web-types.json`
- `examples/docs/zh-CN/cascader.md`、`init-options.md`、`popup-guide.md`
- `CHANGELOG.zh-CN.md`、`PROJECT_SUMMARY.md`
- `test/unit/specs/cascader.spec.js`、`util.vue-popper.spec.js`

## 七、验证

- 全量 karma：`Executed 1062 of 1062 (1 FAILED)`，唯一失败为 `Button > loading implies disabled`，在未改动的 HEAD 上复现同样失败，属既有问题（jQuery 风格的 `$el.click()` 在 HeadlessChrome 下不再触发原生 click），与本次改动无关。
- 本次新增 / 相关 spec：31 passed（popper-config 12 + vue-popper 19）。
- `npx eslint` 全部改动文件：0 error。
- `web-types.json`：`JSON.parse` 校验通过。
