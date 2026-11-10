<template>
  <ul class="hzq-select-group__wrap" v-show="visible">
    <li class="hzq-select-group__title">{{ label }}</li>
    <li>
      <ul class="hzq-select-group">
        <slot></slot>
      </ul>
    </li>
  </ul>
</template>

<script type="text/babel">
  import Emitter from 'hzq-ui/src/mixins/emitter';

  export default {
    mixins: [Emitter],

    name: 'HzqOptionGroup',

    componentName: 'HzqOptionGroup',

    props: {
      label: String,
      disabled: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        visible: true
      };
    },

    watch: {
      disabled(val) {
        this.broadcast('HzqOption', 'handleGroupDisabled', val);
      }
    },

    methods: {
      queryChange() {
        this.visible = this.$children &&
          Array.isArray(this.$children) &&
          this.$children.some(option => option.visible === true);
      }
    },

    created() {
      this.$on('queryChange', this.queryChange);
    },

    mounted() {
      if (this.disabled) {
        this.broadcast('HzqOption', 'handleGroupDisabled', this.disabled);
      }
    }
  };
</script>
