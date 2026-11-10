<template>
  <div class="hzq-page-header">
    <div class="hzq-page-header__left" @click="$emit('back')">
      <i class="hzq-icon-back"></i>
      <div class="hzq-page-header__title">
        <slot name="title">{{ title }}</slot>
      </div>
    </div>
    <div class="hzq-page-header__content">
      <slot name="content">{{ content }}</slot>
    </div>
  </div>
</template>

<script>
import { t } from 'hzq-ui/src/locale';
export default {
  name: 'HzqPageHeader',

  props: {
    title: {
      type: String,
      default() {
        return t('el.pageHeader.title');
      }
    },
    content: String
  }
};
</script>
