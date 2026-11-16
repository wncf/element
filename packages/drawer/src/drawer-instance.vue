<template>
  <hzq-drawer
    :visible.sync="visible"
    :title="title"
    :size="drawerSize"
    :direction="direction"
    :close-on-press-escape="escClose"
    :show-close="showClose"
    :append-to-body="true"
    :wrapper-closable="maskClose"
    :custom-class="drawerClass"
    :with-header="withHeader"
    :before-close="handleBeforeClose"
    @closed="handleClosed"
  >
    <drawer-render-fn v-if="renderFn" :render="renderFn" />
    <div v-else-if="typeof content === 'string'" class="hzq-drawer-service__content">{{ content }}</div>
    <drawer-render-fn v-else-if="contentRender" :render="contentRender" />

    <!-- hzq-drawer 只有 title 与默认插槽，没有 footer，所以按钮放在内容之后 -->
    <div v-if="isConfirm" class="hzq-drawer-service__footer">
      <hzq-button :size="buttonSize" @click="handleCancel">
        {{ resolvedCancelText }}
      </hzq-button>
      <hzq-button
        :size="buttonSize"
        type="primary"
        :loading="loading"
        @click="handleConfirm"
      >
        {{ resolvedConfirmText }}
      </hzq-button>
    </div>
  </hzq-drawer>
</template>

<script>
import Locale from 'hzq-ui/src/mixins/locale';
import DrawerRenderFn from './drawer-render-fn.vue';

export default {
  name: 'HzqDrawerServiceInstance',

  components: {
    DrawerRenderFn
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
    size: {
      type: [String, Number],
      default: ''
    },
    direction: {
      type: String,
      default: 'rtl'
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
    withHeader: {
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
    onConfirm: {
      type: Function,
      default: null
    },
    onCancel: {
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
    isConfirm() {
      return this.type === 'confirm';
    },

    drawerClass() {
      return this.border ? 'hzq-drawer--bordered' : '';
    },

    drawerSize() {
      return normalizeSize(this.size);
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
        close() {
          vm.closeDrawer();
        }
      };
    },

    getInstance() {
      return this.instanceProxy;
    },

    closeDrawer() {
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
      this.closeDrawer();
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
      if (!this.isConfirm || typeof this.onConfirm !== 'function') {
        this.closeDrawer();
        return;
      }
      const result = this.onConfirm(this.getInstance());
      if (result && typeof result.then === 'function') {
        result.catch(function() {});
      }
    },

    handleClosed() {
      this.$emit('destroy');
    }
  }
};

// 数字补 px，带单位或百分比的原样返回（抽屉默认就是 30% 这类写法）
function normalizeSize(size) {
  if (size === undefined || size === null || size === '') {
    return undefined;
  }
  if (typeof size === 'number') {
    return `${size}px`;
  }
  const value = String(size);
  return /%$/.test(value) || /px$/i.test(value) ? value : `${value}px`;
}
</script>

<style>
.hzq-drawer-service__content {
  padding: 0 20px 20px;
}

.hzq-drawer-service__footer {
  display: flex;
  justify-content: flex-end;
  padding: 12px 20px;
  border-top: 1px solid var(--hzq-border-color-lighter);
}
</style>
