## Descriptions

Display multiple fields in list form.

### Basic usage

:::demo

```html
<hzq-descriptions title="User Info">
    <hzq-descriptions-item label="Username">kooriookami</hzq-descriptions-item>
    <hzq-descriptions-item label="Telephone">18100000000</hzq-descriptions-item>
    <hzq-descriptions-item label="Place">Suzhou</hzq-descriptions-item>
    <hzq-descriptions-item label="Remarks">
      <hzq-tag size="small">School</hzq-tag>
    </hzq-descriptions-item>
    <hzq-descriptions-item label="Address">No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province</hzq-descriptions-item>
</hzq-descriptions>
```
:::

### Sizes

:::demo Changez de taille avec `size` ; sans lui la liste est `medium`.

```html
<template>
  <hzq-radio-group v-model="size">
    <hzq-radio label="large">Large</hzq-radio>
    <hzq-radio label="medium">Medium</hzq-radio>
    <hzq-radio label="small">Small</hzq-radio>
    <hzq-radio label="mini">Mini</hzq-radio>
  </hzq-radio-group>

  <hzq-descriptions class="margin-top" title="With border" :column="3" :size="size" border>
    <template slot="extra">
      <hzq-button type="primary" size="small">Operation</hzq-button>
    </template>
    <hzq-descriptions-item>
      <template slot="label">
        <i class="hzq-icon-user"></i>
        Username
      </template>
      kooriookami
    </hzq-descriptions-item>
    <hzq-descriptions-item>
      <template slot="label">
        <i class="hzq-icon-mobile-phone"></i>
        Telephone
      </template>
      18100000000
    </hzq-descriptions-item>
    <hzq-descriptions-item>
      <template slot="label">
        <i class="hzq-icon-location-outline"></i>
        Place
      </template>
      Suzhou
    </hzq-descriptions-item>
    <hzq-descriptions-item>
      <template slot="label">
        <i class="hzq-icon-tickets"></i>
        Remarks
      </template>
      <hzq-tag size="small">School</hzq-tag>
    </hzq-descriptions-item>
    <hzq-descriptions-item>
      <template slot="label">
        <i class="hzq-icon-office-building"></i>
        Address
      </template>
      No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
    </hzq-descriptions-item>
  </hzq-descriptions>

  <hzq-descriptions class="margin-top" title="Without border" :column="3" :size="size">
    <template slot="extra">
      <hzq-button type="primary" size="small">Operation</hzq-button>
    </template>
    <hzq-descriptions-item label="Username">kooriookami</hzq-descriptions-item>
    <hzq-descriptions-item label="Telephone">18100000000</hzq-descriptions-item>
    <hzq-descriptions-item label="Place">Suzhou</hzq-descriptions-item>
    <hzq-descriptions-item label="Remarks">
      <hzq-tag size="small">School</hzq-tag>
    </hzq-descriptions-item>
    <hzq-descriptions-item label="Address">No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province</hzq-descriptions-item>
  </hzq-descriptions>
</template>

<script>
  export default {
    data () {
      return {
        size: 'medium'
      };
    }
  }
</script>
```
:::

### Vertical List

:::demo

```html
<hzq-descriptions title="Vertical list with border" direction="vertical" :column="4" border>
  <hzq-descriptions-item label="Username">kooriookami</hzq-descriptions-item>
  <hzq-descriptions-item label="Telephone">18100000000</hzq-descriptions-item>
  <hzq-descriptions-item label="Place" :span="2">Suzhou</hzq-descriptions-item>
  <hzq-descriptions-item label="Remarks">
    <hzq-tag size="small">School</hzq-tag>
  </hzq-descriptions-item>
  <hzq-descriptions-item label="Address">No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province</hzq-descriptions-item>
</hzq-descriptions>

<hzq-descriptions class="margin-top" title="Vertical list without border" :column="4" direction="vertical">
  <hzq-descriptions-item label="Username">kooriookami</hzq-descriptions-item>
  <hzq-descriptions-item label="Telephone">18100000000</hzq-descriptions-item>
  <hzq-descriptions-item label="Place" :span="2">Suzhou</hzq-descriptions-item>
  <hzq-descriptions-item label="Remarks">
    <hzq-tag size="small">School</hzq-tag>
  </hzq-descriptions-item>
  <hzq-descriptions-item label="Address">No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province</hzq-descriptions-item>
</hzq-descriptions>
```
:::

### Customized Style

:::demo

```html
<hzq-descriptions title="Customized style list" :column="3" border>
  <hzq-descriptions-item label="Username" label-class-name="my-label" content-class-name="my-content">kooriookami</hzq-descriptions-item>
  <hzq-descriptions-item label="Telephone">18100000000</hzq-descriptions-item>
  <hzq-descriptions-item label="Place">Suzhou</hzq-descriptions-item>
  <hzq-descriptions-item label="Remarks">
    <hzq-tag size="small">School</hzq-tag>
  </hzq-descriptions-item>
  <hzq-descriptions-item label="Address" :content-style="{'text-align': 'right'}">No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province</hzq-descriptions-item>
</hzq-descriptions>
<style>
  .my-label {
    background: #E1F3D8;
  }

  .my-content {
    background: #FDE2E2;
  }
</style>
```
:::

### Descriptions Attributes
| Attribute     | Description       | Type       | Accepted Values        | Default   |
|-------------  |---------------- |---------------- |---------------------- |-------- |
| border        | with or without border      | boolean  |          —             |    false     |
| column        | numbers of `Descriptions Item` in one line  | number | — |    3  |
| direction     | direction of list  | string | vertical / horizontal |    horizontal  |
| size          | size of list    | string  | large / medium / small / mini |  — |
| title         | title text, display on the top left    | string  |    —  |  — |
| extra         | extra text, display on the top right    | string  |    —  |  — |
| colon | change default props colon value of Descriptions Item   | boolean |    —  |  true |
| labelClassName          | custom label class name         | string  |          —             |    —     |
| contentClassName          | custom content class name         | string  |          —             |    —     |
| labelStyle          | custom label style | object |          —             |    —     |
| contentStyle         | custom content style | object |          —             |    —     |

### Descriptions Slots

| Name | Description |
|------|--------|
| title | custom title, display on the top left  |
| extra | custom extra area, display on the top right  |

### Descriptions Item Attributes
| Attribute       | Description        | Type       | Accepted Values       | Default   |
|-------------  |---------------- |---------------- |---------------------- |-------- |
| label          | label text         | string  |          —             |    —     |
| span          | colspan of column       | number  |          —             |    1     |
| labelClassName          | custom label class name         | string  |          —             |    —     |
| contentClassName          | custom content class name         | string  |          —             |    —     |
| labelStyle          | custom label style | object |          —             |    —     |
| contentStyle         | custom content style | object |          —             |    —     |

### Descriptions Item Slots

| Name | Description |
|------|--------|
| label | custom label  |
