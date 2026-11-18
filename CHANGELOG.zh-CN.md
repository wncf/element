## 更新日志

### 未发布

#### 新特性
- Cascader
  - `change` 事件新增第二参 `nodes`：当前选中节点对应的原始 option 数组，调用方可直接取业务字段（如 `goodsId`），无需按 value 反查。无选中或清空时为 `[]`。
  - 新增 `value-compat` 属性：允许 value 直接传末级值（如 `['xihu']`），组件按 options 自动补全为完整路径；异步到达的 options 会重新归一化，查不到节点时原值透传。仅在 `props.emitPath` 为 true 时生效。
  - 新增 `popover-trigger` 属性：设为 `manual` 时点击输入框、箭头、Enter、方向键都不再切换下拉层，由外部调用 `toggleDropDownVisible` 控制；点击外部、`esc` / `tab`、选中后自动关闭保持不变。
  - `remove-tag` 事件新增第二参 `index`，该 Tag 在已展示标签中的下标。
- Popper / 全局配置
  - `Vue.use(HZQUI, { popper })` 新增浮层统一配置：`appendTo`（挂载容器）、`boundariesElement`（边界元素）、`boundariesPadding`（边界留白）、`zIndex`（层级起始值）。
  - 新增导出 `setPopperConfig` / `getPopperConfig` / `resolveContainer` / `resolveBoundaries`，供不走 `Vue.use` 全量注册的接入方单独配置。
  - 挂载容器与边界元素支持选择器、元素、函数三种写法，**每次创建浮层时实时解析**，微前端容器晚于插件安装注入也能命中。

#### 修复
- Popper
  - `boundariesElement` 解析失败或选择器未命中时回落到 `viewport`。此前会把未知字符串透传给 popper，`_getBoundaries` 算出 `NaN` 边界，配置看起来生效、实际完全不约束位置。
  - `beforeDestroy` 清理浮层时改为判断 `parentNode` 是否存在。此前只在父节点是 `document.body` 时才移除，挂到自定义容器后 DOM 会残留。

#### 优化
- Popper
  - `vue-popper` 的 `createPopper` 改为克隆 `popperOptions` 后再合并全局配置，不再原地改写组件实例上的 options 对象。优先级：组件自身 `popper-options` > 全局 `popper` 配置 > 库默认值。

#### 文档
- Cascader：补充末级值兼容、手动控制下拉层两个示例，更新属性 / 事件 / 方法表。
- 初始化参数：新增 `popper` 小节，说明四个字段、优先级与微前端用法。
- 浮层层级管理：补充挂载容器与边界元素的关系说明。

### 1.1.0

*2026-11-18*

#### 新特性
- Theme
  - 新增输入类控件专用底色 token `--hzq-bg-color-control`：浅色 `#f8fafc`、深色 `#243347`，控件不再与卡片同色。
  - 新增控件禁用态 token：`--hzq-bg-color-control-disabled`、`--hzq-border-color-control-disabled`、`--hzq-text-color-control-disabled`，浅色深色各一套。

#### 优化
- Input / Textarea / Select / DatePicker / InputNumber / Checkbox / Radio
  - 常态填充改取 `--hzq-bg-color-control`，复选框、单选框的方块与输入框保持同一底色。
  - 禁用态改为「底色更沉 + 边框更实」：浅色 `#e6ebf3` / `#b7c2d2`，深色 `#0f1a2e` / `#3d5169`。此前禁用与可用只差几个色阶，几乎分辨不出来。
  - 输入框字数统计块跟随控件底色，深色下不再露出色块。

#### 文档
- 示例区补上卡片底色，避免页面底与控件底过近导致输入框轮廓看不清。
