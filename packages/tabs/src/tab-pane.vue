<template>
  <div
    class="hzq-tab-pane"
    v-if="shouldRender"
    v-show="active"
    role="tabpanel"
    :aria-hidden="!active"
    :id="`pane-${paneName}`"
    :aria-labelledby="`tab-${paneName}`"
  >
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name: 'HzqTabPane',

    componentName: 'HzqTabPane',

    props: {
      label: String,
      labelContent: Function,
      name: String,
      closable: Boolean,
      disabled: Boolean,
      // 面板内容的加载策略：
      //   once  默认。只在激活期间挂载，切走即销毁，每次进入都是全新的面板
      //   lazy  首次激活时挂载，之后一直保留（切走不销毁，状态不丢）
      //   all   首屏就全部挂载，之后靠 v-show 切换
      load: {
        type: String,
        default: 'once',
        validator: value => ['once', 'lazy', 'all'].indexOf(value) !== -1
      }
    },

    data() {
      return {
        index: null,
        loaded: false
      };
    },

    computed: {
      isClosable() {
        return this.closable || this.$parent.closable;
      },
      active() {
        const active = this.$parent.currentName === (this.name || this.index);
        if (active) {
          this.loaded = true;
        }
        return active;
      },
      shouldRender() {
        if (this.load === 'lazy') return this.active || this.loaded;
        if (this.load === 'all') return true;
        return this.active;
      },
      paneName() {
        return this.name || this.index;
      }
    },

    updated() {
      this.$parent.$emit('tab-nav-update');
    }
  };
</script>
