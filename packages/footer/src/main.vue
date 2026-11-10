<template>
  <footer class="hzq-footer" :style="{ height }">
    <slot></slot>
  </footer>
</template>

<script>
  export default {
    name: 'HzqFooter',

    componentName: 'HzqFooter',

    props: {
      height: {
        type: String,
        default: '60px'
      }
    }
  };
</script>
