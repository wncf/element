## AmountInput 金额输入

面向金额场景的输入框，在输入过程中即时清洗与约束，失焦时按精度补齐。

:::tip
与 `hzq-input` 的区别：`v-model` 的值固定为**字符串**（金额用 Number 往返会丢精度），且会在每次按键后清洗输入内容。
:::

### 基础用法

:::demo 用 `v-model` 绑定金额，默认保留两位小数。输入时只接受数字与至多一个小数点，全角数字会自动转成半角，千分位逗号与货币符号会被去除。超出精度的位数直接截断（不四舍五入），编辑过程中不补齐小数位，失焦后才补齐。
```html
<template>
  <hzq-amount-input
    v-model="amount"
    placeholder="请输入金额"
    style="width: 200px;">
  </hzq-amount-input>
  <p>当前值：{{ amount || '（空）' }}</p>
</template>

<script>
  export default {
    data() {
      return {
        amount: ''
      };
    }
  };
</script>
```
:::

### 小数位数

:::demo 用 `precision` 控制小数位数，`0` 表示只接受整数。输入 `1,234.56` 时，`precision` 为 0 的框只会得到 `1234`，而不会把逗号一并去掉后拼成 `123456`。
```html
<template>
  <hzq-row :gutter="12">
    <hzq-col :span="8">
      <hzq-amount-input v-model="int" :precision="0" placeholder="整数" />
      <p class="amount-tip">precision=0：{{ int || '（空）' }}</p>
    </hzq-col>
    <hzq-col :span="8">
      <hzq-amount-input v-model="two" :precision="2" placeholder="两位小数" />
      <p class="amount-tip">precision=2：{{ two || '（空）' }}</p>
    </hzq-col>
    <hzq-col :span="8">
      <hzq-amount-input v-model="four" :precision="4" placeholder="四位小数" />
      <p class="amount-tip">precision=4：{{ four || '（空）' }}</p>
    </hzq-col>
  </hzq-row>
</template>

<script>
  export default {
    data() {
      return {
        int: '',
        two: '',
        four: ''
      };
    }
  };
</script>
```
:::

### 取值范围

:::demo `min` 与 `max` 在失焦时硬收敛。`min` 大于 0 时，整数部分仍可继续输入期间不会提前收敛，否则 `min=100` 时根本输不进 `500`。
```html
<template>
  <hzq-amount-input
    v-model="range"
    :min="100"
    :max="1000"
    placeholder="100 ~ 1000">
  </hzq-amount-input>
  <p>当前值：{{ range || '（空）' }}</p>
</template>

<script>
  export default {
    data() {
      return {
        range: ''
      };
    }
  };
</script>
```
:::

### 允许负数

:::demo 默认不允许负数，下限强制为 0，即使传了负的 `min` 也以「禁止负数」为准。需要录入退款、调整额等场景时打开 `allow-negative`。
```html
<template>
  <hzq-row :gutter="12">
    <hzq-col :span="12">
      <hzq-amount-input v-model="positive" placeholder="不允许负数" />
      <p class="amount-tip">{{ positive || '（空）' }}</p>
    </hzq-col>
    <hzq-col :span="12">
      <hzq-amount-input v-model="negative" allow-negative placeholder="允许负数" />
      <p class="amount-tip">{{ negative || '（空）' }}</p>
    </hzq-col>
  </hzq-row>
</template>

<script>
  export default {
    data() {
      return {
        positive: '',
        negative: ''
      };
    }
  };
</script>
```
:::

### 尺寸

:::demo 与其他表单控件一致，支持 `large` / `medium` / `small` / `mini` 四档，不传时跟随 `hzq-form` 或全局 `$ELEMENT.size`。
```html
<template>
  <hzq-amount-input v-model="large" size="large" placeholder="large" style="width: 140px; margin-right: 8px;" />
  <hzq-amount-input v-model="medium" size="medium" placeholder="medium" style="width: 140px; margin-right: 8px;" />
  <hzq-amount-input v-model="small" size="small" placeholder="small" style="width: 140px; margin-right: 8px;" />
  <hzq-amount-input v-model="mini" size="mini" placeholder="mini" style="width: 140px;" />
</template>

<script>
  export default {
    data() {
      return { large: '', medium: '', small: '', mini: '' };
    }
  };
</script>
```
:::

### 可清空与前缀后缀

:::demo 用 `clearable` 显示清空按钮，`prefix-icon` / `suffix-icon` 添加图标，也可以用 `prefix` / `suffix` 插槽放自定义内容。
```html
<template>
  <hzq-amount-input
    v-model="clearable"
    clearable
    prefix-icon="hzq-icon-coin"
    placeholder="可清空">
  </hzq-amount-input>
</template>

<script>
  export default {
    data() {
      return { clearable: '128.50' };
    }
  };
</script>
```
:::

### 与表单集成

:::demo 可以放进 `hzq-form-item`，`validate-event` 为 `true`（默认）时会派发 `el.form.change` / `el.form.blur`，校验时机与普通输入框一致。金额用 `type: 'number'` 之外还需注意值本身是字符串。
```html
<template>
  <hzq-form :model="form" label-width="88px">
    <hzq-form-item label="金额" prop="amount" :rules="[{ required: true, message: '请输入金额', trigger: 'blur' }]">
      <hzq-amount-input v-model="form.amount" placeholder="请输入金额" />
    </hzq-form-item>
    <hzq-form-item>
      <hzq-button type="primary" @click="submit">校验</hzq-button>
    </hzq-form-item>
  </hzq-form>
</template>

<script>
  export default {
    data() {
      return {
        form: { amount: '' }
      };
    },
    methods: {
      submit() {
        this.$refs.form && this.$refs.form.validate(() => {});
      }
    }
  };
</script>
```
:::

### Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---------- | -------------- | ---------- | --- | -------- |
| value / v-model | 绑定值，统一为字符串以避免精度丢失 | string / number | — | '' |
| precision | 小数位数，0 表示只收整数 | number | 0 ~ 20 的整数 | 2 |
| min | 最小值，未传时由 `allow-negative` 决定下限 | number | — | null |
| max | 最大值 | number | — | Infinity |
| allow-negative | 是否允许输入负数 | boolean | — | false |
| placeholder | 占位文本 | string | — | — |
| disabled | 是否禁用 | boolean | — | false |
| readonly | 是否只读 | boolean | — | false |
| size | 尺寸 | string | large / medium / small / mini | — |
| clearable | 是否可清空 | boolean | — | false |
| prefix-icon | 前缀图标类名 | string | — | — |
| suffix-icon | 后缀图标类名 | string | — | — |
| tabindex | 原生 tabindex | string | — | — |
| label | 无障碍标签，同时作为 `aria-label` | string | — | — |
| autocomplete | 原生 autocomplete | string | — | off |
| validate-event | 是否触发表单校验 | boolean | — | true |

### Events

| 事件名称 | 说明 | 回调参数 |
| ---------- | -------------- | ---------- |
| input | 输入时触发，值为清洗后的文本 | (value) |
| change | 失焦后且值发生变化时触发 | (value) |
| focus | 获得焦点时触发 | (event) |
| blur | 失去焦点时触发 | (event) |
| clear | 点击清空按钮时触发 | — |

### Slots

| name | 说明 |
|------|--------|
| prefix | 输入框头部内容 |
| suffix | 输入框尾部内容 |

### Methods

| 方法名 | 说明 | 参数 |
| ---------- | -------------- | ---------- |
| focus | 使输入框获取焦点 | — |
| blur | 使输入框失去焦点 | — |
| select | 选中输入框内的文本 | — |

:::tip
值在编辑过程中是「未完成的文本」，可能暂时是空串、单独的 `-` 或 `1.`。提交前请用 `parseAmount` 转换，或监听 `change` 事件而不是 `input`。
:::
