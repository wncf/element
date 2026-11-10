## FormBuilder 配置化表单

用一份字段配置数组渲染出整个表单。字段组件、props、事件、插槽、校验规则和栅格布局都写在配置里，适合「表单很多、结构大同小异」的增删改查页面。

### 基础用法

:::demo 用 `fields` 描述每个字段，用 `v-model` 绑定数据对象。字段值直接读写你传入的这个对象（与 `hzq-form` 的 `model` 是同一个引用），不产生副本，因此校验读到的永远是最新值。`prop` 支持嵌套路径，如 `user.name`、`list[0].id`。不写 `columns` 时每个字段独占一行，写了则按列数等分。
```html
<template>
  <hzq-form-builder
    v-model="form"
    :fields="fields"
    label-width="88px"
    :columns="2"
    :gutter="12"
  />
</template>

<script>
  export default {
    data() {
      return {
        form: {
          name: '',
          region: '',
          date: '',
          online: false
        },
        fields: [
          {
            prop: 'name',
            label: '活动名称',
            component: 'hzq-input',
            props: { placeholder: '请输入活动名称' }
          },
          {
            prop: 'region',
            label: '活动区域',
            component: 'hzq-select',
            options: [
              { label: '区域一', value: 'shanghai' },
              { label: '区域二', value: 'beijing' }
            ]
          },
          {
            prop: 'date',
            label: '活动日期',
            component: 'hzq-date-picker',
            props: { type: 'date', placeholder: '选择日期', valueFormat: 'yyyy-MM-dd' }
          },
          {
            prop: 'online',
            label: '线上活动',
            component: 'hzq-switch'
          }
        ]
      };
    }
  };
</script>
```
:::

### 校验

:::demo `required` 会自动生成一条「{label}不能为空」的规则，并同时监听 `blur` 与 `change`（只监听 `blur` 的话，改完值要等到别处失焦才消红）。字段自己的 `rules` 与表单级 `rules` 会按 `prop` 合并，不会互相覆盖。开启 `show-actions` 后，点击提交会先校验：通过抛 `submit`，不通过抛 `invalid`，两种结果只会有一次提示。
```html
<template>
  <div>
    <hzq-form-builder
      ref="builder"
      v-model="form"
      :fields="fields"
      :rules="rules"
      label-width="88px"
      :columns="2"
      :gutter="12"
      show-actions
      submit-text="保存"
      @submit="handleSubmit"
      @invalid="handleInvalid"
    />
    <p class="demo-result">{{ result }}</p>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        result: '尚未提交',
        form: { name: '', amount: '' },
        rules: {
          name: [{ min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }]
        },
        fields: [
          { prop: 'name', label: '名称', component: 'hzq-input', required: true },
          {
            prop: 'amount',
            label: '金额',
            component: 'hzq-input',
            required: true,
            requiredMessage: '金额必须填写',
            rules: [{ pattern: /^\d+$/, message: '只能填数字', trigger: 'change' }]
          }
        ]
      };
    },
    methods: {
      handleSubmit(model) {
        this.result = '提交成功：' + JSON.stringify(model);
      },
      handleInvalid() {
        this.result = '请先补全必填项';
      }
    }
  };
</script>

<style>
  .demo-result {
    margin: 8px 0 0;
    font-size: 13px;
    color: #909399;
  }
</style>
```
:::

### 选项数据

:::demo 给 `hzq-select`、`hzq-radio-group`、`hzq-checkbox-group` 配上 `options`，就会自动渲染出对应的 `hzq-option`、`hzq-radio`、`hzq-checkbox` 子节点。数据字段名与 `label` / `value` / `disabled` 不一致时，用 `optionProps` 做映射，接口数据可以直接丢进来。
```html
<template>
  <hzq-form-builder
    v-model="form"
    :fields="fields"
    label-width="88px"
  />
</template>

<script>
  export default {
    data() {
      return {
        form: { region: '', level: 'normal', tags: [] },
        fields: [
          {
            prop: 'region',
            label: '区域',
            component: 'hzq-select',
            props: { clearable: true },
            options: [
              { name: '区域一', code: 'shanghai' },
              { name: '区域二', code: 'beijing' },
              { name: '区域三', code: 'shenzhen', off: true }
            ],
            optionProps: { label: 'name', value: 'code', disabled: 'off' }
          },
          {
            prop: 'level',
            label: '级别',
            component: 'hzq-radio-group',
            options: [
              { label: '普通', value: 'normal' },
              { label: '紧急', value: 'urgent' }
            ]
          },
          {
            prop: 'tags',
            label: '标签',
            component: 'hzq-checkbox-group',
            options: [
              { label: '重要', value: 'important' },
              { label: '长期', value: 'longterm' }
            ]
          }
        ]
      };
    }
  };
</script>
```
:::

### 字段联动

:::demo `hidden` 与 `disabled` 既可以写死布尔值，也可以写成 `(model) => boolean`。函数形式会随数据变化重新求值：隐藏只是不渲染，`model` 里的值仍然保留。
```html
<template>
  <hzq-form-builder
    v-model="form"
    :fields="fields"
    label-width="88px"
    :columns="2"
    :gutter="12"
  />
</template>

<script>
  export default {
    data() {
      return {
        form: { type: 'fixed', amount: '', remark: '' },
        fields: [
          {
            prop: 'type',
            label: '计费方式',
            component: 'hzq-select',
            options: [
              { label: '固定金额', value: 'fixed' },
              { label: '按量计费', value: 'dynamic' }
            ]
          },
          {
            prop: 'amount',
            label: '金额',
            component: 'hzq-input',
            tip: '按量计费时不需要填写',
            hidden: model => model.type === 'dynamic',
            disabled: model => !model.type
          },
          {
            prop: 'remark',
            label: '备注',
            component: 'hzq-input',
            disabled: model => model.type === 'dynamic'
          }
        ]
      };
    }
  };
</script>
```
:::

### 自定义插槽

:::demo 三种接管方式：`slot` 整块替换字段的渲染（作用域里有 `setValue`，用来把值写回 `model`）；`labelSlot` 替换标签内容；`slots` 把插槽转发进字段组件内部（如 `hzq-input` 的 `prefix`）。`slots` 支持数组（插槽同名）和对象（目标插槽名 → 你的插槽名）两种写法。
```html
<template>
  <hzq-form-builder
    v-model="form"
    :fields="fields"
    label-width="88px"
  >
    <template slot="amountLabel" slot-scope="scope">★{{ scope.field.label }}</template>
    <template slot="amount" slot-scope="scope">
      <hzq-input-number
        :value="Number(scope.value) || 0"
        :min="0"
        @change="scope.setValue"
      />
    </template>
    <template slot="remark" slot-scope="scope">
      <hzq-input
        :value="scope.value"
        type="textarea"
        :rows="2"
        placeholder="自定义插槽字段"
        @input="scope.setValue"
      />
    </template>
    <span slot="namePrefix">￥</span>
  </hzq-form-builder>
</template>

<script>
  export default {
    data() {
      return {
        form: { name: '', amount: '', remark: '' },
        fields: [
          {
            prop: 'name',
            label: '名称',
            component: 'hzq-input',
            slots: { prefix: 'namePrefix' }
          },
          { prop: 'amount', label: '金额', labelSlot: 'amountLabel', slot: 'amount' },
          { prop: 'remark', label: '说明', slot: 'remark' }
        ]
      };
    }
  };
</script>
```
:::

### 分组与布局

:::demo `type` 为 `title` 的条目渲染成分组标题，为 `divider` 的渲染成 `hzq-divider`，两者都只做展示，不参与数据和校验。不设 `columns` 时可以用 `span` 按 24 栅格累计换行；`gutter` 控制列间距。
```html
<template>
  <hzq-form-builder
    v-model="form"
    :fields="fields"
    label-width="88px"
    :gutter="16"
  />
</template>

<script>
  export default {
    data() {
      return {
        form: { name: '', phone: '', email: '', address: '' },
        fields: [
          { type: 'title', label: '基本信息' },
          { prop: 'name', label: '姓名', component: 'hzq-input', span: 12 },
          { prop: 'phone', label: '手机号', component: 'hzq-input', span: 12 },
          { type: 'divider', label: '联系方式' },
          { prop: 'email', label: '邮箱', component: 'hzq-input' },
          { prop: 'address', label: '地址', component: 'hzq-input' }
        ]
      };
    }
  };
</script>
```
:::

### 字段事件

:::demo 字段上的 `events` 是事件名到处理函数的映射，处理函数在组件参数之后会额外收到一个上下文对象 `ctx`（`field`、`model`、`prop`、`value`），业务侧不用再从闭包里捞这些信息。
```html
<template>
  <div>
    <hzq-form-builder
      v-model="form"
      :fields="fields"
      label-width="88px"
    />
    <p class="demo-result">{{ log || '等待操作' }}</p>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        log: '',
        form: { locked: false, region: '' },
        fields: [
          {
            prop: 'locked',
            label: '锁定',
            component: 'hzq-switch',
            events: {
              change: (value, ctx) => {
                this.log = `字段「${ctx.field.label}」变为 ${value}`;
                // 函数形式的事件天然带着 model，联动可以直接改
                if (value) ctx.model.region = '';
              }
            }
          },
          {
            prop: 'region',
            label: '区域',
            component: 'hzq-select',
            props: { clearable: true },
            options: [
              { label: '区域一', value: 'shanghai' },
              { label: '区域二', value: 'beijing' }
            ]
          }
        ]
      };
    }
  };
</script>

<style>
  .demo-result {
    margin: 8px 0 0;
    font-size: 13px;
    color: #909399;
  }
</style>
```
:::

### FormBuilder Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---------- | -------------- | ---------- | --- | -------- |
| value / v-model | 表单数据。会被就地更新，不产生副本 | object | — | {} |
| fields | 字段配置，每一项渲染一个表单项，详见下方 Field 配置项 | array | — | [] |
| rules | 表单校验规则，按 `prop` 与字段自身规则合并 | object | — | {} |
| label-width | 标签宽度，透传给 `hzq-form` | string | — | — |
| label-position | 标签位置 | string | right / left / top | right |
| label-suffix | 标签后缀 | string | — | '' |
| inline | 是否行内表单 | boolean | — | false |
| inline-message | 是否将错误信息显示在行内 | boolean | — | false |
| status-icon | 是否在输入框中显示校验状态图标 | boolean | — | false |
| hide-required-asterisk | 是否隐藏必填字段标签旁的星号 | boolean | — | false |
| validate-on-rule-change | 规则变化时是否立即重新校验 | boolean | — | true |
| size | 表单内组件尺寸 | string | large / medium / small / mini | — |
| disabled | 是否禁用整个表单 | boolean | — | false |
| show-message | 是否显示校验错误信息 | boolean | — | true |
| columns | 一行几列。设置后按等分栅格排版，忽略字段上的 `span` | number | — | 0 |
| gutter | 列间距，单位 px | number | — | 0 |
| show-actions | 是否渲染提交 / 重置按钮 | boolean | — | false |
| submit-text | 提交按钮文案 | string | — | 提交 |
| reset-text | 重置按钮文案 | string | — | 重置 |
| loading | 提交按钮的加载状态 | boolean | — | false |

### Field 配置项

`fields` 数组的每一项：

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---------- | -------------- | ---------- | --- | -------- |
| prop | 对应数据对象的路径，支持 `a.b` 与 `list[0].id` | string | — | — |
| label | 标签文案 | string | — | — |
| component | 字段组件：全局注册的组件名字符串（如 `hzq-select`）或组件对象。不填则交给 `slot` 接管 | string / object | — | — |
| props | 透传给字段组件的 props | object | — | — |
| events | 事件名 → 处理函数，回调最后会多收到一个 `ctx`（`{ field, model, prop, value }`） | object | — | — |
| slots | 转发进字段组件内部的插槽。`['prefix']` 表示同名转发，`{ prefix: 'myPrefix' }` 表示映射到你的插槽名 | array / object | — | — |
| options | 选项数据。按组件自动渲染 `hzq-option` / `hzq-radio` / `hzq-checkbox` | array | — | — |
| optionProps | 选项字段映射，如 `{ label: 'name', value: 'id' }`，用于对接接口数据 | object | — | — |
| optionComponent | 手动指定选项子组件名，默认按 `component` 自动推断 | string | — | — |
| required | 是否自动生成必填规则 | boolean | — | false |
| requiredMessage | 自动生成的必填规则文案，默认「{label}不能为空」 | string | — | — |
| rules | 字段自己的校验规则，与 `required`、表单级 `rules` 合并 | array | — | — |
| span | 24 栅格占位，仅在未设置 `columns` 时生效 | number | — | 24 |
| hidden | 是否隐藏。为真时不渲染，但保留数据 | boolean / function(model) | — | false |
| disabled | 是否禁用。函数形式随数据变化重新求值 | boolean / function(model) | — | false |
| tip | 字段下方的说明文字 | string | — | — |
| type | 条目类型 | string | field / title / divider | field |
| slot | 用你的哪个插槽整块渲染这个字段，优先级最高 | string | — | — |
| labelSlot | 用你的哪个插槽渲染标签 | string | — | — |
| contentPosition | 分隔线文字位置，仅 `type="divider"` 时有效 | string | left / center / right | left |
| key | 列表渲染用的 key，默认取 `prop` | string | — | — |

### FormBuilder Events

| 事件名称 | 说明 | 回调参数 |
| ---------- | -------------- | ---------- |
| submit | 点击提交按钮且校验通过时触发 | (model) |
| invalid | 点击提交按钮但校验未通过时触发 | — |
| reset | 点击重置按钮时触发，同时重置所有字段与校验状态 | (model) |
| field-change | 任一字段值变化时触发 | (prop, value, model) |

### FormBuilder Slots

| name | 说明 | 作用域参数 |
| ---------- | -------------- | ---------- |
| title | 自定义 `type="title"` 分组标题的内容 | { field } |
| — | 任意具名插槽，由字段的 `slot`、`labelSlot`、`slots` 引用 | { field, model, value, setValue } |

### FormBuilder Methods

| 方法名 | 说明 | 参数 |
| ---------- | -------------- | ---------- |
| validate | 校验整个表单，行为与 `hzq-form` 一致 | (callback) |
| validateField | 校验指定字段 | (props, callback) |
| resetFields | 重置所有字段并清除校验状态 | — |
| clearValidate | 清除指定字段的校验状态 | (props) |
