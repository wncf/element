#!/usr/bin/env node
/* eslint-env node, es6 */
'use strict';

/**
 * 校验按需引入的 token 完整性。
 *
 * 主题 token（--hzq-*）只在 theme-chalk/base.css 里定义一次，组件产物只保留
 * var() 引用。按需引入时 babel-plugin-component 会自动引入 base.css，所以
 * 只要 base.css 定义了组件引用到的全部 token，单独引任意组件都不会掉色。
 *
 * 本脚本在构建后运行，任何组件引用了 base 里没有的 token 都会失败——
 * 这是把 token 定义从每个组件产物里抽走后容易踩的坑。
 *
 * 用法：node build/bin/check-theme-tokens.js [theme-chalk 产物目录]
 */

const fs = require('fs');
const path = require('path');

const dir = path.resolve(process.argv[2] || path.join(__dirname, '../../lib/theme-chalk'));
const BASE = 'base.css';
const SKIP = new Set([BASE, 'index.css', 'fonts']);

if (!fs.existsSync(dir)) {
  console.error(`[check-theme-tokens] 产物目录不存在：${dir}\n请先运行 npm run build:theme`);
  process.exit(1);
}

function read(file) {
  return fs.readFileSync(path.join(dir, file), 'utf8');
}

function definedTokens(css) {
  return new Set(Array.from(css.matchAll(/(--hzq-[a-z0-9-]+)\s*:/g), m => m[1]));
}

const base = read(BASE);
const baseTokens = definedTokens(base);
const usedTokens = new Set();

if (baseTokens.size === 0) {
  console.error(`[check-theme-tokens] ${BASE} 里没有任何 token 定义，主题变量可能没有输出`);
  process.exit(1);
}

const missing = new Map();
const embedded = [];

for (const file of fs.readdirSync(dir)) {
  if (!file.endsWith('.css') || SKIP.has(file)) continue;

  const css = read(file);
  // 组件产物理论上不该再内嵌 token 定义；如果出现说明 common/var 又把它带回来了
  if (definedTokens(css).size > 0) embedded.push(file);

  // 组件自己定义的局部变量（如有）不算缺失
  const local = definedTokens(css);

  for (const [, name] of css.matchAll(/var\((--hzq-[a-z0-9-]+)/g)) {
    usedTokens.add(name);
    if (!baseTokens.has(name) && !local.has(name)) {
      if (!missing.has(name)) missing.set(name, new Set());
      missing.get(name).add(file);
    }
  }
}

if (embedded.length) {
  console.error(`[check-theme-tokens] 以下产物内嵌了 token 定义，应只由 ${BASE} 输出：`);
  console.error(`  ${embedded.join(', ')}`);
  console.error('  检查 common/var.scss 是否又 import 了 common/tokens。\n');
}

if (missing.size) {
  console.error('[check-theme-tokens] 以下 token 被组件引用，但 base.css 中没有定义：\n');
  for (const [name, files] of missing) {
    console.error(`  ${name}`);
    if (files.size) console.error(`    引用方：${Array.from(files).slice(0, 5).join(', ')}`);
  }
  console.error('\n按需引入时这些声明会失效，颜色会退回继承值。');
  process.exit(1);
}

console.log(
  `[check-theme-tokens] OK：${usedTokens.size} 个被引用的 token 全部由 ${BASE} 定义（共 ${baseTokens.size} 个）。`
);
