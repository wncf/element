## Link

Text hyperlink

### Basic

Basic text link
:::demo

```html
<div>
  <hzq-link href="https://element.eleme.io" target="_blank">default</hzq-link>
  <hzq-link type="primary">primary</hzq-link>
  <hzq-link type="success">success</hzq-link>
  <hzq-link type="warning">warning</hzq-link>
  <hzq-link type="danger">danger</hzq-link>
  <hzq-link type="info">info</hzq-link>
</div>
```

:::

### Disabled

Disabled state of link
:::demo

```html
<div>
  <hzq-link disabled>default</hzq-link>
  <hzq-link type="primary" disabled>primary</hzq-link>
  <hzq-link type="success" disabled>success</hzq-link>
  <hzq-link type="warning" disabled>warning</hzq-link>
  <hzq-link type="danger" disabled>danger</hzq-link>
  <hzq-link type="info" disabled>info</hzq-link>
</div>
```

:::

### Underline

Underline of link
:::demo

```html
<div>
  <hzq-link :underline="false">Without Underline</hzq-link>
  <hzq-link>With Underline</hzq-link>
</div>
```

:::

### Icon

Link with icon
:::demo

```html
<div>
  <hzq-link icon="hzq-icon-edit">Edit</hzq-link>
  <hzq-link>Check<i class="hzq-icon-view hzq-icon--right"></i> </hzq-link>
</div>
```

:::

### Attributes

| Attribute | Description                         | Type    | Options                                     | Default |
| --------- | ----------------------------------- | ------- | ------------------------------------------- | ------- |
| type      | type                                | string  | primary / success / warning / danger / info | default |
| underline | whether the component has underline | boolean | —                                           | true    |
| disabled  | whether the component is disabled   | boolean | —                                           | false   |
| href      | same as native hyperlink's `href`   | string  | —                                           | -       |
| icon      | class name of icon                  | string  | —                                           | -       |
