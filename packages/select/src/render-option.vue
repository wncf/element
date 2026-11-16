<script>
/**
 * 承载 option.render 的函数式组件。
 * 只负责把 (h, option) 的返回值渲染出来，不持有状态。
 */
export default {
  name: 'SelectRenderOption',

  functional: true,

  props: {
    render: {
      type: Function,
      required: true
    },
    option: {
      type: Object,
      required: true
    }
  },

  render(h, ctx) {
    return ctx.props.render(h, ctx.props.option);
  }
};
</script>
