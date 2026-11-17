<template>
  <transition name="hzq-loading-fade" @after-leave="handleAfterLeave">
    <div
      v-show="visible"
      class="hzq-loading-mask"
      :style="{ backgroundColor: background || '' }"
      :class="[customClass, { 'is-fullscreen': fullscreen }]">
      <div class="hzq-loading-spinner">
        <svg v-if="!spinner && !spinnerComponent" class="circular" viewBox="25 25 50 50">
          <circle class="path" cx="50" cy="50" r="20" fill="none"/>
        </svg>
        <i v-else-if="spinner" :class="spinner"></i>
        <component
          v-else
          :is="spinnerComponent"
          v-bind="componentProps"/>
        <p v-if="text" class="hzq-loading-text">{{ text }}</p>
      </div>
    </div>
  </transition>
</template>

<script>
  import { getConfig } from './config';

  export default {
    data() {
      return {
        text: null,
        spinner: null,
        spinnerComponent: null,
        spinnerProps: {},
        size: null,
        color: null,
        background: null,
        fullscreen: true,
        visible: false,
        customClass: ''
      };
    },

    computed: {
      componentProps() {
        const props = Object.assign({}, this.spinnerProps);
        if (this.size !== undefined && this.size !== null && this.size !== '') {
          props.size = this.size;
        }
        if (this.color) {
          props.color = this.color;
        }
        return props;
      }
    },

    created() {
      const config = getConfig();
      if (!this.spinnerComponent) {
        this.spinnerComponent = config.spinnerComponent;
      }
      this.spinnerProps = Object.assign({}, config.spinnerProps, this.spinnerProps);
    },

    methods: {
      handleAfterLeave() {
        this.$emit('after-leave');
      },
      setText(text) {
        this.text = text;
      }
    }
  };
</script>
