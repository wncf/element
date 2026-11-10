<template>
  <i :class="'hzq-icon-' + name"></i>
</template>

<script>
  export default {
    name: 'HzqIcon',

    props: {
      name: String
    }
  };
</script>
