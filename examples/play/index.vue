<template>
  <component-preview />
</template>

<script>
import ComponentPreview from './components/ComponentPreview.vue'

export default {
  components: {
    ComponentPreview
  },

  // playground 需要 html/body/#app 撑满且不滚动，这套规则会污染全站，
  // 所以只在进入 playground 时挂上，离开时摘掉
  mounted() {
    this.togglePlaygroundClass(true)
  },

  beforeDestroy() {
    this.togglePlaygroundClass(false)
  },

  methods: {
    togglePlaygroundClass(active) {
      const method = active ? 'add' : 'remove'
      document.documentElement.classList[method]('is-playground')
      document.body.classList[method]('is-playground')
      const app = document.getElementById('app')
      if (app) app.classList[method]('is-playground')
    }
  }
}
</script>

<style>
/* 只在 playground 内生效：加上 .is-playground 前缀后，
   文档站其余页面不会再被 height:100% + overflow:hidden 锁死滚动 */
html.is-playground,
body.is-playground,
#app.is-playground {
  height: 100%;
  margin: 0;
  overflow: hidden;
}

/* 底色与文字跟着主题 token 走，否则切到深色后页面会露出白底 */
body.is-playground {
  background: var(--hzq-bg-color-page);
  color: var(--hzq-text-color-primary);
}
</style>
