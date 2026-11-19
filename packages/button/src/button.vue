<template>
  <button
    class="hzq-button"
    @click="handleClick"
    :disabled="buttonDisabled || loading"
    :autofocus="autofocus"
    :type="nativeType"
    :class="[
      type ? 'hzq-button--' + type : '',
      buttonSize ? 'hzq-button--' + buttonSize : '',
      {
        'is-disabled': buttonDisabled,
        'is-loading': loading,
        'is-plain': plain,
        'is-round': round,
        'is-circle': circle
      }
    ]"
  >
    <i class="hzq-icon-loading" v-if="loading"></i>
    <i :class="icon" v-if="icon && !loading"></i>
    <span v-if="$slots.default"><slot></slot></span>
  </button>
</template>
<script>
  export default {
    name: 'HzqButton',

    inject: {
      elForm: {
        default: ''
      },
      elFormItem: {
        default: ''
      }
    },

    props: {
      type: {
        type: String,
        default: 'default'
      },
      size: String,
      icon: {
        type: String,
        default: ''
      },
      nativeType: {
        type: String,
        default: 'button'
      },
      loading: Boolean,
      disabled: Boolean,
      plain: Boolean,
      autofocus: Boolean,
      round: Boolean,
      circle: Boolean
    },

    computed: {
      _elFormItemSize() {
        return (this.elFormItem || {}).elFormItemSize;
      },
      buttonSize() {
        return this.size || this._elFormItemSize || (this.$HZQ || {}).size;
      },
      buttonDisabled() {
        return this.$options.propsData.hasOwnProperty('disabled') ? this.disabled : (this.elForm || {}).disabled;
      }
    },

    methods: {
      handleClick(evt) {
        // 原生 disabled 只在事件命中元素自身时才阻断；点击子元素后冒泡上来的
        // click 仍会走到这里。样式里的 pointer-events: none 只能拦住真实指针，
        // 程序化 dispatch 的 click 不经过命中测试，所以这里再守一道。
        if (this.buttonDisabled || this.loading) return;
        this.$emit('click', evt);
      }
    }
  };
</script>
