## Dialog 对话框
在保留当前页面状态的情况下，告知用户并承载相关操作。

### 基本用法

Dialog 弹出一个对话框，适合需要定制性更大的场景。

:::demo 需要设置`visible`属性，它接收`Boolean`，当为`true`时显示 Dialog。Dialog 分为两个部分：`body`和`footer`，`footer`需要具名为`footer`的`slot`。`title`属性用于定义标题，它是可选的，默认值为空。最后，本例还展示了`before-close`的用法。

```html
<hzq-button type="text" @click="dialogVisible = true">点击打开 Dialog</hzq-button>

<hzq-dialog
  title="提示"
  :visible.sync="dialogVisible"
  width="30%"
  :before-close="handleClose">
  <span>这是一段信息</span>
  <span slot="footer" class="dialog-footer">
    <hzq-button @click="dialogVisible = false">取 消</hzq-button>
    <hzq-button type="primary" @click="dialogVisible = false">确 定</hzq-button>
  </span>
</hzq-dialog>

<script>
  export default {
    data() {
      return {
        dialogVisible: false
      };
    },
    methods: {
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      }
    }
  };
</script>
```
:::

:::tip
`before-close` 仅当用户通过点击关闭图标或遮罩关闭 Dialog 时起效。如果你在 `footer` 具名 slot 里添加了用于关闭 Dialog 的按钮，那么可以在按钮的点击回调函数里加入 `before-close` 的相关逻辑。
:::

### 自定义内容

Dialog 组件的内容可以是任意的，甚至可以是表格或表单，下面是应用了 Element Table 和 Form 组件的两个样例。

:::demo
```html
<!-- Table -->
<hzq-button type="text" @click="dialogTableVisible = true">打开嵌套表格的 Dialog</hzq-button>

<hzq-dialog title="收货地址" :visible.sync="dialogTableVisible">
  <hzq-table :data="gridData">
    <hzq-table-column property="date" label="日期" width="150"></hzq-table-column>
    <hzq-table-column property="name" label="姓名" width="200"></hzq-table-column>
    <hzq-table-column property="address" label="地址"></hzq-table-column>
  </hzq-table>
</hzq-dialog>

<!-- Form -->
<hzq-button type="text" @click="dialogFormVisible = true">打开嵌套表单的 Dialog</hzq-button>

<hzq-dialog title="收货地址" :visible.sync="dialogFormVisible">
  <hzq-form :model="form">
    <hzq-form-item label="活动名称" :label-width="formLabelWidth">
      <hzq-input v-model="form.name" autocomplete="off"></hzq-input>
    </hzq-form-item>
    <hzq-form-item label="活动区域" :label-width="formLabelWidth">
      <hzq-select v-model="form.region" placeholder="请选择活动区域">
        <hzq-option label="区域一" value="shanghai"></hzq-option>
        <hzq-option label="区域二" value="beijing"></hzq-option>
      </hzq-select>
    </hzq-form-item>
  </hzq-form>
  <div slot="footer" class="dialog-footer">
    <hzq-button @click="dialogFormVisible = false">取 消</hzq-button>
    <hzq-button type="primary" @click="dialogFormVisible = false">确 定</hzq-button>
  </div>
</hzq-dialog>

<script>
  export default {
    data() {
      return {
        gridData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
        dialogTableVisible: false,
        dialogFormVisible: false,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '120px'
      };
    }
  };
</script>
```
:::

### 嵌套的 Dialog
如果需要在一个 Dialog 内部嵌套另一个 Dialog，需要使用 `append-to-body` 属性。
:::demo 正常情况下，我们不建议使用嵌套的 Dialog，如果需要在页面上同时显示多个 Dialog，可以将它们平级放置。对于确实需要嵌套 Dialog 的场景，我们提供了`append-to-body`属性。将内层 Dialog 的该属性设置为 true，它就会插入至 body 元素上，从而保证内外层 Dialog 和遮罩层级关系的正确。
```html
<template>
  <hzq-button type="text" @click="outerVisible = true">点击打开外层 Dialog</hzq-button>
  
  <hzq-dialog title="外层 Dialog" :visible.sync="outerVisible">
    <hzq-dialog
      width="30%"
      title="内层 Dialog"
      :visible.sync="innerVisible"
      append-to-body>
    </hzq-dialog>
    <div slot="footer" class="dialog-footer">
      <hzq-button @click="outerVisible = false">取 消</hzq-button>
      <hzq-button type="primary" @click="innerVisible = true">打开内层 Dialog</hzq-button>
    </div>
  </hzq-dialog>
</template>

<script>
  export default {
    data() {
      return {
        outerVisible: false,
        innerVisible: false
      };
    }
  }
</script>
```
:::

### 居中布局

标题和底部可水平居中

:::demo 将`center`设置为`true`即可使标题和底部居中。`center`仅影响标题和底部区域。Dialog 的内容是任意的，在一些情况下，内容并不适合居中布局。如果需要内容也水平居中，请自行为其添加 CSS。

```html
<hzq-button type="text" @click="centerDialogVisible = true">点击打开 Dialog</hzq-button>

<hzq-dialog
  title="提示"
  :visible.sync="centerDialogVisible"
  width="30%"
  center>
  <span>需要注意的是内容是默认不居中的</span>
  <span slot="footer" class="dialog-footer">
    <hzq-button @click="centerDialogVisible = false">取 消</hzq-button>
    <hzq-button type="primary" @click="centerDialogVisible = false">确 定</hzq-button>
  </span>
</hzq-dialog>

<script>
  export default {
    data() {
      return {
        centerDialogVisible: false
      };
    }
  };
</script>
```
:::

### 可拖拽

:::demo 头部默认可拖拽（`draggable` 默认 `true`）。拖动后对话框改为绝对定位，关闭动画结束时复位。设置 `:draggable="false"` 可关闭。全屏状态下不生效。
```html
<hzq-button type="text" @click="dragVisible = true">打开可拖拽 Dialog</hzq-button>

<hzq-dialog
  title="拖动标题栏"
  :visible.sync="dragVisible"
  width="30%">
  <span>按住顶部标题栏可以拖动整个对话框</span>
  <span slot="footer" class="dialog-footer">
    <hzq-button @click="dragVisible = false">关 闭</hzq-button>
  </span>
</hzq-dialog>

<script>
  export default {
    data() {
      return { dragVisible: false };
    }
  };
</script>
```
:::

### 命令式调用

:::demo 不想在模板里写 Dialog 时，用 `this.$dialog(options, renderFn)` 直接打开。`type` 为 `confirm` 时渲染取消/确定按钮，为 `alert` 时只有内容。
```html
<template>
  <div>
    <hzq-button @click="openAlert">打开 alert</hzq-button>
    <hzq-button type="primary" @click="openConfirm">打开 confirm</hzq-button>
    <hzq-button @click="openCustom">自定义渲染</hzq-button>
  </div>
</template>

<script>
  export default {
    methods: {
      openAlert() {
        this.$dialog({
          title: '提示',
          content: '这是一条 alert，只有一个关闭按钮。'
        });
      },
      openConfirm() {
        this.$dialog({
          title: '确认删除',
          type: 'confirm',
          content: '删除后不可恢复，确定继续吗？',
          confirmButtonText: '删除',
          cancelButtonText: '再想想',
          confirm: instance => {
            instance.loading = true;
            return new Promise(resolve => {
              setTimeout(() => {
                instance.loading = false;
                instance.close();
                this.$message.success('已删除');
                resolve();
              }, 800);
            });
          }
        });
      },
      openCustom() {
        this.$dialog({ title: '自定义内容', width: '420px' }, h => (
          <div>
            <p>这里由 render 函数返回，可以放任意 VNode。</p>
            <hzq-button size="mini" type="primary">示例按钮</hzq-button>
          </div>
        ));
      }
    }
  };
</script>
```
:::

:::tip
默认同一时刻只显示一个弹窗，后续调用会排队，上一个关闭后延迟 500ms 再弹出。需要叠加显示时传 `stack: true`。
:::

:::tip
Dialog 的内容是懒渲染的，即在第一次被打开之前，传入的默认 slot 不会被渲染到 DOM 上。因此，如果需要执行 DOM 操作，或通过 `ref` 获取相应组件，请在 `open` 事件回调中进行。
:::

:::tip
如果 `visible` 属性绑定的变量位于 Vuex 的 store 内，那么 `.sync` 不会正常工作。此时需要去除 `.sync` 修饰符，同时监听 Dialog 的 `open` 和 `close` 事件，在事件回调中执行 Vuex 中对应的 mutation 更新 `visible` 属性绑定的变量的值。
:::

### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| visible   | 是否显示 Dialog，支持 .sync 修饰符 | boolean | — | false |
| title     | Dialog 的标题，也可通过具名 slot （见下表）传入 | string    | — | — |
| width     | Dialog 的宽度 | string    | — | 50% |
| fullscreen     | 是否为全屏 Dialog | boolean    | — | false |
| top       | Dialog 距顶部的距离。留空时改为**垂直居中** | string | — | — |
| draggable | 是否允许拖动头部移动对话框 | boolean | — | true |
| modal     | 是否需要遮罩层   | boolean   | — | true |
| modal-append-to-body     | 遮罩层是否插入至 body 元素上，若为 false，则遮罩层会插入至 Dialog 的父元素上   | boolean   | — | true |
| append-to-body     | Dialog 自身是否插入至 body 元素上。嵌套的 Dialog 必须指定该属性并赋值为 true   | boolean   | — | false |
| lock-scroll | 是否在 Dialog 出现时将 body 滚动锁定 | boolean | — | true |
| custom-class      | Dialog 的自定义类名 | string    | — | — |
| close-on-click-modal | 是否可以通过点击 modal 关闭 Dialog | boolean    | — | true |
| close-on-press-escape | 是否可以通过按下 ESC 关闭 Dialog | boolean    | — | true |
| show-close | 是否显示关闭按钮 | boolean    | — | true |
| before-close | 关闭前的回调，会暂停 Dialog 的关闭 | function(done)，done 用于关闭 Dialog | — | — |
| center | 是否对头部和底部采用居中布局 | boolean | — | false |
| destroy-on-close | 关闭时销毁 Dialog 中的元素 | boolean | — | false |

### Slot
| name | 说明 |
|------|--------|
| — | Dialog 的内容 |
| title | Dialog 标题区的内容 |
| footer | Dialog 按钮操作区的内容 |

### Events
| 事件名称      | 说明    | 回调参数      |
|---------- |-------- |---------- |
| open  | Dialog 打开的回调 | — |
| opened  | Dialog 打开动画结束时的回调 | — |
| close  | Dialog 关闭的回调 | — |
| closed | Dialog 关闭动画结束时的回调 | — |

### $dialog Options

`this.$dialog(options, renderFn?)`，第二个参数为 `h => VNode`，优先级高于 `content`。

| 参数 | 说明 | 类型 | 默认值 |
| ---------- | -------------- | ---------- | -------- |
| title | 标题 | string | '' |
| type | `alert`（无底部按钮）/ `confirm`（取消 + 确定） | string | alert |
| width | 宽度，数字会补上 `px` | string / number | '' |
| content | 内容，支持字符串或 VNode | string / object | '' |
| maskClose | 点击遮罩是否关闭 | boolean | false |
| escClose | 按 ESC 是否关闭 | boolean | true |
| showClose | 是否显示右上角关闭按钮 | boolean | true |
| confirmButtonText | 确定按钮文案 | string | '' |
| cancelButtonText | 取消按钮文案 | string | '' |
| confirm | 确定回调，可返回 Promise，rejection 会被吞掉 | function(instance) | — |
| cancel | 取消回调 | function(instance) | — |
| stack | 叠在上一个弹窗之上，而不是排队 | boolean | false |
| border | header / body / footer 之间加分割线 | boolean | false |

返回的实例代理提供 `visible`、`loading`、`close()`。
