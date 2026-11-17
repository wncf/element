import { on, off } from 'hzq-ui/src/utils/dom';
import { isOverflow, readInnerText } from 'hzq-ui/src/utils/overflow';
import { tooltip, releaseTarget } from './tooltip-service';

const ELLIPSIS_STYLE = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
};

const DEFAULT_DELAY = 200;

const STATE_KEY = '__hzqTooltip__';

const noop = () => {};

/** 当前正在展示指令提示的元素，保证 mouseleave 只关自己的提示 */
let activeEl = null;

function isPlainText(value) {
  return typeof value === 'string' || typeof value === 'number';
}

/**
 * 解析 binding 为统一配置
 * 优先级：对象字段 > 修饰符 / 参数 > 默认值
 */
function resolveOptions(binding) {
  const modifiers = binding.modifiers || {};
  const rawValue = binding.value;
  const valueOptions = rawValue && typeof rawValue === 'object' && !Array.isArray(rawValue)
    ? rawValue
    : {};

  // 悬浮即提示：不判断是否溢出
  const always = !!(modifiers.always || valueOptions.always);

  // 省略样式：默认开启（溢出场景）；always 模式默认关闭，可用 .ellipsis 强制打开
  // Vue 不 camelize 修饰符，`.no-ellipsis` 的 key 仍为 'no-ellipsis'
  const noEllipsis = !!(modifiers.noEllipsis || modifiers['no-ellipsis']);
  let ellipsis = !always;
  if (modifiers.ellipsis || valueOptions.ellipsis === true) ellipsis = true;
  if (noEllipsis || valueOptions.ellipsis === false) ellipsis = false;

  const options = {
    placement: binding.arg || valueOptions.placement || 'top',
    effect: modifiers.light ? 'light' : (valueOptions.effect || 'dark'),
    maxWidth: valueOptions.maxWidth,
    offset: valueOptions.offset,
    popperClass: valueOptions.popperClass,
    delay: valueOptions.delay == null ? DEFAULT_DELAY : valueOptions.delay,
    disabled: !!valueOptions.disabled,
    always,
    ellipsis
  };

  // 绑定值直接传文本时作为提示内容
  options.content = isPlainText(rawValue) ? String(rawValue) : valueOptions.content;

  return options;
}

function applyEllipsis(el, state) {
  if (state.ellipsisApplied) return;
  state.ellipsisApplied = true;
  state.originalStyle = {
    overflow: el.style.overflow,
    textOverflow: el.style.textOverflow,
    whiteSpace: el.style.whiteSpace
  };
  Object.keys(ELLIPSIS_STYLE).forEach(key => {
    el.style[key] = ELLIPSIS_STYLE[key];
  });
}

function restoreEllipsis(el, state) {
  if (!state.ellipsisApplied) return;
  state.ellipsisApplied = false;
  const original = state.originalStyle || {};
  Object.keys(ELLIPSIS_STYLE).forEach(key => {
    el.style[key] = original[key] || '';
  });
  state.originalStyle = null;
}

function resolveContent(el, options) {
  if (options.content != null && String(options.content).trim()) {
    return String(options.content).trim();
  }
  return readInnerText(el);
}

function resolveShow(el, state) {
  const { options } = state;
  if (options.disabled) return null;
  const content = resolveContent(el, options);
  if (!content) return null;
  if (!options.always && !isOverflow(el)) return null;
  return content;
}

function clearTimer(state) {
  if (state.timer) {
    clearTimeout(state.timer);
    state.timer = null;
  }
}

function hide(el) {
  const state = el[STATE_KEY];
  if (state) clearTimer(state);
  if (activeEl === el) activeEl = null;
  // 元素被移除或配置变更时释放单例对它的引用
  releaseTarget(el);
}

function handleEnter(el) {
  const state = el[STATE_KEY];
  if (!state) return;
  clearTimer(state);
  const content = resolveShow(el, state);
  if (!content) return;

  const { options } = state;
  const show = () => {
    state.timer = null;
    activeEl = el;
    tooltip({
      target: el,
      content,
      placement: options.placement,
      effect: options.effect,
      maxWidth: options.maxWidth,
      offset: options.offset,
      popperClass: options.popperClass
    });
  };

  if (options.delay > 0) {
    state.timer = setTimeout(show, options.delay);
  } else {
    show();
  }
}

function handleLeave(el) {
  const state = el[STATE_KEY];
  if (state) clearTimer(state);
  // 已显示时不在指令里立即关闭：浮层服务自己监听触发元素的 mouseleave，
  // 用延时关闭来留出鼠标移入浮层（选文字、复制）的时间
}

function bind(el, binding) {
  const previous = el[STATE_KEY];
  if (previous) {
    off(el, 'mouseenter', previous.onEnter);
    off(el, 'mouseleave', previous.onLeave);
    restoreEllipsis(el, previous);
  }
  if (el.nodeType !== 1) return;

  const options = resolveOptions(binding);
  const state = {
    options,
    timer: null,
    ellipsisApplied: false,
    originalStyle: null,
    onEnter: noop,
    onLeave: noop
  };
  state.onEnter = () => handleEnter(el);
  state.onLeave = () => handleLeave(el);

  el[STATE_KEY] = state;

  if (options.ellipsis) applyEllipsis(el, state);

  on(el, 'mouseenter', state.onEnter);
  on(el, 'mouseleave', state.onLeave);
}

function update(el, binding) {
  const state = el[STATE_KEY];
  if (!state) return;

  // 模板中的对象字面量每次渲染都是新引用，按值比较避免无意义重建
  const next = resolveOptions(binding);
  if (JSON.stringify(next) === JSON.stringify(state.options)) return;

  // 配置变化后重建，逻辑复用 bind，先解绑旧监听与样式
  hide(el);
  bind(el, binding);
}

function unbind(el) {
  const state = el[STATE_KEY];
  if (!state) return;
  hide(el);
  off(el, 'mouseenter', state.onEnter);
  off(el, 'mouseleave', state.onLeave);
  restoreEllipsis(el, state);
  delete el[STATE_KEY];
}

export default {
  bind,
  update,
  unbind
};
