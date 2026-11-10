<template>
  <transition name="hzq-loading-fade" @after-leave="handleAfterLeave">
    <div
      v-show="visible"
      class="hzq-loading-mask"
      :style="{ backgroundColor: background || '' }"
      :class="[customClass, { 'is-fullscreen': fullscreen }]">
      <div class="hzq-loading-spinner">
        <svg v-if="!spinner" class="circular" viewBox="25 25 50 50">
          <circle class="path" cx="50" cy="50" r="20" fill="none"/>
        </svg>
        <i v-else :class="spinner"></i>
        <p v-if="text" class="hzq-loading-text">{{ text }}</p>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    data() {
      return {
        text: null,
        spinner: null,
        background: null,
        fullscreen: true,
        visible: false,
        customClass: ''
      };
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
