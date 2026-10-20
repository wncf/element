<template>
  <el-dialog
    :visible.sync="visible"
    :title="title"
    :width="dialogWidth"
    :close-on-click-modal="maskClose"
    :close-on-press-escape="escClose"
    :show-close="showClose"
    :append-to-body="true"
    :custom-class="dialogClass"
    :before-close="handleBeforeClose"
    @closed="handleClosed"
  >
    <dialog-render-fn v-if="renderFn" :render="renderFn" />
    <div v-else-if="typeof content === 'string'" class="el-dialog-service__content">{{ content }}</div>
    <dialog-render-fn v-else-if="contentRender" :render="contentRender" />

    <template v-if="isConfirm" slot="footer">
      <el-button :size="buttonSize" @click="handleCancel">
        {{ resolvedCancelText }}
      </el-button>
      <el-button
        :size="buttonSize"
        type="primary"
        :loading="loading"
        @click="handleConfirm"
      >
        {{ resolvedConfirmText }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
import Locale from 'element-ui/src/mixins/locale';
import DialogRenderFn from './dialog-render-fn.vue';

export default {
  name: 'ElDialogServiceInstance',

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
      instanceProxy: null
    };
  },

  computed: {
    isConfirm() {
      return this.type === 'confirm';
    },

    dialogClass() {
      return this.border ? 'el-dialog--bordered' : '';
    },

    dialogWidth() {
      return normalizeWidth(this.width);
    },

    buttonSize() {
      return (this.$ELEMENT || {}).size;
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
          vm.closeDialog();
        }
      };
    },

    getInstance() {
      return this.instanceProxy;
    },

    closeDialog() {
      this.visible = false;
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
      this.invokeCancel();
      done();
    },

    handleConfirm() {
      if (!this.isConfirm || typeof this.onConfirm !== 'function') {
        this.closeDialog();
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
