import Vue from 'vue';
import merge from 'hzq-ui/src/utils/merge';
import DrawerInstance from './drawer-instance.vue';

const DrawerConstructor = Vue.extend(DrawerInstance);

const defaults = {
  title: '',
  type: 'alert',
  size: '',
  direction: 'rtl',
  maskClose: false,
  escClose: true,
  showClose: true,
  withHeader: true,
  confirmButtonText: '',
  cancelButtonText: '',
  content: '',
  border: false
};

const QUEUE_INTERVAL = 500;

const queue = [];
const mountedInstances = [];
let activeCount = 0;
let queueTimer = null;

function mountInstance(entry) {
  const options = merge({}, defaults, entry.options);
  const renderFn = entry.renderFn;

  const instance = new DrawerConstructor({
    propsData: {
      title: options.title,
      type: options.type,
      size: options.size,
      direction: options.direction,
      maskClose: options.maskClose,
      escClose: options.escClose,
      showClose: options.showClose,
      withHeader: options.withHeader,
      confirmButtonText: options.confirmButtonText,
      cancelButtonText: options.cancelButtonText,
      content: options.content,
      border: options.border,
      renderFn: renderFn || null,
      onConfirm: options.type === 'confirm' ? options.confirm : null,
      onCancel: options.cancel
    }
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
  mountInstance(entry);
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

const drawer = function(options, renderFn) {
  if (Vue.prototype.$isServer) return;

  if (typeof options !== 'object') {
    options = {
      content: options
    };
  }

  const entry = {
    options,
    renderFn: typeof renderFn === 'function' ? renderFn : null,
    queued: false,
    mounted: false
  };

  if (activeCount > 0) {
    if (options.stack) {
      mountInstance(entry);
    } else {
      entry.queued = true;
      queue.push(entry);
    }
    return;
  }

  entry.queued = true;
  queue.push(entry);
  drainQueue();
};

export function resetDrawerService() {
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

export default drawer;
