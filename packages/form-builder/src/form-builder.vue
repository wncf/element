<template>
  <hzq-form
    ref="form"
    class="hzq-form-builder"
    :model="formModel"
    :rules="rules"
    :label-width="labelWidth"
    :label-position="labelPosition"
    :label-suffix="labelSuffix"
    :inline="inline"
    :inline-message="inlineMessage"
    :status-icon="statusIcon"
    :hide-required-asterisk="hideRequiredAsterisk"
    :validate-on-rule-change="validateOnRuleChange"
    :size="size"
    :disabled="disabled"
    :show-message="showMessage"
  >
    <div
      v-for="(row, rowIndex) in rows"
      :key="rowIndex"
      class="hzq-form-builder__row"
      :style="rowStyle"
    >
      <div
        v-for="field in row"
        :key="field.key"
        class="hzq-form-builder__col"
        :style="colStyle(field)"
      >
        <!-- 分组标题：只做展示，不参与数据与校验 -->
        <div v-if="field.type === 'title'" class="hzq-form-builder__title">
          <slot :name="field.slot || 'title'" :field="field">{{ field.label }}</slot>
        </div>

        <hzq-divider
          v-else-if="field.type === 'divider'"
          class="hzq-form-builder__divider"
          :content-position="field.contentPosition || 'left'"
        >{{ field.label }}</hzq-divider>

        <form-field
          v-else-if="!isHidden(field)"
          :field="field"
          :model="formModel"
          :form-rules="rules"
          @field-change="handleFieldChange"
        >
          <!--
            把使用方给这个字段准备的插槽转进 form-field：
            字段插槽、label 插槽、以及要转给字段组件的插槽，都是按名字取的，
            所以只能在这里用 v-for 动态拼。每个 form-field 只会拿到自己那几个。
          -->
          <template
            v-for="name in resolveSlots(field)"
            :slot="name"
            slot-scope="scope"
          >
            <slot :name="name" v-bind="scope"></slot>
          </template>
        </form-field>
      </div>
    </div>

    <div v-if="showActions" class="hzq-form-builder__actions">
      <hzq-button type="primary" :loading="loading" @click="handleSubmit">{{ submitText }}</hzq-button>
      <hzq-button @click="handleReset">{{ resetText }}</hzq-button>
    </div>
  </hzq-form>
</template>

<script>
import Form from 'hzq-ui/packages/form';
import Button from 'hzq-ui/packages/button';
import Divider from 'hzq-ui/packages/divider';
import FormField from './form-field.vue';
import {
  normalizeFields,
  resolveCondition,
  resolveForwardedSlots,
  setValueByPath
} from 'hzq-ui/src/utils/form-builder';

/**
 * 配置驱动的表单构建器。
 *
 *   <hzq-form-builder v-model="form" :fields="fields" show-actions @submit="save" />
 *
 * 字段配置（fields 数组的每一项）：
 *   prop         String   对应 model 的路径，支持 'a.b'、'list[0].id'
 *   label        String   标签文案
 *   component    String|Object  字段组件：全局注册的名字（'hzq-amount-input'）或组件对象。
 *                            不填则交给 slot 接管
 *   props        Object   透传给字段组件的 props
 *   events       Object   事件名 → 处理函数，回调最后会多收到一个 ctx
 *                        （{ field, model, prop, value }）
 *   slots        Array|Object  转给字段组件的插槽：['prefix'] 或 { prefix: 'myPrefix' }
 *                        （前者目标插槽名与使用方同名，后者可映射到别的名字）
 *   options      Array    选项数据，按组件自动渲染 hzq-option / hzq-radio / hzq-checkbox
 *   optionProps  Object   选项字段映射 { label, value, disabled }，用于对接接口数据
 *   required     Boolean  自动生成必填规则（文案「{label}不能为空」）
 *   rules        Array    校验规则，与 required、表单级 rules 合并后生效
 *   span         Number   24 栅格占位（columns 为空时生效）
 *   hidden       Boolean|Function(model)  不渲染，但保留 model 里的值
 *   disabled     Boolean|Function(model)
 *   tip          String   字段下方的说明文字
 *   type         String   'field'（默认）| 'title' 分组标题 | 'divider' 分隔线
 *   slot         String   用使用方的哪个插槽渲染这个字段（优先级最高）
 *   labelSlot    String   用使用方的哪个插槽渲染 label
 *
 * 约定：v-model 传入的对象会被就地更新（和 hzq-form 的 model 是同一个引用），
 * 不产生副本 —— 校验读的就是这个对象，拷一份会让字段值与校验时机差一个 tick。
 */
export default {
  name: 'HzqFormBuilder',

  components: {
    HzqForm: Form,
    HzqButton: Button,
    HzqDivider: Divider,
    FormField
  },

  props: {
    // 表单数据
    value: {
      type: Object,
      default: () => ({})
    },
    // 字段配置
    fields: {
      type: Array,
      default: () => []
    },
    // 透传给 hzq-form 的常用项
    labelWidth: String,
    labelPosition: String,
    labelSuffix: {
      type: String,
      default: ''
    },
    inline: Boolean,
    inlineMessage: Boolean,
    statusIcon: Boolean,
    hideRequiredAsterisk: {
      type: Boolean,
      default: false
    },
    validateOnRuleChange: {
      type: Boolean,
      default: true
    },
    size: String,
    disabled: Boolean,
    showMessage: {
      type: Boolean,
      default: true
    },
    rules: {
      type: Object,
      default: () => ({})
    },
    // 一行几列。填了就按等分栅格排版，忽略字段上的 span
    columns: {
      type: Number,
      default: 0
    },
    gutter: {
      type: Number,
      default: 0
    },
    // 底部提交 / 重置按钮
    showActions: {
      type: Boolean,
      default: false
    },
    submitText: {
      type: String,
      default: '提交'
    },
    resetText: {
      type: String,
      default: '重置'
    },
    loading: Boolean
  },

  computed: {
    formModel() {
      return this.value;
    },

    defaultSpan() {
      return this.columns > 0 ? 24 / this.columns : 24;
    },

    rowStyle() {
      return this.gutter
        ? { marginLeft: `-${this.gutter / 2}px`, marginRight: `-${this.gutter / 2}px` }
        : {};
    },

    // 把字段累计成行，让「一行两列」这类布局不用手写 hzq-row / hzq-col。
    // 指定 columns 时按个数切分（24 除不尽时按个数更准），否则按 span 累计到 24
    rows() {
      const rows = [];
      let current = [];
      let used = 0;

      this.normalizedFields.forEach(field => {
        const span = this.spanOf(field);

        if (field.type === 'title' || field.type === 'divider' || span >= 24) {
          if (current.length) rows.push(current);
          rows.push([field]);
          current = [];
          used = 0;
          return;
        }

        const overflow = this.columns > 0
          ? current.length >= this.columns
          : used + span > 24;

        if (current.length && overflow) {
          rows.push(current);
          current = [];
          used = 0;
        }

        current.push(field);
        used += span;
      });

      if (current.length) rows.push(current);

      return rows;
    },

    normalizedFields() {
      return normalizeFields(this.fields);
    }
  },

  methods: {
    spanOf(field) {
      if (this.columns > 0) return this.defaultSpan;

      return field.span > 0 ? Math.min(field.span, 24) : 24;
    },

    colStyle(field) {
      const span = this.spanOf(field);
      const style = { width: `${(span / 24) * 100}%` };

      if (this.gutter) {
        style.paddingLeft = `${this.gutter / 2}px`;
        style.paddingRight = `${this.gutter / 2}px`;
      }

      if (field.type === 'title' || field.type === 'divider') style.width = '100%';

      return style;
    },

    isHidden(field) {
      return resolveCondition(field.hidden, this.formModel);
    },

    resolveSlots(field) {
      // 需要从使用方透下来的插槽名：整块接管字段的 slot、
      // 自定义 label 的 labelSlot、以及要转进字段组件的那些。
      // 去重是因为同一个名字可能被重复引用（如 prefix 与 labelSlot 同名）。
      const names = [];

      if (field.slot) names.push(field.slot);
      if (field.labelSlot) names.push(field.labelSlot);
      resolveForwardedSlots(field.slots).forEach(item => names.push(item.source));

      return names.filter((name, index) => names.indexOf(name) === index);
    },

    handleFieldChange(prop, value) {
      if (!prop) return;

      setValueByPath(this.formModel, prop, value, this);
      this.$emit('field-change', prop, value, this.formModel);
    },

    // —— 以下方法把 hzq-form 的实例方法透出去，调用方不用自己找 ref ——

    validate(callback) {
      return this.$refs.form.validate(callback);
    },

    validateField(props, callback) {
      return this.$refs.form.validateField(props, callback);
    },

    resetFields() {
      return this.$refs.form.resetFields();
    },

    clearValidate(props) {
      return this.$refs.form.clearValidate(props);
    },

    // 提交前先校验：调用方收到 submit 时数据一定合法，
    // 不合法单独抛 invalid，方便只做一次提示
    handleSubmit() {
      return this.validate(valid => {
        if (valid) {
          this.$emit('submit', this.formModel);
        } else {
          this.$emit('invalid');
        }
      });
    },

    handleReset() {
      this.resetFields();
      this.$emit('reset', this.formModel);
    }
  }
};
</script>
