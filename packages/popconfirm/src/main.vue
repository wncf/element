<template>
  <hzq-popover
    v-bind="$attrs"
    v-model="visible"
    trigger="click"
  >
  <div class="hzq-popconfirm">
    <p class="hzq-popconfirm__main">
    <i
      v-if="!hideIcon"
      :class="icon"
      class="hzq-popconfirm__icon"
      :style="{color: iconColor}"
    ></i>
      {{title}}
    </p>
    <div class="hzq-popconfirm__action">
      <hzq-button 
        size="mini" 
        :type="cancelButtonType" 
        @click="cancel"
      >
        {{ displayCancelButtonText }}
      </hzq-button>
      <hzq-button 
        size="mini" 
        :type="confirmButtonType" 
        @click="confirm"
      >
        {{ displayConfirmButtonText }}
      </hzq-button>
    </div>
  </div>
  <slot name="reference" slot="reference"></slot>
</hzq-popover>
</template>

<script>
import HzqPopover from 'hzq-ui/packages/popover';
import HzqButton from 'hzq-ui/packages/button';
import {t} from 'hzq-ui/src/locale';

export default {
  name: 'HzqPopconfirm',
  props: {
    title: {
      type: String
    },
    confirmButtonText: {
      type: String
    },
    cancelButtonText: {
      type: String
    },
    confirmButtonType: {
      type: String,
      default: 'primary'
    },
    cancelButtonType: {
      type: String,
      default: 'text'
    },
    icon: {
      type: String,
      default: 'hzq-icon-question'
    },
    iconColor: {
      type: String,
      default: 'var(--hzq-color-warning)'
    },
    hideIcon: {
      type: Boolean,
      default: false
    }
  },
  components: {
    HzqPopover,
    HzqButton
  },
  data() {
    return {
      visible: false
    };
  },
  computed: {
    displayConfirmButtonText() {
      return this.confirmButtonText || t('el.popconfirm.confirmButtonText');
    },
    displayCancelButtonText() {
      return this.cancelButtonText || t('el.popconfirm.cancelButtonText');
    }
  },
  methods: {
    confirm() {
      this.visible = false;
      this.$emit('confirm');
    },
    cancel() {
      this.visible = false;
      this.$emit('cancel');
    }
  }
};
</script>
