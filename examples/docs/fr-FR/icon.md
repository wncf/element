## Icônes

Element fournit un ensemble d'icônes basiques.

### Usage

Il vous suffit d'assigner le nom de classe `hzq-icon-iconName` à une balise `<i>`.

:::demo

```html
<i class="hzq-icon-edit"></i>
<i class="hzq-icon-share"></i>
<i class="hzq-icon-delete"></i>
<hzq-button type="primary" icon="hzq-icon-search">Chercher</hzq-button>

```
:::

### Icônes

<ul class="icon-list">
  <li v-for="name in $icon" :key="name">
    <span>
      <i :class="'hzq-icon-' + name"></i>
      <span class="icon-name">{{'hzq-icon-' + name}}</span>
    </span>
  </li>
</ul>
