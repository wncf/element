<template>
  <component-preview />
</template>

<script>
import ComponentPreview from './components/ComponentPreview.vue'

export default {
  components: {
    ComponentPreview
  }
}
</script>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
  overflow: hidden;
}

/* 底色与文字跟着主题 token 走，否则切到深色后页面会露出白底 */
body {
  background: var(--el-bg-color-page);
  color: var(--el-text-color-primary);
}
</style>
