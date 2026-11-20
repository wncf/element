# 2026-11-20 表单控件底色 control-bg

## 背景

业务表单里的输入类控件默认使用 `--hzq-bg-color-control`（浅色下 `#f8fafc`）作为底色。放在白底弹窗、白底卡片里时，控件底比周围暗一档，视觉上显得"突兀"；而绿色主题下这个底色仍是中性灰蓝，与主题色完全不呼应。

本次为表单与输入类控件新增 `control-bg` 属性，提供两档底色：跟随卡片的「白底」与跟随主题色的「浅底」。

## 属性

```vue
<hzq-form control-bg="card">        <!-- card / tint，不传则不干预 -->
  <hzq-input v-model="v" control-bg="tint" />
</hzq-form>
```

| 值 | 含义 |
| --- | --- |
| `card` | 白底：与卡片同色，控件只靠边框界定 |
| `tint` | 主题浅底：默认浅蓝灰、绿色主题下是极浅的绿、深色主题下比卡片亮一档 |
| `''` | 不设置：交给下一层决定 |

可用组件：`hzq-form`、`hzq-input`、`hzq-select`、`hzq-input-number`、`hzq-date-picker`、`hzq-amount-input`。

## 优先级

**控件自身 > 所在 hzq-form > 全局 > 默认 card**

```js
// Vue.use 时设置全局兜底
Vue.use(Element, { controlBg: 'tint' })
```

越局部越优先：控件最清楚自己要什么，表单次之，全局只做兜底。

实现上的关键约束是**每一层"未显式设置时不输出类"**。若某一层用了默认值（如 `default: 'card'`），它就会把下层提前定死，优先级链条断裂。因此各层的 props 默认值都是空串，由控件的 `resolvedControlBg` 计算属性逐层解析。

## 主题层

控件底色统一读 `--hzq-bg-color-control`，所以两个档位只做一件事——在作用域根节点把这个变量换掉（`theme-chalk/src/common/control-bg.scss`）：

```css
.hzq-bg-card { --hzq-bg-color-control: var(--hzq-fill-color-blank); }
.hzq-bg-tint { --hzq-bg-color-control: var(--hzq-bg-color-control-tint); }
```

这也是「控件 > 表单」在 CSS 层能成立的原因：控件节点自己声明了该变量，就不再继承表单那一档的值。

### 新增 token

`--hzq-bg-color-control-tint` 跟随**品牌轴**（而非明暗轴），因为在语义上它是"当前主题色的浅底"，不属于中性色。

- 默认预设：取中性色板的 `bg-color-control`，即控件沿用至今的底色，观感不变
- 绿色预设等有色相的品牌，由 `palette.scss` 的 `$--brand-tint-modes` 覆盖成淡淡的品牌色：值为 blend-base（当前明暗模式的卡片底）占比，`92%` 即「92% 底色 + 8% 品牌色」

白色档（card）**不随品牌色**，固定取卡片色 `--hzq-fill-color-blank`；深色模式下随之取深卡片色，否则深色页面里会露白块。

四套主题下的实际取值：

| 主题 | card | tint |
| --- | --- | --- |
| 默认浅色 | `#ffffff` | `#f8fafc` |
| 绿色 | `#ffffff` | `#eef5f3` |
| 深色 | `#1e293b` | `#243347` |
| 深色 + 绿色 | `#1e293b` | `#1f303e` |

## 兼容性

- 不传 `control-bg`：控件回落到 `card`，即**默认变为白底**。默认浅色主题下 `#ffffff` 与 `#f8fafc` 差异极小，但绿色主题下会从浅绿变纯白，是可见变化。
- 老代码里手写覆盖 `.hzq-input__inner { background: ... }` 的样式优先级更高，不受影响。

## 验证

- form 单测 28 个全过，含 5 个 control-bg 用例，覆盖 控件/表单/全局 三层优先级与默认回落。
- 主题构建 `npm run build:theme` 通过，`check-theme-tokens`：74 个被引用 token 全部由 base.css 定义。
- play 页面新增「控件底色 control-bg」演示段，可分别切换表单层与控件层，并实时显示实际生效值；已验证默认/绿色/深色三种主题下的取值。
