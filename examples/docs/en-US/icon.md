## Icon

Element provides a set of common icons.

### Basic usage

Just assign the class name to `hzq-icon-iconName`.

:::demo

```html
<i class="hzq-icon-edit"></i>
<i class="hzq-icon-share"></i>
<i class="hzq-icon-delete"></i>
<hzq-button type="primary" icon="hzq-icon-search">Search</hzq-button>

```
:::

### Icons

<ul class="icon-list">
  <li v-for="name in $icon" :key="name">
    <span>
      <i :class="'hzq-icon-' + name"></i>
      <span class="icon-name">{{'hzq-icon-' + name}}</span>
    </span>
  </li>
</ul>
