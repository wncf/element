<script>
export default {
  name: 'DialogRenderFn',

  functional: true,

  props: {
    render: {
      type: Function,
      required: true
    }
  },

  render(h, ctx) {
    return ctx.props.render(h);
  }
};
</script>
