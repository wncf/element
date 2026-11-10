## FormBuilder

Render a whole form from a field config array. Field components, props, events, slots, validation rules and grid layout all live in the config, which suits CRUD pages with many similar forms.

### Basic usage

:::demo Describe each field in `fields` and bind the data object with `v-model`. Field values are read from and written to the object you pass in (the same reference as the `hzq-form` model), so validation always sees the latest value. `prop` supports nested paths such as `user.name` and `list[0].id`. Without `columns` every field takes a whole row; with `columns` the row is split evenly.
```html
<template>
  <hzq-form-builder
    v-model="form"
    :fields="fields"
    label-width="120px"
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
            label: 'Activity name',
            component: 'hzq-input',
            props: { placeholder: 'Activity name' }
          },
          {
            prop: 'region',
            label: 'Activity zone',
            component: 'hzq-select',
            options: [
              { label: 'Zone one', value: 'shanghai' },
              { label: 'Zone two', value: 'beijing' }
            ]
          },
          {
            prop: 'date',
            label: 'Activity date',
            component: 'hzq-date-picker',
            props: { type: 'date', placeholder: 'Pick a date', valueFormat: 'yyyy-MM-dd' }
          },
          {
            prop: 'online',
            label: 'Online activity',
            component: 'hzq-switch'
          }
        ]
      };
    }
  };
</script>
```
:::

### Validation

:::demo `required` generates a "`{label}` cannot be empty" rule and listens to both `blur` and `change`; listening to `blur` alone would keep the error visible until the user clicks elsewhere. The field's own `rules` are merged with the form level `rules` by `prop` instead of overriding them. With `show-actions` the submit button validates first: it emits `submit` when valid and `invalid` when not, so you only have to show one message.
```html
<template>
  <div>
    <hzq-form-builder
      ref="builder"
      v-model="form"
      :fields="fields"
      :rules="rules"
      label-width="120px"
      :columns="2"
      :gutter="12"
      show-actions
      submit-text="Save"
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
        result: 'Not submitted yet',
        form: { name: '', amount: '' },
        rules: {
          name: [{ min: 2, max: 20, message: 'Length should be 2 to 20', trigger: 'blur' }]
        },
        fields: [
          { prop: 'name', label: 'Name', component: 'hzq-input', required: true },
          {
            prop: 'amount',
            label: 'Amount',
            component: 'hzq-input',
            required: true,
            requiredMessage: 'Amount is required',
            rules: [{ pattern: /^\d+$/, message: 'Numbers only', trigger: 'change' }]
          }
        ]
      };
    },
    methods: {
      handleSubmit(model) {
        this.result = 'Submitted: ' + JSON.stringify(model);
      },
      handleInvalid() {
        this.result = 'Please fill in the required fields';
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

### Option data

:::demo Give `hzq-select`, `hzq-radio-group` or `hzq-checkbox-group` an `options` array and the matching `hzq-option`, `hzq-radio` and `hzq-checkbox` children are rendered for you. When the source uses different key names, map them with `optionProps` so API responses can be passed in as is.
```html
<template>
  <hzq-form-builder
    v-model="form"
    :fields="fields"
    label-width="120px"
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
            label: 'Zone',
            component: 'hzq-select',
            props: { clearable: true },
            options: [
              { name: 'Zone one', code: 'shanghai' },
              { name: 'Zone two', code: 'beijing' },
              { name: 'Zone three', code: 'shenzhen', off: true }
            ],
            optionProps: { label: 'name', value: 'code', disabled: 'off' }
          },
          {
            prop: 'level',
            label: 'Level',
            component: 'hzq-radio-group',
            options: [
              { label: 'Normal', value: 'normal' },
              { label: 'Urgent', value: 'urgent' }
            ]
          },
          {
            prop: 'tags',
            label: 'Tags',
            component: 'hzq-checkbox-group',
            options: [
              { label: 'Important', value: 'important' },
              { label: 'Long term', value: 'longterm' }
            ]
          }
        ]
      };
    }
  };
</script>
```
:::

### Field links

:::demo `hidden` and `disabled` accept either a boolean or a `(model) => boolean` function. The function form is re-evaluated when the data changes; hiding a field only skips rendering, the value in `model` is kept.
```html
<template>
  <hzq-form-builder
    v-model="form"
    :fields="fields"
    label-width="120px"
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
            label: 'Billing',
            component: 'hzq-select',
            options: [
              { label: 'Fixed amount', value: 'fixed' },
              { label: 'Pay as you go', value: 'dynamic' }
            ]
          },
          {
            prop: 'amount',
            label: 'Amount',
            component: 'hzq-input',
            tip: 'Not needed for pay as you go',
            hidden: model => model.type === 'dynamic',
            disabled: model => !model.type
          },
          {
            prop: 'remark',
            label: 'Remark',
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

### Custom slots

:::demo Three ways to take over rendering: `slot` replaces the whole field (its scope exposes `setValue`, which writes back into `model`); `labelSlot` replaces the label content; `slots` forwards slots into the field component, such as `prefix` of `hzq-input`. `slots` accepts an array (same name) or an object (target slot name → your slot name).
```html
<template>
  <hzq-form-builder
    v-model="form"
    :fields="fields"
    label-width="120px"
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
        placeholder="Custom slot field"
        @input="scope.setValue"
      />
    </template>
    <span slot="namePrefix">$</span>
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
            label: 'Name',
            component: 'hzq-input',
            slots: { prefix: 'namePrefix' }
          },
          { prop: 'amount', label: 'Amount', labelSlot: 'amountLabel', slot: 'amount' },
          { prop: 'remark', label: 'Remark', slot: 'remark' }
        ]
      };
    }
  };
</script>
```
:::

### Groups and layout

:::demo A `type: 'title'` entry renders as a group title and `type: 'divider'` renders an `hzq-divider`. Both are display only and stay out of the data and validation. Without `columns` you can use `span` to fill 24 grid columns before wrapping; `gutter` sets the horizontal spacing.
```html
<template>
  <hzq-form-builder
    v-model="form"
    :fields="fields"
    label-width="120px"
    :gutter="16"
  />
</template>

<script>
  export default {
    data() {
      return {
        form: { name: '', phone: '', email: '', address: '' },
        fields: [
          { type: 'title', label: 'Basic info' },
          { prop: 'name', label: 'Name', component: 'hzq-input', span: 12 },
          { prop: 'phone', label: 'Phone', component: 'hzq-input', span: 12 },
          { type: 'divider', label: 'Contact' },
          { prop: 'email', label: 'Email', component: 'hzq-input' },
          { prop: 'address', label: 'Address', component: 'hzq-input' }
        ]
      };
    }
  };
</script>
```
:::

### Field events

:::demo `events` on a field maps event names to handlers. Each handler receives a context object `ctx` (`field`, `model`, `prop`, `value`) as its last argument, so business code does not have to capture them in the closure.
```html
<template>
  <div>
    <hzq-form-builder
      v-model="form"
      :fields="fields"
      label-width="120px"
    />
    <p class="demo-result">{{ log || 'Waiting for input' }}</p>
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
            label: 'Locked',
            component: 'hzq-switch',
            events: {
              change: (value, ctx) => {
                this.log = `Field "${ctx.field.label}" changed to ${value}`;
                // function handlers already carry the model, so links are trivial
                if (value) ctx.model.region = '';
              }
            }
          },
          {
            prop: 'region',
            label: 'Zone',
            component: 'hzq-select',
            props: { clearable: true },
            options: [
              { label: 'Zone one', value: 'shanghai' },
              { label: 'Zone two', value: 'beijing' }
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

| Attribute | Description | Type | Accepted Values | Default |
| ---------- | -------------- | ---------- | --- | -------- |
| value / v-model | Form data. Updated in place, no copy is made | object | — | {} |
| fields | Field configs, one form item per entry, see Field Attributes below | array | — | [] |
| rules | Validation rules of the form, merged with each field's own rules by `prop` | object | — | {} |
| label-width | Width of label, passed to `hzq-form` | string | — | — |
| label-position | Position of label | string | right / left / top | right |
| label-suffix | Suffix of the label | string | — | '' |
| inline | Whether the form is inline | boolean | — | false |
| inline-message | Whether to show the error message inline | boolean | — | false |
| status-icon | Whether to show a validation status icon inside the input | boolean | — | false |
| hide-required-asterisk | Whether to hide the asterisk at the end of required field labels | boolean | — | false |
| validate-on-rule-change | Whether to validate immediately when rules change | boolean | — | true |
| size | Size of the controls in this form | string | large / medium / small / mini | — |
| disabled | Whether the whole form is disabled | boolean | — | false |
| show-message | Whether to show the error message | boolean | — | true |
| columns | Number of columns in a row. When set, fields are split evenly and `span` is ignored | number | — | 0 |
| gutter | Horizontal gap between columns, in pixels | number | — | 0 |
| show-actions | Whether to render the submit / reset buttons | boolean | — | false |
| submit-text | Text of the submit button | string | — | 提交 |
| reset-text | Text of the reset button | string | — | 重置 |
| loading | Loading state of the submit button | boolean | — | false |

### Field Attributes

Every entry of the `fields` array:

| Attribute | Description | Type | Accepted Values | Default |
| ---------- | -------------- | ---------- | --- | -------- |
| prop | Path of the value in the data object, supports `a.b` and `list[0].id` | string | — | — |
| label | Label text | string | — | — |
| component | Field component: a globally registered name (`hzq-select`) or a component object. Leave empty to render with `slot` | string / object | — | — |
| props | Props forwarded to the field component | object | — | — |
| events | event name → handler, the handler receives an extra `ctx` (`{ field, model, prop, value }`) | object | — | — |
| slots | Slots forwarded into the field component. `['prefix']` keeps the name, `{ prefix: 'myPrefix' }` maps to your slot name | array / object | — | — |
| options | Option data. Rendered as `hzq-option` / `hzq-radio` / `hzq-checkbox` automatically | array | — | — |
| optionProps | Field name mapping for option data, e.g. `{ label: 'name', value: 'id' }` | object | — | — |
| optionComponent | Option child component name, inferred from `component` by default | string | — | — |
| required | Whether to generate a required rule automatically | boolean | — | false |
| requiredMessage | Message of the generated required rule, defaults to "{label} cannot be empty" | string | — | — |
| rules | Validation rules of the field, merged with `required` and the form level `rules` | array | — | — |
| span | 24-column grid span, only used when `columns` is not set | number | — | 24 |
| hidden | Whether to hide the field. A hidden field is not rendered but keeps its value | boolean / function(model) | — | false |
| disabled | Whether to disable the field. The function form is re-evaluated on data change | boolean / function(model) | — | false |
| tip | Helper text rendered under the field | string | — | — |
| type | Entry kind | string | field / title / divider | field |
| slot | Render this field with one of your slots, takes the highest priority | string | — | — |
| labelSlot | Render the label with one of your slots | string | — | — |
| contentPosition | Position of the divider text, only for `type="divider"` | string | left / center / right | left |
| key | Key for list rendering, defaults to `prop` | string | — | — |

### FormBuilder Events

| Event Name | Description | Callback Parameters |
| ---------- | -------------- | ---------- |
| submit | Triggers when the submit button is clicked and the form is valid | (model) |
| invalid | Triggers when the submit button is clicked but the form is invalid | — |
| reset | Triggers when the reset button is clicked, all fields and validation are reset | (model) |
| field-change | Triggers when a field value changes | (prop, value, model) |

### FormBuilder Slots

| Name | Description | Scope |
| ---------- | -------------- | ---------- |
| title | Content of a `type="title"` entry | { field } |
| — | Any named slot referenced by `field.slot`, `field.labelSlot` or `field.slots` | { field, model, value, setValue } |

### FormBuilder Methods

| Method | Description | Parameters |
| ---------- | -------------- | ---------- |
| validate | Validate the whole form, same behavior as `hzq-form` | (callback) |
| validateField | Validate specific fields | (props, callback) |
| resetFields | Reset all fields and clear the validation state | — |
| clearValidate | Clear the validation state of specific fields | (props) |
