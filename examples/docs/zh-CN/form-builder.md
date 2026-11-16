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

### 字段类型解析

把「字段类型」和「用什么组件渲染」分开：配置里存 `fieldType`，由 `field-resolver` 翻译成组件。解析器是一个普通函数，返回 `{ component, props, optionComponent }`，返回 `null` 表示不认识这个类型。

库本身不内置任何类型表 —— 类型名属于业务，不同表单也可以用不同的解析器。`field.component` 的优先级永远高于解析器，所以新旧写法可以混用。解析器抛错时该字段降级为纯文本，不会让整个表单渲染失败。

解析器返回的 `props` 是预设值，字段自己的 `props` 会覆盖同名项。类型表之外的兜底写法见下一个例子。

:::demo 用一份 `PRESETS` 表把 `fieldType` 映射到组件，初始化时不需要再写 `component`。
```html
<template>
  <hzq-form-builder
    v-model="form"
    :fields="fields"
    :field-resolver="resolveField"
    label-width="88px"
  />
</template>

<script>
  // 这份表只有业务自己知道，放在项目里，增删类型不用等组件库发版
  const PRESETS = {
    text: { component: 'hzq-input' },
    textarea: {
      component: 'hzq-input',
      props: { type: 'textarea', rows: 3 }
    },
    switch: { component: 'hzq-switch' },
    enum: {
      component: 'hzq-select',
      optionComponent: 'hzq-option',
      props: { clearable: true }
    }
  };

  export default {
    data() {
      return {
        form: { name: '', remark: '', online: false, region: '' },
        fields: [
          { prop: 'name', label: '名称', fieldType: 'text' },
          { prop: 'remark', label: '说明', fieldType: 'textarea' },
          { prop: 'online', label: '启用', fieldType: 'switch' },
          {
            prop: 'region',
            label: '区域',
            fieldType: 'enum',
            options: [
              { label: '区域一', value: 'shanghai' },
              { label: '区域二', value: 'beijing' }
            ]
          }
        ]
      };
    },
    methods: {
      resolveField(field) {
        return PRESETS[field.fieldType] || null;
      }
    }
  };
</script>
```
:::

:::demo 类型表之外的情况用字段自己的配置兜底：`field.component` 直接写组件名或组件对象（优先级最高），`props` 覆盖解析器的预设，解析器返回 `null` 的字段会降级成纯文本。
```html
<template>
  <hzq-form-builder
    v-model="form"
    :fields="fields"
    :field-resolver="resolveField"
    label-width="88px"
  />
</template>

<script>
  export default {
    data() {
      return {
        form: { name: '', remark: '', legacy: '只在配置里出现' },
        fields: [
          { prop: 'name', label: '名称', fieldType: 'text' },
          {
            prop: 'remark',
            label: '说明',
            fieldType: 'textarea',
            // 覆盖解析器预设的 rows
            props: { rows: 6 }
          },
          {
            prop: 'legacy',
            label: '未知类型',
            // 不给 component，解析器也返回 null → 渲染成纯文本
            fieldType: 'not-registered'
          }
        ]
      };
    },
    methods: {
      resolveField(field) {
        if (field.fieldType === 'text') return { component: 'hzq-input' };
        if (field.fieldType === 'textarea') {
          return { component: 'hzq-input', props: { type: 'textarea', rows: 3 } };
        }
        return null;
      }
    }
  };
</script>
```
:::

### 生成初始数据

`createFormModel(fields, fieldResolver?)` 按字段配置生成初始数据对象，省去手写一份容易和配置对不上的空对象。它与 Vue 无关，可以在组件外调用。

默认值取自 `field.defaultValue`，支持函数形式（每次调用重新求值，适合 `() => new Date()`）。没写时按组件兜底：`hzq-checkbox-group` 为 `[]`、`hzq-switch` 为 `false`、`hzq-rate` 为 `0`，其余为 `''`。数组和对象的默认值每次都会新建，多个表单实例之间不会串值。

`prop` 支持嵌套路径和数组下标，`type` 为 `title` / `divider` 的条目会被跳过。

```js
import { createFormModel } from 'hzq-ui/src/utils/form-builder';

const fields = [
  { prop: 'name', component: 'hzq-input' },
  { prop: 'tags', component: 'hzq-checkbox-group' },
  { prop: 'online', component: 'hzq-switch' },
  { prop: 'user.phone', component: 'hzq-input' },
  { prop: 'items[0].id', component: 'hzq-input' },
  { prop: 'createdAt', defaultValue: () => new Date() }
];

const form = createFormModel(fields);
// {
//   name: '',
//   tags: [],
//   online: false,
//   user: { phone: '' },
//   items: [{ id: '' }],
//   createdAt: <调用时的时间>
// }
```

传了 `fieldResolver` 时，默认值还能按 `fieldType` 推断 —— 由解析器指定的组件决定兜底值：

```js
const form = createFormModel(
  [{ prop: 'online', fieldType: 'switch' }],
  field => (field.fieldType === 'switch' ? { component: 'hzq-switch' } : null)
);
// { online: false }
```

配合后端数据时，默认值打底、后端覆盖：

```js
async loadDetail() {
  const form = createFormModel(this.fields);
  this.form = deepMerge(form, await api.getDetail());
  this.loading = false;   // 数据准备好之后再渲染表单
}
```

:::tip
**先把数据准备好，再渲染表单。** `hzq-form-item` 是在挂载那一刻把当前值记为「初始值」的，`resetFields` 会回到这个快照。所以后端数据异步返回时，要等数据回来再渲染表单（用 `loading` 包住），否则初始值快照的是空值，用户点重置会把数据清空。

默认值和后端数据的合并顺序是「默认值打底、后端覆盖」，嵌套对象需要递归合并（`Object.assign` 只能覆盖第一层），数组建议整体替换。
:::

### 编辑场景回显

编辑页和新增页的区别只有一处：`v-model` 里的数据不是空对象，而是接口返回的详情。回显本身不需要额外 API，把数据填进 `model` 即可；难的是**时机**和**切换记录**。

推荐做法是等数据回来再渲染表单。`loading` 期间不渲染 `hzq-form-builder`，数据就绪后一次性赋给 `model`，这样 `hzq-form-item` 挂载时快照到的就是详情值，点「重置」回到详情值而不是空值。如果边加载边渲染，表单项会先挂载在空值上，之后虽然能显示数据，但重置会清空全部内容。

:::demo 加载完成后才渲染表单，重置回到详情值。
```html
<template>
  <div>
    <div v-if="loading" class="edit-tip">正在加载详情…</div>
    <template v-else-if="form">
      <hzq-form-builder
        v-model="form"
        :fields="fields"
        label-width="88px"
        show-actions
        submit-text="保存"
        @submit="handleSubmit"
        @reset="handleReset"
      />
      <p class="edit-tip">{{ message }}</p>
    </template>
    <div v-else class="edit-tip">加载失败</div>
  </div>
</template>

<script>
  // 模拟接口：真实项目里换成 api.getDetail(id)
  function fetchDetail() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          title: '十月加班申请',
          hours: 8,
          type: 'overtime',
          remark: '项目上线支持',
          contacts: '13800000000'
        });
      }, 500);
    });
  }

  export default {
    data() {
      return {
        loading: true,
        // 数据没回来之前保持 null，配合 v-else-if 不渲染表单
        form: null,
        message: '',
        fields: [
          { prop: 'title', label: '标题', component: 'hzq-input', required: true },
          { prop: 'hours', label: '时长', component: 'hzq-input-number' },
          {
            prop: 'type',
            label: '类型',
            component: 'hzq-select',
            options: [
              { label: '加班', value: 'overtime' },
              { label: '调休', value: 'leave' }
            ]
          },
          {
            prop: 'remark',
            label: '备注',
            component: 'hzq-input',
            props: { type: 'textarea', rows: 3 }
          },
          { prop: 'contacts', label: '联系电话', component: 'hzq-input' }
        ]
      };
    },
    created() {
      this.loadDetail();
    },
    methods: {
      loadDetail() {
        this.loading = true;
        fetchDetail().then(detail => {
          // 一次性赋值：此时表单还没渲染，后续挂载拿到的就是这份数据
          this.form = {
            title: detail.title,
            hours: detail.hours,
            type: detail.type,
            remark: detail.remark,
            contacts: detail.contacts
          };
          this.loading = false;
        });
      },
      handleSubmit(model) {
        this.message = '已保存：' + JSON.stringify(model);
      },
      handleReset() {
        // 重置回到挂载时的详情值，不是空值
        this.message = '已恢复为原始详情';
      }
    }
  };
</script>

<style>
  .edit-tip {
    margin: 8px 0 0;
    font-size: 13px;
    color: #909399;
  }
</style>
```
:::

在同一个页面里切换编辑对象时，只替换 `model` 是不够的：表单已经挂载过，`hzq-form-item` 记录的初始值还是上一条数据，点重置会跳回上一个对象的值。给 `hzq-form-builder` 加 `:key`，切换时整块重建，初始值随新数据重新快照；记录 id 作为 key 最直观。

:::demo 切换记录时把记录 id 绑到 `:key` 上，重置回到当前对象的详情。
```html
<template>
  <div>
    <div class="record-switch">
      <hzq-radio-group v-model="currentId" @change="switchRecord">
        <hzq-radio-button
          v-for="item in records"
          :key="item.id"
          :label="item.id"
        >{{ item.name }}</hzq-radio-button>
      </hzq-radio-group>
    </div>

    <hzq-form-builder
      :key="currentId"
      v-model="form"
      :fields="fields"
      label-width="88px"
    />
    <p class="edit-tip">当前表单值：{{ JSON.stringify(form) }}</p>
  </div>
</template>

<script>
  const RECORDS = [
    { id: 1, name: '张三', department: '研发部', remark: '第一条' },
    { id: 2, name: '李四', department: '产品部', remark: '第二条' },
    { id: 3, name: '王五', department: '设计部', remark: '第三条' }
  ];

  export default {
    data() {
      return {
        records: RECORDS,
        currentId: 1,
        form: {},
        fields: [
          { prop: 'name', label: '姓名', component: 'hzq-input' },
          {
            prop: 'department',
            label: '部门',
            component: 'hzq-select',
            options: [
              { label: '研发部', value: '研发部' },
              { label: '产品部', value: '产品部' },
              { label: '设计部', value: '设计部' }
            ]
          },
          { prop: 'remark', label: '备注', component: 'hzq-input' }
        ]
      };
    },
    created() {
      this.form = this.toModel(this.currentId);
    },
    methods: {
      toModel(id) {
        const record = RECORDS.filter(item => item.id === id)[0] || {};
        return { name: record.name, department: record.department, remark: record.remark };
      },
      switchRecord(id) {
        this.form = this.toModel(id);
      }
    }
  };
</script>

<style>
  .record-switch {
    margin-bottom: 16px;
  }
  .edit-tip {
    margin: 8px 0 0;
    font-size: 13px;
    color: #909399;
    word-break: break-all;
  }
</style>
```
:::

后端返回的格式经常和组件的值形态对不上，回显前要转一次。常见的三类：时间戳转日期字符串（配合 `value-format`）、数字转金额字符串（`hzq-amount-input` 用字符串保存精度）、接口用 `0/1` 表示布尔。编辑态里有些字段只允许看，用 `disabled` 写死或写成函数都行；`props.readonly` 只会阻止输入，值仍会随表单提交。

:::demo 在加载数据时做格式转换，配置本身保持可序列化。
```html
<template>
  <div>
    <hzq-form-builder
      v-model="form"
      :fields="fields"
      label-width="96px"
    />
    <p class="edit-tip">{{ JSON.stringify(form) }}</p>
  </div>
</template>

<script>
  // 模拟接口返回：字段格式与组件期望的形态不一致
  const DETAIL = {
    launchAt: 1793808000000,   // 时间戳
    budget: 1234.5,            // Number
    urgent: 1,                 // 0 / 1
    creator: '张三'            // 只读
  };

  function pad(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function formatDate(timestamp) {
    const d = new Date(timestamp);
    return [
      d.getFullYear(),
      pad(d.getMonth() + 1),
      pad(d.getDate())
    ].join('-') + ' ' + [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':');
  }

  export default {
    data() {
      return {
        form: {
          // 时间戳 → 'yyyy-MM-dd HH:mm:ss'，与 value-format 对应
          launchAt: formatDate(DETAIL.launchAt),
          // 数字 → 字符串，避免精度问题
          budget: DETAIL.budget.toFixed(2),
          // 0 / 1 → 布尔
          urgent: !!DETAIL.urgent,
          creator: DETAIL.creator
        },
        fields: [
          {
            prop: 'launchAt',
            label: '上线时间',
            component: 'hzq-date-picker',
            props: {
              type: 'datetime',
              valueFormat: 'yyyy-MM-dd HH:mm:ss',
              placeholder: '选择时间'
            }
          },
          {
            prop: 'budget',
            label: '预算',
            component: 'hzq-amount-input',
            props: { precision: 2 }
          },
          { prop: 'urgent', label: '是否加急', component: 'hzq-switch' },
          {
            prop: 'creator',
            label: '创建人',
            component: 'hzq-input',
            // 编辑态只读：看得到、提交时仍带着这个值
            props: { readonly: true }
          }
        ]
      };
    }
  };
</script>

<style>
  .edit-tip {
    margin: 8px 0 0;
    font-size: 13px;
    color: #909399;
    word-break: break-all;
  }
</style>
```
:::

:::warning
上面几个 demo 里的转换函数（`formatDate`、`toFixed`、`!!`）都写在业务侧，不要在 `fields` 里塞函数去改值。`fields` 是配置，可能来自后端、要存库、要跨端复用；把转换逻辑留在加载数据那一步，配置才能保持可序列化。
:::

### 动态构建表单

`fields` 是普通数组，运行中增删元素，表单会立刻重新渲染，不需要重新创建组件实例。`model` 需要自己同步：加字段时补上初始值，删字段时删掉对应键，否则提交的数据里会带着已经不存在的字段。

字段的 `prop` 必须唯一。动态生成的字段建议用递增序号而不是「字段名」，业务名称随时可能重复或改名。

:::demo 从左侧点选字段类型，右侧实时渲染表单并输出配置 JSON。点下方的字段标签可删除。
```html
<template>
  <div class="dynamic-demo">
    <div class="dynamic-demo__palette">
      <span class="dynamic-demo__title">点击添加字段</span>
      <button
        v-for="item in palette"
        :key="item.type"
        type="button"
        class="dynamic-demo__add"
        @click="addField(item)"
      >{{ item.label }}</button>
    </div>

    <div class="dynamic-demo__main">
      <div v-if="fields.length" class="dynamic-demo__chips">
        <span
          v-for="field in fields"
          :key="field.prop"
          class="dynamic-demo__chip"
          @click="removeField(field)"
        >{{ field.label }} ×</span>
      </div>

      <hzq-form-builder
        v-if="fields.length"
        v-model="form"
        :fields="fields"
        label-width="96px"
      />
      <p v-else class="dynamic-demo__empty">还没有字段，从左侧点选添加</p>

      <div v-if="fields.length" class="dynamic-demo__actions">
        <hzq-button size="small" @click="clearFields">清空</hzq-button>
        <hzq-button size="small" type="primary" @click="showConfig">输出配置</hzq-button>
      </div>

      <pre v-if="config" class="dynamic-demo__json">{{ config }}</pre>
    </div>
  </div>
</template>

<script>
  const PALETTE = [
    { type: 'text', label: '单行文本' },
    { type: 'textarea', label: '多行文本' },
    { type: 'number', label: '数字' },
    { type: 'select', label: '下拉选择' },
    { type: 'switch', label: '开关' },
    { type: 'date', label: '日期' }
  ];

  // 每种类型展开成一份字段配置，同时给出初始值
  function buildField(item, seq) {
    const base = {
      prop: 'field' + seq,
      label: item.label + seq,
      component: 'hzq-input',
      defaultValue: ''
    };

    switch (item.type) {
      case 'textarea':
        return Object.assign(base, { props: { type: 'textarea', rows: 3 } });
      case 'number':
        return Object.assign(base, {
          component: 'hzq-input-number',
          defaultValue: 0
        });
      case 'select':
        return Object.assign(base, {
          component: 'hzq-select',
          options: [
            { label: '选项 A', value: 'a' },
            { label: '选项 B', value: 'b' }
          ]
        });
      case 'switch':
        return Object.assign(base, {
          component: 'hzq-switch',
          defaultValue: false
        });
      case 'date':
        return Object.assign(base, {
          component: 'hzq-date-picker',
          props: { type: 'date', valueFormat: 'yyyy-MM-dd' }
        });
      default:
        return base;
    }
  }

  export default {
    data() {
      return {
        palette: PALETTE,
        fields: [],
        form: {},
        seq: 0,
        config: ''
      };
    },
    methods: {
      addField(item) {
        this.seq += 1;
        const field = buildField(item, this.seq);

        this.fields.push(field);
        // model 与 fields 必须同步：新字段没有键，输入框会拿到 undefined
        this.$set(this.form, field.prop, field.defaultValue);
        this.config = '';
      },

      removeField(field) {
        this.fields = this.fields.filter(item => item.prop !== field.prop);
        // 删字段的同时删数据，否则提交时会带上已删除的键
        this.$delete(this.form, field.prop);
        this.config = '';
      },

      clearFields() {
        this.fields = [];
        this.form = {};
        this.config = '';
      },

      showConfig() {
        this.config = JSON.stringify(this.fields, null, 2);
      }
    }
  };
</script>

<style>
  .dynamic-demo {
    display: flex;
    gap: 16px;
    align-items: flex-start;
  }

  .dynamic-demo__palette {
    flex: 0 0 120px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .dynamic-demo__title {
    font-size: 13px;
    color: #909399;
  }

  .dynamic-demo__add {
    padding: 6px 8px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    background: #fff;
    font-size: 13px;
    color: #606266;
    cursor: pointer;
  }

  .dynamic-demo__add:hover {
    border-color: #409eff;
    color: #409eff;
  }

  .dynamic-demo__main {
    flex: 1;
    min-width: 0;
  }

  .dynamic-demo__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
  }

  .dynamic-demo__chip {
    padding: 2px 8px;
    border-radius: 10px;
    background: #f4f4f5;
    font-size: 12px;
    color: #606266;
    cursor: pointer;
  }

  .dynamic-demo__chip:hover {
    background: #fef0f0;
    color: #f56c6c;
  }

  .dynamic-demo__empty {
    margin: 0;
    padding: 24px 0;
    text-align: center;
    font-size: 13px;
    color: #909399;
  }

  .dynamic-demo__actions {
    margin-top: 8px;
  }

  .dynamic-demo__json {
    margin: 12px 0 0;
    padding: 12px;
    background: #f5f7fa;
    border-radius: 4px;
    font-size: 12px;
    line-height: 1.6;
    color: #606266;
    overflow: auto;
    max-height: 240px;
  }
</style>
```
:::

:::tip
**切换字段类型时加 `:key`。** 如果设计器允许把一个字段从「单行文本」改成「多选」，只改 `fields` 里的 `component`，同一个位置的组件实例可能被复用，内部状态会残留。给字段容器或整块表单加 `:key="field.prop + field.component"`，类型变化时强制重建。

另外配置来自后端时，渲染前建议先做一遍检查：`prop` 是否缺失或重复、`component` 是否存在、`defaultValue` 的形态是否和组件匹配。库本身不做这类校验，配错了只会降级成纯文本或收到控制台告警。
:::

### FormBuilder Attributes

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ---------- | -------------- | ---------- | --- | -------- |
| value / v-model | 表单数据。会被就地更新，不产生副本 | object | — | {} |
| fields | 字段配置，每一项渲染一个表单项，详见下方 Field 配置项 | array | — | [] |
| rules | 表单校验规则，按 `prop` 与字段自身规则合并 | object | — | {} |
| field-resolver | 字段解析器，把 `fieldType` 翻译成 `{ component, props, optionComponent }`。返回 `null` 表示不认识 | function(field) | — | — |
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
| component | 字段组件：全局注册的组件名字符串（如 `hzq-select`）或组件对象。不填则交给 `slot` 接管。写了就不走 `field-resolver` | string / object | — | — |
| fieldType | 语义类型，交给 `field-resolver` 解析成组件。`component` 为空时才生效 | string | — | — |
| props | 透传给字段组件的 props。同名项会覆盖 `field-resolver` 返回的预设 | object | — | — |
| defaultValue | 初始值，`createFormModel` 会使用；支持函数形式，每次调用重新求值 | any / function | — | — |
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

### 工具函数

```js
import {
  createFormModel,
  resolveFieldComponent,
  mergeComponentProps
} from 'hzq-ui/src/utils/form-builder';
```

| 函数 | 说明 |
| --- | --- |
| `createFormModel(fields, fieldResolver?)` | 按字段配置生成初始数据对象。`defaultValue` 优先，没写时按组件兜底；跳过 `title` / `divider`；支持嵌套路径与数组下标。返回新对象，不修改 `fields` |
| `resolveFieldComponent(field, fieldResolver?)` | 解析字段该用哪个组件。返回 `{ component, props, optionComponent }` 或 `null`。优先级：`field.component` → `fieldResolver` → `null`。解析器抛错时返回 `null` |
| `mergeComponentProps(presetProps, fieldProps)` | 合并解析器的预设 props 与字段自己的 props，后者覆盖前者 |

这几个函数与 Vue 无关，可以脱离组件单独使用，也便于在业务侧做配置校验、导出等场景复用。
