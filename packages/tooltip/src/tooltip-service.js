import Vue from 'vue';
import TooltipService from './tooltip-service.vue';
import { getPopperConfig, resolveContainer } from 'hzq-ui/src/utils/popper-config';

let instance = null;

function ensureInstance() {
  if (instance) return instance;
  const Ctor = Vue.extend(TooltipService);
  instance = new Ctor();
  instance.$mount();
  // 单例只在首次创建时挂载，此后再改 appendTo 不会迁移已有实例
  const container = resolveContainer(getPopperConfig().appendTo);
  if (container) container.appendChild(instance.$el);
  return instance;
}

function isPlainText(value) {
  return typeof value === 'string' || typeof value === 'number';
}

const noop = () => {};

/**
 * 显示一个悬浮提示（全局单例，同一时刻仅一个）
 * @param {Object|String|Number} options 配置对象，或直接传提示文字
 * @param {HTMLElement} options.target 目标元素
 * @param {String} options.content 提示文字
 * @param {String} [options.placement='top'] 方向：top|bottom|left|right，可带 -start/-end
 * @param {String} [options.effect='dark'] 主题：dark|light
 * @param {Number|String} [options.maxWidth=360]
 * @param {Number} [options.offset=0]
 * @param {String} [options.popperClass]
 * @returns {{ hide: Function, update: Function }}
 */
export function tooltip(options) {
  if (Vue.prototype.$isServer) return { hide: noop, update: noop };

  let opts = options;
  if (!opts || typeof opts !== 'object') {
    opts = { content: opts };
  }
  if (!opts.target || opts.target.nodeType !== 1) return { hide: noop, update: noop };
  if (!isPlainText(opts.content) || !String(opts.content).trim()) {
    return { hide: noop, update: noop };
  }

  const vm = ensureInstance();
  vm.show(opts);

  return {
    hide: hideTooltip,
    update: () => vm.updatePosition()
  };
}

/**
 * 隐藏当前悬浮提示
 */
export function hideTooltip() {
  if (instance) instance.hide();
}

/**
 * 元素被移除时调用：若当前提示正指向该元素，先关闭并释放引用，
 * 避免单例长期持有已卸载的 DOM（v-for / 虚拟滚动场景）
 * @param {HTMLElement} el
 */
export function releaseTarget(el) {
  if (!instance || !el) return;
  if (instance.$el === el || instance.$refs.popper === el) return;
  if (instance.target !== el) return;
  instance.hide();
  instance.target = null;
}

export default tooltip;
