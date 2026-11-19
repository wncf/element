<template>
  <hzq-dialog
    :visible.sync="visible"
    :title="title"
    :width="dialogWidth"
    :fullscreen="fullscreen"
    :modal="modal"
    :close-on-click-modal="maskClose"
    :close-on-press-escape="escClose"
    :show-close="showClose"
    :append-to-body="true"
    :z-index="zIndex"
    explicit-z-index
    :custom-class="dialogClass"
    :before-close="handleBeforeClose"
    @open="handleOpen"
    @closed="handleClosed"
  >
    <template v-if="resolvedIcon" slot="title">
      <div class="hzq-dialog__service-header">
        <span
          class="hzq-dialog__service-icon"
          :class="[
            `hzq-dialog__service-icon--${iconType}`,
            resolvedIcon
          ]"
        ></span>
        <span class="hzq-dialog__title">{{ title }}</span>
      </div>
    </template>

    <dialog-render-fn v-if="renderFn" :render="renderFn" />
    <div v-else-if="typeof content === 'string'" class="hzq-dialog__service-content">{{ content }}</div>
    <dialog-render-fn v-else-if="contentRender" :render="contentRender" />

    <template v-if="showFooter" slot="footer">
      <hzq-button class="hzq-dialog__service-cancel" :size="buttonSize" @click="handleCancel">
        {{ resolvedCancelText }}
      </hzq-button>
      <hzq-button
        class="hzq-dialog__service-confirm"
        :size="buttonSize"
        :type="confirmButtonType"
        :loading="loading"
        @click="handleConfirm"
      >
        {{ resolvedConfirmText }}
      </hzq-button>
    </template>
  </hzq-dialog>
</template>

<script>
import Locale from 'hzq-ui/src/mixins/locale';
import DialogRenderFn from './dialog-render-fn.vue';

// 带底部按钮的类型：confirm 为纯确认，其余类型额外渲染标题图标
const CONFIRM_TYPES = ['confirm', 'error', 'warning', 'info', 'add', 'edit'];

// 类型 -> 标题图标（iconfont 类名）。图标语义沿用业务方的既有约定。
const TYPE_ICONS = {
  error: 'hzq-icon-delete',
  warning: 'hzq-icon-warning',
  info: 'hzq-icon-info',
  add: 'hzq-icon-circle-plus-outline',
  edit: 'hzq-icon-edit'
};

// 图标的色彩分组，决定图标块的背景/前景色
const TYPE_ICON_VARIANTS = {
  error: 'error',
  warning: 'warning',
  info: 'info',
  add: 'primary',
  edit: 'primary'
};

export default {
  name: 'HzqDialogServiceInstance',

  components: {
    DialogRenderFn
  },

  mixins: [Locale],

  props: {
    title: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'alert'
    },
    width: {
      type: [String, Number],
      default: ''
    },
    fullscreen: {
      type: Boolean,
      default: false
    },
    // 是否渲染遮罩。命令式弹窗默认与 <hzq-dialog> 保持一致（有遮罩）
    modal: {
      type: Boolean,
      default: true
    },
    zIndex: {
      type: Number,
      default: undefined
    },
    maskClose: {
      type: Boolean,
      default: false
    },
    escClose: {
      type: Boolean,
      default: true
    },
    showClose: {
      type: Boolean,
      default: true
    },
    confirmButtonText: {
      type: String,
      default: ''
    },
    cancelButtonText: {
      type: String,
      default: ''
    },
    content: {
      type: [String, Object],
      default: ''
    },
    renderFn: {
      type: Function,
      default: null
    },
    icon: {
      type: String,
      default: ''
    },
    hideFooter: {
      type: Boolean,
      default: false
    },
    onConfirm: {
      type: Function,
      default: null
    },
    onCancel: {
      type: Function,
      default: null
    },
    onOpen: {
      type: Function,
      default: null
    },
    border: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      visible: false,
      loading: false,
      instanceProxy: null,
      // 程序化关闭时置真，用来跳过 before-close 里的 cancel 回调
      skipBeforeClose: false
    };
  },

  computed: {
    hasConfirmButton() {
      return CONFIRM_TYPES.indexOf(this.type) > -1;
    },

    // hideFooter 只在「不传类型」的自定义内容弹窗上有意义；
    // 显式传了 error/warning 等类型时，底部按钮是类型语义的一部分。
    showFooter() {
      return this.hasConfirmButton && !this.hideFooter;
    },

    iconType() {
      return TYPE_ICON_VARIANTS[this.type] || 'info';
    },

    resolvedIcon() {
      if (this.icon) return this.icon;
      return TYPE_ICONS[this.type] || '';
    },

    confirmButtonType() {
      return this.type === 'error' ? 'danger' : 'primary';
    },

    dialogClass() {
      const classes = [];
      if (this.border) classes.push('hzq-dialog--bordered');
      if (this.resolvedIcon) classes.push('hzq-dialog--with-icon');
      return classes.join(' ');
    },

    dialogWidth() {
      if (this.fullscreen) return undefined;
      return normalizeWidth(this.width);
    },

    buttonSize() {
      return (this.$HZQ || {}).size;
    },

    contentRender() {
      if (this.renderFn || typeof this.content === 'string' || !this.content) {
        return null;
      }
      const content = this.content;
      return h => content;
    },

    resolvedConfirmText() {
      return this.confirmButtonText || this.t('el.messagebox.confirm');
    },

    resolvedCancelText() {
      return this.cancelButtonText || this.t('el.messagebox.cancel');
    }
  },

  created() {
    this.instanceProxy = this.createInstanceProxy();
  },

  mounted() {
    this.$nextTick(() => {
      this.visible = true;
    });
  },

  methods: {
    // 实例代理：业务方拿到的就是这个对象，语义与组件实例保持一致。
    // $refs / $el 直接转发到真实实例，供「弹窗内组件校验」这类用法。
    createInstanceProxy() {
      const vm = this;
      return {
        get visible() {
          return vm.visible;
        },
        set visible(val) {
          vm.visible = val;
        },
        get loading() {
          return vm.loading;
        },
        set loading(val) {
          vm.loading = val;
        },
        get $refs() {
          return vm.$refs;
        },
        get $el() {
          return vm.$el;
        },
        get instance() {
          return vm;
        },
        close() {
          vm.closeDialog();
        }
      };
    },

    getInstance() {
      return this.instanceProxy;
    },

    closeDialog() {
      // 程序化关闭（instance.close() / 点确定）不应再走 before-close，
      // 否则会反过来触发一次 cancel 回调，把"确定"当成"取消"
      this.skipBeforeClose = true;
      this.visible = false;
      this.$nextTick(() => {
        this.skipBeforeClose = false;
      });
    },

    invokeCancel() {
      if (typeof this.onCancel === 'function') {
        this.onCancel(this.getInstance());
      }
    },

    handleCancel() {
      this.invokeCancel();
      this.closeDialog();
    },

    handleBeforeClose(done) {
      // 程序化关闭时直接放行，不触发 cancel
      if (this.skipBeforeClose) {
        done();
        return;
      }
      this.invokeCancel();
      done();
    },

    handleConfirm() {
      if (!this.showFooter || typeof this.onConfirm !== 'function') {
        this.closeDialog();
        return;
      }
      const result = this.onConfirm(this.getInstance());
      if (result && typeof result.then === 'function') {
        result.catch(function() {});
      }
    },

    handleOpen() {
      if (typeof this.onOpen === 'function') {
        this.onOpen(this.getInstance());
      }
    },

    handleClosed() {
      this.$emit('destroy');
    }
  }
};

function normalizeWidth(width) {
  if (width === undefined || width === null || width === '') {
    return undefined;
  }
  if (typeof width === 'number') {
    return `${width}px`;
  }
  const value = String(width);
  return /px$/i.test(value) ? value : `${value}px`;
}
</script>
