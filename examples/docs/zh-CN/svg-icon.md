## SvgIcon 图标

用于引入业务方自己的 SVG 图标。系统内置图标仍使用 [Icon 图标](./#/zh-CN/component/icon)，两者命名空间互相隔离。

:::tip
图标最终都以 `<symbol id="icon-[name]">` 的形式存在于页面，`<hzq-svg-icon>` 用 `<use>` 引用。`<symbol>` 的来源有两种，任选其一：

| 方式 | 使用方要做的事 | 适合场景 |
| --- | --- | --- |
| 运行期注入 | 只在 `Vue.use` 里传 `{ 名称: svg 内容 }` | 图标不多，或不想改构建配置 |
| svg-sprite-loader | webpack 配置 + 入口注册 | 图标多、按目录维护 |
:::

### 方式一：只在 Vue.use 里配置

把 SVG 内容以字符串形式传进去，组件库会在运行时解析成 `<symbol>` 并注入页面。**无需任何 webpack 配置。**

```js
import HZQUI from 'hzq-ui';

Vue.use(HZQUI, {
  svgIcons: {
    prefix: 'crm',
    icons: {
      'base-arrow': '<svg viewBox="0 0 24 24"><path d="M12 2L2 22h20z"/></svg>',
      'base-book': '<svg viewBox="0 0 24 24"><rect width="24" height="24"/></svg>'
    }
  }
});
```

然后在模板里直接使用：

```html
<hzq-svg-icon name="crm-base-arrow" />
```

注入逻辑的细节：

- `viewBox` 沿用原 `<svg>` 的；没有的话用 `width` / `height` 推导成 `0 0 w h`
- 字符串没写 `xmlns` 时会自动补齐，否则解析出的节点不在 SVG 命名空间下，浏览器不会渲染
- 所有 symbol 统一放在一个隐藏的 `<svg>` 容器里（优先挂到 `body`，`body` 尚不可用时挂到 `documentElement`）
- 同名图标重复注册会抛错，不会重复注入
- 内容不是合法 `<svg>`、或 `<svg>` 内没有任何可渲染节点时，只 `console.warn` 并跳过，不影响应用启动

:::tip
如果图标内容来自 `.svg` 文件，用 `raw-loader` 把它作为字符串引入即可，仍然只需在入口写一次：

```js
const icons = {
  'base-arrow': require('!raw-loader!./icons/base-arrow.svg'),
  'base-book': require('!raw-loader!./icons/base-book.svg')
};
```
:::

### 方式二：使用 svg-sprite-loader

图标较多时，用构建工具统一处理目录，性能更好。

```js
// webpack 配置
{
  test: /\.svg$/,
  include: [resolve('src/icons/svg')],
  use: [
    {
      loader: 'svg-sprite-loader',
      options: { symbolId: 'icon-[name]' }
    },
    {
      // 建议加上：压缩后再打成 symbol
      loader: 'svgo-loader',
      options: { externalConfig: 'svgo.config.yml' }
    }
  ]
}
```

```js
// 入口文件，把目录下所有 svg 打成 symbol
const req = require.context('./icons/svg', false, /\.svg$/);
req.keys().forEach(req);
```

这种方式下，`svgIcons` 的 `icons` 传图标名数组即可。它只做登记与校验（前缀、查重），不会处理文件：

```js
Vue.use(HZQUI, {
  svgIcons: {
    prefix: 'crm',
    icons: ['base-arrow', 'base-book', 'base-bulb']
  }
});
```

### 压缩图标

设计软件导出的 SVG 通常带大量无用内容：XML 声明、DOCTYPE、注释、`<style>` 与 class、层层嵌套的 `<g>`。实测一个 1.6 KB 的图标压缩后只剩 215 B。

仓库根目录提供了 `svgo.config.yml` 参考配置，按下面接入：

```bash
npm i svgo svgo-loader -D
```

```js
// webpack 配置，放在 svg-sprite-loader 之后
{
  test: /\.svg$/,
  include: [resolve('src/icons/svg')],
  use: [
    { loader: 'svg-sprite-loader', options: { symbolId: 'icon-[name]' } },
    { loader: 'svgo-loader', options: { externalConfig: 'svgo.config.yml' } }
  ]
}
```

配置文件内容：

```yml
plugins:
  - removeDoctype: true
  - removeXMLProcInst: true
  - removeComments: true
  - removeMetadata: true
  - removeEditorsNSData: true
  - removeUselessDefs: true
  - removeEmptyAttrs: true
  - removeHiddenElems: true
  - removeEmptyText: true
  - removeEmptyContainers: true
  - removeViewBox: false        # 保留 viewBox，否则缩放会失效
  - removeDimensions: true      # 去掉 width/height，交给组件 size 控制
  - cleanupIDs: true
  - removeUnusedNS: true
  - collapseGroups: true
  - cleanupEnableBackground: true
  - convertColors:
      currentColor: true        # 颜色统一交给 currentColor
  - convertPathData:
      floatPrecision: 2         # 路径精度，2 位足够
  - convertShapeToPath: true
  - mergePaths: true
```

:::warning
`convertColors.currentColor` 和 `mergePaths` 会让图标变成**单色**。多色图标请关掉这两项，否则所有颜色会被合并成同一个。
:::

也可以不接入构建，直接对图标目录跑一次：

```bash
npx svgo --config svgo.config.yml -f src/icons/svg -o src/icons/svg
```

### 单独注册

不通过 `Vue.use`，也可以直接调用注册函数：

```js
import { registerSvgIcons } from 'hzq-ui/packages/svg-icon';

// 运行期注入
registerSvgIcons({ 'base-arrow': svgString }, { prefix: 'crm' });

// 仅登记名字
registerSvgIcons(['base-arrow', 'base-book'], { prefix: 'crm' });
```

也可直接传文件里已经带前缀的完整名，注册器会自动识别，不会重复拼接：

```js
registerSvgIcons(['crm-base-arrow'], { prefix: 'crm' }); // 结果仍是 crm-base-arrow
```

### 基础用法

:::demo `name` 传入完整图标名，`size` 默认 `1em`，跟随父级字号缩放入。
```html
<div>
  <hzq-svg-icon name="crm-base-arrow" />
  <hzq-svg-icon name="crm-base-book" size="24px" />
  <hzq-svg-icon name="crm-base-bulb" size="32px" color="#409EFF" />
</div>
```
:::

### 跟随字号

:::demo 不传 `size` 时默认 `1em`，放进按钮、导航等容器里会自动跟随字号，无需逐个指定像素。
```html
<div>
  <hzq-button size="large" icon="hzq-icon-search">大号</hzq-button>
  <hzq-button icon="hzq-icon-search">默认</hzq-button>
  <hzq-button size="small" icon="hzq-icon-search">小号</hzq-button>
</div>
```
:::

### 命名冲突

图标名由「前缀 + 图标名」组成，因此天然和系统内置图标（`hzq-icon-xxx`）隔离。注册器只在以下情况报错：

| 情况 | 行为 |
| --- | --- |
| 未传 `prefix` | 抛错 `registerSvgIcons 需要显式传入 prefix` |
| `prefix` 为空字符串、`el`、`hzq` | 抛错，提示为系统保留 |
| 同名图标重复注册 | 抛错；传 `{ silent: true }` 时改为 `console.warn` 并跳过 |

```js
// 推荐前缀：业务域名或模块名，避免跨应用撞名
registerSvgIcons(icons, { prefix: 'crm' });   // ✓
registerSvgIcons(icons, { prefix: 'hzq' });   // ✗ 系统保留
registerSvgIcons(icons, {});                  // ✗ 缺少 prefix
```

### Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---------- | -------------- | ---------- | --- | -------- |
| name | 完整图标名，由「前缀 + 图标名」组成 | string | — | — |
| size | 图标尺寸，支持任意 CSS 长度单位；传数字时按 `px` 处理 | string / number | — | 1em |
| color | 图标颜色，默认继承 `currentColor` | string | — | — |
| class-name | 附加的类名 | string | — | — |

### API

```js
import {
  registerSvgIcons,
  ensureSvgIconInjected,
  hasSvgIcon,
  getSvgIconContent,
  getRegisteredSvgIcons,
  clearSvgIcons
} from 'hzq-ui/packages/svg-icon';
```

| 方法 | 说明 |
| --- | --- |
| `registerSvgIcons(icons, { prefix, silent })` | 注册图标，返回成功注册的完整名称数组；传内容映射时同时注入 symbol |
| `hasSvgIcon(name)` | 判断某个完整名称是否已注册 |
| `getSvgIconContent(name)` | 取运行期注册的 SVG 内容，仅登记名字的返回 `null` |
| `getRegisteredSvgIcons()` | 返回全部已注册的完整名称 |
| `ensureSvgIconInjected(name)` | 确保该图标的 symbol 已注入 DOM，返回是否注入成功（组件挂载时会自动调用） |
| `clearSvgIcons()` | 清空注册表并移除已注入的 symbol（主要用于测试） |
