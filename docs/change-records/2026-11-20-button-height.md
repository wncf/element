# 2026-11-20 按钮高度钉死，修复带图标时高 1px

## 现象

带图标的 `hzq-button` 比同档输入框高 1px：

| 档位 | 纯文字 | 带图标 | 设计值 |
| --- | --- | --- | --- |
| large | 36 | 37 | 36 |
| default / medium | 32 | 33 | 32 |
| small | 28 | 29 | 28 |
| mini | 24 | 25 | 24 |

圆形按钮因此从正圆变成椭圆（如 small 档 28×29）。

实际影响：在 float 栅格里，带图标按钮所在的列比同行高 1px，`hzq-col` 是 `float: left`、按"能往左就往左"排布，后续列会滑到自己不该在的位置。表现为表单里部分字段跑到右列、下一行字段跑到左列，中间空出半行。业务侧见 `hzq-app-common` 回访详情的「客户姓名 + 加号按钮」插槽。

## 根因

按钮原本靠 `padding + border + 内容行盒` 撑出高度。

- **纯文字**：行盒恰等于 `line-height`，`7×2 + 1×2 + 12 = 28`，正好命中设计值。
- **带图标**：图标是 `display: inline-block` + `vertical-align: baseline`（见 `icon.scss`）。按基线摆放时，基线下方还要留出字体的降部空间，行盒比 `line-height` 多 1px，按钮就高 1px。

element-ui 没有暴露这个问题，不是它处理得更好，而是它的 padding 余量更大（small 档上下各 9px，hzq-ui 是 7px），那 1px 溢出被 padding 吸收，看不出来。hzq-ui 收紧 padding 到 7px 后就没有余量了。

`common/var.scss` 里原来的注释「高度 = 上下 padding × 2 + font-size + 上下 border」只在纯文字时成立，正是这条假设埋下了问题。

## 改动

1. **`mixins/_button.scss`**：`button-size` 新增可选参数 `$height`，给了就输出 `height`。
2. **`common/var.scss`**：新增 `$--button-height` / `$--button-large-height` / `$--button-medium-height` / `$--button-small-height` / `$--button-mini-height`，取值分别为 `$--component-height-*`（36 / 32 / 32 / 28 / 24），与同档输入框同源；同时修正上述注释。
3. **`button.scss`**：
   - 根节点 `display: inline-block` → `inline-flex` + `align-items: center` + `justify-content: center`，高度钉死后内容靠 flex 居中，图标不再影响按钮高度。
   - 四档 `button-size` 调用传入对应高度。
   - `is-circle` 由「单边 padding 撑宽」改为「`width` 取同档高度 + `padding: 0`」，保证正圆。
   - 基础 `is-circle` 宽度取 `$--button-height`。

## 验证

**单测**：button + form 共 42 个通过。

**play 页面逐档扫描**（每个档位切换后统计全部按钮）：

| 档位 | 数量 | 高度 | 不符 |
| --- | --- | --- | --- |
| large | 61 | 36 | 0 |
| small | 61 | 28 | 0 |
| mini | 62 | 24 | 0 |

圆形按钮各档均为正圆：large 36×36、default 32×32、small 28×28、mini 24×24。

图标居中：所有组合偏差为 0；"纯图标"场景 0.5px，为字形在字体 em 框内的固有位置，12px 图标下不可见。

**组合覆盖**：4 档 × 5 种内容（纯图标 / 图标+文字 / 文字+图标 / 纯文字 / 裸图标 / 长文字），高度全部命中设计值。

**业务页面回归**（hzq-app-common 回访详情）：

| | 修复前 | 修复后 |
| --- | --- | --- |
| 插槽内按钮 / 输入框 | 29 / 28 | 28 / 28 |
| 客户姓名列高 | 47 | 46 |
| 企业名称 | 错位到右列 | 回到左列 |
| 服务方式 | 错位到左列 | 回到右列 |

## 兼容性

- 按钮高度在各档位下**只减 1px**（带图标场景），纯文字按钮不变。
- `is-circle` 从椭圆变正圆，宽度不变。
- 多行文字：按钮本身 `white-space: nowrap`，钉死高度不会截断。若业务侧覆盖了 `white-space` 并依赖自动换行，需改为显式设置高度。
- 自定义 `font-size` 的场景：高度不再随字号变化，与同档输入框的约束一致。
