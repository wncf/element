## Vue.use 初始化参数

组件库通过 `Vue.use(HZQUI, options)` 一次性完成注册。本文说明 `options` 里每个参数的作用、取值和生效时机，以及初始化时一并挂到 Vue 上的全局能力。

```js
import Vue from 'vue';
import HZQUI from 'hzq-ui';

Vue.use(HZQUI, {
  size: 'small',                                   // 全局组件尺寸
  zIndex: 5000,                                    // 浮层起始层级
  locale: require('hzq-ui/src/locale/lang/en'),    // 组件内文案语言包
  i18n: (path, options) => i18n.t(path, options),  // 接入 vue-i18n
  svgIcons: {                                      // 业务 SVG 图标
    prefix: 'crm',
    icons: ['base-arrow', 'base-book']
  },
  loading: {                                       // 全局 Loading 展示组件
    spinnerComponent: MySpinner,
    spinnerProps: { size: 32 }
  },
  popper: {                                        // 全局浮层配置
    appendTo: 'micro-app-body',
    boundariesElement: 'viewport',
    zIndex: 5000
  }
});
```

:::tip
所有参数都是可选的，不传时使用默认值。`Vue.use` 对同一个插件只会执行一次，重复调用不会重新应用配置。`svgIcons` 另有 `registerSvgIcons`、`loading` 另有 `Loading.setConfig` 可在运行时追加配置，其余参数需要在应用启动时一次配好。
:::

### 参数总览

| 参数 | 类型 | 默认值 | 作用 |
| --- | --- | --- | --- |
| `size` | string | `''`（等同 `medium`） | 全局组件尺寸 |
| `zIndex` | number | `2000` | 浮层层级计数器的起始值 |
| `locale` | object | 内置简体中文 | 组件内置文案的语言包 |
| `i18n` | function | — | 自定义翻译函数，用于接入 vue-i18n |
| `svgIcons` | object | — | 注册业务 SVG 图标 |
| `loading` | object | — | 全局自定义 Loading 展示组件 |
| `popper` | object | — | 全局浮层配置：挂载容器、边界元素、起始层级 |

### size

统一设置所有支持尺寸的组件的默认大小。取值为 `large` / `medium` / `small` / `mini`，不传时等同 `medium`，四档高度依次为 36px、32px、28px、24px。

```js
Vue.use(HZQUI, { size: 'small' });
```

优先级由低到高：

1. 组件自身的 `size` 属性
2. 所在 `hzq-form` / `hzq-form-item` 的尺寸
3. 全局 `$HZQ.size`

也就是说，全局值只是兜底，单个组件写了 `size` 就以组件的为准。

生效范围包括 Button、Input、InputNumber、AmountInput、Select、Cascader、Checkbox、Radio、DatePicker、TimePicker、ColorPicker、Pagination、Dropdown、Descriptions、Table、Tag，以及 Form、Dialog、Drawer 等。Switch、Slider 这类尺寸由自身样式决定的组件不受此配置影响。

配置会同时写到 `Vue.prototype.$HZQ.size`，业务代码里可以读取当前全局尺寸。

### zIndex

浮层（对话框、下拉、气泡、消息提示等）共用一套层级计数器，保证后打开的盖住先打开的。`zIndex` 用于指定这个计数器的起始值，默认 `2000`。

```js
Vue.use(HZQUI, { zIndex: 5000 });
```

:::warning
计数器在**第一次打开浮层时**才从 `$HZQ.zIndex` 初始化。如果此时已有浮层被打开并取过号，之后再改 `zIndex` 不会回溯生效。所以需要在应用启动阶段、任何浮层打开之前完成配置。
:::

把组件库嵌入已有 `z-index` 体系的老系统时，这个参数很有用。层级机制的完整说明见[浮层层级管理](./#/zh-CN/component/popup-guide)。

### locale

替换组件内部的所有内置文案，例如日期选择器的「此刻 / 今天 / 确定」，分页器的「前往 / 页」，表格的空数据提示等。默认使用内置的简体中文语言包。

```js
import en from 'hzq-ui/src/locale/lang/en';

Vue.use(HZQUI, { locale: en });
```

语言包是一个普通对象，结构为 `{ el: { ... } }`。可以只覆盖部分字段，未提供的字段仍使用内置默认值：

```js
import zhCN from 'hzq-ui/src/locale/lang/zh-CN';

Vue.use(HZQUI, {
  locale: {
    el: {
      ...zhCN.el,
      pagination: {
        ...zhCN.el.pagination,
        goto: '跳至'
      }
    }
  }
});
```

### i18n

接入 `vue-i18n` 时使用。传入一个 `(path, options) => string` 的函数，组件取文案时会先调用它，返回 `null` / `undefined` 时回退到 `locale` 语言包。

```js
import VueI18n from 'vue-i18n';
import HZQUI from 'hzq-ui';

Vue.use(VueI18n);

const i18n = new VueI18n({ locale: 'zh-CN', messages });

Vue.use(HZQUI, {
  i18n: (path, options) => i18n.t(path, options)
});
```

:::tip
如果项目里注册了 `vue-i18n`，但**没有**传 `i18n` 参数，组件会自动尝试调用 `Vue.prototype.$t`。只有当默认行为不满足需求（例如语言包需要按业务命名空间拆分）时，才需要显式传这个函数。
:::

### svgIcons

注册业务方自己的 SVG 图标，与系统内置的 iconfont 图标命名空间互相隔离。

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `prefix` | string | 是 | 业务图标前缀，不能是 `el` / `hzq` |
| `icons` | string[] / object | 是 | 图标名数组，或 `{ 名称: svg 内容 }` 映射（内容会在运行时注入页面） |

```js
Vue.use(HZQUI, {
  svgIcons: {
    prefix: 'crm',
    icons: ['base-arrow', 'base-book', 'base-bulb']
  }
});
```

注册后的完整名称为 `前缀-图标名`，例如 `crm-base-arrow`，在模板里通过 `<hzq-svg-icon name="crm-base-arrow" />` 使用。传入已经带前缀的名称也能识别，不会重复拼接。

:::warning
同一个图标重复注册会直接抛错。如需跳过并只打印警告，请改用单独的 `registerSvgIcons(icons, { prefix, silent: true })` 调用。
:::

`icons` 支持两种写法：

- **数组**：只登记图标名，图标本身需要由 `svg-sprite-loader` 在使用方构建时打成 `<symbol>`
- **对象映射**：`{ 名称: svg 内容 }`，组件库在运行时解析并注入 `<symbol>`，无需任何构建配置

```js
// 运行时注入，无需 webpack 配置
Vue.use(HZQUI, {
  svgIcons: {
    prefix: 'crm',
    icons: {
      'base-arrow': '<svg viewBox="0 0 24 24"><path d="..."/></svg>'
    }
  }
});
```

详见 [SvgIcon 业务图标](./#/zh-CN/component/svg-icon)。

### loading

全局自定义 Loading 的展示元素。传入一个组件后，所有 `v-loading` 指令和 `$loading` 服务都会默认用它渲染，不再使用内置的 SVG 圆圈。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `spinnerComponent` | VueComponent | 自定义展示组件 |
| `spinnerProps` | object | 透传给该组件的属性，例如 `size`、`color` |

```js
import MySpinner from './MySpinner.vue';

Vue.use(HZQUI, {
  loading: {
    spinnerComponent: MySpinner,
    spinnerProps: { size: 32, color: '#409eff' }
  }
});
```

单次使用时仍可覆盖：

```html
<div v-loading="loading" element-loading-size="48" element-loading-color="#f56c6c"></div>
```

```js
this.$loading({ size: 48, color: '#f56c6c' });
```

渲染优先级从高到低为：`element-loading-spinner` 字符串图标 → 自定义组件 → 内置 SVG 圆圈。详见 [Loading 加载](./#/zh-CN/component/loading)。

### popper

统一配置所有定位类浮层（Tooltip、Popover、Select 下拉、DatePicker 面板、Dropdown 等）的挂载容器、边界元素与起始层级。主要解决主应用 / micro-app 场景下浮层被裁切、被遮盖或被推回的问题。

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `appendTo` | string / HTMLElement / function | `'body'` | 浮层的挂载容器。字符串按选择器查找，函数需要返回元素 |
| `boundariesElement` | string / HTMLElement / function | `'viewport'` | 浮层允许摆放的边界。`'viewport'` / `'window'` / `'scrollParent'` 直接透传给 popper，其它字符串按选择器查找 |
| `boundariesPadding` | number | — | 边界留白，不设时沿用组件自身或 popper 的默认值 |
| `zIndex` | number | `2000` | 浮层层级计数器的起始值，与顶层 `zIndex` 等价 |

```js
Vue.use(HZQUI, {
  popper: {
    appendTo: 'micro-app-body',
    boundariesElement: 'viewport',
    zIndex: 5000
  }
});
```

:::tip
`appendTo` 支持选择器、元素、函数三种写法，**每次创建浮层时实时解析**，所以微前端容器即使晚于插件安装才注入也能被正确找到。解析失败（或函数返回 `null`）时回落到 `document.body`。
:::

优先级从高到低：

1. 组件自身的 `popper-options`（例如 `<hzq-tooltip :popper-options="{ boundariesElement: el }">`）
2. 全局 `popper` 配置
3. 库内默认值

也就是说，全局配置只做兜底，单个组件显式指定了就以组件为准。`$tooltip` 服务式提示使用全局单例，只在首次调用时挂载，因此之后再改 `appendTo` 不会迁移已有实例。

配置也可以不用 `Vue.use`，单独调用导出的方法：

```js
import { setPopperConfig } from 'hzq-ui';

setPopperConfig({
  appendTo: () => document.querySelector('.app-container'),
  zIndex: 5000
});
```

### 初始化时一并完成的事

除了上面这些参数，`Vue.use(HZQUI)` 还会注册以下内容，无需额外调用：

**全局组件**

组件库导出的全部组件，包括 `hzq-button`、`hzq-input`、`hzq-table`、`hzq-dialog` 等，均以 `hzq-` 为前缀注册。

**全局指令**

| 指令 | 说明 |
| --- | --- |
| `v-loading` | 区域 / 全屏加载遮罩，支持 `.fullscreen`、`.lock`、`.body` 修饰符 |
| `v-tooltip` | 文字提示，适用于列表、表格等大量元素场景 |
| `v-infinite-scroll` | 无限滚动 |

**全局方法**

| 方法 | 说明 |
| --- | --- |
| `this.$loading(options)` | 服务式加载，返回可 `close()` 的实例 |
| `this.$dialog(options)` | 服务式对话框 |
| `this.$drawer(options)` | 服务式抽屉 |
| `this.$message(options)` | 消息提示 |
| `this.$notify(options)` | 通知提醒 |
| `this.$tooltip(options)` | 服务式文字提示 |
| `this.$HZQ` | 全局配置对象，包含 `{ size, zIndex }` |

```js
export default {
  mounted() {
    this.$message.success('加载完成');
    this.$HZQ.size;   // 当前全局尺寸
    this.$HZQ.zIndex; // 当前浮层起始层级
  }
};
```

### 单独安装

如果只需要部分能力，可以跳过完整安装，按需引入：

```js
import Vue from 'vue';
import Loading from 'hzq-ui/packages/loading';

// 只装指令和服务
Vue.use(Loading, {
  spinnerComponent: MySpinner
});

// 或只注册指令，服务单独使用
Vue.use(Loading.directive);
Vue.prototype.$loading = Loading.service;
```

:::tip
单独安装时，`size`、`zIndex` 这类全局参数不会自动写入 `$HZQ`，需要自己设置 `Vue.prototype.$HZQ = { size, zIndex }`。
:::
