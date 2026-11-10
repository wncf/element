<template>
  <header class="hzq-header" :style="{ height }">
    <slot></slot>
  </header>
</template>

<script>
  export default {
    name: 'HzqHeader',

    componentName: 'HzqHeader',

    props: {
      height: {
        type: String,
        default: '60px'
      }
    }
  };
</script>
