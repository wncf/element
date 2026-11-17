## 安装

### npm 安装

推荐使用 npm 安装，配合 [webpack](https://webpack.js.org/) 等打包工具使用：

```shell
npm i hzq-ui -S
```

### CDN

也可以直接在页面上引入 js 和 css 文件开始使用。构建产物随 npm 包一起发布，可以通过 unpkg 获取：

```html
<!-- 引入样式 -->
<link rel="stylesheet" href="https://unpkg.com/hzq-ui/lib/theme-chalk/index.css">
<!-- 引入组件库 -->
<script src="https://unpkg.com/hzq-ui/lib/index.js"></script>
```

:::tip
使用 CDN 引入时，建议在链接地址上锁定版本，避免将来升级时受到非兼容性更新的影响，例如 `https://unpkg.com/hzq-ui@1.0.0/lib/index.js`。
:::

UMD 构建挂到全局的变量名是 `HZQUI`，引入后按下面方式注册：

```html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/hzq-ui/lib/index.js"></script>
<script>
  Vue.use(HZQUI);
</script>
```

### 引入

安装完成后，在入口文件中引入并注册：

```javascript
import Vue from 'vue';
import HZQUI from 'hzq-ui';
import 'hzq-ui/lib/theme-chalk/index.css';

Vue.use(HZQUI);
```

需要注意的是，样式文件需要单独引入。

:::tip
`Vue.use` 的第二个参数可以配置全局尺寸、浮层层级、语言包、业务 SVG 图标和 Loading 展示组件，详见 [Vue.use 初始化参数](./#/zh-CN/component/init-options)。
:::

如果是通过 npm 安装，并希望配合 webpack 使用，请阅读下一节：[快速上手](./#/zh-CN/component/quickstart)。
