## SvgIcon 图标

用于引入业务方自己的 SVG 图标。系统内置图标仍使用 [Icon 图标](./#/zh-CN/component/icon)，两者命名空间互相隔离。

:::tip
组件本身走 **svg-sprite** 方案：使用方用 `svg-sprite-loader` 把 SVG 打成 `<symbol id="icon-[name]">` 注入到页面，`<hzq-svg-icon>` 用 `<use>` 引用。

这样做的好处是**现有构建配置无需改造**，也避免每个图标内联一份 `<path>` 导致 DOM 膨胀。
:::

### 前置配置

使用 `svg-sprite-loader` 处理图标目录：

```js
// webpack 配置
{
  test: /\.svg$/,
  include: [resolve('src/icons/svg')],
  use: [{
    loader: 'svg-sprite-loader',
    options: { symbolId: 'icon-[name]' }
  }]
}
```

```js
// 入口文件，把目录下所有 svg 打成 symbol
const req = require.context('./icons/svg', false, /\.svg$/);
req.keys().forEach(req);
```

### 注册图标

引入图标时显式声明前缀。前缀会与图标名拼接成完整名称，例如 `prefix: 'crm'` + `crm-base-arrow` 注册为 `crm-base-arrow`。

```js
import HZQUI from 'hzq-ui';
import { registerSvgIcons } from 'hzq-ui/packages/svg-icon';

// 方式一：在初始化时传入
Vue.use(HZQUI, {
  svgIcons: {
    prefix: 'crm',
    icons: ['base-arrow', 'base-book', 'base-bulb']
  }
});

// 方式二：单独调用
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
| size | 图标尺寸，支持任意 CSS 长度单位 | string / number | — | 1em |
| color | 图标颜色，默认继承 `currentColor` | string | — | — |
| class-name | 附加的类名 | string | — | — |

### API

```js
import {
  registerSvgIcons,
  hasSvgIcon,
  getRegisteredSvgIcons,
  clearSvgIcons
} from 'hzq-ui/packages/svg-icon';
```

| 方法 | 说明 |
| --- | --- |
| `registerSvgIcons(icons, { prefix, silent })` | 注册图标，返回成功注册的完整名称数组 |
| `hasSvgIcon(name)` | 判断某个完整名称是否已注册 |
| `getRegisteredSvgIcons()` | 返回全部已注册的完整名称 |
| `clearSvgIcons()` | 清空注册表（主要用于测试） |
