/**
 * 主题换色工具
 *
 * 背景：主题 token（见 packages/theme-chalk/src/common/tokens.scss）在编译期已经生成了
 * 品牌色的全部衍生档：主色、rgb 三元组、light-1..9、hover、shade。
 * 其中 light-1..9 的取值只由「品牌色 + 当前明暗模式的混合目标色（blend-base）」决定，
 * 所以运行期只要拿到一个主色，就能用本模块按同样的公式算齐其余变量。
 *
 * 这里存在的必要性：light-1..9 在 CSS 里是编译期算好的字面量，
 * 单独覆盖 --hzq-color-primary 会让这些衍生档留在旧色相上（hover、plain 底色、tag、树选中底色都会串色）。
 *
 * 用法：
 *   import { applyTheme, setThemeMode, resetTheme } from 'hzq-ui/src/utils/theme';
 *   applyTheme({ primary: '#16a34a' });   // 只给主色，其余自动推导
 *   setThemeMode('dark');                 // 切深色，并把已接管的主色按深色重新推导
 *   resetTheme();                         // 交还给编译期主题（CSS 里的预设）
 *
 * 约定：只接管调用方显式设置过的品牌色，没设置过的仍由 CSS 决定，
 * 因此本模块和 .hzq-theme-green / .hzq-theme-dark 这类预设类可以共存。
 */

// 与 palette.scss 的 $--brand-default 对齐：新增品牌色时两边都要加
export const BRAND_COLOR_NAMES = ['primary', 'success', 'warning', 'danger', 'info'];

export const DARK_MODE_CLASS = 'hzq-theme-dark';

const TOKEN_PREFIX = '--hzq-color-';
const BLEND_BASE_TOKEN = '--hzq-color-blend-base';
const LIGHT_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// 与 tokens.scss 的 mix 权重一一对应，改动必须同步
const LIGHT_STEP_WEIGHT = 0.1;
const HOVER_TINT_WEIGHT = 0.2;
const SHADE_TINT_WEIGHT = 0.1;

const WHITE = { r: 255, g: 255, b: 255 };
const BLACK = { r: 0, g: 0, b: 0 };

// 与 palette.scss 的 $--brightness-modes 对齐，读不到 CSS 变量时兜底
const FALLBACK_BLEND_BASE = {
  light: WHITE,
  // #1e293b：与 palette.scss 深色模式的 bg-color 一致
  dark: { r: 30, g: 41, b: 59 }
};

function getRootElement() {
  return typeof document === 'undefined' ? null : document.documentElement;
}

function readToken(name, root) {
  if (typeof window === 'undefined' || !window.getComputedStyle) return '';
  return (window.getComputedStyle(root).getPropertyValue(name) || '').trim();
}

/**
 * 解析颜色字面量，只接受 #rgb / #rrggbb / rgb(r, g, b)。
 * 解析不出来返回 null——宁可不改，也不要猜出一个错色相。
 */
export function parseColor(value) {
  if (typeof value !== 'string') return null;

  const hex = value.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const digits = hex[1];
    const full = digits.length === 3
      ? digits.split('').map(char => char + char).join('')
      : digits;

    return {
      r: parseInt(full.slice(0, 2), 16),
      g: parseInt(full.slice(2, 4), 16),
      b: parseInt(full.slice(4, 6), 16)
    };
  }

  const rgb = value.trim().match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*[\d.]+\s*)?\)$/i);
  if (!rgb) return null;

  return {
    r: Math.min(255, parseInt(rgb[1], 10)),
    g: Math.min(255, parseInt(rgb[2], 10)),
    b: Math.min(255, parseInt(rgb[3], 10))
  };
}

/**
 * 与 Sass 的 mix() 等价：weight 是 from 的占比，逐通道四舍五入。
 * 必须和 tokens.scss 的结果完全一致，否则编译期主题与运行期换色会出现肉眼可见的色差。
 */
export function mixColor(from, to, weight) {
  const channel = key => Math.round(from[key] * weight + to[key] * (1 - weight));

  return { r: channel('r'), g: channel('g'), b: channel('b') };
}

function toHex(color) {
  const part = value => {
    const hex = value.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };

  return `#${part(color.r)}${part(color.g)}${part(color.b)}`;
}

/**
 * 纯计算：一个品牌色 + 当前模式的混合目标色 ⇒ 该品牌色的 13 个 token。
 * 拆出来是为了可单测（见 test/unit/specs/theme.spec.js）。
 */
export function createBrandTokens(name, color, blendBase) {
  const tokens = {};

  tokens[`${TOKEN_PREFIX}${name}`] = toHex(color);
  tokens[`${TOKEN_PREFIX}${name}-rgb`] = `${color.r}, ${color.g}, ${color.b}`;

  LIGHT_LEVELS.forEach(level => {
    tokens[`${TOKEN_PREFIX}${name}-light-${level}`] = toHex(
      mixColor(blendBase, color, level * LIGHT_STEP_WEIGHT)
    );
  });

  tokens[`${TOKEN_PREFIX}${name}-hover`] = toHex(mixColor(WHITE, color, HOVER_TINT_WEIGHT));
  tokens[`${TOKEN_PREFIX}${name}-shade`] = toHex(mixColor(BLACK, color, SHADE_TINT_WEIGHT));

  return tokens;
}

function writeTokens(tokens, root) {
  Object.keys(tokens).forEach(key => root.style.setProperty(key, tokens[key]));
}

// 混合目标色由明暗轴决定，运行期必须跟着 CSS 走，否则深色下算出的浅色档会偏亮
function readBlendBase(root) {
  const parsed = parseColor(readToken(BLEND_BASE_TOKEN, root));
  if (parsed) return parsed;

  return root.classList.contains(DARK_MODE_CLASS) ? FALLBACK_BLEND_BASE.dark : FALLBACK_BLEND_BASE.light;
}

// 只有行内样式里的值才算"被 JS 接管"，避免抢掉 CSS 预设（.theme-green 等）
function readOwnedColor(name, root) {
  return parseColor(root.style.getPropertyValue(`${TOKEN_PREFIX}${name}`));
}

function removeBrandTokens(name, root) {
  const keys = [`${TOKEN_PREFIX}${name}`, `${TOKEN_PREFIX}${name}-rgb`, `${TOKEN_PREFIX}${name}-hover`, `${TOKEN_PREFIX}${name}-shade`];

  LIGHT_LEVELS.forEach(level => keys.push(`${TOKEN_PREFIX}${name}-light-${level}`));
  keys.forEach(key => root.style.removeProperty(key));
}

/**
 * 设置品牌色。传一个主色即可，light-1..9 / hover / shade / rgb 三元组会自动补齐。
 * colors 形如 { primary: '#16a34a', success: '#0e9f6e' }，未出现的品牌色保持 CSS 的取值。
 */
export function applyTheme(colors, root = getRootElement()) {
  if (!root || !colors) return;

  const blendBase = readBlendBase(root);

  Object.keys(colors).forEach(name => {
    const color = parseColor(colors[name]);
    if (!color) return;

    writeTokens(createBrandTokens(name, color, blendBase), root);
  });
}

/**
 * 切明暗模式：只切换根元素上的类，中性色由 CSS 负责；
 * 已被 JS 接管过的品牌色按新模式的混合目标色重新推导，保证在深色底上依然正确。
 */
export function setThemeMode(mode, root = getRootElement()) {
  if (!root) return;

  root.classList.toggle(DARK_MODE_CLASS, mode === 'dark');
  refreshBrandTokens(root);
}

export function getThemeMode(root = getRootElement()) {
  if (!root) return 'light';

  return root.classList.contains(DARK_MODE_CLASS) ? 'dark' : 'light';
}

// 明暗切换后重算：只处理被接管的品牌色，CSS 预设的品牌色不碰
export function refreshBrandTokens(root = getRootElement()) {
  if (!root) return;

  const blendBase = readBlendBase(root);

  BRAND_COLOR_NAMES.forEach(name => {
    const color = readOwnedColor(name, root);
    if (!color) return;

    writeTokens(createBrandTokens(name, color, blendBase), root);
  });
}

/**
 * 撤销运行期换色，把主题交回编译期（CSS 里的默认色或 .theme-green 之类的预设类）。
 */
export function resetTheme(root = getRootElement()) {
  if (!root) return;

  BRAND_COLOR_NAMES.forEach(name => removeBrandTokens(name, root));
}
