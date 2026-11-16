# Element UI 贡献指南

Hi! 首先感谢你使用 Element UI。

Element UI 是一套为开发者、设计师和产品经理准备的开源组件库，旨在快速搭建页面。它基于 Vue 2.0 开发，并提供了配套的设计资源，充分满足可定制化的需求。

Element UI 的成长离不开大家的支持，如果你愿意为 Element UI 贡献代码或提供建议，请阅读以下内容。

## Issue 规范
- issue 仅用于提交 Bug 或 Feature 以及设计相关的内容，其它内容可能会被直接关闭。如果你在使用时产生了疑问，请到 Slack 或 [Gitter](https://gitter.im/ElemeFE/element) 里咨询。

- 在提交 issue 之前，请搜索相关内容是否已被提出。

- 请说明 Element UI 和 Vue 的版本号，并提供操作系统和浏览器信息。推荐使用 [JSFiddle](https://jsfiddle.net/) 生成在线 demo，这能够更直观地重现问题。

## Pull Request 规范
- 请先 fork 一份到自己的项目下，不要直接在仓库下建分支。

- commit 信息要以`[组件名]: 描述信息` 的形式填写，例如 `Button: fix xxx bug`。

- **不要提交** `lib` 里面打包的文件。

- 执行 `npm run dist` 后可以正确打包文件。

- 为了兼容性以及最终打包的文件体积考虑，我们的 babel 只引入了 `preset-2015`，所以不建议使用 ES2015 的 API，例如 `Array.prototype.find`、`Object.assign`等。如果有需要，请引入第三方的 polyfill。

- 提交 PR 前请 rebase，确保 commit 记录的整洁。

- 确保 PR 是提交到 `dev` 分支，而不是 `master` 分支。

- 如果是修复 bug，请在 PR 中给出描述信息。

- 合并代码需要两名维护人员参与：一人进行 review 后 approve，另一人再次 review，通过后即可合并。

## 开发环境搭建

### 环境要求

| 依赖 | 版本 | 说明 |
| --- | --- | --- |
| Node.js | 12.x（推荐 12.22.12） | 仓库根目录有 `.nvmrc`，执行 `nvm use` 即可切换 |
| yarn | 1.x | **必须**。项目用 `yarn.lock` 锁定依赖版本，请勿使用 `npm install` |
| npm | 6+ | 仅用于执行 `npm run xxx` 脚本 |

Node 14 也可以正常工作，但以 `.nvmrc` 中的版本为准。项目使用 dart-sass 编译样式，**不需要安装 Python、node-gyp 或 Visual Studio Build Tools**。

### 首次启动

```shell
git clone https://github.com/wncf/element.git
cd element

# 使用 .nvmrc 指定的 Node 版本（已装 nvm 时）
nvm use

# 1. 安装依赖
yarn install

# 2. 启动开发服务
npm run dev

# 浏览器打开 http://localhost:8085
```

`npm run dev` 会依次执行 `yarn install`、`build:file` 和 `webpack-dev-server`。

> **注意**：`examples/pages/` 目录由 `build:file` 从 `examples/pages/template/` 生成，不纳入版本控制。如果跳过 `build:file` 直接启动 webpack，会报 `Can't resolve './pages/zh-CN'`。

### 两种开发模式

两个命令都监听 `8085` 端口，**不能同时运行**。

```shell
# 文档站：带路由，可查看完整文档与 demo（含全部语言）
npm run dev

# 组件预览：单页 playground，改代码刷新更快
npm run dev:play
```

访问地址相同，均为 [http://localhost:8085](http://localhost:8085)。`dev:play` 没有路由，进去是组件预览页；`dev` 才是文档站，具体页面地址形如 `http://localhost:8085/#/zh-CN/component/button`。

修改 `examples/play/index.vue` 可以调整预览页展示的组件。

### 打包

```shell
npm run dist
```

### 运行测试

```shell
npm run test
```

会先执行 lint 并构建主题，然后用 Karma + Headless Chrome 跑单元测试。本机需已安装 Chrome，或设置 `CHROME_BIN` 指向浏览器可执行文件。

已知 `button.spec.js` 中 `loading implies disabled` 用例在部分环境下失败，与业务代码无关。

## 组件开发规范
- 通过 `make new` 创建组件目录结构，包含测试代码、入口文件、文档
- 如果包含父子组件，需要更改目录结构，参考 `Button`
- 组件内如果依赖了其他组件，需要在当前组件内引入，参考 `Select`

## 代码规范
遵循饿了么前端的 [ESLint](https://github.com/ElemeFE/eslint-config-elemefe) 即可
