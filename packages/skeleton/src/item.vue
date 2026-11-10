<template>
  <div :class="['hzq-skeleton__item', `hzq-skeleton__${variant}`]">
    <img-placeholder v-if="variant === 'image'" />
  </div>
</template>

<script>
  import ImgPlaceholder from './img-placeholder';

  export default {
    name: 'HzqSkeletonItem',
    props: {
      variant: {
        type: String,
        default: 'text'
      }
    },
    components: {
      [ImgPlaceholder.name]: ImgPlaceholder
    }
  };
</script>