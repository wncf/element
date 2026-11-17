## Tooltip 文字提示

常用于展示鼠标 hover 时的提示信息。

### 基础用法

在这里我们提供 9 种不同方向的展示方式，可以通过以下完整示例来理解，选择你要的效果。

:::demo 使用`content`属性来决定`hover`时的提示信息。由`placement`属性决定展示效果：`placement`属性值为：`方向-对齐位置`；四个方向：`top`、`left`、`right`、`bottom`；三种对齐位置：`start`, `end`，默认为空。如`placement="left-end"`，则提示信息出现在目标元素的左侧，且提示信息的底部与目标元素的底部对齐。

```html
<div class="box">
  <div class="top">
    <hzq-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start">
      <hzq-button>上左</hzq-button>
    </hzq-tooltip>
    <hzq-tooltip class="item" effect="dark" content="Top Center 提示文字" placement="top">
      <hzq-button>上边</hzq-button>
    </hzq-tooltip>
    <hzq-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end">
      <hzq-button>上右</hzq-button>
    </hzq-tooltip>
  </div>
  <div class="left">
    <hzq-tooltip class="item" effect="dark" content="Left Top 提示文字" placement="left-start">
      <hzq-button>左上</hzq-button>
    </hzq-tooltip>
    <hzq-tooltip class="item" effect="dark" content="Left Center 提示文字" placement="left">
      <hzq-button>左边</hzq-button>
    </hzq-tooltip>
    <hzq-tooltip class="item" effect="dark" content="Left Bottom 提示文字" placement="left-end">
      <hzq-button>左下</hzq-button>
    </hzq-tooltip>
  </div>

  <div class="right">
    <hzq-tooltip class="item" effect="dark" content="Right Top 提示文字" placement="right-start">
      <hzq-button>右上</hzq-button>
    </hzq-tooltip>
    <hzq-tooltip class="item" effect="dark" content="Right Center 提示文字" placement="right">
      <hzq-button>右边</hzq-button>
    </hzq-tooltip>
    <hzq-tooltip class="item" effect="dark" content="Right Bottom 提示文字" placement="right-end">
      <hzq-button>右下</hzq-button>
    </hzq-tooltip>
  </div>
  <div class="bottom">
    <hzq-tooltip class="item" effect="dark" content="Bottom Left 提示文字" placement="bottom-start">
      <hzq-button>下左</hzq-button>
    </hzq-tooltip>
    <hzq-tooltip class="item" effect="dark" content="Bottom Center 提示文字" placement="bottom">
      <hzq-button>下边</hzq-button>
    </hzq-tooltip>
    <hzq-tooltip class="item" effect="dark" content="Bottom Right 提示文字" placement="bottom-end">
      <hzq-button>下右</hzq-button>
    </hzq-tooltip>
  </div>
</div>

<style>
  .box {
    width: 400px;

    .top {
      text-align: center;
    }

    .left {
      float: left;
      width: 60px;
    }

    .right {
      float: right;
      width: 60px;
    }

    .bottom {
      clear: both;
      text-align: center;
    }

    .item {
      margin: 4px;
    }

    .left .hzq-tooltip__popper,
    .right .hzq-tooltip__popper {
      padding: 8px 10px;
    }
  }
</style>
```
:::

### 主题

Tooltip 组件提供了两个不同的主题：`dark`和`light`。


:::demo 通过设置`effect`属性来改变主题，默认为`dark`。
```html
<hzq-tooltip content="Top center" placement="top">
  <hzq-button>Dark</hzq-button>
</hzq-tooltip>
<hzq-tooltip content="Bottom center" placement="bottom" effect="light">
  <hzq-button>Light</hzq-button>
</hzq-tooltip>
```
:::

### 更多 Content

展示多行文本或者是设置文本内容的格式

:::demo 用具名 slot 分发`content`，替代`tooltip`中的`content`属性。
```html
<hzq-tooltip placement="top">
  <div slot="content">多行信息<br/>第二行信息</div>
  <hzq-button>Top center</hzq-button>
</hzq-tooltip>
```
:::

### 高级扩展

除了这些基本设置外，还有一些属性可以让使用者更好的定制自己的效果：

`transition` 属性可以定制显隐的动画效果，默认为`fade-in-linear`。
如果需要关闭 `tooltip` 功能，`disabled` 属性可以满足这个需求，它接受一个`Boolean`，设置为`true`即可。

事实上，这是基于 [Vue-popper](https://github.com/element-component/vue-popper) 的扩展，你可以自定义任意 Vue-popper 中允许定义的字段。
当然 Tooltip 组件实际上十分强大，文末的API文档会做一一说明。

:::demo
```html
<template>
  <hzq-tooltip :disabled="disabled" content="点击关闭 tooltip 功能" placement="bottom" effect="light">
    <hzq-button @click="disabled = !disabled">点击{{disabled ? '开启' : '关闭'}} tooltip 功能</hzq-button>
  </hzq-tooltip>
</template>
<script>
  export default {
    data() {
      return {
        disabled: false
      };
    }
  };
</script>
```
:::

:::tip
tooltip 内不支持 `router-link` 组件，请使用 `vm.$router.push` 代替。

tooltip 内不支持 disabled form 元素，参考[MDN](https://developer.mozilla.org/en-US/docs/Web/Events/mouseenter)，请在 disabled form 元素外层添加一层包裹元素。
:::

### 指令 v-tooltip

`v-tooltip` 会给元素加上单行省略样式（`overflow: hidden; text-overflow: ellipsis; white-space: nowrap`），并在文字被省略时悬浮显示完整内容。检测逻辑与 `scrollWidth > clientWidth` 一致，容差 1px。

:::demo 不传值时提示内容取元素文本，**仅在文字被截断时**提示；传入字符串或数字时用该值作为提示内容。元素需要有自己的宽度约束，省略才会发生。

```html
<div>
  <div v-tooltip style="width: 220px; margin-bottom: 12px;">
    这是一段很长很长很长很长很长很长很长很长很长的文字，宽度不够时自动省略
  </div>
  <div v-tooltip="longText" style="width: 220px;">
    页面上渲染的文字，提示内容来自绑定值
  </div>
</div>

<script>
export default {
  data() {
    return {
      longText: '用绑定值作为提示内容，比元素上的文字更长一些'
    };
  }
};
</script>
```
:::

:::demo 当元素本身没有超出宽度时不会提示——把下面两个对比一下，第一个被截断了会提示，第二个没有。

```html
<div>
  <div v-tooltip style="width: 120px; margin-bottom: 12px;">
    这一段文字一定会被截断
  </div>
  <div v-tooltip style="width: 320px;">
    短文字
  </div>
</div>
```
:::

:::demo `always` 修饰符表示**悬浮即提示，不判断是否溢出**；该模式下默认不注入省略样式（适合图标按钮等），需要时加 `ellipsis` 修饰符打开。`no-ellipsis` 则是在默认模式下关闭省略样式。

```html
<div>
  <hzq-button v-tooltip.always="'悬浮即提示，不判断溢出'" style="margin-right: 8px;">always</hzq-button>
  <hzq-button v-tooltip.always.ellipsis="'悬浮即提示，并加省略样式'" style="margin-right: 8px;">always + ellipsis</hzq-button>
  <hzq-button v-tooltip.no-ellipsis="'不注入省略样式'">no-ellipsis</hzq-button>
</div>
```
:::

:::demo 用指令参数指定方向，用对象写法配置其余项。

```html
<div>
  <div v-tooltip:bottom-start="{ content: '底部左对齐', maxWidth: 200 }" style="width: 220px; margin-bottom: 12px;">
    方向由指令参数指定，其余配置走对象
  </div>
  <div v-tooltip.light="{ content: '浅色主题，300ms 延迟', delay: 300 }" style="width: 220px;">
    .light 修饰符 + 对象里配 delay
  </div>
</div>
```
:::

:::demo 在表格等需要左对齐缩略的场景里，直接给单元格加 `v-tooltip` 即可，无需再手写省略样式。

```html
<hzq-table :data="tableData" border style="width: 100%;">
  <hzq-table-column prop="date" label="日期" width="140"></hzq-table-column>
  <hzq-table-column prop="name" label="姓名" width="120"></hzq-table-column>
  <hzq-table-column prop="address" label="备注">
    <template slot-scope="scope">
      <span v-tooltip>{{ scope.row.address }}</span>
    </template>
  </hzq-table-column>
</hzq-table>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          date: '2026-11-16',
          name: '张三',
          address: '这是一段非常非常长的备注信息，用来演示宽度不足时的省略与悬浮提示效果'
        },
        {
          date: '2026-11-16',
          name: '李四',
          address: '短备注'
        }
      ]
    };
  }
};
</script>
```
:::

### 在 v-for 中使用

`v-tooltip` 适合列表、表格这类**元素数量多**的场景：无论渲染多少个元素，全局始终只有一个浮层节点，隐藏时保留在 body 下等待复用，不会随列表长度增长。元素被移除（列表项删除、分页切换）时，指令会自动解绑事件并释放引用。

:::demo 列表里的每一项都加 `v-tooltip`，提示内容取各自的文字。鼠标划过的元素才计算溢出，未划过的元素没有额外开销。

```html
<div>
  <div
    v-for="item in list"
    :key="item.id"
    v-tooltip
    style="width: 240px; margin-bottom: 8px; padding: 4px 8px; border: 1px solid #ebeef5; border-radius: 4px;"
  >
    {{ item.label }}
  </div>
</div>

<script>
export default {
  data() {
    return {
      list: [
        { id: 1, label: '第一条：这段文字比较长，宽度不够时会被省略' },
        { id: 2, label: '第二条：短文本' },
        { id: 3, label: '第三条：这段文字也非常长，用来演示省略号与悬浮提示效果' },
        { id: 4, label: '第四条' },
        { id: 5, label: '第五条：再长一点的文字，超出容器宽度后截断显示' }
      ]
    };
  }
};
</script>
```
:::

:::demo 也可以把绑定值作为提示内容，让「显示的文字」与「提示的文字」分离；`delay` 等配置可以全局统一设置，建议在循环里只传字符串，避免每次渲染都创建新的对象字面量。

```html
<div>
  <div
    v-for="item in list"
    :key="item.id"
    v-tooltip="item.full"
    style="width: 240px; margin-bottom: 8px; padding: 4px 8px; border: 1px solid #ebeef5; border-radius: 4px;"
  >
    {{ item.short }}
  </div>
</div>

<script>
export default {
  data() {
    return {
      list: [
        { id: 1, short: '订单 #20261116-001', full: '订单 #20261116-001（含 3 件商品，预计 2 天内发出）' },
        { id: 2, short: '订单 #20261116-002', full: '订单 #20261116-002（含 1 件商品，已发货）' },
        { id: 3, short: '订单 #20261116-003', full: '订单 #20261116-003（含 12 件商品，部分缺货待补）' }
      ]
    };
  }
};
</script>
```
:::

:::tip
不要在同一个元素上同时使用 `v-tooltip` 和表格列的 `show-overflow-tooltip`——后者会为每个单元格渲染一个 `hzq-tooltip` 组件实例，与单例浮层叠加，既重复提示也浪费内存。两者选其一即可。
:::

### 函数式调用 $tooltip

指令底层就是全局单例的 `this.$tooltip(options)`，业务也可以直接调用它，不依赖 `v-tooltip`。

:::demo 点击按钮在指定元素上显示提示；`$tooltip` 返回一个句柄，可 `update()` 重新定位、`hide()` 主动关闭。鼠标离开触发元素与浮层后会自动隐藏，页面滚动或窗口尺寸变化时也会隐藏。

```html
<div>
  <hzq-button ref="targetBtn" type="primary" @click="showTip">在按钮上显示提示</hzq-button>
  <hzq-button @click="showCustomTip">自定义方向与主题</hzq-button>
  <hzq-button @click="hide">handle.hide()</hzq-button>
</div>

<script>
export default {
  data() {
    return {
      tipHandle: null
    };
  },
  methods: {
    showTip() {
      this.tipHandle = this.$tooltip({
        target: this.$refs.targetBtn.$el,
        content: '这是通过 $tooltip 显示的提示文字',
        placement: 'top'
      });
    },
    showCustomTip() {
      this.tipHandle = this.$tooltip({
        target: this.$refs.targetBtn.$el,
        content: '浅色主题、底部对齐、最大宽度 200',
        placement: 'bottom-start',
        effect: 'light',
        maxWidth: 200
      });
    },
    hide() {
      this.tipHandle && this.tipHandle.hide();
    }
  }
};
</script>
```
:::

:::tip
`$tooltip` 是全局单例，同一时刻只会有一个提示，重复调用会直接替换上一个。

鼠标离开触发元素后有 150ms 的缓冲，这期间移入浮层不会关闭，因此可以**在浮层上选中并复制完整文字**；拖选过程中浮层也不会因鼠标划出而消失。
:::

### 指令参数

| 写法 | 说明 |
|------|------|
| `v-tooltip` | 内容取元素文本，溢出时才提示，注入省略样式 |
| `v-tooltip="text"` | 用绑定值（String/Number）作为提示内容 |
| `v-tooltip="{ ... }"` | 对象写法，支持 `content`、`placement`、`effect`、`maxWidth`、`offset`、`popperClass`、`delay`、`disabled`、`always`、`ellipsis` |
| `v-tooltip:placement` | 指令参数指定方向，如 `v-tooltip:bottom-start` |
| `v-tooltip.always` | 悬浮即提示，不判断溢出（默认不注入省略样式） |
| `v-tooltip.ellipsis` | 强制注入省略样式 |
| `v-tooltip.no-ellipsis` | 不注入省略样式 |
| `v-tooltip.light` | 浅色主题 |

指令配置优先级：对象字段 > 修饰符 / 参数 > 默认值。

:::tip
`v-tooltip` 注入的是行内样式，会覆盖元素上原有的 `overflow` / `text-overflow` / `white-space`，`unbind` 时按原值精确还原。
指令**不会**修改元素的 `display`：`<span>`、`<a>` 等 inline 元素上 `text-overflow` 不生效，需要自行设 `display: inline-block` 并给出宽度。
:::

### $tooltip 参数

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| target | 目标元素（必填） | HTMLElement | — | — |
| content | 提示文字（必填） | String/Number | — | — |
| placement | 出现位置 | String | top/bottom/left/right 及 -start/-end | top |
| effect | 主题 | String | dark/light | dark |
| maxWidth | 浮层最大宽度 | Number/String | — | 360 |
| offset | 位置偏移量 | Number | — | 0 |
| popperClass | 浮层自定义类名 | String | — | — |

### Attributes
| 参数               | 说明                                                     | 类型              | 可选值      | 默认值 |
|--------------------|----------------------------------------------------------|-------------------|-------------|--------|
|  effect        |  默认提供的主题  | String            | dark/light | dark  |
|  content        |  显示的内容，也可以通过 `slot#content` 传入 DOM  | String            | — | — |
|  placement        |  Tooltip 的出现位置  | String           |  top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end |  bottom |
|  value / v-model |  状态是否可见  | Boolean           | — |  false |
|  disabled       |  Tooltip 是否可用  | Boolean           | — |  false |
|  offset        |  出现位置的偏移量  | Number           | — |  0 |
|  transition     |  定义渐变动画      | String             | — | el-fade-in-linear |
|  visible-arrow   |  是否显示 Tooltip 箭头，更多参数可见[Vue-popper](https://github.com/element-component/vue-popper) | Boolean | — | true |
|  popper-options        | [popper.js](https://popper.js.org/docs/v2/) 的参数 | Object            | 参考 [popper.js](https://popper.js.org/docs/v2/) 文档 | { boundariesElement: 'body', gpuAcceleration: false } |
| open-delay | 延迟出现，单位毫秒 | Number | — | 0 |
| manual | 手动控制模式，设置为 true 后，mouseenter 和 mouseleave 事件将不会生效 | Boolean | — | false |
| popper-class | 为 Tooltip 的 popper 添加类名 | String | — | — |
| enterable | 鼠标是否可进入到 tooltip 中 | Boolean | — | true |
| hide-after | Tooltip 出现后自动隐藏延时，单位毫秒，为 0 则不会自动隐藏 | number | — | 0 |
| tabindex   | Tooltip 组件的 [tabindex](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex) | number | — | 0 |
