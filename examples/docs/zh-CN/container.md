## Container 布局容器
用于布局的容器组件，方便快速搭建页面的基本结构：

`<hzq-container>`：外层容器。当子元素中包含 `<hzq-header>` 或 `<hzq-footer>` 时，全部子元素会垂直上下排列，否则会水平左右排列。

`<hzq-header>`：顶栏容器。

`<hzq-aside>`：侧边栏容器。

`<hzq-main>`：主要区域容器。

`<hzq-footer>`：底栏容器。

:::tip
以上组件采用了 flex 布局，使用前请确定目标浏览器是否兼容。此外，`<hzq-container>` 的子元素只能是后四者，后四者的父元素也只能是 `<hzq-container>`。
:::

### 常见页面布局

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

### 实例

:::demo
```html
<hzq-container style="height: 500px; border: 1px solid #eee">
  <hzq-aside width="200px" style="background-color: rgb(238, 241, 246)">
    <hzq-menu :default-openeds="['1', '3']">
      <hzq-submenu index="1">
        <template slot="title"><i class="hzq-icon-message"></i>导航一</template>
        <hzq-menu-item-group>
          <template slot="title">分组一</template>
          <hzq-menu-item index="1-1">选项1</hzq-menu-item>
          <hzq-menu-item index="1-2">选项2</hzq-menu-item>
        </hzq-menu-item-group>
        <hzq-menu-item-group title="分组2">
          <hzq-menu-item index="1-3">选项3</hzq-menu-item>
        </hzq-menu-item-group>
        <hzq-submenu index="1-4">
          <template slot="title">选项4</template>
          <hzq-menu-item index="1-4-1">选项4-1</hzq-menu-item>
        </hzq-submenu>
      </hzq-submenu>
      <hzq-submenu index="2">
        <template slot="title"><i class="hzq-icon-menu"></i>导航二</template>
        <hzq-menu-item-group>
          <template slot="title">分组一</template>
          <hzq-menu-item index="2-1">选项1</hzq-menu-item>
          <hzq-menu-item index="2-2">选项2</hzq-menu-item>
        </hzq-menu-item-group>
        <hzq-menu-item-group title="分组2">
          <hzq-menu-item index="2-3">选项3</hzq-menu-item>
        </hzq-menu-item-group>
        <hzq-submenu index="2-4">
          <template slot="title">选项4</template>
          <hzq-menu-item index="2-4-1">选项4-1</hzq-menu-item>
        </hzq-submenu>
      </hzq-submenu>
      <hzq-submenu index="3">
        <template slot="title"><i class="hzq-icon-setting"></i>导航三</template>
        <hzq-menu-item-group>
          <template slot="title">分组一</template>
          <hzq-menu-item index="3-1">选项1</hzq-menu-item>
          <hzq-menu-item index="3-2">选项2</hzq-menu-item>
        </hzq-menu-item-group>
        <hzq-menu-item-group title="分组2">
          <hzq-menu-item index="3-3">选项3</hzq-menu-item>
        </hzq-menu-item-group>
        <hzq-submenu index="3-4">
          <template slot="title">选项4</template>
          <hzq-menu-item index="3-4-1">选项4-1</hzq-menu-item>
        </hzq-submenu>
      </hzq-submenu>
    </hzq-menu>
  </hzq-aside>
  
  <hzq-container>
    <hzq-header style="text-align: right; font-size: 12px">
      <hzq-dropdown>
        <i class="hzq-icon-setting" style="margin-right: 15px"></i>
        <hzq-dropdown-menu slot="dropdown">
          <hzq-dropdown-item>查看</hzq-dropdown-item>
          <hzq-dropdown-item>新增</hzq-dropdown-item>
          <hzq-dropdown-item>删除</hzq-dropdown-item>
        </hzq-dropdown-menu>
      </hzq-dropdown>
      <span>王小虎</span>
    </hzq-header>
    
    <hzq-main>
      <hzq-table :data="tableData">
        <hzq-table-column prop="date" label="日期" width="140">
        </hzq-table-column>
        <hzq-table-column prop="name" label="姓名" width="120">
        </hzq-table-column>
        <hzq-table-column prop="address" label="地址">
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
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
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
| 参数    | 说明     | 类型    | 可选值      | 默认值 |
|---------|----------|---------|-------------|--------|
| direction | 子元素的排列方向 | string | horizontal / vertical | 子元素中有 `hzq-header` 或 `hzq-footer` 时为 vertical，否则为 horizontal |

### Header Attributes
| 参数    | 说明     | 类型    | 可选值      | 默认值 |
|---------|----------|---------|-------------|--------|
| height | 顶栏高度 | string | — | 60px |

### Aside Attributes
| 参数    | 说明     | 类型    | 可选值      | 默认值 |
|---------|----------|---------|-------------|--------|
| width | 侧边栏宽度 | string | — | 300px |

### Footer Attributes
| 参数    | 说明     | 类型    | 可选值      | 默认值 |
|---------|----------|---------|-------------|--------|
| height | 底栏高度 | string | — | 60px |