<script>
  import Emitter from 'hzq-ui/src/mixins/emitter';

  export default {
    name: 'HzqCheckboxGroup',

    componentName: 'HzqCheckboxGroup',

    mixins: [Emitter],

    inject: {
      elFormItem: {
        default: ''
      }
    },

    props: {
      value: {},
      disabled: Boolean,
      min: Number,
      max: Number,
      size: String,
      fill: String,
      textColor: String
    },

    computed: {
      _elFormItemSize() {
        return (this.elFormItem || {}).elFormItemSize;
      },
      checkboxGroupSize() {
        return this.size || this._elFormItemSize || (this.$HZQ || {}).size;
      }
    },

    watch: {
      value(value) {
        this.dispatch('HzqFormItem', 'el.form.change', [value]);
      }
    }
  };
</script>

<template>
  <div class="hzq-checkbox-group" role="group" aria-label="checkbox-group">
    <slot></slot>
  </div>
</template>
