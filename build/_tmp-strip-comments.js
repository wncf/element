/* 一次性脚本：把新增的块注释改成 // 行注释（Sass 会剥掉，不进入 CSS 产物）。用完即删。 */
const fs = require('fs');

const jobs = [
  {
    file: 'packages/theme-chalk/src/common/var.scss',
    pairs: [
      ['/* 原始色板：只放字面量颜色，见 common/palette.scss */', '// 原始色板：只放字面量颜色，见 common/palette.scss'],
      ['/* 语义颜色统一指向 token（定义见 common/tokens.scss），\n   深浅模式切换对组件代码透明；原始色板在 common/palette.scss。 */', '// 语义颜色统一指向 token（定义见 common/tokens.scss），\n// 深浅模式切换对组件代码透明；原始色板在 common/palette.scss。'],
      ['/* 品牌色浅色档：浅色模式向白混合、深色模式向组件底色混合，由 tokens.scss 按模式生成 */', '// 品牌色浅色档：浅色模式向白混合、深色模式向组件底色混合，由 tokens.scss 按模式生成'],
      ['/* 品牌色提亮档（悬停）与加深档（按下）：两种模式取值一致，深色底上也读得出来 */', '// 品牌色提亮档（悬停）与加深档（按下）：两种模式取值一致，深色底上也读得出来'],
      ['/* 语义 token 输出：必须放在最后，此时上面所有变量已解析完成 */', '// 语义 token 输出：必须放在最后，此时上面所有变量已解析完成']
    ]
  },
  {
    file: 'packages/theme-chalk/src/tag.scss',
    pairs: [
      ['/* 标签配色\n *\n * 原来用 4 个混合权重（mix(类型色, 白, 权重)）表达三种 effect，\n * 现在改为取品牌色梯度的不同档位——因为权重混合在深色模式下会错：\n * mix(类型色, 白, 10%) 在深底上会变成一块接近白的亮色。\n *\n * 三档后缀的含义：\n *   light-9 = mix(白/底色, 类型色, 90%)，浅底档\n *   light-8 / light-6 / light-2 依次加深\n *   类型色本身 = 满饱和档\n * tokens 会按深浅模式给出不同色值，所以这里不需要分支。\n */',
        '// 标签配色\n//\n// 原来用 4 个混合权重（mix(类型色, 白, 权重)）表达三种 effect，\n// 现在改为取品牌色梯度的不同档位——因为权重混合在深色模式下会错：\n// mix(类型色, 白, 10%) 在深底上会变成一块接近白的亮色。\n//\n// 三档后缀的含义：\n//   light-9 = mix(白/底色, 类型色, 90%)，浅底档\n//   light-8 / light-6 / light-2 依次加深\n//   类型色本身 = 满饱和档\n// tokens 会按深浅模式给出不同色值，所以这里不需要分支。'],
      ['/* 把"类型 + 档位"解析成 token 引用，避免在组件层写死色值 */', '// 把"类型 + 档位"解析成 token 引用，避免在组件层写死色值'],
      ['/* 单个类型在某个 effect 下的完整配色 */', '// 单个类型在某个 effect 下的完整配色'],
      ['/* default 类型（不写 type 时的样子）落在 .el-tag 上，其余类型作为覆盖 */', '// default 类型（不写 type 时的样子）落在 .el-tag 上，其余类型作为覆盖']
    ]
  },
  {
    file: 'packages/theme-chalk/src/mixins/_button.scss',
    pairs: [
      ['/* 按钮配色 mixin\n *\n * 颜色全部取自品牌色梯度 token（--el-color-{type} / -light-N / -hover / -shade），\n * 组件层不再做任何 Sass 颜色运算——因为 Sass 无法对 var() 求值。\n *\n * 之所以能只靠品牌色梯度表达所有状态：\n *   mix(白, 品牌色, 90%)                = --el-color-{type}-light-9\n *   mix(白, 品牌色, 60%)                = --el-color-{type}-light-6\n *   mix(品牌色, 白)  (50%/50%)          = --el-color-{type}-light-5\n *   mix(白, 品牌色, 20%) 悬停提亮        = --el-color-{type}-hover\n *   mix(黑, 品牌色, 10%) 按下压暗        = --el-color-{type}-shade\n * 其中 light-N 在浅色模式向白混合、深色模式向组件底色混合，\n * 所以同一个品牌色在深浅两套底色上都能得到正确的浅色档。\n */',
        '// 按钮配色 mixin\n//\n// 颜色全部取自品牌色梯度 token（--el-color-{type} / -light-N / -hover / -shade），\n// 组件层不再做任何 Sass 颜色运算——因为 Sass 无法对 var() 求值。\n//\n// 之所以能只靠品牌色梯度表达所有状态：\n//   mix(白, 品牌色, 90%)                = --el-color-{type}-light-9\n//   mix(白, 品牌色, 60%)                = --el-color-{type}-light-6\n//   mix(品牌色, 白)  (50%/50%)          = --el-color-{type}-light-5\n//   mix(白, 品牌色, 20%) 悬停提亮        = --el-color-{type}-hover\n//   mix(黑, 品牌色, 10%) 按下压暗        = --el-color-{type}-shade\n// 其中 light-N 在浅色模式向白混合、深色模式向组件底色混合，\n// 所以同一个品牌色在深浅两套底色上都能得到正确的浅色档。'],
      ['/* 浅色按钮（plain）：底色/边框取浅色档，悬停转为实心 */', '// 浅色按钮（plain）：底色/边框取浅色档，悬停转为实心'],
      ['/* 实心按钮：底色与边框同色，悬停提亮、按下压暗，禁用时降为浅色档 */', '// 实心按钮：底色与边框同色，悬停提亮、按下压暗，禁用时降为浅色档']
    ]
  },
  {
    file: 'packages/theme-chalk/src/link.scss',
    pairs: [
      ['/* 链接各类型色：直接取品牌色 token 及其梯度档，\n   悬停用 --el-color-{type}-hover（两模式一致的提亮档），\n   深色模式下不会像原来那样反而变暗。 */',
        '// 链接各类型色：直接取品牌色 token 及其梯度档，\n// 悬停用 --el-color-{type}-hover（两模式一致的提亮档），\n// 深色模式下不会像原来那样反而变暗。']
    ]
  }
];

let failed = [];
jobs.forEach(({ file, pairs }) => {
  let source = fs.readFileSync(file, 'utf8');
  let fileFailed = false;
  pairs.forEach(([from, to]) => {
    const hits = source.split(from).length - 1;
    if (hits !== 1) {
      failed.push(`${file} -> ${hits} 次命中: ${from.slice(0, 40)}...`);
      fileFailed = true;
      return;
    }
    source = source.replace(from, to);
  });
  if (!fileFailed) {
    fs.writeFileSync(file, source);
  }
});

if (failed.length) {
  console.log('以下规则未唯一命中：');
  failed.forEach(item => console.log('  ' + item));
  process.exit(1);
}
console.log('注释转换完成');
