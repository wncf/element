import Vue from 'vue';
import { addClass, removeClass } from 'hzq-ui/src/utils/dom';

let hasModal = false;
let hasInitZIndex = false;
let zIndex;
// closeModal 的延迟清理定时器。没有它时，关闭后 200ms 内重新打开，
// 旧定时器仍会把遮罩移除并置回 display:none，同时 v-modal-leave
// 的淡出动画也在继续播，表现为遮罩闪一下。
let modalCloseTimer = null;

function clearModalCloseTimer() {
  if (modalCloseTimer) {
    clearTimeout(modalCloseTimer);
    modalCloseTimer = null;
  }
}

const getModal = function() {
  if (Vue.prototype.$isServer) return;
  let modalDom = PopupManager.modalDom;
  if (modalDom) {
    hasModal = true;
  } else {
    hasModal = false;
    modalDom = document.createElement('div');
    PopupManager.modalDom = modalDom;

    modalDom.addEventListener('touchmove', function(event) {
      event.preventDefault();
      event.stopPropagation();
    });

    modalDom.addEventListener('click', function() {
      PopupManager.doOnModalClick && PopupManager.doOnModalClick();
    });
  }

  return modalDom;
};

const instances = {};

const PopupManager = {
  modalFade: true,

  getInstance: function(id) {
    return instances[id];
  },

  register: function(id, instance) {
    if (id && instance) {
      instances[id] = instance;
    }
  },

  deregister: function(id) {
    if (id) {
      instances[id] = null;
      delete instances[id];
    }
  },

  nextZIndex: function() {
    return PopupManager.zIndex++;
  },

  modalStack: [],

  // 打开中的浮层顺序，用于 esc 关闭。
  // 不能复用 modalStack：它只记录「渲染了遮罩」的浮层，modal: false 的
  // 弹窗从不进入，于是 esc 找不到它、按了没反应。
  escStack: [],

  pushEsc: function(id) {
    if (!id) return;
    if (this.escStack.indexOf(id) > -1) return;
    this.escStack.push(id);
  },

  popEsc: function(id) {
    const index = this.escStack.indexOf(id);
    if (index > -1) this.escStack.splice(index, 1);
  },

  doOnModalClick: function() {
    const topItem = PopupManager.modalStack[PopupManager.modalStack.length - 1];
    if (!topItem) return;

    const instance = PopupManager.getInstance(topItem.id);
    if (instance && instance.closeOnClickModal) {
      instance.close();
    }
  },

  openModal: function(id, zIndex, dom, modalClass, modalFade) {
    if (Vue.prototype.$isServer) return;
    if (!id || zIndex === undefined) return;
    this.modalFade = modalFade;

    const modalStack = this.modalStack;

    for (let i = 0, j = modalStack.length; i < j; i++) {
      const item = modalStack[i];
      if (item.id === id) {
        return;
      }
    }

    const modalDom = getModal();

    // 上一轮关闭的延迟清理还没执行就重新打开了：取消清理，
    // 并立即摘掉 v-modal-leave，否则它会在新遮罩上继续播淡出
    clearModalCloseTimer();
    removeClass(modalDom, 'v-modal-leave');

    addClass(modalDom, 'v-modal');
    if (this.modalFade && !hasModal) {
      addClass(modalDom, 'v-modal-enter');
    }
    if (modalClass) {
      let classArr = modalClass.trim().split(/\s+/);
      classArr.forEach(item => addClass(modalDom, item));
    }
    setTimeout(() => {
      removeClass(modalDom, 'v-modal-enter');
    }, 200);

    if (dom && dom.parentNode && dom.parentNode.nodeType !== 11) {
      dom.parentNode.appendChild(modalDom);
    } else {
      document.body.appendChild(modalDom);
    }

    if (zIndex) {
      modalDom.style.zIndex = zIndex;
    }
    modalDom.tabIndex = 0;
    modalDom.style.display = '';

    this.modalStack.push({ id: id, zIndex: zIndex, modalClass: modalClass });
  },

  closeModal: function(id) {
    const modalStack = this.modalStack;
    const modalDom = getModal();

    if (modalStack.length > 0) {
      const topItem = modalStack[modalStack.length - 1];
      if (topItem.id === id) {
        if (topItem.modalClass) {
          let classArr = topItem.modalClass.trim().split(/\s+/);
          classArr.forEach(item => removeClass(modalDom, item));
        }

        modalStack.pop();
        if (modalStack.length > 0) {
          modalDom.style.zIndex = modalStack[modalStack.length - 1].zIndex;
        }
      } else {
        for (let i = modalStack.length - 1; i >= 0; i--) {
          if (modalStack[i].id === id) {
            modalStack.splice(i, 1);
            break;
          }
        }
      }
    }

    if (modalStack.length === 0) {
      if (this.modalFade) {
        addClass(modalDom, 'v-modal-leave');
      }
      clearModalCloseTimer();
      modalCloseTimer = setTimeout(() => {
        modalCloseTimer = null;
        // 期间可能又打开了：仅在栈仍为空时清理，否则会把新遮罩一起删掉
        if (modalStack.length === 0) {
          if (modalDom.parentNode) modalDom.parentNode.removeChild(modalDom);
          modalDom.style.display = 'none';
          PopupManager.modalDom = undefined;
        }
        removeClass(modalDom, 'v-modal-leave');
      }, 200);
    }
  }
};

Object.defineProperty(PopupManager, 'zIndex', {
  configurable: true,
  get() {
    if (!hasInitZIndex) {
      zIndex = zIndex || (Vue.prototype.$HZQ || {}).zIndex || 2000;
      hasInitZIndex = true;
    }
    return zIndex;
  },
  set(value) {
    zIndex = value;
  }
});

const getTopPopup = function() {
  if (Vue.prototype.$isServer) return;
  // 用 escStack 而非 modalStack：后者只含渲染了遮罩的浮层，
  // modal: false 的弹窗不在其中，会导致 esc 对它无效。
  const stack = PopupManager.escStack;
  if (stack.length > 0) {
    const id = stack[stack.length - 1];
    return PopupManager.getInstance(id);
  }
};

if (!Vue.prototype.$isServer) {
  // handle `esc` key when the popup is shown
  window.addEventListener('keydown', function(event) {
    if (event.keyCode === 27) {
      const topPopup = getTopPopup();

      if (topPopup && topPopup.closeOnPressEscape) {
        topPopup.handleClose
          ? topPopup.handleClose()
          : (topPopup.handleAction ? topPopup.handleAction('cancel') : topPopup.close());
      }
    }
  });
}

export default PopupManager;
