## Link 文字链接

文字超链接

### 基础用法
基础的文字链接用法。
:::demo
```html
<div>
  <hzq-link href="https://element.eleme.io" target="_blank">默认链接</hzq-link>
  <hzq-link type="primary">主要链接</hzq-link>
  <hzq-link type="success">成功链接</hzq-link>
  <hzq-link type="warning">警告链接</hzq-link>
  <hzq-link type="danger">危险链接</hzq-link>
  <hzq-link type="info">信息链接</hzq-link>
</div>
```
:::

### 禁用状态
文字链接不可用状态。
:::demo
```html
<div>
  <hzq-link disabled>默认链接</hzq-link>
  <hzq-link type="primary" disabled>主要链接</hzq-link>
  <hzq-link type="success" disabled>成功链接</hzq-link>
  <hzq-link type="warning" disabled>警告链接</hzq-link>
  <hzq-link type="danger" disabled>危险链接</hzq-link>
  <hzq-link type="info" disabled>信息链接</hzq-link>
</div>
```
:::

### 下划线
文字链接下划线。
:::demo
```html
<div>
  <hzq-link :underline="false">无下划线</hzq-link>
  <hzq-link>有下划线</hzq-link>
</div>
```
:::

### 图标

带图标的文字链接可增强辨识度。
:::demo
```html
<div>
  <hzq-link icon="hzq-icon-edit">编辑</hzq-link>
  <hzq-link>查看<i class="hzq-icon-view hzq-icon--right"></i> </hzq-link>
</div>
```
:::

### 加载中

点击后需要等待时，用 `loading` 显示加载图标并阻止重复点击。加载期间 `href` 会被置空，`click` 事件不再触发，hover 下划线也会隐藏。

:::demo
```html
<div>
  <hzq-link :loading="loading" @click="handleClick">提交审核</hzq-link>
  <hzq-link loading type="primary">加载中</hzq-link>
</div>
<script>
  export default {
    data() {
      return { loading: false };
    },
    methods: {
      handleClick() {
        this.loading = true;
        setTimeout(() => { this.loading = false; }, 2000);
      }
    }
  };
</script>
```
:::

### Attributes

| 参数           | 说明                           | 类型      | 可选值                               | 默认值  |
| -------------- | ------------------------------ | --------- | ------------------------------------ | ------- |
| type           | 类型                   | string  | primary / success / warning / danger / info | default |
| underline      | 是否下划线                         | boolean | —                                    | true    |
| disabled       | 是否禁用状态                       | boolean | —                                    | false   |
| loading        | 是否处于加载中，加载时不可点击        | boolean | —                                    | false   |
| href           | 原生 href 属性                     | string  | —                                    | -       |
| icon           | 图标类名                       | string  | —                                    | -       |
