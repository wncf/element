<template>
  <svg
    class="hzq-svg-icon"
    :class="svgClass"
    :style="svgStyle"
    :width="size"
    :height="size"
    aria-hidden="true"
    v-on="$listeners"
  >
    <!--
      方案 A：走 svg-sprite。
      使用方用 svg-sprite-loader 把 svg 打成 symbol（symbolId: 'icon-[name]'），
      这里用 <use> 引用，构建配置无需改造。
    -->
    <use :xlink:href="symbolId" />
  </svg>
</template>

<script>
export default {
  name: 'HzqSvgIcon',

  props: {
    // 完整图标名，例如 'crm-base-arrow'
    name: {
      type: String,
      required: true
    },
    // 尺寸，默认 1em 跟随父级字号
    size: {
      type: [String, Number],
      default: '1em'
    },
    // 额外类名
    className: {
      type: String,
      default: ''
    },
    // 覆盖颜色，默认跟随 currentColor
    color: {
      type: String,
      default: ''
    }
  },

  computed: {
    // sprite 的 symbol id 约定：icon-[name]
    symbolId() {
      return `#icon-${this.name}`;
    },

    svgClass() {
      return this.className || '';
    },

    svgStyle() {
      return this.color ? { color: this.color } : {};
    }
  }
};
</script>

<style>
.hzq-svg-icon {
  width: 1em;
  height: 1em;
  fill: currentColor;
  overflow: hidden;
  vertical-align: -0.15em;
}
</style>
