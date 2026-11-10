<template>
  <transition name="el-zoom-in-top" @after-leave="doDestroy">
    <div
      v-show="showPopper"
      class="hzq-autocomplete-suggestion hzq-popper"
      :class="{ 'is-loading': !parent.hideLoading && parent.loading }"
      :style="{ width: dropdownWidth }"
      role="region">
      <hzq-scrollbar
        tag="ul"
        wrap-class="hzq-autocomplete-suggestion__wrap"
        view-class="hzq-autocomplete-suggestion__list">
        <li v-if="!parent.hideLoading && parent.loading"><i class="hzq-icon-loading"></i></li>
        <slot v-else>
        </slot>
      </hzq-scrollbar>
    </div>
  </transition>
</template>
<script>
  import Popper from 'hzq-ui/src/utils/vue-popper';
  import Emitter from 'hzq-ui/src/mixins/emitter';
  import HzqScrollbar from 'hzq-ui/packages/scrollbar';

  export default {
    components: { HzqScrollbar },
    mixins: [Popper, Emitter],

    componentName: 'HzqAutocompleteSuggestions',

    data() {
      return {
        parent: this.$parent,
        dropdownWidth: ''
      };
    },

    props: {
      options: {
        default() {
          return {
            gpuAcceleration: false
          };
        }
      },
      id: String
    },

    methods: {
      select(item) {
        this.dispatch('HzqAutocomplete', 'item-click', item);
      }
    },

    updated() {
      this.$nextTick(_ => {
        this.popperJS && this.updatePopper();
      });
    },

    mounted() {
      this.$parent.popperElm = this.popperElm = this.$el;
      this.referenceElm = this.$parent.$refs.input.$refs.input || this.$parent.$refs.input.$refs.textarea;
      this.referenceList = this.$el.querySelector('.hzq-autocomplete-suggestion__list');
      this.referenceList.setAttribute('role', 'listbox');
      this.referenceList.setAttribute('id', this.id);
    },

    created() {
      this.$on('visible', (val, inputWidth) => {
        this.dropdownWidth = inputWidth + 'px';
        this.showPopper = val;
      });
    }
  };
</script>
