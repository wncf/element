<template>
  <hzq-form-item
    :prop="field.prop"
    :label="field.label"
    :rules="fieldRules"
    class="hzq-form-builder__field"
  >
    <!-- label 插槽：field.labelSlot 指向使用方的插槽名 -->
    <template v-if="field.labelSlot" slot="label">
      <slot :name="field.labelSlot" :field="field" :model="model"></slot>
    </template>

    <!-- 1. 使用方用插槽整块接管该字段 -->
    <slot
      v-if="field.slot"
      :name="field.slot"
      :field="field"
      :model="model"
      :value="fieldValue"
      :set-value="setFieldValue"
    ></slot>

    <!-- 2. 配置了组件：渲染动态组件，按需带出选项子组件 -->
    <component
      v-else-if="resolvedComponent"
      :is="resolvedComponent"
      v-model="fieldValue"
      v-bind="componentProps"
      v-on="componentListeners"
    >
      <!-- 字段组件内部的插槽（如 hzq-input 的 prefix / append）转发给使用方 -->
      <template v-for="item in forwardedSlots" :slot="item.target">
        <slot
          :name="item.source"
          :field="field"
          :model="model"
          :value="fieldValue"
        ></slot>
      </template>
      <component
        :is="optionComponent"
        v-for="option in normalizedOptions"
        :key="option.value"
        :label="option.label"
        :value="option.value"
        :disabled="option.disabled"
      ></component>
    </component>

    <!-- 3. 什么都没配：原样显示 model 里的值，便于排查配置 -->
    <span v-else class="hzq-form-builder__plain">{{ fieldValue }}</span>

    <div v-if="field.tip" class="hzq-form-builder__tip">{{ field.tip }}</div>
  </hzq-form-item>
</template>

<script>
import FormItem from 'hzq-ui/packages/form-item';
import {
  getValueByPath,
  resolveCondition,
  mergeFieldRules,
  resolveFieldComponent,
  mergeComponentProps,
  resolveOptionComponent,
  normalizeOptions,
  resolveForwardedSlots
} from 'hzq-ui/src/utils/form-builder';

export default {
  name: 'HzqFormBuilderField',

  components: {
    HzqFormItem: FormItem
  },

  props: {
    field: {
      type: Object,
      required: true
    },
    model: {
      type: Object,
      default: () => ({})
    },
    // 表单级 rules，按 prop 取出对应项与本字段的规则合并
    formRules: {
      type: Object,
      default: () => ({})
    },
    // 字段解析器：把 fieldType 这类语义类型翻译成 { component, props, optionComponent }
    fieldResolver: {
      type: Function,
      default: null
    }
  },

  computed: {
    // 直接读写 model：和 hzq-form 共用同一个对象，校验读到的才是最新值
    fieldValue: {
      get() {
        return getValueByPath(this.model, this.field.prop);
      },
      set(value) {
        this.setFieldValue(value);
      }
    },

    // 显式 component 优先，其次交给 fieldResolver 解析，都没有返回空串（渲染成纯文本）
    resolution() {
      return resolveFieldComponent(this.field, this.fieldResolver);
    },

    resolvedComponent() {
      return this.resolution ? this.resolution.component : '';
    },

    optionComponent() {
      // 解析器显式给了选项子组件就用它，否则按组件名查表
      return (this.resolution && this.resolution.optionComponent) ||
        resolveOptionComponent(this.field, this.resolvedComponent);
    },

    normalizedOptions() {
      return normalizeOptions(this.field.options, this.field.optionProps);
    },

    forwardedSlots() {
      return resolveForwardedSlots(this.field.slots);
    },

    fieldRules() {
      return mergeFieldRules(this.field, this.formRules);
    },

    // 事件包一层：把字段上下文作为最后一个参数交给业务，
    // 业务写回调时不用再从闭包里捞 field / model
    componentListeners() {
      const listeners = {};
      const events = this.field.events || {};

      Object.keys(events).forEach(name => {
        const handler = events[name];
        if (typeof handler !== 'function') return;

        listeners[name] = (...args) => handler(...args, this.createEventContext());
      });

      return listeners;
    },

    // disabled 支持函数：随 model 变化实时求值，比在配置里手写 :disabled 更省事
    // props 以解析器返回的预设为底，字段自己的 props 覆盖它
    componentProps() {
      const presetProps = this.resolution ? this.resolution.props : null;
      const props = Object.assign({}, mergeComponentProps(presetProps, this.field.props));
      const disabled = resolveCondition(this.field.disabled, this.model);

      if (disabled || props.disabled) props.disabled = true;

      return props;
    }
  },

  methods: {
    setFieldValue(value) {
      this.$emit('field-change', this.field.prop, value);
    },

    createEventContext() {
      return {
        field: this.field,
        model: this.model,
        prop: this.field.prop,
        value: this.fieldValue
      };
    }
  }
};
</script>
