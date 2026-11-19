import Vue from 'vue';
import merge from 'hzq-ui/src/utils/merge';
import DialogInstance from './dialog-instance.vue';

const DialogConstructor = Vue.extend(DialogInstance);

const defaults = {
  title: '',
  type: 'alert',
  width: '',
  fullscreen: false,
  modal: true,
  maskClose: false,
  escClose: true,
  showClose: true,
  confirmButtonText: '',
  cancelButtonText: '',
  content: '',
  icon: '',
  hideFooter: false,
  border: false,
  // 默认叠在上一个弹窗之上，与业务方既有的「多弹窗共存」用法一致；
  // 传 stack: false 才改为排队，等前一个关闭后再显示。
  stack: true
};

const QUEUE_INTERVAL = 500;

const queue = [];
const mountedInstances = [];
let activeCount = 0;
let queueTimer = null;

function mountInstance(entry) {
  const options = merge({}, defaults, entry.options);
  const renderFn = entry.renderFn;

  const instance = new DialogConstructor({
    propsData: {
      title: options.title,
      type: options.type,
      width: options.width,
      fullscreen: options.fullscreen,
      modal: options.modal,
      maskClose: options.maskClose,
      escClose: options.escClose,
      showClose: options.showClose,
      confirmButtonText: options.confirmButtonText,
      cancelButtonText: options.cancelButtonText,
      content: options.content,
      icon: options.icon,
      hideFooter: options.hideFooter,
      border: options.border,
      zIndex: options.zIndex,
      renderFn: renderFn || null,
      onConfirm: options.confirm,
      onCancel: options.cancel,
      onOpen: options.open
    },
    // parent 必须在构造时传入：$store / $route / inject 都是在实例初始化阶段
    // 沿 $parent 链解析的，构造完再赋值就来不及了。
    parent: entry.parent
  });

  activeCount++;

  instance.$once('destroy', () => {
    if (instance.$el && instance.$el.parentNode) {
      instance.$el.parentNode.removeChild(instance.$el);
    }
    instance.$destroy();
    activeCount--;
    const mountedIndex = mountedInstances.indexOf(instance);
    if (mountedIndex > -1) {
      mountedInstances.splice(mountedIndex, 1);
    }

    if (entry.queued) {
      const index = queue.indexOf(entry);
      if (index > -1) {
        queue.splice(index, 1);
      }
      scheduleDrainQueue();
    }
  });

  instance.$mount();
  document.body.appendChild(instance.$el);
  mountedInstances.push(instance);

  // 对外始终返回实例代理（visible / loading / close / $refs / $el）
  return instance.getInstance();
}

function drainQueue() {
  if (activeCount > 0 || !queue.length) {
    return;
  }

  const entry = queue.find(item => !item.mounted);
  if (!entry) {
    return;
  }

  entry.mounted = true;
  entry.instance = mountInstance(entry);
}

function scheduleDrainQueue() {
  if (queueTimer) {
    clearTimeout(queueTimer);
  }
  queueTimer = setTimeout(() => {
    queueTimer = null;
    drainQueue();
  }, QUEUE_INTERVAL);
}

const dialog = function(options, renderFn) {
  if (Vue.prototype.$isServer) return;

  if (typeof options !== 'object') {
    options = {
      content: options
    };
  }

  const merged = merge({}, defaults, options);
  // this.$dialog() 调用时 this 是业务组件，用它接上 store / route / provide
  const caller = this && this._isVue ? this : null;

  const entry = {
    options,
    renderFn: typeof renderFn === 'function' ? renderFn : null,
    parent: options.parent || caller,
    queued: false,
    mounted: false,
    instance: null
  };

  if (activeCount > 0) {
    if (merged.stack) {
      entry.instance = mountInstance(entry);
      return entry.instance;
    }
    entry.queued = true;
    queue.push(entry);
    return createPendingProxy(entry);
  }

  entry.queued = true;
  queue.push(entry);
  drainQueue();
  return entry.instance || createPendingProxy(entry);
};

// 排队中的弹窗还没有实例，先给一个代理，实例挂载后把读写转发过去
function createPendingProxy(entry) {
  return {
    get visible() {
      return entry.instance ? entry.instance.visible : false;
    },
    set visible(val) {
      if (entry.instance) entry.instance.visible = val;
    },
    get loading() {
      return entry.instance ? entry.instance.loading : false;
    },
    set loading(val) {
      if (entry.instance) entry.instance.loading = val;
    },
    get $refs() {
      return entry.instance ? entry.instance.$refs : {};
    },
    get $el() {
      return entry.instance ? entry.instance.$el : null;
    },
    close() {
      if (entry.instance) entry.instance.close();
    }
  };
}

export function resetDialogService() {
  if (queueTimer) {
    clearTimeout(queueTimer);
    queueTimer = null;
  }

  mountedInstances.slice().forEach(instance => {
    instance.$destroy();
    if (instance.$el && instance.$el.parentNode) {
      instance.$el.parentNode.removeChild(instance.$el);
    }
  });

  mountedInstances.length = 0;
  queue.length = 0;
  activeCount = 0;
}

export default dialog;
