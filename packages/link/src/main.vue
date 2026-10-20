<template>
  <a
    :class="[
      'el-link',
      type ? `el-link--${type}` : '',
      disabled && 'is-disabled',
      loading && 'is-loading',
      underline && !disabled && !loading && 'is-underline'
    ]"
    :href="(disabled || loading) ? null : href"
    v-bind="$attrs"
    @click="handleClick"
  >

    <i class="el-icon-loading" v-if="loading"></i>
    <i :class="icon" v-if="icon && !loading"></i>

    <span v-if="$slots.default" class="el-link--inner">
      <slot></slot>
    </span>

    <template v-if="!loading && $slots.icon"><slot name="icon"></slot></template>
  </a>
</template>

<script>

export default {
  name: 'ElLink',

  props: {
    type: {
      type: String,
      default: 'default'
    },
    underline: {
      type: Boolean,
      default: true
    },
    disabled: Boolean,
    loading: Boolean,
    href: String,
    icon: String
  },

  methods: {
    handleClick(event) {
      if (!this.disabled && !this.loading) {
        if (!this.href) {
          this.$emit('click', event);
        }
      }
    }
  }
};
</script>
