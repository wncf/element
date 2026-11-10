## NavMenu

Menu that provides navigation for your website.

### Top bar

Top bar NavMenu can be used in a variety of scenarios.

:::demo By default Menu is vertical, but you can change it to horizontal by setting the mode prop to 'horizontal'. In addition, you can use the submenu component to create a second level menu. Menu provides `background-color`, `text-color` and `active-text-color` to customize the colors.
```html
<hzq-menu :default-active="activeIndex" class="hzq-menu-demo" mode="horizontal" @select="handleSelect">
  <hzq-menu-item index="1">Processing Center</hzq-menu-item>
  <hzq-submenu index="2">
    <template slot="title">Workspace</template>
    <hzq-menu-item index="2-1">item one</hzq-menu-item>
    <hzq-menu-item index="2-2">item two</hzq-menu-item>
    <hzq-menu-item index="2-3">item three</hzq-menu-item>
    <hzq-submenu index="2-4">
      <template slot="title">item four</template>
      <hzq-menu-item index="2-4-1">item one</hzq-menu-item>
      <hzq-menu-item index="2-4-2">item two</hzq-menu-item>
      <hzq-menu-item index="2-4-3">item three</hzq-menu-item>
    </hzq-submenu>
  </hzq-submenu>
  <hzq-menu-item index="3" disabled>Info</hzq-menu-item>
  <hzq-menu-item index="4"><a href="https://www.ele.me" target="_blank">Orders</a></hzq-menu-item>
</hzq-menu>
<div class="line"></div>
<hzq-menu
  :default-active="activeIndex2"
  class="hzq-menu-demo"
  mode="horizontal"
  @select="handleSelect"
  background-color="#545c64"
  text-color="#fff"
  active-text-color="#ffd04b">
  <hzq-menu-item index="1">Processing Center</hzq-menu-item>
  <hzq-submenu index="2">
    <template slot="title">Workspace</template>
    <hzq-menu-item index="2-1">item one</hzq-menu-item>
    <hzq-menu-item index="2-2">item two</hzq-menu-item>
    <hzq-menu-item index="2-3">item three</hzq-menu-item>
    <hzq-submenu index="2-4">
      <template slot="title">item four</template>
      <hzq-menu-item index="2-4-1">item one</hzq-menu-item>
      <hzq-menu-item index="2-4-2">item two</hzq-menu-item>
      <hzq-menu-item index="2-4-3">item three</hzq-menu-item>
    </hzq-submenu>
  </hzq-submenu>
  <hzq-menu-item index="3" disabled>Info</hzq-menu-item>
  <hzq-menu-item index="4"><a href="https://www.ele.me" target="_blank">Orders</a></hzq-menu-item>
</hzq-menu>

<script>
  export default {
    data() {
      return {
        activeIndex: '1',
        activeIndex2: '1'
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>
```
:::

### Side bar

Vertical NavMenu with sub-menus.

:::demo You can use the hzq-menu-item-group component to create a menu group, and the name of the group is determined by the title prop or a named slot.
```html
<hzq-row class="tac">
  <hzq-col :span="12">
    <h5>Default colors</h5>
    <hzq-menu
      default-active="2"
      class="hzq-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose">
      <hzq-submenu index="1">
        <template slot="title">
          <i class="hzq-icon-location"></i>
          <span>Navigator One</span>
        </template>
        <hzq-menu-item-group title="Group One">
          <hzq-menu-item index="1-1">item one</hzq-menu-item>
          <hzq-menu-item index="1-2">item one</hzq-menu-item>
        </hzq-menu-item-group>
        <hzq-menu-item-group title="Group Two">
          <hzq-menu-item index="1-3">item three</hzq-menu-item>
        </hzq-menu-item-group>
        <hzq-submenu index="1-4">
          <template slot="title">item four</template>
          <hzq-menu-item index="1-4-1">item one</hzq-menu-item>
        </hzq-submenu>
      </hzq-submenu>
      <hzq-menu-item index="2">
        <i class="hzq-icon-menu"></i>
        <span>Navigator Two</span>
      </hzq-menu-item>
      <hzq-menu-item index="3" disabled>
        <i class="hzq-icon-document"></i>
        <span>Navigator Three</span>
      </hzq-menu-item>
      <hzq-menu-item index="4">
        <i class="hzq-icon-setting"></i>
        <span>Navigator Four</span>
      </hzq-menu-item>
    </hzq-menu>
  </hzq-col>
  <hzq-col :span="12">
    <h5>Custom colors</h5>
    <hzq-menu
      default-active="2"
      class="hzq-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <hzq-submenu index="1">
        <template slot="title">
          <i class="hzq-icon-location"></i>
          <span>Navigator One</span>
        </template>
        <hzq-menu-item-group title="Group One">
          <hzq-menu-item index="1-1">item one</hzq-menu-item>
          <hzq-menu-item index="1-2">item one</hzq-menu-item>
        </hzq-menu-item-group>
        <hzq-menu-item-group title="Group Two">
          <hzq-menu-item index="1-3">item three</hzq-menu-item>
        </hzq-menu-item-group>
        <hzq-submenu index="1-4">
          <template slot="title">item four</template>
          <hzq-menu-item index="1-4-1">item one</hzq-menu-item>
        </hzq-submenu>
      </hzq-submenu>
      <hzq-menu-item index="2">
        <i class="hzq-icon-menu"></i>
        <span>Navigator Two</span>
      </hzq-menu-item>
      <hzq-menu-item index="3" disabled>
        <i class="hzq-icon-document"></i>
        <span>Navigator Three</span>
      </hzq-menu-item>
      <hzq-menu-item index="4">
        <i class="hzq-icon-setting"></i>
        <span>Navigator Four</span>
      </hzq-menu-item>
    </hzq-menu>
  </hzq-col>
</hzq-row>

<script>
  export default {
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>
```
:::

### Collapse

Vertical NavMenu could be collapsed.

:::demo
```html
<hzq-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
  <hzq-radio-button :label="false">expand</hzq-radio-button>
  <hzq-radio-button :label="true">collapse</hzq-radio-button>
</hzq-radio-group>
<hzq-menu default-active="2" class="hzq-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
  <hzq-submenu index="1">
    <template slot="title">
      <i class="hzq-icon-location"></i>
      <span slot="title">Navigator One</span>
    </template>
    <hzq-menu-item-group>
      <span slot="title">Group One</span>
      <hzq-menu-item index="1-1">item one</hzq-menu-item>
      <hzq-menu-item index="1-2">item two</hzq-menu-item>
    </hzq-menu-item-group>
    <hzq-menu-item-group title="Group Two">
      <hzq-menu-item index="1-3">item three</hzq-menu-item>
    </hzq-menu-item-group>
    <hzq-submenu index="1-4">
      <span slot="title">item four</span>
      <hzq-menu-item index="1-4-1">item one</hzq-menu-item>
    </hzq-submenu>
  </hzq-submenu>
  <hzq-menu-item index="2">
    <i class="hzq-icon-menu"></i>
    <span slot="title">Navigator Two</span>
  </hzq-menu-item>
  <hzq-menu-item index="3" disabled>
    <i class="hzq-icon-document"></i>
    <span slot="title">Navigator Three</span>
  </hzq-menu-item>
  <hzq-menu-item index="4">
    <i class="hzq-icon-setting"></i>
    <span slot="title">Navigator Four</span>
  </hzq-menu-item>
</hzq-menu>

<style>
  .hzq-menu-vertical-demo:not(.hzq-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
</style>

<script>
  export default {
    data() {
      return {
        isCollapse: true
      };
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>
```
:::

### Menu Attribute
| Attribute      | Description          | Type      | Accepted Values       | Default  |
|---------- |-------- |---------- |-------------  |-------- |
| mode     | menu display mode   | string  |   horizontal / vertical   | vertical |
| collapse  | whether the menu is collapsed (available only in vertical mode) | boolean  |   —   | false |
| background-color  | background color of Menu (hex format) | string |   —   | #ffffff |
| text-color  | text color of Menu (hex format) | string |   —   | #303133 |
| active-text-color  | text color of currently active menu item (hex format) | string |   —   | #409EFF |
| default-active | index of currently active menu | string    | — | — |
| default-openeds | array that contains indexes of currently active sub-menus  | Array    | — | — |
| unique-opened  |  whether only one sub-menu can be active  | boolean   | — | false   |
| menu-trigger | how sub-menus are triggered, only works when `mode` is 'horizontal' | string    | hover / click | hover |
| router  | whether `vue-router` mode is activated. If true, index will be used as 'path' to activate the route action | boolean   | — | false   |
| collapse-transition  | whether to enable the collapse transition | boolean   | — | true   |

### Menu Methods
| Methods Name | Description | Parameters |
|---------- |-------- |---------- |
| open  | open a specific sub-menu | index: index of the sub-menu to open |
| close  | close a specific sub-menu | index: index of the sub-menu to close |

### Menu Events
| Event Name | Description | Parameters |
|---------- |-------- |---------- |
| select  | callback function when menu is activated | index: index of activated menu, indexPath: index path of activated menu  |
| open  | callback function when sub-menu expands | index: index of expanded sub-menu, indexPath: index path of expanded sub-menu |
| close  | callback function when sub-menu collapses | index: index of collapsed sub-menu, indexPath: index path of collapsed sub-menu |

### Menu-Item Events
| Event Name | Description | Parameters |
|---------- |-------- |---------- |
| click  | callback function when menu-item is clicked | el: menu-item instance  |

### SubMenu Attribute
| Attribute      | Description          | Type      | Accepted Values       | Default  |
|---------- |-------- |---------- |-------------  |-------- |
| index     | unique identification   | string  | — | — |
| popper-class | custom class name for the popup menu | string | — | — |
| show-timeout | timeout before showing a sub-menu | number | — | 300 |
| hide-timeout | timeout before hiding a sub-menu | number | — | 300 |
| disabled | whether the sub-menu is disabled | boolean | — | false |
| popper-append-to-body | whether to append the popup menu to body. If the positioning of the menu is wrong, you can try setting this prop | boolean | - | level one Submenu: true / other Submenus: false |

### Menu-Item Attribute
| Attribute      | Description          | Type      | Accepted Values       | Default  |
|---------- |-------- |---------- |-------------  |-------- |
| index     | unique identification   | string/null  | — | null |
| route     | Vue Router object   | object | — | — |
| disabled | whether disabled | boolean | — | false |

### Menu-Group Attribute
| Attribute      | Description          | Type      | Accepted Values       | Default  |
|---------- |-------- |---------- |-------------  |-------- |
| title     | group title   | string  | — | — |
