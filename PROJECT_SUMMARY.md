# Element UI 项目现状总结

> 生成时间：2026-09-24
> 代码基线：`dev` 分支，HEAD = `c345bb45`（2024-04-02，"Docs: official page foot picture size is incorrect"），共 4612 次提交
> 本地环境：Node `v14.14.0`、npm `6.14.8`、HeadlessChrome `153`

## 1. 项目定位

| 项目 | 内容 |
| --- | --- |
| 包名 / 版本 | `element-ui` / `2.15.14` |
| 上游仓库 | https://github.com/ElemeFE/element.git（`origin`，当前分支 `dev`） |
| 定位 | 面向 Vue 2 的桌面端组件库，同时内置组件源码、主题、官方文档站与单元测试 |
| 运行依赖 | `async-validator`、`deepmerge`、`normalize-wheel`、`resize-observer-polyfill`、`throttle-debounce` |
| Vue 约束 | `peerDependencies.vue: ^2.5.17`，开发依赖锁定 `vue@2.5.21` |
| 对外入口 | `main: lib/element-ui.common.js`（需构建后才有 `lib/`）、`typings: types/index.d.ts`、`web-types: ./web-types.json` |

这是一个"源码 + 文档站 + 测试"三合一的单仓结构，仓库本身就等于 npm 包的源码仓库，组件、主题、文档示例都在同一棵目录树里维护。

## 2. 目录结构与职责

| 目录 | 文件数 | 职责 |
| --- | --- | --- |
| `src/` | 93 | 入口 `src/index.js`、工具函数、指令、混入、过渡、国际化 |
| `packages/` | 472 | 90 个组件包 + `theme-chalk` 主题包，每个包内含 `index.js` 与 `src/` |
| `examples/` | 501 | 官方文档站（含 5 个语言目录、264 个 md 文档、md-loader、playground） |
| `test/` | 589 | 单元测试（karma）、SSR 冒烟测试、覆盖率产物 |
| `build/` | 27 | webpack 配置、构建脚本、md-loader |
| `types/` | 91 | 手写 TypeScript 声明文件 |
| `temp_web/` | 0 | 历史遗留的空目录 |

### 2.1 `src/` 内部

- `src/index.js`：**由 `build/bin/build-entry.js` 自动生成**（文件头有 `/* Automatically generated ... */` 注释），不要手工维护，改动会在下次 `npm run build:file` 时被覆盖。
- `src/utils/`（18 个文件）：`dom.js`、`popper.js`、`vue-popper.js`、`merge.js`、`date.js`、`clickoutside.js`、`scrollbar-width.js` 等通用能力，是全库的公共依赖层。
- `src/utils/lodash.js`：**内联的 lodash 副本，单文件 17029 行**，占 `src/` 总行数（约 2.8 万行）的六成，是覆盖率统计的主要干扰项。
- `src/mixins/`、`src/directives/`、`src/transitions/`：跨组件复用的混入（如表单元素、Popper）、指令（`v-loading`、`v-infinite-scroll`）与过渡。
- `src/locale/lang/`：60 个语言包。

### 2.2 `packages/` 组件层

- 组件总数：**90 个包**（不含 `theme-chalk`），包含容器类组件（`row`/`col`/`container`/`main`）与子组件（`menu-item`、`checkbox-group`、`table-column` 等）。
- 入口注册：`src/index.js` 的 `components` 数组共 **85 项**（84 个组件 + `CollapseTransition`），`install()` 中通过 `Vue.component(component.name, component)` 全量注册。
- 默认导出：**94 个键**，除组件外还包含 `version`、`locale`、`i18n`、`install`，以及 `Loading`、`MessageBox`、`Notification`、`Message` 等命令式 API。
- 命令式 API 通过原型挂载：`Vue.prototype.$loading`、`$msgbox`、`$alert`、`$confirm`、`$prompt`、`$notify`、`$message`，全局配置放在 `Vue.prototype.$ELEMENT`（`size`、`zIndex`）。
- 单文件最大的几个组件：

| 文件 | 行数 |
| --- | --- |
| `packages/date-picker/src/picker.vue` | 873 |
| `packages/select/src/select.vue` | 829 |
| `packages/table/src/table.vue` | 625 |
| `packages/date-picker/src/panel/date-range.vue` | 620 |
| `packages/cascader/src/cascader.vue` | 612 |

`date-picker`、`select`、`table`、`cascader` 这几个是复杂度最高的组件，其中 `picker.vue`（873 行）已经越过单文件 800 行的建议上限。

### 2.3 `packages/theme-chalk/` 主题

- SCSS 源码在 `packages/theme-chalk/src`，通过 gulp 编译到 `packages/theme-chalk/lib`，产物再拷贝到 `lib/theme-chalk`。
- 测试入口 `test/unit/index.js` 强制 `require('packages/theme-chalk/lib/index.css')`，**所以跑单测前必须先生成主题产物**，这也是 `npm test` 里 `build:theme` 排在 karma 前面的原因。

## 3. 技术栈与工具链

| 层 | 技术选型 |
| --- | --- |
| 框架 | Vue 2（Options API、SFC、scoped slot、`$attrs/$listeners` 透传） |
| 编译 | webpack `4.47`（dev 依赖声明 `^4.14.0`）+ `vue-loader@15` |
| 转译 | Babel 6（`babel-preset-env` + `stage-2` + `transform-vue-jsx`），`targets: > 1%, last 2 versions, not ie <= 8` |
| 样式 | SCSS + `gulp` + `node-sass@4` + `autoprefixer` |
| 测试 | karma 4 + mocha 6 + chai 4 + sinon 7 + `karma-spec-reporter` + `karma-coverage` |
| 覆盖率 | istanbul（`babel-plugin-istanbul`，`BABEL_ENV=test` 时启用） |
| 规范 | eslint `4.18.2` + `eslint-config-elemefe`，带 `html`、`json` 插件 |
| 文档站 | webpack-dev-server + 自研 md-loader（把 md 中的代码块编译成可运行 demo） |
| 类型 | 手写 `types/*.d.ts` + `web-types.json`（IDE 提示） |

工具链整体停留在 2019–2021 年的版本，最旧的 `node-sass@4`、`babel-cli@6`、`eslint@4` 对 Node 版本敏感（当前 Node 14 可用，升到 Node 16+ 需要连带升级）。

## 4. 构建体系

### 4.1 webpack 配置分工（`build/`）

| 配置 | 产物 |
| --- | --- |
| `webpack.conf.js` | UMD 全量包（`dist/index.js`） |
| `webpack.common.js` | CommonJS 全量包（`lib/element-ui.common.js`） |
| `webpack.component.js` | 单组件独立包（`lib/<component>.js`） |
| `webpack.demo.js` | 文档站（dev server） |
| `webpack.extension.js` | 浏览器扩展 demo |
| `webpack.test.js` | 测试打包（别名 `vue$ -> vue/dist/vue.common.js`） |

### 4.2 代码生成脚本（`build/bin/`）

`build-entry.js`（生成 `src/index.js`）、`iconInit.js`（字体图标）、`i18n.js`（语言包汇总）、`version.js`、`gen-cssfile.js`、`gen-indices.js`、`new.js`（脚手架新建组件）、`new-lang.js`（新增语言包）、`template.js`。

`npm run build:file` 会并行跑其中 4 个脚本，是改动组件清单后必须执行的步骤。

### 4.3 常用命令

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 启动文档站开发环境 |
| `npm run dev:play` | 启动 playground（`examples/play/index.vue`），用于快速验证单个组件 |
| `npm run test` | lint + 主题构建 + karma 单测（一次性） |
| `npm run test:watch` | 主题构建 + karma 监听模式 |
| `npm run lint` | eslint 全量检查 |
| `npm run dist` | 全量发布构建（clean → build:file → lint → 各 webpack 配置 → utils → umd → 主题） |
| `make new <name>` / `make new-lang <lang>` | 新建组件 / 语言包脚手架 |

## 5. 测试体系与最近一次执行结果

### 5.1 测试组织

- 配置：`test/unit/karma.conf.js`，`browsers: ['ChromeHeadless']`，reporters 为 `spec` + `coverage`，mocha `timeout: 4000`。
- 入口：`test/unit/index.js` 通过 `require.context` 加载 `specs` 下所有 `*.spec.js`，并加载全部 `src` 文件用于覆盖率统计。
- 用例文件：**63 个 spec**，覆盖 60+ 组件以及 `util.clickoutside`、`util.vue-popper`、`mixin.vue-popup` 等基础设施。
- 因为 `src/index.js` 在浏览器环境下会自动 `install(window.Vue)`，大部分 spec 直接在模板里使用 `<el-xxx>` 标签，不需要显式 import 组件。
- 覆盖率输出目录为 `test/unit/coverage`（已在 `.gitignore` 中忽略）。
- `test/ssr/require.test.js` 是一个独立的 SSR 冒烟测试，`VUE_ENV=server` 下 `require('./lib/index')`；它依赖构建产物 `lib/`，且**未接入任何 npm script 或 CI**。

### 5.2 执行记录（2026-09-24）

执行命令（跳过 `npm test` 中的 lint 与主题构建，因主题产物已存在）：

```bash
npx karma start test/unit/karma.conf.js --single-run
```

结果：

```
Executed 877 of 877 (1 FAILED) (1 min 20.774 secs)
TOTAL: 1 FAILED, 876 SUCCESS
```

**通过率 876 / 877 = 99.89%。**

覆盖率汇总：

| 指标 | 数值 |
| --- | --- |
| Statements | 65.85%（9685 / 14707） |
| Branches | 53.59%（5834 / 10887） |
| Functions | 55.05%（1008 / 1831） |
| Lines | 66.39%（9378 / 14126） |

**覆盖率口径提示**：若剔除内联的 `src/utils/lodash.js`（3686 行可执行行，仅覆盖 25.12%），整体行覆盖率会从 66.39% 升到 **80.96%**。看项目真实测试质量时应以这个数字为准。

### 5.3 失败用例

```
1) Button > loading implies disabled
   Uncaught AssertionError: expected PointerEvent{ isTrusted: false } to not exist
```

- 用例位置：`test/unit/specs/button.spec.js:114`，用例写于 2018 年（提交 `54c36136`）。
- 用例逻辑：对 `<el-button loading>` 内部的 `<span class="inner-slot">` 调用 `.click()`，断言点击不会冒泡到组件根节点触发 `@click`。
- 失败原因：新版 Chromium 的行为变化。实测（HeadlessChrome 153 / 148）在禁用按钮内部的子元素上调用 `.click()` 时，事件仍会冒泡到按钮自身的监听器，并且事件类型已从 `MouseEvent` 变为 `PointerEvent`（`HTMLElement.click()` 现在派发 PointerEvent）。
- 结论：属于**环境导致的存量失败**，与当前工作区改动无关，`packages/button/src/button.vue` 最后修改于 2021 年（`e39d4cb2`）。

### 5.4 lint 结果

`npm run lint`（eslint 全量）报 **1 个错误**：

```
src/locale/lang/lo-LA.js
  126:3  error  Newline required at end of file but not found  eol-last
```

来源为提交 `a5ff3282`（新增 lo-LA 语言包），同样是存量问题，不是本次改动引入的。

### 5.5 覆盖率薄弱模块（行数 ≥ 50，按覆盖率升序）

| 模块 | 行覆盖率 | 覆盖 / 总行 |
| --- | --- | --- |
| `packages/statistic` | 13.11% | 8 / 61 |
| `src/utils` | 39.98% | 2050 / 5128 |
| `packages/image` | 51.61% | 96 / 186 |
| `packages/scrollbar` | 60.00% | 42 / 70 |
| `packages/upload` | 68.22% | 146 / 214 |
| `packages/menu` | 69.81% | 185 / 265 |
| `packages/rate` | 70.45% | 62 / 88 |
| `packages/tree` | 71.20% | 497 / 698 |

覆盖较好的模块：`packages/steps` 100%、`input-number` 97.8%、`radio` 97.3%、`checkbox` 95.45%、`loading` 95.35%、`input` 93.13%、`slider` 93.1%。

`statistic` 只有 13.11%，是最明显的测试缺口；`src/utils` 的低覆盖率主要来自 `lodash.js`。

### 5.6 测试运行中的告警

运行日志中出现 7 条 `ERROR LOG`，均为测试主动触发异常分支产生的预期告警，不影响结果：

- `[Vue warn]: <transition-group> children must be keyed: <li>`（Upload）
- `[Vue warn]: Missing required prop: "value"`（Transfer）
- `Error in event handler for "pick": TypeError: value.map is not a function`（ColorPicker/DatePicker 异常入参分支）

## 6. 国际化与文档站

- 语言包 60 个，位于 `src/locale/lang/`，由 `build/bin/i18n.js` 汇总。
- 文档站支持 5 个语言目录：`en-US`、`zh-CN`、`es`、`fr-FR`、`template`；`examples/docs/zh-CN` 下 66 个组件文档。
- 文档写法是"md 里写 `<demo-block>` + 代码块"，由 `build/md-loader`（`config.js`、`containers.js`、`fence.js`、`util.js`）编译成可交互 demo。
- `examples/pages/{en-US,zh-CN,es,fr-FR}` 是生成的旧版文档页面，已在 `.gitignore` 中；`examples/element-ui`（文档站构建产物）同样被忽略。
- 文档站构建产物部署到 `surge.sh`（见 GitHub Actions），发布脚本见 `build/deploy-ci.sh`、`build/deploy-faas.sh`。

## 7. CI / CD

| 位置 | 内容 |
| --- | --- |
| `.travis.yml` | Node 10 + stable Chrome，成功后执行 `build/deploy-ci.sh` 并上报 coveralls |
| `.github/workflows/preview-build.yml` | PR 触发，`npm run bootstrap && npm run deploy:build`，上传文档站产物与 PR 号 |
| `.github/workflows/preview-deploy.yml` | 下载产物后发布到 `https://preview-pr-<id>-element-ui.surge.sh`，并把预览链接回评到 PR |
| `.github/stale.yml` | Issue 自动标记过期 |
| `build/release.sh`、`build/git-release.sh`、`build/bin/gen-indices.js` | `npm run pub` 的发版链路 |

仓库没有配置仓库内的测试 CI（karma 未接入 Actions），单测目前依赖本地或 Travis 执行。

## 8. 当前工作区状态

| 文件 | 状态 | 说明 |
| --- | --- | --- |
| `examples/play/index.vue` | 已修改 | playground 试验改动：把 `el-input` 换成了 `<el-button v-model="input" size="mini" placeholder="small">`。`v-model` 与 `placeholder` 对 `el-button` 无效，属于临时试写，提交前需还原或修正 |
| `src/index.js` | 已修改（仅换行符） | CRLF/LF 差异，`git diff` 无内容变更；该文件本身是自动生成的，不应手工编辑 |

## 9. 风险与改进建议

按优先级排列：

1. **补 `statistic` 的测试**：13.11% 的覆盖率说明该组件基本处于无测试状态，是当前最大的质量缺口；其次是 `image`、`scrollbar`、`upload`。
2. **修正覆盖率口径**：把内联的 `src/utils/lodash.js` 从 istanbul 统计中排除（`.babelrc` 的 `test` 环境或 webpack 规则里过滤），否则 66% 的整体数字会长期掩盖真实覆盖率（80.96%），影响质量判断。
3. **处理存量失败与 lint 错误**：`button.spec.js` 的 `loading implies disabled` 需要按现代浏览器行为重写断言（例如改为验证组件在 `loading` 状态下不应触发 `click` 事件，或直接断言 `disabled` 属性）；`src/locale/lang/lo-LA.js` 补一个文件末尾换行即可。
4. **`src/index.js` 加保护**：在文件头补注释说明由脚本生成，并考虑在 CI 中校验 `npm run build:file` 后无 diff，避免手工修改被覆盖或误提交。
5. **拆分 `date-picker/src/picker.vue`**：873 行已超过单文件 800 行的维护上限，可抽出 picker 的展示层与面板联动逻辑。
6. **把 SSR 冒烟测试接入流水线**：`test/ssr/require.test.js` 目前只能手动跑，建议在 `dist` 之后追加执行，防止构建产物无法被 `require` 的回归。
7. **工具链升级要整体规划**：`node-sass@4`、`babel-cli@6`、`eslint@4`、`webpack@4` 互相牵连，单独升级会失败；若必须升级，建议一次性迁移到 `sass`（dart-sass）+ 新版 webpack/eslint，并同步更新 `.travis.yml` 与两个 GitHub Actions 里的 Node 版本。
8. **清理无用目录**：`temp_web/` 为空目录，可删除。

## 10. 结论

项目是一套结构清晰、分层明确的 Vue 2 组件库：`src`（基础设施）+ `packages`（90 个组件）+ `theme-chalk`（主题）+ `examples`（文档站）+ `test`（63 个 spec）五层职责互不混淆，公共能力集中在 `src/utils`，命令式 API 统一挂在 `Vue.prototype` 上，构建与代码生成脚本齐全。

当前质量状况良好但存在两处存量问题：单元测试 **877 个用例中 876 个通过（99.89%）**，唯一失败是浏览器行为变化导致的测试断言过期；`npm run lint` 因一个语言包缺少文件末尾换行而失败。两者都不影响组件功能，但会让 CI 处于红灯状态，建议优先修复。覆盖率方面，剔除内联 lodash 后的真实行覆盖率为 80.96%，其中 `statistic`（13.11%）和 `image`（51.61%）是最需要补测试的模块。
