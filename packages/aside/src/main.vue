<template>
  <aside class="hzq-aside" :style="{ width }">
    <slot></slot>
  </aside>
</template>

<script>
  export default {
    name: 'HzqAside',

    componentName: 'HzqAside',

    props: {
      width: {
        type: String,
        default: '300px'
      }
    }
  };
</script>
