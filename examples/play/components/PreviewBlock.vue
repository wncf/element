<template>
  <section :id="sectionId" class="preview-block">
    <div class="preview-block__header">
      <h3 class="preview-block__title">{{ title }}</h3>
      <span v-if="tag" class="preview-block__tag">{{ tag }}</span>
    </div>
    <div class="preview-block__body">
      <slot />
    </div>
  </section>
</template>

<script>
export default {
  name: 'PreviewBlock',

  props: {
    sectionId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    tag: {
      type: String,
      default: ''
    }
  }
}
</script>
