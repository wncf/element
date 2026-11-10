## Icon 图标

提供了一套常用的图标集合。

### 使用方法

直接通过设置类名为 `hzq-icon-iconName` 来使用即可。例如：

:::demo
```html
<i class="hzq-icon-edit"></i>
<i class="hzq-icon-share"></i>
<i class="hzq-icon-delete"></i>
<hzq-button type="primary" icon="hzq-icon-search">搜索</hzq-button>

```
:::

### 图标集合

<ul class="icon-list">
  <li v-for="name in $icon" :key="name">
    <span>
      <i :class="'hzq-icon-' + name"></i>
      <span class="icon-name">{{'hzq-icon-' + name}}</span>
    </span>
  </li>
</ul>
