<template>
  <li class="hzq-menu-item-group">
    <div class="hzq-menu-item-group__title" :style="{paddingLeft: levelPadding + 'px'}">
      <template v-if="!$slots.title">{{title}}</template>
      <slot v-else name="title"></slot>
    </div>
    <ul>
      <slot></slot>
    </ul>
  </li>
</template>
<script>
  export default {
    name: 'HzqMenuItemGroup',

    componentName: 'HzqMenuItemGroup',

    inject: ['rootMenu'],
    props: {
      title: {
        type: String
      }
    },
    data() {
      return {
        paddingLeft: 20
      };
    },
    computed: {
      levelPadding() {
        let padding = 20;
        let parent = this.$parent;
        if (this.rootMenu.collapse) return 20;
        while (parent && parent.$options.componentName !== 'HzqMenu') {
          if (parent.$options.componentName === 'HzqSubmenu') {
            padding += 20;
          }
          parent = parent.$parent;
        }
        return padding;
      }
    }
  };
</script>

