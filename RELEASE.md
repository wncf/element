# 发布说明

本包以 `hzq-ui` 发布到公司私有 registry `http://npm.27yn.cn/`。

## 前置条件

- Node 12（`node-sass@4` 只提供到 Node 12 的预编译二进制，见 `package.json`）
- 工作区干净，所有改动已提交
- 全局 `~/.npmrc` 里已有该 registry 的 authToken

## 发布步骤

```bash
# 1. 改版本号（不自动打 tag，由脚本统一处理）
npm version 1.0.1 --no-git-tag-version

# 2. 提交版本号变更
git add package.json && git commit -m "chore: release 1.0.1"

# 3. 发布
sh build/release.sh 1.0.1
```

预发布版本：

```bash
npm version 1.1.0-beta.1 --no-git-tag-version
git add package.json && git commit -m "chore: release 1.1.0-beta.1"
sh build/release.sh 1.1.0-beta.1 --tag beta
```

## 脚本做了什么

`build/release.sh` 按顺序执行：

1. **参数校验** —— 版本号格式必须是 `x.y.z` 或 `x.y.z-pre`
2. **工作区检查** —— 有未提交改动直接退出，避免把半成品打进包
3. **版本一致性** —— `package.json` 的版本必须与传入参数一致
4. **构建** —— `npm run dist`（clean → build:file → lint → 三套 webpack → utils → umd → theme）
5. **产物检查** —— 确认 `lib/hzq-ui.common.js`、`lib/index.js`、`lib/theme-chalk/index.css`、`types/index.d.ts` 都存在
6. **SSR 冒烟测试** —— `node test/ssr/require.test.js`
7. **人工确认** —— 打印 `npm pack` 内容后等待输入 `y`
8. **发布** —— `npm publish --registry http://npm.27yn.cn/`

## 产物说明

| 文件 | 用途 |
| --- | --- |
| `lib/hzq-ui.common.js` | CommonJS 全量包（`package.json` 的 `main`） |
| `lib/index.js` | UMD 全量包（`unpkg`，浏览器直接引入） |
| `lib/<component>.js` | 单组件包，按需引入 |
| `lib/theme-chalk/index.css` | 全量样式 |
| `lib/theme-chalk/<component>.css` | 单组件样式 |
| `lib/theme-chalk/fonts/hzq-icons.*` | 图标字体 |
| `types/` | TypeScript 声明 |
| `src/`、`packages/` | 源码，供按需引入与二次开发 |

## 使用方接入

```js
import Vue from 'vue';
import HZQUI from 'hzq-ui';
import 'hzq-ui/lib/theme-chalk/index.css';

Vue.use(HZQUI, {
  size: 'small',
  zIndex: 3000,
  // 可选：注册业务方自己的 SVG 图标
  svgIcons: { prefix: 'crm', icons: ['base-arrow', 'base-book'] }
});
```

按需引入：

```js
import { Button, Select } from 'hzq-ui';
```

## 微前端场景

子应用与宿主共用 `document.documentElement` 时，需要把 token 收敛到子应用容器，
否则切换主题会影响宿主。构建期与运行期各配一次：

```scss
$--token-scope: '[data-hzq-scope]';
@import '~hzq-ui/packages/theme-chalk/src/index';
```

```js
import { configureThemeScope } from 'hzq-ui/src/utils/theme';
configureThemeScope('[data-hzq-scope]');
```

```html
<div data-hzq-scope>
  <hzq-button>提交</hzq-button>
</div>
```

## 与官方 Element 的差异

本包基于 Element UI 2.15.14 改造，主要差异见文档站的「改造记录」页，要点：

- 命名空间 `el-` → `hzq-`（类名、CSS 变量、组件名、模板标签）
- MessageBox 已下线，改用 `$dialog`
- 主色 `#409EFF` → `#2563eb`，输入框高度 40px → 32px，字号 14px → 13px
- 新增 AmountInput、FormBuilder、SvgIcon
- 深色模式与运行期换肤
