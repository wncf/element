<template>
  <transition name="hzq-fade-in-linear" @after-leave="handleAfterLeave">
    <div
      v-show="visible"
      ref="popper"
      class="hzq-tooltip__popper"
      :class="['is-' + effect, popperClass]"
      :style="popperStyle"
      role="tooltip"
      @mouseenter="cancelHide"
      @mouseleave="scheduleHide"
      @mousedown="handleMouseDown"
    >
      {{ content }}
      <div class="popper__arrow" x-arrow></div>
    </div>
  </transition>
</template>

<script>
import Vue from 'vue';
import { on, off } from 'hzq-ui/src/utils/dom';
import { PopupManager } from 'hzq-ui/src/utils/popup';

const PopperJS = Vue.prototype.$isServer ? function() {} : require('hzq-ui/src/utils/popper');

const DEFAULT_MAX_WIDTH = 360;

/**
 * 离开触发元素 / 浮层后的延迟关闭时间
 * 需要留出跨越两者之间间隙（箭头 + 6px margin）的时间，否则鼠标移不进浮层
 */
const HIDE_DELAY = 150;

export default {
  name: 'HzqTooltipService',

  data() {
    return {
      visible: false,
      content: '',
      effect: 'dark',
      placement: 'top',
      popperClass: '',
      maxWidth: DEFAULT_MAX_WIDTH,
      offset: 0,
      target: null,
      lastPlacement: '',
      lastOffset: 0
    };
  },

  computed: {
    popperStyle() {
      const style = { userSelect: 'text', cursor: 'auto' };
      if (!this.maxWidth) return style;
      style.maxWidth = typeof this.maxWidth === 'number' ? `${this.maxWidth}px` : this.maxWidth;
      return style;
    }
  },

  beforeDestroy() {
    this.destroyPopper();
    this.unbindGlobalListeners();
    this.unbindTargetListeners();
  },

  methods: {
    /**
     * 显示提示
     * @param {Object} options
     * @param {HTMLElement} options.target 目标元素
     * @param {String} options.content 提示文字
     * @param {String} [options.placement='top']
     * @param {String} [options.effect='dark'] dark | light
     * @param {Number|String} [options.maxWidth=360]
     * @param {Number} [options.offset=0]
     * @param {String} [options.popperClass]
     */
    show(options = {}) {
      const target = options.target;
      if (!target || target.nodeType !== 1) return;

      if (this.target !== target) this.unbindTargetListeners();

      this.content = options.content == null ? '' : String(options.content);
      this.effect = options.effect === 'light' ? 'light' : 'dark';
      this.placement = options.placement || 'top';
      this.popperClass = options.popperClass || '';
      this.maxWidth = options.maxWidth == null ? DEFAULT_MAX_WIDTH : options.maxWidth;
      this.offset = options.offset || 0;
      this.target = target;

      this.cancelHide();
      this.visible = true;
      // 等待内容渲染完成再定位，避免首帧尺寸为 0
      this.$nextTick(() => {
        if (this.visible) this.createPopper();
      });

      this.bindTargetListeners();
      this.bindGlobalListeners();
    },

    hide() {
      if (!this.visible) return;
      this.cancelHide();
      this.visible = false;
      this.unbindGlobalListeners();
      this.unbindTargetListeners();
    },

    /**
     * 延时关闭。鼠标从触发元素移到浮层、或反向移动时，
     * 跨越间隙的这段时间内不会关闭；期间进入任一侧即取消。
     */
    scheduleHide() {
      // 正在拖选文字时先不关，等 mouseup 后再判断
      if (this.selecting) return;
      this.cancelHide();
      this.hideTimer = setTimeout(() => {
        this.hideTimer = null;
        this.hide();
      }, HIDE_DELAY);
    },

    cancelHide() {
      if (!this.hideTimer) return;
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    },

    handleMouseDown() {
      // 在浮层内按下鼠标（选文字）期间不自动关闭
      this.cancelHide();
      this.selecting = true;
      if (!this.docMouseUpBound) {
        this.docMouseUpBound = true;
        on(document, 'mouseup', this.handleDocMouseUp);
      }
    },

    handleDocMouseUp(event) {
      this.selecting = false;
      this.docMouseUpBound = false;
      off(document, 'mouseup', this.handleDocMouseUp);

      const popperElm = this.$refs.popper;
      const insidePopper = popperElm && popperElm.contains(event.target);
      const insideTarget = this.target && this.target.contains(event.target);
      if (!insidePopper && !insideTarget) this.scheduleHide();
    },

    handleAfterLeave() {
      // 淡出期间可能已被 show 重新打开，此时不能销毁新的 popper
      if (this.visible) return;
      this.destroyPopper();
    },

    updatePosition() {
      if (!this.visible) return;
      if (this.popperJS) {
        this.popperJS.update();
      } else {
        this.createPopper();
      }
    },

    createPopper() {
      const popperElm = this.$refs.popper;
      if (!this.target || !popperElm) return;

      if (this.popperJS) {
        const sameTarget = this.popperJS._reference === this.target;
        const sameConfig = this.lastPlacement === this.placement &&
          this.lastOffset === this.offset;
        if (sameTarget && sameConfig) {
          this.popperJS.update();
          return;
        }
        this.destroyPopper();
      }

      this.popperJS = new PopperJS(this.target, popperElm, {
        placement: this.placement,
        offset: this.offset,
        arrowOffset: 0,
        boundariesPadding: 10,
        gpuAcceleration: false,
        removeOnDestroy: false
      });
      this.lastPlacement = this.placement;
      this.lastOffset = this.offset;

      popperElm.style.zIndex = PopupManager.nextZIndex();
    },

    destroyPopper() {
      if (!this.popperJS) return;
      this.popperJS.destroy();
      this.popperJS = null;
    },

    bindTargetListeners() {
      if (!this.target || this._targetListening) return;
      this._targetListening = true;
      this._onTargetEnter = () => this.cancelHide();
      this._onTargetLeave = () => this.scheduleHide();
      on(this.target, 'mouseenter', this._onTargetEnter);
      on(this.target, 'mouseleave', this._onTargetLeave);
    },

    unbindTargetListeners() {
      if (!this._targetListening) return;
      this._targetListening = false;
      off(this.target, 'mouseenter', this._onTargetEnter);
      off(this.target, 'mouseleave', this._onTargetLeave);
      this._onTargetEnter = null;
      this._onTargetLeave = null;
    },

    bindGlobalListeners() {
      if (this._listening) return;
      this._listening = true;
      this._onGlobalChange = () => {
        // 拖选文字期间页面滚动不打断选中
        if (this.selecting) return;
        this.hide();
      };
      window.addEventListener('scroll', this._onGlobalChange, true);
      window.addEventListener('resize', this._onGlobalChange, false);
    },

    unbindGlobalListeners() {
      if (!this._listening) return;
      this._listening = false;
      window.removeEventListener('scroll', this._onGlobalChange, true);
      window.removeEventListener('resize', this._onGlobalChange, false);
      this._onGlobalChange = null;
    }
  }
};
</script>
