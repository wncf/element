## Tabs 标签页

分隔内容上有关联但属于不同类别的数据集合。

### 基础用法

基础的、简洁的标签页。

:::demo Tabs 组件提供了选项卡功能，默认选中第一个标签页，你也可以通过 `value` 属性来指定当前选中的标签页。

```html
<template>
  <hzq-tabs v-model="activeName" @tab-click="handleClick">
    <hzq-tab-pane label="用户管理" name="first">用户管理</hzq-tab-pane>
    <hzq-tab-pane label="配置管理" name="second">配置管理</hzq-tab-pane>
    <hzq-tab-pane label="角色管理" name="third">角色管理</hzq-tab-pane>
    <hzq-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</hzq-tab-pane>
  </hzq-tabs>
</template>
<script>
  export default {
    data() {
      return {
        activeName: 'second'
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
  };
</script>
```
:::

### 分段控件样式

分段控件风格的标签页。

:::demo 只需要设置 `type` 属性为 `card`，标签栏会变成一块独立的分段控件：外层是浅色圆角容器，选中项是内嵌的圆角块。标签栏不再撑满容器，右侧留出的空白可以直接放操作按钮。

```html
<template>
  <hzq-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <hzq-tab-pane label="用户管理" name="first">用户管理</hzq-tab-pane>
    <hzq-tab-pane label="配置管理" name="second">配置管理</hzq-tab-pane>
    <hzq-tab-pane label="角色管理" name="third">角色管理</hzq-tab-pane>
    <hzq-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</hzq-tab-pane>
  </hzq-tabs>
</template>
<script>
  export default {
    data() {
      return {
        activeName: 'first'
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
  };
</script>
```
:::

### 卡片化

卡片化的标签页。

:::demo 将`type`设置为`border-card`。
```html
<hzq-tabs type="border-card">
  <hzq-tab-pane label="用户管理">用户管理</hzq-tab-pane>
  <hzq-tab-pane label="配置管理">配置管理</hzq-tab-pane>
  <hzq-tab-pane label="角色管理">角色管理</hzq-tab-pane>
  <hzq-tab-pane label="定时任务补偿">定时任务补偿</hzq-tab-pane>
</hzq-tabs>
```
:::

### 右侧操作区

标签栏宽度按内容自适应，右侧留白可以直接放置操作按钮。底部的横线也由使用方自己维护，按需通过 CSS 添加。

:::demo 默认类型不再内置底部横线；示例里用 `::after` 在标签栏下方画一条，并在同一行的右侧放一个按钮。

```html
<template>
  <div class="tabs-with-extra">
    <hzq-tabs v-model="activeName">
      <hzq-tab-pane label="用户管理" name="first">用户管理</hzq-tab-pane>
      <hzq-tab-pane label="配置管理" name="second">配置管理</hzq-tab-pane>
      <hzq-tab-pane label="角色管理" name="third">角色管理</hzq-tab-pane>
    </hzq-tabs>
    <hzq-button type="primary" size="mini">新建用户</hzq-button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        activeName: 'first'
      };
    }
  };
</script>
```
:::

### 位置

可以通过 `tab-position` 设置标签的位置

:::demo 标签一共有四个方向的设置 `tabPosition="left|right|top|bottom"`

```html
<template>
  <hzq-radio-group v-model="tabPosition" style="margin-bottom: 30px;">
    <hzq-radio-button label="top">top</hzq-radio-button>
    <hzq-radio-button label="right">right</hzq-radio-button>
    <hzq-radio-button label="bottom">bottom</hzq-radio-button>
    <hzq-radio-button label="left">left</hzq-radio-button>
  </hzq-radio-group>

  <hzq-tabs :tab-position="tabPosition" style="height: 200px;">
    <hzq-tab-pane label="用户管理">用户管理</hzq-tab-pane>
    <hzq-tab-pane label="配置管理">配置管理</hzq-tab-pane>
    <hzq-tab-pane label="角色管理">角色管理</hzq-tab-pane>
    <hzq-tab-pane label="定时任务补偿">定时任务补偿</hzq-tab-pane>
  </hzq-tabs>
</template>
<script>
  export default {
    data() {
      return {
        tabPosition: 'left'
      };
    }
  };
</script>
```
:::

### 自定义标签页

可以通过具名 `slot` 来实现自定义标签页的内容

:::demo
```html
<hzq-tabs type="border-card">
  <hzq-tab-pane>
    <span slot="label"><i class="hzq-icon-date"></i> 我的行程</span>
    我的行程
  </hzq-tab-pane>
  <hzq-tab-pane label="消息中心">消息中心</hzq-tab-pane>
  <hzq-tab-pane label="角色管理">角色管理</hzq-tab-pane>
  <hzq-tab-pane label="定时任务补偿">定时任务补偿</hzq-tab-pane>
</hzq-tabs>
```
:::

### 动态增减标签页

增减标签页按钮只能在选项卡样式的标签页下使用

:::demo
```html
<hzq-tabs v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit">
  <hzq-tab-pane
    :key="item.name"
    v-for="(item, index) in editableTabs"
    :label="item.title"
    :name="item.name"
  >
    {{item.content}}
  </hzq-tab-pane>
</hzq-tabs>
<script>
  export default {
    data() {
      return {
        editableTabsValue: '2',
        editableTabs: [{
          title: 'Tab 1',
          name: '1',
          content: 'Tab 1 content'
        }, {
          title: 'Tab 2',
          name: '2',
          content: 'Tab 2 content'
        }],
        tabIndex: 2
      }
    },
    methods: {
      handleTabsEdit(targetName, action) {
        if (action === 'add') {
          let newTabName = ++this.tabIndex + '';
          this.editableTabs.push({
            title: 'New Tab',
            name: newTabName,
            content: 'New Tab content'
          });
          this.editableTabsValue = newTabName;
        }
        if (action === 'remove') {
          let tabs = this.editableTabs;
          let activeName = this.editableTabsValue;
          if (activeName === targetName) {
            tabs.forEach((tab, index) => {
              if (tab.name === targetName) {
                let nextTab = tabs[index + 1] || tabs[index - 1];
                if (nextTab) {
                  activeName = nextTab.name;
                }
              }
            });
          }
          
          this.editableTabsValue = activeName;
          this.editableTabs = tabs.filter(tab => tab.name !== targetName);
        }
      }
    }
  }
</script>
```
:::

### 自定义增加标签页触发器

:::demo
```html
<div style="margin-bottom: 20px;">
  <hzq-button
    size="small"
    @click="addTab(editableTabsValue)"
  >
    add tab
  </hzq-button>
</div>
<hzq-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">
  <hzq-tab-pane
    v-for="(item, index) in editableTabs"
    :key="item.name"
    :label="item.title"
    :name="item.name"
  >
    {{item.content}}
  </hzq-tab-pane>
</hzq-tabs>
<script>
  export default {
    data() {
      return {
        editableTabsValue: '2',
        editableTabs: [{
          title: 'Tab 1',
          name: '1',
          content: 'Tab 1 content'
        }, {
          title: 'Tab 2',
          name: '2',
          content: 'Tab 2 content'
        }],
        tabIndex: 2
      }
    },
    methods: {
      addTab(targetName) {
        let newTabName = ++this.tabIndex + '';
        this.editableTabs.push({
          title: 'New Tab',
          name: newTabName,
          content: 'New Tab content'
        });
        this.editableTabsValue = newTabName;
      },
      removeTab(targetName) {
        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }
        
        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      }
    }
  }
</script>
```
:::

### Tabs Attributes
| 参数       | 说明     | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |-------------  |-------- |
| value / v-model  | 绑定值，选中选项卡的 name  | string   |  —  |  第一个选项卡的 name |
| type     | 风格类型   | string   | card/border-card  |     —    |
| closable  | 标签是否可关闭   | boolean   | — |  false  |
| addable  | 标签是否可增加   | boolean   | — |  false  |
| editable  | 标签是否同时可增加和关闭   | boolean   | — |  false  |
| tab-position  | 选项卡所在位置 | string   |  top/right/bottom/left  |  top |
| before-leave | 切换标签之前的钩子，若返回 false 或者返回 Promise 且被 reject，则阻止切换。 | Function(activeName, oldActiveName) | — | — |

### Tabs Events
| 事件名称 | 说明 | 回调参数 |
|---------- |-------- |---------- |
| tab-click  | tab 被选中时触发 | 被选中的标签 tab 实例 |
| tab-remove  | 点击 tab 移除按钮后触发  | 被删除的标签的 name |
| tab-add  | 点击 tabs 的新增按钮后触发  | — |
| edit  | 点击 tabs 的新增按钮或 tab 被关闭后触发  | (targetName, action) |

### Tab-pane Attributes
| 参数       | 说明     | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |-------------  |-------- |
| label     | 选项卡标题   | string   | — |    —     |
| disabled | 是否禁用 | boolean | — | false |
| name      | 与选项卡绑定值 value 对应的标识符，表示选项卡别名 | string | — | 该选项卡在选项卡列表中的顺序值，如第一个选项卡则为'1' |
| closable  | 标签是否可关闭   | boolean   | — |  false  |
| load  | 面板内容的加载策略。`once` 只在激活期间挂载，切走即销毁；`lazy` 首次激活时挂载并一直保留；`all` 首屏全部挂载并一直保留 | string | once / lazy / all | once |
