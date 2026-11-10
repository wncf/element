## Badge

A number or status mark on buttons and icons.

### Basic usage

Displays the amount of new messages.

:::demo The amount is defined with `value` which accepts `Number` or `String`.

```html
<hzq-badge :value="12" class="item">
  <hzq-button size="small">comments</hzq-button>
</hzq-badge>
<hzq-badge :value="3" class="item">
  <hzq-button size="small">replies</hzq-button>
</hzq-badge>
<hzq-badge :value="1" class="item" type="primary">
  <hzq-button size="small">comments</hzq-button>
</hzq-badge>
<hzq-badge :value="2" class="item" type="warning">
  <hzq-button size="small">replies</hzq-button>
</hzq-badge>

<hzq-dropdown trigger="click">
  <span class="hzq-dropdown-link">
    Click Me<i class="hzq-icon-caret-bottom hzq-icon--right"></i>
  </span>
  <hzq-dropdown-menu slot="dropdown">
    <hzq-dropdown-item class="clearfix">
      comments
      <hzq-badge class="mark" :value="12" />
    </hzq-dropdown-item>
    <hzq-dropdown-item class="clearfix">
      replies
      <hzq-badge class="mark" :value="3" />
    </hzq-dropdown-item>
  </hzq-dropdown-menu>
</hzq-dropdown>

<style>
.item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>
```
:::

### Max value

You can customize the max value.

:::demo The max value is defined by property `max` which is a `Number`. Note that it only works when `value` is also a `Number`.

```html
<hzq-badge :value="200" :max="99" class="item">
  <hzq-button size="small">comments</hzq-button>
</hzq-badge>
<hzq-badge :value="100" :max="10" class="item">
  <hzq-button size="small">replies</hzq-button>
</hzq-badge>

<style>
.item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>
```
:::

### Customizations

Displays text content other than numbers.

:::demo When `value` is a `String`, it can display customized text.

```html
<hzq-badge value="new" class="item">
  <hzq-button size="small">comments</hzq-button>
</hzq-badge>
<hzq-badge value="hot" class="item">
  <hzq-button size="small">replies</hzq-button>
</hzq-badge>

<style>
.item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>
```
:::

### Little red dot

Use a red dot to mark content that needs to be noticed.

:::demo Use the attribute `is-dot`. It is a `Boolean`.

```html
<hzq-badge is-dot class="item">query</hzq-badge>
<hzq-badge is-dot class="item">
  <hzq-button class="share-button" icon="hzq-icon-share" type="primary"></hzq-button>
</hzq-badge>

<style>
.item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>
```
:::

### Attributes
| Attribute     | Description     | Type            | Accepted Values       | Default |
|-------------  |---------------- |---------------- |---------------------- |-------- |
| value         | display value   | string, number  |          —            |    —    |
| max           |  maximum value, shows '{max}+' when exceeded. Only works if `value` is a `Number`   | number  |         —              |     —    |
| is-dot        | if a little dot is displayed | boolean   |    —           |  false  |
| hidden        | hidden badge    | boolean         |          —            |  false  |
| type          | button type     | string          | primary / success / warning / danger / info |   —  |
