<template>
  <div
    :class="inputClass"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <!--
      不套 hzq-input：金额要在每次按键后就地过滤。包一层的话，el-input 会先按原文
      吐一次 input、自己把 DOM 值写回去，外层再纠正就成了"两次改 DOM、两次 emit"，
      光标位置、组字和重复事件都会乱。这里参照 hzq-input 的实现，直接持有原生 input，
      由组件自己决定框里显示什么、什么时候抛值。
    -->
    <input
      ref="input"
      class="hzq-input__inner"
      type="text"
      inputmode="decimal"
      :disabled="inputDisabled"
      :readonly="readonly"
      :autocomplete="autocomplete"
      :tabindex="tabindex"
      :placeholder="placeholder"
      :aria-label="label"
      v-bind="$attrs"
      @compositionstart="handleCompositionStart"
      @compositionend="handleCompositionEnd"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
    >
    <span class="hzq-input__prefix" v-if="$slots.prefix || prefixIcon">
      <slot name="prefix"></slot>
      <i class="hzq-input__icon" v-if="prefixIcon" :class="prefixIcon"></i>
    </span>
    <span class="hzq-input__suffix" v-if="suffixVisible">
      <span class="hzq-input__suffix-inner">
        <template v-if="!showClear">
          <slot name="suffix"></slot>
          <i class="hzq-input__icon" v-if="suffixIcon" :class="suffixIcon"></i>
        </template>
        <i
          v-if="showClear"
          class="hzq-input__icon hzq-icon-circle-close hzq-input__clear"
          @mousedown.prevent
          @click="clear"
        ></i>
      </span>
      <i
        v-if="validateState && needStatusIcon"
        class="hzq-input__icon hzq-input__validateIcon"
        :class="validateIcon"
      ></i>
    </span>
  </div>
</template>

<script>
import emitter from 'hzq-ui/src/mixins/emitter';
import {
  DEFAULT_PRECISION,
  sanitizeAmount,
  clampAmount,
  normalizeAmount
} from 'hzq-ui/src/utils/amount';

export default {
  name: 'HzqAmountInput',

  mixins: [emitter],

  // 原生 input 自己接 $attrs（maxlength / name / aria-* 等），根节点只负责合并类名
  inheritAttrs: false,

  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },

  props: {
    // 空串表示没填。统一用字符串：金额用 Number 往返会丢精度
    value: {
      type: [String, Number],
      default: ''
    },
    // 保留几位小数，0 表示只收整数
    precision: {
      type: Number,
      default: DEFAULT_PRECISION,
      validator: val => val >= 0 && val <= 20 && val === Math.floor(val)
    },
    // 未显式传 min 时，由 allowNegative 决定下限（禁止负数即下限 0）
    min: {
      type: Number,
      default: null
    },
    max: {
      type: Number,
      default: Infinity
    },
    // 默认不允许输入负数
    allowNegative: {
      type: Boolean,
      default: false
    },
    placeholder: String,
    disabled: Boolean,
    readonly: Boolean,
    size: String,
    clearable: {
      type: Boolean,
      default: false
    },
    prefixIcon: String,
    suffixIcon: String,
    tabindex: String,
    label: String,
    autocomplete: {
      type: String,
      default: 'off'
    },
    validateEvent: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      // 编辑中的原文；null 表示"不在编辑"，此时显示规范化后的值
      userInput: null,
      // 获得焦点时的文本，用于判断失焦后是否真的发生了变化
      valueOnFocus: '',
      // 最近一次由本组件发出的值，用来区分"自己发的"和"外部改的"
      lastEmitted: null,
      hovering: false,
      focused: false,
      // 输入法组字期间不能改写输入框内容，否则拼音会被打断
      isComposing: false,
      // mounted 之前的同步只做规范化，不触发校验，避免页面一加载就报错
      synced: false
    };
  },

  computed: {
    constraint() {
      return {
        precision: this.precision,
        min: this.resolvedMin,
        max: this.max,
        allowNegative: this.allowNegative
      };
    },

    // allowNegative=false 时最小值为 0，哪怕调用方传了 min=-100 也以"禁止负数"为准
    resolvedMin() {
      if (this.allowNegative) {
        return this.min === null ? -Infinity : this.min;
      }

      return this.min === null ? 0 : Math.max(this.min, 0);
    },

    displayValue() {
      if (this.userInput !== null) return this.userInput;

      return normalizeAmount(this.value, this.constraint);
    },

    inputClass() {
      return [
        'hzq-input',
        'hzq-amount-input',
        this.inputSize ? `hzq-input--${this.inputSize}` : '',
        {
          'is-disabled': this.inputDisabled,
          'hzq-input--prefix': this.$slots.prefix || this.prefixIcon,
          'hzq-input--suffix': this.suffixVisible
        }
      ];
    },

    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize;
    },

    inputSize() {
      return this.size || this._elFormItemSize || (this.$HZQ || {}).size;
    },

    inputDisabled() {
      return this.disabled || !!(this.elForm || {}).disabled;
    },

    validateState() {
      return this.elFormItem ? this.elFormItem.validateState : '';
    },

    needStatusIcon() {
      return this.elForm ? this.elForm.statusIcon : false;
    },

    validateIcon() {
      return {
        validating: 'hzq-icon-loading',
        success: 'hzq-icon-circle-check',
        error: 'hzq-icon-circle-close'
      }[this.validateState];
    },

    showClear() {
      return this.clearable &&
        !this.inputDisabled &&
        !this.readonly &&
        this.displayValue !== '' &&
        (this.focused || this.hovering);
    },

    suffixVisible() {
      return this.$slots.suffix ||
        this.suffixIcon ||
        this.showClear ||
        (this.validateState && this.needStatusIcon);
    }
  },

  watch: {
    value: {
      immediate: true,
      handler(value) {
        // 自己 emit 出去的值会原样回来，此时不能清掉编辑态，
        // 否则每敲一个键都会被补齐成 "12.50"，光标和输入都会乱
        if (this.toText(value) === this.lastEmitted) return;

        this.userInput = null;
        this.syncValue(value);

        if (this.synced) this.notifyFormChange();
      }
    },
    // 和 hzq-input 一样自己写回原生值。直接给 input 绑 :value 的话，
    // 组字过程中一旦触发重渲染，Vue 会把输入法里的拼音整段抹掉
    displayValue() {
      this.$nextTick(() => this.setNativeInputValue());
    },
    // 精度或范围变了要重新收敛，否则会停在按旧规则算出来的文本上
    constraint() {
      this.userInput = null;
      this.syncValue(this.value);
    }
  },

  mounted() {
    this.synced = true;
    this.setNativeInputValue();
  },

  methods: {
    // 外部传入的值可能不满足 precision 或范围（如 '12'、'-5'），先规范化再回写。
    // 只在真的变了才 emit，避免一挂载就无谓地触发一次表单校验。
    syncValue(value) {
      const normalized = normalizeAmount(value, this.constraint);
      if (normalized === this.toText(value)) return;

      this.emitInput(normalized);
    },

    emitInput(value) {
      this.lastEmitted = value;
      this.$emit('input', value);
    },

    notifyFormChange(value = this.displayValue) {
      if (this.validateEvent) {
        this.dispatch('HzqFormItem', 'el.form.change', [value]);
      }
    },

    toText(value) {
      return value === null || value === undefined ? '' : String(value);
    },

    setNativeInputValue() {
      const input = this.$refs.input;
      if (!input || input.value === this.displayValue) return;

      input.value = this.displayValue;
    },

    handleFocus(event) {
      this.focused = true;
      this.valueOnFocus = this.displayValue;
      this.$emit('focus', event);
    },

    handleBlur(event) {
      const editing = this.userInput === null ? this.toText(this.value) : this.userInput;
      const normalized = normalizeAmount(editing, this.constraint);
      const current = this.toText(this.value);

      this.focused = false;
      this.userInput = null;

      // 编辑态不补齐小数，失焦才补齐，所以这里要把补齐后的值写回去
      if (normalized !== current) {
        this.emitInput(normalized);
        this.notifyFormChange(normalized);
      }

      if (normalized !== this.valueOnFocus) this.$emit('change', normalized);

      if (this.validateEvent) this.dispatch('HzqFormItem', 'el.form.blur', [normalized]);

      this.$emit('blur', event);
    },

    handleInput(event) {
      if (this.isComposing) return;

      const input = event.target;
      const raw = input.value;
      const caret = input.selectionStart;
      const next = clampAmount(sanitizeAmount(raw, this.constraint), this.constraint);

      this.userInput = next;
      this.emitInput(next);
      this.notifyFormChange(next);

      // 被过滤掉的字符会让输入框停在非法文本上，必须当场改回去；
      // 改完光标会跑到末尾，所以再按"合法前缀"的长度把光标放回来
      if (next !== raw) {
        input.value = next;
        if (input === document.activeElement) {
          const position = this.resolveCaret(raw, caret, next);
          input.setSelectionRange(position, position);
        }
      }
    },

    // 组字期间拿到的是拼音而不是数字，等 compositionend 再统一清洗一次
    handleCompositionStart(event) {
      this.isComposing = true;
      this.$emit('compositionstart', event);
    },

    handleCompositionEnd(event) {
      this.$emit('compositionend', event);

      if (this.isComposing) {
        this.isComposing = false;
        this.handleInput(event);
      }
    },

    // 前缀清洗完还剩多长，光标就落在哪里；整体被收敛过（如 1005→1000）则落到末尾
    resolveCaret(raw, caret, next) {
      if (caret === null || caret === undefined) return next.length;

      const cleanedPrefix = sanitizeAmount(raw.slice(0, caret), this.constraint);
      if (next.indexOf(cleanedPrefix) === 0) return cleanedPrefix.length;

      return next.length;
    },

    clear() {
      this.userInput = null;
      this.emitInput('');
      this.notifyFormChange('');
      this.$emit('change', '');
      this.$emit('clear');
    },

    focus() {
      if (this.$refs.input) this.$refs.input.focus();
    },

    blur() {
      if (this.$refs.input) this.$refs.input.blur();
    },

    select() {
      if (this.$refs.input) this.$refs.input.select();
    }
  }
};
</script>
