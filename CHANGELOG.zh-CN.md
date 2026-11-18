## 更新日志

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
