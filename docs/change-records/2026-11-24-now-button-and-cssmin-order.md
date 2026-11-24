# 2026-11-24 此刻按钮：默认不顶面板 + 修复多出的灰边框

## 现象

日期时间选择器（`type="datetime"`）面板底部的「此刻」按钮有两个问题：

1. 点击后只把当前时间填进输入框，面板随即关闭，没法接着调时分秒。
2. 按钮多出一圈 1px 灰边框（`#DCDFE6`），和右侧的「确定」按钮叠在一起显得杂乱；同时 `padding-left/right: 0` 生效，按钮只剩文字宽度（实测 26px），看起来像被压扁。

业务侧见 `hzq-app-common` 员工详情「基本信息」的日期时间字段。

## 根因

### 1. 面板关闭

`panel/date.vue` 的 `changeToNow()` 把「是否保持打开」交给 `keepOpenOnNow && showTime` 决定，而 `keepOpenOnNow` 在 `picker.vue` 里是个普通 `Boolean`，默认 `false`：

```js
keepOpenOnNow: Boolean,
```

于是无论什么场景，点击「此刻」都收起面板。组件库后来补了这个 prop，但默认值停在「旧行为」，等于新能力默认不生效。

### 2. 灰边框

样式源码本身是对的 —— `theme-chalk/src/button.scss` 的 `@include m(text)` 里有 `border-color: transparent`：

```scss
@include m(text) {
  border-color: transparent;
  color: $--color-primary;
  background: transparent;
  padding-left: 0;
  padding-right: 0;
  ...
}
```

问题出在构建。`gulp-cssmin`（clean-css 3.4）默认开启 restructuring：把声明相同、选择器不同的规则合并成一条多选择器规则，**并把合并结果挪到文件中较早的位置**。

`.hzq-button--text` 的 `border-color: transparent` 与 `.hzq-input-group` 下几条规则被合并，落到 `index.css` 第 218902 字符处；而 `.hzq-button` 基类（含 `border: 1px solid var(--hzq-border-color-base)`）在第 233073 字符处。两者特异性同为 (0,1,0)，后者靠后胜出，基类的灰边框反过来盖住了 `--text` 的透明边框。

单独看 `button.css` 是对的 —— 它是单文件产物，规则顺序没被打乱。只有合并后的 `index.css` 出错，这也解释了为什么「文档站里正常、项目里不对」。

## 改动

1. **`packages/date-picker/src/picker.vue`**：`keepOpenOnNow` 改为对象式声明，`default: true`；需要旧行为时显式传 `false`。
2. **`packages/theme-chalk/gulpfile.js`**：`cssmin` 传入 `{ restructuring: false }`，只做声明级压缩（去空白、合并简写），不再合并/前移规则。

## 验证

**面板保持打开**（浏览器实测，真实点击）：

| `keepOpenOnNow` | 点击「此刻」后面板 | 输入框 |
| --- | --- | --- |
| `true`（默认） | 保持打开 | 填入 `2026-11-24 18:04` |
| `false` | 收起 | 仍填入当前时间 |

**按钮边框**：

| | 修复前 | 修复后 |
| --- | --- | --- |
| `border-color` | `rgb(220, 223, 230)` | `rgba(0, 0, 0, 0)` |
| 视觉 | 多一圈灰边框 | 无边框 |

**规则顺序**（`lib/theme-chalk/index.css`）：

| | 修复前 | 修复后 |
| --- | --- | --- |
| `.hzq-button--text` 位置 | 218902 | 245636 |
| `.hzq-button` 基类位置 | 233073 | 234811 |
| 顺序 | 反转（边框被覆盖） | 正确 |
| 合并型多选择器规则 | 存在 | 不存在 |

## 兼容性

- **不兼容**：`keep-open-on-now` 默认值 `false` → `true`。依赖「点击此刻即关闭」的业务需显式传 `:keep-open-on-now="false"`。`hzq-app-common` 里已显式写出该 prop，不受影响。
- **CSS 产物体积**：`index.css` 由 278 KB 增至 281 KB（+1.2%），换来规则顺序与源码严格一致。若后续遇到其它「源码正确但产物失效」的情况，可优先从该开关排查。
- 关闭 restructuring 后不再合并重复规则，产物中可能出现少量重复声明，属预期。
