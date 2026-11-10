## Button

Commonly used button.

### Basic usage

:::demo Use `type`, `plain`, `round` and `circle` to define Button's style.

```html
<hzq-row>
  <hzq-button>Default</hzq-button>
  <hzq-button type="primary">Primary</hzq-button>
  <hzq-button type="success">Success</hzq-button>
  <hzq-button type="info">Info</hzq-button>
  <hzq-button type="warning">Warning</hzq-button>
  <hzq-button type="danger">Danger</hzq-button>
</hzq-row>

<hzq-row>
  <hzq-button plain>Plain</hzq-button>
  <hzq-button type="primary" plain>Primary</hzq-button>
  <hzq-button type="success" plain>Success</hzq-button>
  <hzq-button type="info" plain>Info</hzq-button>
  <hzq-button type="warning" plain>Warning</hzq-button>
  <hzq-button type="danger" plain>Danger</hzq-button>
</hzq-row>

<hzq-row>
  <hzq-button round>Round</hzq-button>
  <hzq-button type="primary" round>Primary</hzq-button>
  <hzq-button type="success" round>Success</hzq-button>
  <hzq-button type="info" round>Info</hzq-button>
  <hzq-button type="warning" round>Warning</hzq-button>
  <hzq-button type="danger" round>Danger</hzq-button>
</hzq-row>

<hzq-row>
  <hzq-button icon="hzq-icon-search" circle></hzq-button>
  <hzq-button type="primary" icon="hzq-icon-edit" circle></hzq-button>
  <hzq-button type="success" icon="hzq-icon-check" circle></hzq-button>
  <hzq-button type="info" icon="hzq-icon-message" circle></hzq-button>
  <hzq-button type="warning" icon="hzq-icon-star-off" circle></hzq-button>
  <hzq-button type="danger" icon="hzq-icon-delete" circle></hzq-button>
</hzq-row>
```
:::

### Disabled Button

The `disabled` attribute determines if the button is disabled.

:::demo Use `disabled` attribute to determine whether a button is disabled. It accepts a `Boolean` value.

```html
<hzq-row>
  <hzq-button disabled>Default</hzq-button>
  <hzq-button type="primary" disabled>Primary</hzq-button>
  <hzq-button type="success" disabled>Success</hzq-button>
  <hzq-button type="info" disabled>Info</hzq-button>
  <hzq-button type="warning" disabled>Warning</hzq-button>
  <hzq-button type="danger" disabled>Danger</hzq-button>
</hzq-row>

<hzq-row>
  <hzq-button plain disabled>Plain</hzq-button>
  <hzq-button type="primary" plain disabled>Primary</hzq-button>
  <hzq-button type="success" plain disabled>Success</hzq-button>
  <hzq-button type="info" plain disabled>Info</hzq-button>
  <hzq-button type="warning" plain disabled>Warning</hzq-button>
  <hzq-button type="danger" plain disabled>Danger</hzq-button>
</hzq-row>
```
:::

### Text Button

Buttons without border and background.

:::demo
```html
<hzq-button type="text">Text Button</hzq-button>
<hzq-button type="text" disabled>Text Button</hzq-button>
```
:::

### Icon Button

Use icons to add more meaning to Button. You can use icon alone to save some space, or use it with text.

:::demo Use the `icon` attribute to add icon. You can find the icon list in Element icon component. Adding icons to the right side of the text is achievable with an `<i>` tag. Custom icons can be used as well.

```html
<hzq-button type="primary" icon="hzq-icon-edit"></hzq-button>
<hzq-button type="primary" icon="hzq-icon-share"></hzq-button>
<hzq-button type="primary" icon="hzq-icon-delete"></hzq-button>
<hzq-button type="primary" icon="hzq-icon-search">Search</hzq-button>
<hzq-button type="primary">Upload<i class="hzq-icon-upload hzq-icon-right"></i></hzq-button>
```
:::

### Button Group

Displayed as a button group, can be used to group a series of similar operations.

:::demo Use tag `<hzq-button-group>` to group your buttons.

```html
<hzq-button-group>
  <hzq-button type="primary" icon="hzq-icon-arrow-left">Previous Page</hzq-button>
  <hzq-button type="primary">Next Page<i class="hzq-icon-arrow-right hzq-icon-right"></i></hzq-button>
</hzq-button-group>
<hzq-button-group>
  <hzq-button type="primary" icon="hzq-icon-edit"></hzq-button>
  <hzq-button type="primary" icon="hzq-icon-share"></hzq-button>
  <hzq-button type="primary" icon="hzq-icon-delete"></hzq-button>
</hzq-button-group>
```
:::

### Loading Button

Click the button to load data, then the button displays a loading state.

:::demo Set `loading` attribute to `true` to display loading state.

```html
<hzq-button type="primary" :loading="true">Loading</hzq-button>
```
:::

### Sizes

Button provides four sizes for you to choose among different scenarios.

:::demo Use attribute `size` to set additional sizes with `large`, `medium`, `small` or `mini`. Without `size` the button is `medium`; the four sizes are 36px, 32px, 28px and 24px high.

```html
<hzq-row>
  <hzq-button>Default</hzq-button>
  <hzq-button size="large">Large</hzq-button>
  <hzq-button size="medium">Medium</hzq-button>
  <hzq-button size="small">Small</hzq-button>
  <hzq-button size="mini">Mini</hzq-button>
</hzq-row>
<hzq-row>
  <hzq-button round>Default</hzq-button>
  <hzq-button size="large" round>Large</hzq-button>
  <hzq-button size="medium" round>Medium</hzq-button>
  <hzq-button size="small" round>Small</hzq-button>
  <hzq-button size="mini" round>Mini</hzq-button>
</hzq-row>
```
:::

### Attributes
| Attribute      | Description    | Type      | Accepted values       | Default   |
|---------- |-------- |---------- |-------------  |-------- |
| size     | button size   | string  | large / medium / small / mini |    —     |
| type     | button type   | string    |   primary / success / warning / danger / info / text |     —    |
| plain     | determine whether it's a plain button   | boolean    | — | false   |
| round     | determine whether it's a round button   | boolean    | — | false   |
| circle     | determine whether it's a circle button   | boolean    | — | false   |
| loading   | determine whether it's loading   | boolean    | — | false   |
| disabled  | disable the button    | boolean   | —   | false   |
| icon  | icon class name | string   |  —  |  —  |
| autofocus  | same as native button's `autofocus` | boolean   |  —  |  false  |
| native-type | same as native button's `type` | string | button / submit / reset | button |