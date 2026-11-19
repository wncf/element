import Vue from 'vue';
import merge from 'hzq-ui/src/utils/merge';
import PopupManager from 'hzq-ui/src/utils/popup/popup-manager';
import getScrollBarWidth from '../scrollbar-width';
import { getStyle, addClass, removeClass, hasClass } from '../dom';

let idSeed = 1;

let scrollBarWidth;

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    openDelay: {},
    closeDelay: {},
    zIndex: {},
    // 为 true 时按 zIndex 精确设置本层浮层的层级，但不改动全局自增基线
    // （默认行为是 zIndex 同时充当基线，供业务方统一调整整套浮层）
    explicitZIndex: {
      type: Boolean,
      default: false
    },
    modal: {
      type: Boolean,
      default: false
    },
    modalFade: {
      type: Boolean,
      default: true
    },
    modalClass: {},
    modalAppendToBody: {
      type: Boolean,
      default: false
    },
    lockScroll: {
      type: Boolean,
      default: true
    },
    closeOnPressEscape: {
      type: Boolean,
      default: false
    },
    closeOnClickModal: {
      type: Boolean,
      default: false
    }
  },

  beforeMount() {
    this._popupId = 'popup-' + idSeed++;
    PopupManager.register(this._popupId, this);
  },

  beforeDestroy() {
    PopupManager.deregister(this._popupId);
    PopupManager.closeModal(this._popupId);
    PopupManager.popEsc(this._popupId);

    this.restoreBodyStyle();
  },

  data() {
    return {
      opened: false,
      bodyPaddingRight: null,
      computedBodyPaddingRight: 0,
      withoutHiddenClass: true,
      rendered: false
    };
  },

  watch: {
    visible(val) {
      if (val) {
        if (this._opening) return;
        if (!this.rendered) {
          this.rendered = true;
          Vue.nextTick(() => {
            this.open();
          });
        } else {
          this.open();
        }
      } else {
        this.close();
      }
    }
  },

  methods: {
    open(options) {
      if (!this.rendered) {
        this.rendered = true;
      }

      const props = merge({}, this.$props || this, options);

      if (this._closeTimer) {
        clearTimeout(this._closeTimer);
        this._closeTimer = null;
      }
      clearTimeout(this._openTimer);

      const openDelay = Number(props.openDelay);
      if (openDelay > 0) {
        this._openTimer = setTimeout(() => {
          this._openTimer = null;
          this.doOpen(props);
        }, openDelay);
      } else {
        this.doOpen(props);
      }
    },

    doOpen(props) {
      if (this.$isServer) return;
      if (this.willOpen && !this.willOpen()) return;
      if (this.opened) return;

      this._opening = true;

      const dom = this.$el;

      const modal = props.modal;

      const zIndex = props.zIndex;
      // 精确层级：只用 zIndex 定本层位置，不改全局自增基线，
      // 避免业务方传一个小 zIndex 就把之后所有浮层一起拉低
      const explicit = Boolean(props.explicitZIndex) && zIndex !== undefined && zIndex !== null && zIndex !== '';
      if (zIndex && !explicit) {
        PopupManager.zIndex = zIndex;
      }

      // 显式层级时遮罩取 zIndex、弹窗本体高一层，避免内容被自己的遮罩压住；
      // 非显式层级沿用自增，遮罩先取、本体再取（与改动前一致）
      let popupZIndex;

      if (modal) {
        if (this._closing) {
          PopupManager.closeModal(this._popupId);
          this._closing = false;
        }
        const modalZIndex = explicit ? Number(zIndex) : PopupManager.nextZIndex();
        popupZIndex = explicit ? Number(zIndex) + 1 : undefined;
        PopupManager.openModal(this._popupId, modalZIndex, this.modalAppendToBody ? undefined : dom, props.modalClass, props.modalFade);
        if (props.lockScroll) {
          this.withoutHiddenClass = !hasClass(document.body, 'hzq-popup-parent--hidden');
          if (this.withoutHiddenClass) {
            this.bodyPaddingRight = document.body.style.paddingRight;
            this.computedBodyPaddingRight = parseInt(getStyle(document.body, 'paddingRight'), 10);
          }
          scrollBarWidth = getScrollBarWidth();
          let bodyHasOverflow = document.documentElement.clientHeight < document.body.scrollHeight;
          let bodyOverflowY = getStyle(document.body, 'overflowY');
          if (scrollBarWidth > 0 && (bodyHasOverflow || bodyOverflowY === 'scroll') && this.withoutHiddenClass) {
            document.body.style.paddingRight = this.computedBodyPaddingRight + scrollBarWidth + 'px';
          }
          addClass(document.body, 'hzq-popup-parent--hidden');
        }
      }

      if (getComputedStyle(dom).position === 'static') {
        dom.style.position = 'absolute';
      }

      // 没有遮罩时同样要定层级
      if (popupZIndex === undefined) {
        popupZIndex = PopupManager.nextZIndex();
      }
      dom.style.zIndex = popupZIndex;

      // 无论有没有遮罩都要参与 esc 关闭的顺序
      PopupManager.pushEsc(this._popupId);

      this.opened = true;

      this.onOpen && this.onOpen();

      this.doAfterOpen();
    },

    doAfterOpen() {
      this._opening = false;
    },

    close() {
      if (this.willClose && !this.willClose()) return;

      if (this._openTimer !== null) {
        clearTimeout(this._openTimer);
        this._openTimer = null;
      }
      clearTimeout(this._closeTimer);

      const closeDelay = Number(this.closeDelay);

      if (closeDelay > 0) {
        this._closeTimer = setTimeout(() => {
          this._closeTimer = null;
          this.doClose();
        }, closeDelay);
      } else {
        this.doClose();
      }
    },

    doClose() {
      this._closing = true;

      this.onClose && this.onClose();

      if (this.lockScroll) {
        setTimeout(this.restoreBodyStyle, 200);
      }

      this.opened = false;

      this.doAfterClose();
    },

    doAfterClose() {
      PopupManager.closeModal(this._popupId);
      PopupManager.popEsc(this._popupId);
      this._closing = false;
    },

    restoreBodyStyle() {
      if (this.modal && this.withoutHiddenClass) {
        document.body.style.paddingRight = this.bodyPaddingRight;
        removeClass(document.body, 'hzq-popup-parent--hidden');
      }
      this.withoutHiddenClass = true;
    }
  }
};

export {
  PopupManager
};
