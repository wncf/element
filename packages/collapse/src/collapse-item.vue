<template>
  <div class="hzq-collapse-item"
    :class="{'is-active': isActive, 'is-disabled': disabled }">
    <div
      role="tab"
      :aria-expanded="isActive"
      :aria-controls="`hzq-collapse-content-${id}`"
      :aria-describedby ="`hzq-collapse-content-${id}`"
    >
      <div
        class="hzq-collapse-item__header"
        @click="handleHeaderClick"
        role="button"
        :id="`hzq-collapse-head-${id}`"
        :tabindex="disabled ? undefined : 0"
        @keyup.space.enter.stop="handleEnterClick"
        :class="{
          'focusing': focusing,
          'is-active': isActive
        }"
        @focus="handleFocus"
        @blur="focusing = false"
      >
        <slot name="title">{{title}}</slot>
        <i
          class="hzq-collapse-item__arrow hzq-icon-arrow-right"
          :class="{'is-active': isActive}">
        </i>
      </div>
    </div>
    <hzq-collapse-transition>
      <div
        class="hzq-collapse-item__wrap"
        v-show="isActive"
        role="tabpanel"
        :aria-hidden="!isActive"
        :aria-labelledby="`hzq-collapse-head-${id}`"
        :id="`hzq-collapse-content-${id}`"
      >
        <div class="hzq-collapse-item__content">
          <slot></slot>
        </div>
      </div>
    </hzq-collapse-transition>
  </div>
</template>
<script>
  import HzqCollapseTransition from 'hzq-ui/src/transitions/collapse-transition';
  import Emitter from 'hzq-ui/src/mixins/emitter';
  import { generateId } from 'hzq-ui/src/utils/util';

  export default {
    name: 'HzqCollapseItem',

    componentName: 'HzqCollapseItem',

    mixins: [Emitter],

    components: { HzqCollapseTransition },

    data() {
      return {
        contentWrapStyle: {
          height: 'auto',
          display: 'block'
        },
        contentHeight: 0,
        focusing: false,
        isClick: false,
        id: generateId()
      };
    },

    inject: ['collapse'],

    props: {
      title: String,
      name: {
        type: [String, Number],
        default() {
          return this._uid;
        }
      },
      disabled: Boolean
    },

    computed: {
      isActive() {
        return this.collapse.activeNames.indexOf(this.name) > -1;
      }
    },

    methods: {
      handleFocus() {
        setTimeout(() => {
          if (!this.isClick) {
            this.focusing = true;
          } else {
            this.isClick = false;
          }
        }, 50);
      },
      handleHeaderClick() {
        if (this.disabled) return;
        this.dispatch('HzqCollapse', 'item-click', this);
        this.focusing = false;
        this.isClick = true;
      },
      handleEnterClick() {
        this.dispatch('HzqCollapse', 'item-click', this);
      }
    }
  };
</script>
