import Vue from 'vue';
import { PopupManager } from 'hzq-ui/src/utils/popup';

// 全局浮层配置，由插件安装时写入，组件内的定位逻辑共用
const DEFAULTS = {
  appendTo: 'body',
  boundariesElement: 'viewport',
  boundariesPadding: undefined,
  zIndex: 2000
};

const config = Object.assign({}, DEFAULTS);

const isElement = el => !!(el && el.nodeType === 1);

export const setPopperConfig = (options = {}) => {
  Object.keys(DEFAULTS).forEach(key => {
    if (options[key] === undefined) return;
    // null 表示显式清空，回落到默认值
    const value = options[key] === null ? DEFAULTS[key] : options[key];
    if (key === 'zIndex') {
      config.zIndex = value;
      PopupManager.zIndex = value;
    } else {
      config[key] = value;
    }
  });
};

export const getPopperConfig = () => Object.assign({}, config);

/**
 * 把 appendTo 的取值解析成挂载容器。
 * 每次调用都实时解析（micro-app 容器可能在插件安装后才注入），不缓存元素。
 * 解析失败或结果为 null 时回落到 document.body；SSR 下返回 null 由调用方跳过。
 * @param {String|HTMLElement|Function} spec
 * @returns {HTMLElement|null}
 */
export const resolveContainer = spec => {
  if (Vue.prototype.$isServer) return null;
  const fallback = () => document.body;
  if (!spec) return fallback();
  if (typeof spec === 'function') {
    try {
      const el = spec();
      return isElement(el) ? el : fallback();
    } catch (e) {
      return fallback();
    }
  }
  if (typeof spec === 'string') {
    try {
      return document.querySelector(spec) || fallback();
    } catch (e) {
      return fallback();
    }
  }
  return isElement(spec) ? spec : fallback();
};

/**
 * 把 boundariesElement 的取值解析成 popper 认识的形式。
 * 'viewport' / 'window' / 'scrollParent' 原样返回；其它字符串按选择器查。
 *
 * 选择器查不到时必须回落到 'viewport'，不能把字符串原样透传：vendored popper 的
 * _getBoundaries 只认上述三个关键字或真实元素，未知字符串会走进 getOffsetRect(string)
 * 分支，算出 NaN 边界，结果是不报错但也完全不约束位置——配置看着生效了，实际没有。
 * @param {String|HTMLElement|Function} spec
 * @returns {String|HTMLElement}
 */
export const resolveBoundaries = spec => {
  if (spec === undefined || spec === null) return 'viewport';
  if (typeof spec === 'function') {
    try {
      return spec() || 'viewport';
    } catch (e) {
      return 'viewport';
    }
  }
  if (typeof spec === 'string') {
    if (spec === 'viewport' || spec === 'window' || spec === 'scrollParent') return spec;
    try {
      return document.querySelector(spec) || 'viewport';
    } catch (e) {
      return 'viewport';
    }
  }
  return isElement(spec) ? spec : 'viewport';
};

export default config;
