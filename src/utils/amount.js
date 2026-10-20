/**
 * 金额输入的工具函数
 *
 * 为什么单独抽出来：过滤字符、收敛范围、补齐小数这三段都是纯字符串/数字运算，
 * 和 Vue 无关。放在这里可以脱离组件单测，表格、导出等场景也能复用。
 *
 * 约定（与 amount-input 的 v-model 保持一致）：
 * - 值一律用字符串表示，空串表示"没填"。金额用 Number 往返会丢精度，大额还会变成科学计数法。
 * - "编辑态"（用户正在打字）不补齐小数位，也不吞掉正在输入的小数点；
 *   只有失焦才补齐成 precision 位。
 *
 * 各函数共用的 options：
 * { precision = 2, min = -Infinity, max = Infinity, allowNegative = false }
 */

export const DEFAULT_PRECISION = 2;

// ０-９ 是 U+FF10 起，与半角 0-9 相差 0xFEE0；中文输入法下打出的金额经常是全角
const FULL_WIDTH_DIGITS = /[０-９]/g;
const FULL_WIDTH_MARKS = /[．。]/g;
const FULL_WIDTH_MINUS = /－/g;

/**
 * 全角转半角：数字、小数点、负号。
 * 用逐字符换算而不是整串正则，是为了只处理数字相关字符，不误伤其它内容。
 */
export function toHalfWidth(text) {
  return text
    .replace(FULL_WIDTH_DIGITS, char => String.fromCharCode(char.charCodeAt(0) - 0xfee0))
    .replace(FULL_WIDTH_MARKS, '.')
    .replace(FULL_WIDTH_MINUS, '-');
}

/**
 * 清洗成合法的"编辑态"文本：只留数字、至多一个小数点、可选的前导负号。
 * 小数位超出 precision 的部分直接丢弃——不是四舍五入，因为边打边跳会让用户很难输。
 */
export function sanitizeAmount(raw, options = {}) {
  const { precision = DEFAULT_PRECISION, allowNegative = false } = options;

  if (raw === null || raw === undefined) return '';

  // 粘贴进来的金额常带千分位逗号、货币符号、空格，一律去掉
  const text = toHalfWidth(String(raw)).replace(allowNegative ? /[^\d.-]/g : /[^\d.]/g, '');
  const negative = allowNegative && text.charAt(0) === '-';
  const body = text.replace(/-/g, '');

  // 只收整数时，小数点及其后面的内容一并舍去。
  // 不能在整数模式下把小数点当普通非法字符删掉再拼接："1,234.56" 会变成 123456，
  // 金额一下放大一百倍，比丢掉小数更糟。
  if (precision <= 0) {
    const integer = body.split('.')[0].replace(/^0+(?=\d)/, '');
    // 只输入了负号时保留住，否则用户永远拼不出负数
    if (negative && body === '') return '-';
    return (negative ? '-' : '') + integer;
  }

  const dotIndex = body.indexOf('.');
  const hasDot = dotIndex !== -1;
  let integerPart = (hasDot ? body.slice(0, dotIndex) : body).replace(/\./g, '').replace(/^0+(?=\d)/, '');
  let decimalPart = hasDot ? body.slice(dotIndex + 1).replace(/\./g, '') : '';

  decimalPart = decimalPart.slice(0, precision);

  if (!hasDot) {
    // 只输入了负号时保留住，否则用户永远拼不出负数
    if (negative && integerPart === '') return '-';
    return (negative ? '-' : '') + integerPart;
  }

  // 只输入了小数点时补成 "0."，后续数字才能正常接上
  const integer = integerPart || '0';
  return (negative ? '-' : '') + `${integer}.${decimalPart}`;
}

/**
 * 解析成数字；空串、单独的负号/小数点是"还没输完"的中间态，返回 null。
 */
export function parseAmount(text) {
  if (text === null || text === undefined || text === '') return null;
  if (text === '-' || text === '.' || text === '-.') return null;

  const value = Number(text);
  return isNaN(value) ? null : value;
}

/**
 * 即时收敛到 [min, max]，返回的仍是"编辑态"文本（不补零）。
 *
 * min 有个例外：整数部分还能继续追加数字时先不收敛。
 * 否则 min=100 时敲下第一个 5 就变成 100，用户根本输不进 500。
 * max 没有这个问题——继续加数字只会更大，超了直接截断即可。
 */
export function clampAmount(text, options = {}) {
  const { min = -Infinity, max = Infinity } = options;
  const value = parseAmount(text);
  if (value === null) return text;

  if (value > max) return String(max);
  if (value < min && !canStillReachMin(text, min)) return String(min);

  return text;
}

/**
 * 失焦时用：补齐 precision 位小数，并硬收敛到 [min, max]。
 * 与 clampAmount 的区别是 min 不再留"还能继续输入"的余地——输入已经结束了。
 */
export function normalizeAmount(text, options = {}) {
  const { precision = DEFAULT_PRECISION, min = -Infinity, max = Infinity } = options;

  // 这里一律保留负号再解析：不允许负数时，-5 应该被收敛到下限 0，
  // 而不是因为负号被过滤掉，反而变成正数 5
  const value = parseAmount(sanitizeAmount(text, { precision, allowNegative: true }));
  if (value === null) return '';

  let final = value;
  if (final < min) final = min;
  if (final > max) final = max;

  return final.toFixed(precision);
}

// 整数部分还能靠继续输入够到 min 吗？
// 已经出现小数点、或者本身是负数，都说明后面再怎么输只会更小。
function canStillReachMin(text, min) {
  if (min <= 0) return false;
  if (text.indexOf('.') !== -1) return false;
  if (text.charAt(0) === '-') return false;

  return Number(text) < min;
}
