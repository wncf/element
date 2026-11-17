/**
 * 文本溢出检测工具
 * 容差 1px，避免亚像素、缩放导致 scrollWidth/clientWidth 取整误差误判
 */

function isNodeOverflow(node) {
  if (!node) return false;
  return (
    node.scrollWidth > node.clientWidth + 1 ||
    node.scrollHeight > node.clientHeight + 1
  );
}

/**
 * 元素（含其直接子节点）是否被截断
 * @param {HTMLElement} el
 * @returns {Boolean}
 */
export function isOverflow(el) {
  if (!el || el.nodeType !== 1) return false;
  if (isNodeOverflow(el)) return true;
  const children = el.children || [];
  for (let i = 0; i < children.length; i++) {
    if (isNodeOverflow(children[i])) return true;
  }
  return false;
}

/**
 * 读取元素可读文本，压缩空白
 * @param {HTMLElement} el
 * @returns {String}
 */
export function readInnerText(el) {
  if (!el) return '';
  return String(el.innerText || el.textContent || '')
    .replace(/\s+/g, ' ')
    .trim();
}
