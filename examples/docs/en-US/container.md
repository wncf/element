## Container
Container components for scaffolding basic structure of the page:

`<hzq-container>`: wrapper container. When nested with a `<hzq-header>` or `<hzq-footer>`, all its child elements will be vertically arranged. Otherwise horizontally.

`<hzq-header>`: container for headers.

`<hzq-aside>`: container for side sections (usually a side nav).

`<hzq-main>`: container for main sections.

`<hzq-footer>`: container for footers.

:::tip
These components use flex for layout, so please make sure your browser supports it. Besides, `<hzq-container>`'s direct child elements have to be one or more of the latter four components. And father element of the latter four components must be a `<hzq-container>`.
:::

### Common layouts

:::demo
```html
<hzq-container>
  <hzq-header>Header</hzq-header>
  <hzq-main>Main</hzq-main>
</hzq-container>

<hzq-container>
  <hzq-header>Header</hzq-header>
  <hzq-main>Main</hzq-main>
  <hzq-footer>Footer</hzq-footer>
</hzq-container>

<hzq-container>
  <hzq-aside width="200px">Aside</hzq-aside>
  <hzq-main>Main</hzq-main>
</hzq-container>

<hzq-container>
  <hzq-header>Header</hzq-header>
  <hzq-container>
    <hzq-aside width="200px">Aside</hzq-aside>
    <hzq-main>Main</hzq-main>
  </hzq-container>
</hzq-container>

<hzq-container>
  <hzq-header>Header</hzq-header>
  <hzq-container>
    <hzq-aside width="200px">Aside</hzq-aside>
    <hzq-container>
      <hzq-main>Main</hzq-main>
      <hzq-footer>Footer</hzq-footer>
    </hzq-container>
  </hzq-container>
</hzq-container>

<hzq-container>
  <hzq-aside width="200px">Aside</hzq-aside>
  <hzq-container>
    <hzq-header>Header</hzq-header>
    <hzq-main>Main</hzq-main>
  </hzq-container>
</hzq-container>

<hzq-container>
  <hzq-aside width="200px">Aside</hzq-aside>
  <hzq-container>
    <hzq-header>Header</hzq-header>
    <hzq-main>Main</hzq-main>
    <hzq-footer>Footer</hzq-footer>
  </hzq-container>
</hzq-container>

<style>
  .hzq-header, .hzq-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  
  .hzq-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  
  .hzq-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
  
  body > .hzq-container {
    margin-bottom: 40px;
  }
  
  .hzq-container:nth-child(5) .hzq-aside,
  .hzq-container:nth-child(6) .hzq-aside {
    line-height: 260px;
  }
  
  .hzq-container:nth-child(7) .hzq-aside {
    line-height: 320px;
  }
</style>
```
:::

### Example

:::demo
```html
<hzq-container style="height: 500px; border: 1px solid #eee">
  <hzq-aside width="200px" style="background-color: rgb(238, 241, 246)">
    <hzq-menu :default-openeds="['1', '3']">
      <hzq-submenu index="1">
        <template slot="title"><i class="hzq-icon-message"></i>Navigator One</template>
        <hzq-menu-item-group>
          <template slot="title">Group 1</template>
          <hzq-menu-item index="1-1">Option 1</hzq-menu-item>
          <hzq-menu-item index="1-2">Option 2</hzq-menu-item>
        </hzq-menu-item-group>
        <hzq-menu-item-group title="Group 2">
          <hzq-menu-item index="1-3">Option 3</hzq-menu-item>
        </hzq-menu-item-group>
        <hzq-submenu index="1-4">
          <template slot="title">Option4</template>
          <hzq-menu-item index="1-4-1">Option 4-1</hzq-menu-item>
        </hzq-submenu>
      </hzq-submenu>
      <hzq-submenu index="2">
        <template slot="title"><i class="hzq-icon-menu"></i>Navigator Two</template>
        <hzq-menu-item-group>
          <template slot="title">Group 1</template>
          <hzq-menu-item index="2-1">Option 1</hzq-menu-item>
          <hzq-menu-item index="2-2">Option 2</hzq-menu-item>
        </hzq-menu-item-group>
        <hzq-menu-item-group title="Group 2">
          <hzq-menu-item index="2-3">Option 3</hzq-menu-item>
        </hzq-menu-item-group>
        <hzq-submenu index="2-4">
          <template slot="title">Option 4</template>
          <hzq-menu-item index="2-4-1">Option 4-1</hzq-menu-item>
        </hzq-submenu>
      </hzq-submenu>
      <hzq-submenu index="3">
        <template slot="title"><i class="hzq-icon-setting"></i>Navigator Three</template>
        <hzq-menu-item-group>
          <template slot="title">Group 1</template>
          <hzq-menu-item index="3-1">Option 1</hzq-menu-item>
          <hzq-menu-item index="3-2">Option 2</hzq-menu-item>
        </hzq-menu-item-group>
        <hzq-menu-item-group title="Group 2">
          <hzq-menu-item index="3-3">Option 3</hzq-menu-item>
        </hzq-menu-item-group>
        <hzq-submenu index="3-4">
          <template slot="title">Option 4</template>
          <hzq-menu-item index="3-4-1">Option 4-1</hzq-menu-item>
        </hzq-submenu>
      </hzq-submenu>
    </hzq-menu>
  </hzq-aside>
  
  <hzq-container>
    <hzq-header style="text-align: right; font-size: 12px">
      <hzq-dropdown>
        <i class="hzq-icon-setting" style="margin-right: 15px"></i>
        <hzq-dropdown-menu slot="dropdown">
          <hzq-dropdown-item>View</hzq-dropdown-item>
          <hzq-dropdown-item>Add</hzq-dropdown-item>
          <hzq-dropdown-item>Delete</hzq-dropdown-item>
        </hzq-dropdown-menu>
      </hzq-dropdown>
      <span>Tom</span>
    </hzq-header>
    
    <hzq-main>
      <hzq-table :data="tableData">
        <hzq-table-column prop="date" label="Date" width="140">
        </hzq-table-column>
        <hzq-table-column prop="name" label="Name" width="120">
        </hzq-table-column>
        <hzq-table-column prop="address" label="Address">
        </hzq-table-column>
      </hzq-table>
    </hzq-main>
  </hzq-container>
</hzq-container>

<style>
  .hzq-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }
  
  .hzq-aside {
    color: #333;
  }
</style>

<script>
  export default {
    data() {
      const item = {
        date: '2016-05-02',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      };
      return {
        tableData: Array(20).fill(item)
      }
    }
  };
</script>
```
:::

### Container Attributes
| Attribute      | Description          | Type      | Accepted Values       | Default  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| direction | layout direction for child elements | string | horizontal / vertical | vertical when nested with `hzq-header` or `hzq-footer`; horizontal otherwise |

### Header Attributes
| Attribute      | Description          | Type      | Accepted Values       | Default  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| height | height of the header | string | — | 60px |

### Aside Attributes
| Attribute      | Description          | Type      | Accepted Values       | Default  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| width | width of the side section | string | — | 300px |

### Footer Attributes
| Attribute      | Description          | Type      | Accepted Values       | Default  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| height | height of the footer | string | — | 60px |