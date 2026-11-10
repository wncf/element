import SvgIcon from './src/svg-icon.vue';

/**
 * 用户自定义 SVG 图标
 *
 * 设计说明：
 * 系统内置图标走 iconfont（packages/icon），类名 hzq-icon-xxx；
 * 用户自定义图标走 svg-sprite，symbol id 为 icon-用户前缀-图标名。
 * 两者命名空间天然隔离，所以不做「与系统图标重名」检测。
 *
 * 用户前缀在 registerSvgIcons 时校验：
 *   - 必填，且不能为空
 *   - 不能是 el / hzq（避免和系统图标、旧命名空间混淆）
 */

// 被占用的前缀，注册时直接拒绝
const RESERVED_PREFIXES = ['', 'el', 'hzq'];

// 已注册的图标：完整 name -> { raw, prefix }
const registry = {};

/**
 * 规范化前缀：去空白、转小写
 */
function normalizePrefix(prefix) {
  return String(prefix || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
}

/**
 * 注册用户自定义图标。
 *
 * @param {string[]|Object} icons 图标名数组（配合 svg-sprite 已有 symbol 时用），
 *                                或 { name: svgContent } 映射
 * @param {Object} options
 * @param {string} options.prefix 必填，用户图标前缀，如 'crm'
 * @param {boolean} options.silent 是否静默失败（默认 false，冲突时抛错）
 * @returns {string[]} 成功注册的完整图标名
 */
export function registerSvgIcons(icons, options = {}) {
  const { silent = false } = options;
  const prefix = normalizePrefix(options.prefix);

  if (!prefix) {
    throw new Error('[hzq-ui] registerSvgIcons 需要显式传入 prefix，例如 { prefix: "crm" }');
  }
  if (RESERVED_PREFIXES.indexOf(prefix) > -1) {
    throw new Error(`[hzq-ui] 前缀 "${prefix}" 为系统保留，请换一个，例如 "crm"、"biz"`);
  }

  const list = Array.isArray(icons)
    ? icons.map(name => ({ name, content: null }))
    : Object.keys(icons || {}).map(name => ({ name, content: icons[name] }));

  const registered = [];

  list.forEach(({ name, content }) => {
    const raw = String(name || '').trim();
    if (!raw) return;

    // 允许用户传已带前缀的名字，也允许只传图标名
    const fullName = raw.indexOf(prefix + '-') === 0 ? raw : `${prefix}-${raw}`;

    if (Object.prototype.hasOwnProperty.call(registry, fullName)) {
      const message = `[hzq-ui] SVG 图标「${fullName}」重复注册，已跳过`;
      if (silent) {
        console.warn(message);
      } else {
        throw new Error(message);
      }
      return;
    }

    registry[fullName] = { raw, prefix, content };
    registered.push(fullName);
  });

  return registered;
}

/**
 * 查询图标是否已注册
 */
export function hasSvgIcon(name) {
  return Object.prototype.hasOwnProperty.call(registry, name);
}

/**
 * 取图标内容（仅运行期注册的才有）
 */
export function getSvgIconContent(name) {
  const item = registry[name];
  return item ? item.content : null;
}

/**
 * 已注册的全部图标名
 */
export function getRegisteredSvgIcons() {
  return Object.keys(registry);
}

/**
 * 清空注册表（主要给单测用）
 */
export function clearSvgIcons() {
  Object.keys(registry).forEach(key => { delete registry[key]; });
}

/* istanbul ignore next */
SvgIcon.install = function(Vue) {
  Vue.component(SvgIcon.name, SvgIcon);
};

export { SvgIcon };
export default SvgIcon;
