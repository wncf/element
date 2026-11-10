## Breadcrumb

Displays the location of the current page, making it easier to browser back.

### Basic usage


:::demo In `hzq-breadcrumb`, each `hzq-breadcrumb-item` is a tag that stands for every level starting from homepage. This component has a `String` attribute `separator`, and it determines the separator. Its default value is '/'.

```html
<hzq-breadcrumb separator="/">
  <hzq-breadcrumb-item :to="{ path: '/' }">homepage</hzq-breadcrumb-item>
  <hzq-breadcrumb-item><a href="/">promotion management</a></hzq-breadcrumb-item>
  <hzq-breadcrumb-item>promotion list</hzq-breadcrumb-item>
  <hzq-breadcrumb-item>promotion detail</hzq-breadcrumb-item>
</hzq-breadcrumb>
```
:::

### Icon separator

:::demo Set `separator-class` to use `iconfont` as the separator，it will cover `separator`

```html
<hzq-breadcrumb separator-class="hzq-icon-arrow-right">
  <hzq-breadcrumb-item :to="{ path: '/' }">homepage</hzq-breadcrumb-item>
  <hzq-breadcrumb-item>promotion management</hzq-breadcrumb-item>
  <hzq-breadcrumb-item>promotion list</hzq-breadcrumb-item>
  <hzq-breadcrumb-item>promotion detail</hzq-breadcrumb-item>
</hzq-breadcrumb>
```
:::

### Breadcrumb Attributes
| Attribute      | Description          | Type      | Accepted Values            | Default|
|---------- |-------------- |---------- |--------------------------------  |-------- |
| separator | separator character | string | — | / |
| separator-class | class name of icon separator | string | — | - |

### Breadcrumb Item Attributes
| Attribute      | Description          | Type      | Accepted Values            | Default|
|---------- |-------------- |---------- |--------------------------------  |-------- |
| to | target route of the link, same as `to` of `vue-router` | string/object | — | — |
| replace | if `true`, the navigation will not leave a history record | boolean | — | false |





