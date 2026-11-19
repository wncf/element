# 2026-11-18 主题 token 收敛到 base 产物

## 背景

hzq-ui 的主题系统把语义 token（`--hzq-*`）输出在 `common/tokens.scss`，由 `common/var.scss` 末尾 import。由于每个组件 scss 都 `@import "common/var"`，而 Sass 的 `@import` 是文本包含，原本用于去重的「单次守卫」（`$--hzq-tokens-emitted`）只在单次编译内有效——每个组件产物都是独立编译的，于是 `lib/` 下每个组件 css 都各自内嵌了一整份四套主题变量块。

与官方 element-ui 2.15.14 对比（同为本地构建产物）：

| 项 | hzq-ui 改前 | element-ui | |
| --- | --- | --- | --- |
| `lib/theme-chalk/` | 1.91 MB | 0.84 MB | +127% |
| `button.css` | 25,143 B | 10,375 B | +142% |
| `button.css` gzip | 3.5 KB | 1.8 KB | +94% |

94 个共有组件 css 合计多出 1,039,755 字节，其中 **927,440 字节（89.2%）** 是重复内嵌的 token 块。

## 改动

1. `common/var.scss` 不再 import `common/tokens`，只保留 Sass 变量定义。
2. `base.scss` 末尾 `@import "common/tokens"`，token 块只在 base 产物输出一次。
3. `build/bin/check-theme-tokens.js`：构建后校验，失败条件为
   - 任一组件 css 引用 `var(--hzq-*)` 但 base 未定义；
   - 任一组件 css 又内嵌了 token 定义。
   已接入 `npm run build:theme`。
4. 文档补充按需引入必须带 `base.css` 的说明。

## 影响面

| 场景 | 结果 |
| --- | --- |
| 全量引入 `index.css` | 不变。`index.scss` 首行即 `@import "./base.scss"`，token 仍在所有组件之前 |
| 按需引入（babel-plugin-component） | 不变。插件 `lib/core.js` 在 `isBaseStyle` 为真（默认）时会自动 `addSideEffect(.../base.css)` |
| 直接引 scss 源码 | **需要额外引入 `base.scss`**，已写入文档 |
| `applyTheme` / `setThemeMode` / `resetTheme` | 不变。JS 从 `:root` 的 computed style 读 token，输入侧未动 |
| `.hzq-theme-dark` / `.hzq-theme-green` 叠加 | 不变。四套选择器与特异性原样保留 |
| 自定义 `$--token-scope` | 不变。token 仍输出在 scope 选择器下，只是位置从各组件移到了 base |

## 验证

- `npm run build:theme` 通过；`check-theme-tokens` 输出：74 个被引用 token 全部由 base 定义（base 共 105 个）。
- 负向验证：从 base.css 删掉 `--hzq-color-primary` 后脚本失败并指出 `button.css` 引用它。
- 单测：1072 通过，1 失败（`Button > loading implies disabled`）。该用例在改动前同样失败，属预存在问题，与本次改动无关。
- 产物体积：`lib/theme-chalk/` 1.91 MB → 875 KB；`button.css` 25,143 B → 13,550 B（gzip 3,543 → 约 1.9 KB）。

## 遗留

- 每个组件产物仍带一份 `:root` 下的 `--hzq-color-white/black`（与明暗轴无关的绝对色）。这两个变量量极小，暂不处理。
- 四个文件（`theme-chalk/lib` 之外）如需进一步压缩，可把 `light-1..9` 改为运行期推导，但那会改变「纯 CSS 可用」的前提，不在本次范围。
