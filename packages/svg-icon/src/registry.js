/**
 * 用户自定义 SVG 图标的注册表与运行期注入。
 *
 * 两种使用方式：
 *   1. 只传图标名数组：使用方用 svg-sprite-loader 把 SVG 打成 <symbol>，这里只做登记。
 *   2. 传 { 名称: svg 内容 } 映射：这里在运行期解析字符串并注入 <symbol>，无需构建配置。
 *
 * 两种方式最终都产出 id 为 icon-完整名称 的 <symbol>，组件统一用 <use> 引用。
 */

const SVG_NS = 'http://www.w3.org/2000/svg';

// 被占用的前缀，注册时直接拒绝
const RESERVED_PREFIXES = ['', 'el', 'hzq'];

// 已注册的图标：完整 name -> { raw, prefix, content }
const registry = {};

// 已注入 DOM 的图标名，避免重复插入
const injected = {};

// 承载全部 symbol 的隐藏容器
let container = null;

/**
 * 规范化前缀：去空白、转小写
 */
function normalizePrefix(prefix) {
  return String(prefix || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
}

function ensureContainer() {
  if (container && container.parentNode) return container;
  // 注册可能发生在 body 可用之前（如入口模块顶层执行），此时先挂到 documentElement
  const parent = document.body || document.documentElement;
  if (!parent) return null;
  container = document.createElementNS(SVG_NS, 'svg');
  container.setAttribute('xmlns', SVG_NS);
  container.setAttribute('aria-hidden', 'true');
  container.setAttribute('style', 'position:absolute;width:0;height:0;overflow:hidden');
  parent.appendChild(container);
  return container;
}

/**
 * 把 svg 字符串解析成 <symbol> 并注入页面。
 * 解析失败（不是合法 svg）时打印警告并跳过，不抛错，避免影响应用启动。
 */
function inject(name, content) {
  /* istanbul ignore if */
  if (typeof document === 'undefined') return false;

  const symbolId = `icon-${name}`;
  if (injected[name] || document.getElementById(symbolId)) {
    injected[name] = true;
    return true;
  }

  // 没有 xmlns 的 svg 字符串，DOMParser 解析出的节点 namespaceURI 为 null，
  // 放进 <symbol> 后浏览器不会当作图形渲染（表现为完全空白）。
  // 这里在解析前补齐命名空间声明。
  let source = String(content).trim();
  if (!/^<svg[^>]*\sxmlns\s*=/.test(source)) {
    source = source.replace(/^<svg/, `<svg xmlns="${SVG_NS}"`);
  }

  let parsed;
  try {
    parsed = new DOMParser().parseFromString(source, 'image/svg+xml');
  } catch (e) {
    console.warn(`[hzq-ui] SVG 图标「${name}」内容解析失败，已跳过`);
    return false;
  }

  const root = parsed && parsed.documentElement;
  if (!root || root.nodeName.toLowerCase() !== 'svg' || parsed.querySelector('parsererror')) {
    console.warn(`[hzq-ui] SVG 图标「${name}」内容不是合法的 <svg>，已跳过`);
    return false;
  }

  const symbol = document.createElementNS(SVG_NS, 'symbol');
  symbol.setAttribute('id', symbolId);

  // 优先沿用原 svg 的 viewBox；没有则用 width/height 推导
  const viewBox = root.getAttribute('viewBox');
  if (viewBox) {
    symbol.setAttribute('viewBox', viewBox);
  } else {
    const width = parseFloat(root.getAttribute('width'));
    const height = parseFloat(root.getAttribute('height'));
    if (width && height) {
      symbol.setAttribute('viewBox', `0 0 ${width} ${height}`);
    }
  }

  // importNode 返回的是克隆，原节点仍在 root 上，不能边遍历边判断 firstChild
  Array.prototype.slice.call(root.childNodes).forEach(child => {
    symbol.appendChild(document.importNode(child, true));
  });

  if (!symbol.firstChild) {
    console.warn(`[hzq-ui] SVG 图标「${name}」没有可渲染的内容，已跳过`);
    return false;
  }

  const target = ensureContainer();
  if (!target) {
    // DOM 还不可用，交由组件挂载时兜底注入
    return false;
  }
  target.appendChild(symbol);
  injected[name] = true;
  return true;
}

/**
 * 注册用户自定义图标。
 *
 * @param {string[]|Object} icons 图标名数组（配合 svg-sprite 已有 symbol 时用），
 *                                或 { name: svgContent } 映射（运行期注入，无需构建配置）
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
    if (content) inject(fullName, content);
    registered.push(fullName);
  });

  return registered;
}

/**
 * 确保某个图标的 symbol 已注入 DOM。
 * 给组件在挂载时兜底调用，覆盖「注册早于 body 可用」的情况。
 */
export function ensureSvgIconInjected(name) {
  const item = registry[name];
  if (!item || !item.content) return false;
  return inject(name, item.content);
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
 * 清空注册表与已注入的 symbol（主要给单测用）
 */
export function clearSvgIcons() {
  Object.keys(registry).forEach(key => { delete registry[key]; });
  Object.keys(injected).forEach(key => { delete injected[key]; });
  if (container && container.parentNode) {
    container.parentNode.removeChild(container);
  }
  container = null;
}
