## 浮层层级管理

组件库里的浮层（对话框、下拉、气泡、消息提示）共用一套层级机制，保证**后打开的永远盖住先打开的**，并且按下 `Esc` 只会关闭最上面那一层。

自己开发浮层组件时，不要手动指定一个很大的 `z-index`，而是接入这套机制。

:::tip
本文面向**在组件库内开发新组件**的场景。如果你只是想在业务页面里使用已有组件，不需要关心这些内容，正常的 `v-model` 用法就够了。
:::

### 三层结构

浮层的层级由三部分协作完成：

| 层 | 位置 | 职责 |
| --- | --- | --- |
| 静态层级 | `common/var.scss` | 提供 Sass 变量，作为 CSS 兜底 |
| 运行时分配 | `src/utils/popup/popup-manager.js` | 每次打开浮层时发一个新号，保证递增 |
| 弹窗栈 | 同上 | 管理遮罩层，决定 `Esc` 关闭哪一层 |

### 静态层级

```scss
$--index-normal: 1 !default;      // 组件内部相互遮挡
$--index-top: 1000 !default;      // 高于普通页面内容
$--index-popper: 2000 !default;   // 浮层默认值
```

各组件用法：

| 数值 | 用途 | 使用者 |
| --- | --- | --- |
| `$--index-normal` ±1 | 组件内部装饰层 | Carousel、Checkbox、Tabs、Slider |
| `$--index-top` | 面板类浮层 | TimePicker、ColorPicker |
| `$--index-top + 1` | 下拉列表 | SelectDropdown |
| `$--index-popper` | 浮层 CSS 兜底 | Popover、Tooltip |

:::warning
CSS 里的 `z-index` 只是**初始值**。浮层打开时会被行内样式覆盖成运行时分配的值，所以这里的数字只影响未接入 JS 管理的场景。
:::

### 运行时分配

核心只有一个方法：

```js
import PopupManager from 'hzq-ui/src/utils/popup/popup-manager';

const zIndex = PopupManager.nextZIndex();  // 返回当前值，并把计数器 +1
```

计数器起点默认是 `2000`，可以通过全局配置修改：

```js
Vue.use(HZQUI, { zIndex: 5000 });
```

这在把组件库嵌入已有 `z-index` 体系的老系统时很有用。

### 一个最小示例

```js
import PopupManager from 'hzq-ui/src/utils/popup/popup-manager';

export default {
  methods: {
    open() {
      const el = this.$refs.panel;
      document.body.appendChild(el);
      // 取号要在挂到 body 之后、显示之前
      el.style.zIndex = PopupManager.nextZIndex();
      el.style.display = 'block';
    }
  }
};
```

### 接入 Popup mixin

大多数浮层不需要自己调 `nextZIndex()`，用 `Popup` mixin 即可，它会自动处理注册、取号、遮罩和销毁。

```js
import Popup from 'hzq-ui/src/utils/popup';

export default {
  name: 'HzqMyPopup',
  mixins: [Popup],
  props: {
    // mixin 已提供 visible、zIndex、modal、lockScroll 等，这里只加业务需要的
    title: String
  },
  template: `
    <div v-show="visible" class="hzq-my-popup">
      <slot></slot>
    </div>
  `
};
```

mixin 帮你做的事：

| 时机 | 行为 |
| --- | --- |
| `beforeMount` | 向 PopupManager 注册实例 |
| `doOpen` | 调用 `nextZIndex()` 并写入行内样式 |
| `modal: true` | 创建遮罩层并压入弹窗栈 |
| `lockScroll: true` | 锁定 body 滚动，补偿滚动条宽度 |
| `beforeDestroy` | 注销实例、关闭遮罩、恢复 body 样式 |

可以透传的 props：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| visible | 是否显示 | boolean | false |
| zIndex | 指定起始层级；设置后会改写全局计数器 | number | — |
| modal | 是否显示遮罩 | boolean | false |
| modalFade | 遮罩是否有淡入淡出 | boolean | true |
| modalClass | 遮罩附加类名 | string | — |
| modalAppendToBody | 遮罩是否挂到 body | boolean | false |
| lockScroll | 是否锁定 body 滚动 | boolean | true |
| closeOnPressEscape | `Esc` 是否关闭 | boolean | false |
| closeOnClickModal | 点击遮罩是否关闭 | boolean | false |

### 只用定位，不要弹窗行为

如果只想让元素跟着触发位置走（下拉、提示），用 `vue-popper` mixin 更轻量：

```js
import Popper from 'hzq-ui/src/utils/vue-popper';

export default {
  mixins: [Popper],
  props: {
    appendToBody: { type: Boolean, default: true }
  }
};
```

它会在创建和每次更新位置时调用 `nextZIndex()`，所以浮层被拖动或内容变化后依然在最上层。

### 弹窗栈与 Esc

`PopupManager` 内部维护一个 `modalStack`，只对 `modal: true` 的浮层生效：

- 遮罩层全局只有一个，层级跟随栈顶
- 按 `Esc` 时读取**栈顶**实例，调用它的 `handleClose` / `handleAction('cancel')` / `close()`
- 栈未空时不移除遮罩，避免多级弹窗之间闪烁

所以多级弹窗（在对话框里再开一个对话框）不需要额外处理，按顺序关闭即可。

### 常见错误

:::warning
**不要写死大数字**

```scss
z-index: 9999;  // ❌ 会永久压住所有后续弹出的 Dialog、Tooltip
```

运行时计数器从 2000 开始递增，`9999` 会排在它前面，用户无法点到被遮挡的浮层。
:::

:::warning
**浮层一定要追加到 body**

如果浮层留在父容器内，而祖先元素有 `overflow: hidden` 或 `transform`，`z-index` 再高也没用 —— 前者会裁掉超出部分，后者会创建新的层叠上下文把浮层困在内部。
:::

:::warning
**祖先元素带 transform 会让内部 z-index 失效**

`transform`、`filter`、`perspective`、`will-change` 都会创建层叠上下文。做动画时不要在浮层的包裹层上加这些属性，否则内部所有 `z-index` 都只在该上下文内比较。
:::

### 手动取号的注意事项

| 场景 | 做法 |
| --- | --- |
| 动态创建的 DOM | 挂到 body 后取号一次 |
| 组件已用 Popup mixin | **不要再取**，mixin 已经分配过 |
| 一个浮层带多个子元素 | 只给最外层取号，子元素靠定位层叠 |
| 在 `render` 或计算属性里 | **禁止**，会导致层级无限递增 |

另外，计数器只增不减，没有回收机制。数字变大不影响功能，但不要在循环或高频回调里无意义地调用。

### 相关源码

| 文件 | 内容 |
| --- | --- |
| `src/utils/popup/popup-manager.js` | 计数器、弹窗栈、`Esc` 处理 |
| `src/utils/popup/index.js` | Popup mixin |
| `src/utils/vue-popper.js` | 定位类浮层的 mixin |
| `packages/theme-chalk/src/common/var.scss` | 静态层级变量 |
