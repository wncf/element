## 更新日志

### 1.1.2

*2026-11-19*

#### 新特性
- Cascader
  - 新增 `suggestion` 作用域插槽：搜索模式下自定义每个建议项的内容，作用域参数为 `{ item, index, keyword }`，便于做关键词高亮。插槽只替换建议项内部内容，点击选中、键盘上下选择与勾选标记仍由组件处理；不传该插槽时渲染与之前完全一致。
  - 新增 `tags-wrap` 属性（默认 `false`）：多选模式下标签自动换行，区域最高 80px、超出纵向滚动，输入框高度随标签实际高度撑高；不开启时保持原有的单行截断行为。
  - 新增 `tag-max-width` 属性：限制单个标签文字的最大宽度（数字按 px 处理），超出仍按省略号截断；留空不限制。
- DatePicker
  - 新增 `keep-open-on-now` 属性（默认 `false`）：`type` 为 `datetime` 时点击「此刻」按钮后面板保持打开，便于继续选择时间；默认值下仍按原逻辑收起面板，`date` 等非时间类型的行为不受影响。
#### 优化
- 主题
  - 禁用态控件底色与边框调浅：`--hzq-bg-color-control-disabled` 由 `#e6ebf3` 改为 `#eef1f6`，`--hzq-border-color-control-disabled` 由 `#b7c2d2` 改为 `#c5cedb`。此前的取值偏重，禁用控件显得发闷、像报错状态。

#### 文档
- Cascader 补充「自定义搜索建议项」「多选标签换行」两个示例，更新属性表与插槽表。
- DateTimePicker 补充「点击『此刻』后保持面板打开」示例，属性表补充 `keep-open-on-now`；DatePicker 属性表同步补充。
- 类型定义 `types/cascader.d.ts` 同步补充 `suggestion` 插槽、`tagsWrap`、`tagMaxWidth`，`types/date-picker.d.ts` 补充 `keepOpenOnNow`；`web-types.json` 同步补充上述属性与插槽。

### 1.1.1

*2026-11-19*

#### 新特性
- Dialog（`$dialog`）
  - 新增 `type`：`error` / `warning` / `info` / `add` / `edit`，在标题区渲染对应图标，底部默认渲染取消 + 确定；`error` 的确定按钮使用危险色。
  - 新增 `icon`（自定义标题图标类名）、`hideFooter`（不渲染底部按钮）、`fullscreen`（全屏）。
  - 新增 `open` 回调，弹窗打开后拿到实例，可用于聚焦输入框等。
  - 新增 `zIndex`，配合 `explicitZIndex` 只设定本层层级、不抬高全局自增基线。
  - 新增 `parent` 选项：`this.$dialog()` 自动取 `this`，`$store` / `$route` / `provide` 沿正确的父链解析。
  - 返回值改为实例代理，透传 `$refs` / `$el`；排队中的占位代理在实例挂载后自动转发读写。
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
- Button
  - `loading` / `disabled` 时不再触发 `click`。原生 `disabled` 只拦截命中按钮自身的点击，点击内部子元素后冒泡上来的 `click` 仍会触发；样式里的 `pointer-events: none` 也只对真实指针生效，程序化触发的点击不受约束。改为在 `handleClick` 中按 `buttonDisabled` / `loading` 再守一道。
- Popper
  - `boundariesElement` 解析失败或选择器未命中时回落到 `viewport`。此前会把未知字符串透传给 popper，`_getBoundaries` 算出 `NaN` 边界，配置看起来生效、实际完全不约束位置。
  - `beforeDestroy` 清理浮层时改为判断 `parentNode` 是否存在。此前只在父节点是 `document.body` 时才移除，挂到自定义容器后 DOM 会残留。

#### 优化
- 主题体积
  - 主题 token（`--hzq-*`）改为只在 `theme-chalk/base.css` 输出一次。此前每个组件产物各自内嵌一份完整的四套主题变量块，`lib/theme-chalk` 因此膨胀到 1.91 MB；现在约 875 KB，`button.css` 由 25,143 B 降到 13,550 B（gzip 3.5 KB → 1.8 KB）。
  - 完整引入与按需引入（`babel-plugin-component` 会自动引入 `base.css`）行为不变；**直接引入 scss 源码**的用法需要额外引入 `base.scss`。
  - 构建新增 `check-theme-tokens` 校验：组件引用的 token 必须由 `base.css` 定义，且不得有组件重新内嵌 token 块。
- Popper
  - `vue-popper` 的 `createPopper` 改为克隆 `popperOptions` 后再合并全局配置，不再原地改写组件实例上的 options 对象。优先级：组件自身 `popper-options` > 全局 `popper` 配置 > 库默认值。

#### 文档
- Dialog：补充语义类型、`fullscreen`、`icon`、`hideFooter`、`zIndex`、`parent`、`open` 与返回值说明；`stack` 默认值改为 `true`。
- 快速上手：说明按需引入必须包含 `base.css`。
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
