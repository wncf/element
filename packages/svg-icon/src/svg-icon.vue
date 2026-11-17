<template>
  <svg
    class="hzq-svg-icon"
    :class="svgClass"
    :style="svgStyle"
    aria-hidden="true"
    v-on="$listeners"
  >
    <!--
      两种来源最终都产出 id 为 icon-[name] 的 symbol：
      - svg-sprite-loader 构建期注入（只传图标名数组）
      - registerSvgIcons 运行期注入（传 { 名称: svg 内容 }）
    -->
    <use :xlink:href="symbolId" />
  </svg>
</template>

<script>
import { ensureSvgIconInjected } from './registry';

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
      const style = {};
      // 尺寸必须走行内样式：CSS 里的 width/height 会覆盖 svg 的 width/height 属性
      if (this.size !== null && this.size !== undefined && this.size !== '') {
        const value = typeof this.size === 'number' ? `${this.size}px` : this.size;
        style.width = value;
        style.height = value;
      }
      if (this.color) {
        style.color = this.color;
      }
      return style;
    }
  },

  mounted() {
    // 兜底：若注册发生在 body 尚未可用时，这里补注入一次
    ensureSvgIconInjected(this.name);
  },

  watch: {
    name(val) {
      ensureSvgIconInjected(val);
    }
  }
};
</script>
