<template>
  <transition
    name="dialog-fade"
    @after-enter="afterEnter"
    @after-leave="afterLeave"
  >
    <div
      v-show="visible"
      class="el-dialog__wrapper"
      :class="{ 'el-dialog__wrapper--centered': isCentered }"
      @click.self="handleWrapperClick"
    >
      <div
        role="dialog"
        :key="key"
        aria-modal="true"
        :aria-label="title || 'dialog'"
        :class="[
          'el-dialog',
          { 'is-fullscreen': fullscreen, 'el-dialog--center': center },
          customClass,
        ]"
        ref="dialog"
        :style="style"
      >
        <div
          class="el-dialog__header"
          :class="{ 'is-draggable': draggable && !fullscreen }"
          @mousedown="handleDragMouseDown"
        >
          <slot name="title">
            <span class="el-dialog__title">{{ title }}</span>
          </slot>
          <button
            type="button"
            class="el-dialog__headerbtn"
            aria-label="Close"
            v-if="showClose"
            @click="handleClose"
          >
            <svg
              class="el-dialog__close"
              viewBox="0 0 12 12"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                d="M2 2l8 8M10 2L2 10"
              />
            </svg>
          </button>
        </div>
        <div class="el-dialog__body" v-if="rendered"><slot></slot></div>
        <div class="el-dialog__footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Popup from 'element-ui/src/utils/popup';
import Migrating from 'element-ui/src/mixins/migrating';
import emitter from 'element-ui/src/mixins/emitter';

export default {
  name: 'ElDialog',

  mixins: [Popup, emitter, Migrating],

  props: {
    title: {
      type: String,
      default: ''
    },

    modal: {
      type: Boolean,
      default: true
    },

    modalAppendToBody: {
      type: Boolean,
      default: true
    },

    appendToBody: {
      type: Boolean,
      default: false
    },

    lockScroll: {
      type: Boolean,
      default: true
    },

    closeOnClickModal: {
      type: Boolean,
      default: true
    },

    closeOnPressEscape: {
      type: Boolean,
      default: true
    },

    showClose: {
      type: Boolean,
      default: true
    },

    width: String,

    fullscreen: Boolean,

    customClass: {
      type: String,
      default: ''
    },

    top: {
      type: String,
      default: ''
    },
    beforeClose: Function,
    center: {
      type: Boolean,
      default: false
    },

    destroyOnClose: Boolean,

    draggable: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      closed: false,
      key: 0,
      dragCleanUp: null
    };
  },

  watch: {
    visible(val) {
      if (val) {
        this.closed = false;
        this.$emit('open');
        this.$el.addEventListener('scroll', this.updatePopper);
        this.$nextTick(() => {
          this.$refs.dialog.scrollTop = 0;
        });
        if (this.appendToBody) {
          document.body.appendChild(this.$el);
        }
      } else {
        this.$el.removeEventListener('scroll', this.updatePopper);
        this.clearDragListener();
        if (!this.closed) this.$emit('close');
        if (this.destroyOnClose) {
          this.$nextTick(() => {
            this.key++;
          });
        }
      }
    }
  },

  computed: {
    isCentered() {
      return !this.fullscreen && !this.top;
    },

    style() {
      let style = {};
      if (!this.fullscreen) {
        if (this.top) {
          style.marginTop = this.top;
        }
        if (this.width) {
          style.width = this.width;
        }
      }
      return style;
    }
  },

  methods: {
    getMigratingConfig() {
      return {
        props: {
          size: 'size is removed.'
        }
      };
    },
    handleWrapperClick() {
      if (!this.closeOnClickModal) return;
      this.handleClose();
    },
    handleClose() {
      if (typeof this.beforeClose === 'function') {
        this.beforeClose(this.hide);
      } else {
        this.hide();
      }
    },
    hide(cancel) {
      if (cancel !== false) {
        this.$emit('update:visible', false);
        this.$emit('close');
        this.closed = true;
      }
    },
    updatePopper() {
      this.broadcast('ElSelectDropdown', 'updatePopper');
      this.broadcast('ElDropdownMenu', 'updatePopper');
    },
    afterEnter() {
      this.$emit('opened');
    },
    afterLeave() {
      this.resetPosition();
      this.$emit('closed');
    },
    handleDragMouseDown(e) {
      if (!this.draggable || this.fullscreen) return;
      if (e.target.closest('.el-dialog__headerbtn')) return;

      const dragDom = this.$refs.dialog;
      const rect = dragDom.getBoundingClientRect();
      const disX = e.clientX - rect.left;
      const disY = e.clientY - rect.top;

      const onMouseMove = (moveEvent) => {
        dragDom.style.marginTop = '0';
        dragDom.style.marginLeft = '0';
        dragDom.style.position = 'absolute';
        dragDom.style.left = `${moveEvent.clientX - disX}px`;
        dragDom.style.top = `${moveEvent.clientY - disY}px`;
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        this.dragCleanUp = null;
      };

      this.clearDragListener();
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      this.dragCleanUp = onMouseUp;
    },
    clearDragListener() {
      if (this.dragCleanUp) {
        this.dragCleanUp();
        this.dragCleanUp = null;
      }
    },
    resetPosition() {
      this.clearDragListener();
      const dragDom = this.$refs.dialog;
      if (!dragDom) return;

      dragDom.style.position = '';
      dragDom.style.left = '';
      dragDom.style.top = '';
      dragDom.style.marginTop = '';
      dragDom.style.marginLeft = '';
    }
  },

  mounted() {
    if (this.visible) {
      this.rendered = true;
      this.open();
      if (this.appendToBody) {
        document.body.appendChild(this.$el);
      }
    }
  },

  destroyed() {
    this.clearDragListener();
    // if appendToBody is true, remove DOM node after destroy
    if (this.appendToBody && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
  }
};
</script>
