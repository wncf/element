## 更新日志

### 1.2.2

#### 变更
- AmountInput
  - 失焦不再补齐尾随零：输入 `12` 保持 `12`，用户自己敲的 `12.50` 原样保留，只有 `12.`、`.`、`-.` 这类没输完的中间态会在失焦时收成 `12` / `0`。原先失焦会统一 `toFixed(precision)`，把 `12` 改写成 `12.00`，既改动了用户的输入，也会让 `v-model` 在失焦时多抛一次 `input`。

### 1.1.4

*2026-11-20*

#### 修复
- Cascader / CascaderPanel
  - 修复多选（`multiple`）未开启 `checkStrictly` 时，被勾选的节点没有任何选中态样式的问题。此前 `checkedNodePaths` 只在严格模式下计算，导致分类、商品这类含子级的节点勾选后文字仍是默认色、看不出已选。现在非严格模式下同样计算选中路径，被勾选节点及其祖先按主题的主色 + 加粗显示。
- InputNumber
  - 加减按钮改为 flex 居中：按钮用 `top: 0; bottom: 0` 撑满控件高度，原先靠 `line-height` 与档位高度对齐，在 large / small / mini 档会偏上或偏下。改后各档位图标都垂直居中，且不再依赖按档位写死的行高。
  - 根节点改用 `inline-flex`，与 `hzq-input` 等 inline-block 控件在同一行内按基线对齐时不再错位（此前在表格单元格内并排会低约 10px）。
- ColorPicker
  - 根节点改回 `inline-block` 并设置 `vertical-align: middle`：内部触发器是块级盒子、不含行内文本，按基线对齐会退化到底边，与输入框并排时偏上约 10px。
- Select
  - 修复多选内框高度被误判为「多行」而多加 6px 的问题：单行标签的高度天然比档位高度大 2px（标签自身高度 + 上下留白），此前直接比较会把 mini / small 档撑高一档。现在按 4px 容差判断，只有真正换行才按内容高度撑开。
  - `initialInputHeight` 改为计算属性，按当前 `size` 实时取值；新增 `size` 监听，切换档位时重算内框高度。此前该值只在 `mounted` 时赋值，组件复用时切换档位不生效。
  - 多选标签高度改为比外框矮 4px（各档位分别为 32 / 28 / 24 / 20），避免标签与输入框等高显得拥挤；`collapseTagSize` 同步降一档，标签字号与内边距一并收小。

#### 优化
- 主题
  - 输入类组件（`hzq-input` / `hzq-select` / `hzq-autocomplete` / `hzq-cascader` / `hzq-input-number`）移除根节点上的 `vertical-align: top`，恢复与 Element 原版一致的基线对齐。之前的问题实际由行高差异引起，已通过 `line-height: normal` 解决，`top` 会让控件与同行文字错开。
  - `hzq-input` / `hzq-select` / `hzq-autocomplete` 根节点显式声明 `line-height: normal`，不再继承 `.hzq-form-item__content` 的 32px，避免 small / mini 档外框被撑高。
  - 日期区间选择器（daterange）的分隔符去掉 `top: -0.15em` 偏移与写死的 14px 字号，改为跟随 `$--font-size-base`，换成「至」等汉字时不再浮到数字上方。
  - `.hzq-range__icon` / `.hzq-range__close-icon` 的行高由写死的 32px 改为 `$--input-medium-height`，跟随主题变量。

#### 开发
- play 页面新增「表单元素对齐测试」区块：覆盖全部表单组件的 FormItem 单行高度、表格单元格内并排对齐、四个尺寸档位的对比，均带 `data-align-item` 标记便于脚本测量。
- play 页与文档站端口分离：`dev` 用 8085，`dev:play` 用 8086，可用 `DEV_PORT` 覆盖，两者可同时运行。

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

#### 修复
- Cascader
  - 修复多选开启 `tags-wrap` 后标签仍然只显示单行、多出的标签被裁切的问题：外层标签容器新增 `hzq-cascader__tags--adaptive` 修饰类（仅在 `tagsWrap` 为 true 时添加），把 `top: 50%` / `transform` / `overflow: hidden` 改为铺满输入框并允许溢出，外层高度跟随 JS 撑高的输入框，标签换行与 80px 限高滚动由内层 `hzq-cascader__tags--wrap` 负责。未开启 `tags-wrap` 时样式与行为保持不变。

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
