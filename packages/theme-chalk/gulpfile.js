'use strict';

const { series, src, dest } = require('gulp');
// 用 dart-sass 而非 node-sass：纯 JS 实现，不依赖 Node ABI，
// 换 Node 版本或换机器都不用重新编译原生模块
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-cssmin');

/**
 * clean-css 默认会做 restructuring：把声明相同、选择器不同的规则合并成一条
 * 多选择器规则，并把合并结果挪到文件中较早的位置。
 *
 * 这会破坏 CSS 的层叠顺序。典型受害者是 .hzq-button--text：
 * 它的 border-color: transparent 与 .hzq-input-group 的规则被合并到
 * .hzq-button 基类规则之前，于是基类的 border-color 反过来覆盖了它，
 * 日期选择器里「此刻」按钮因此多出一圈灰边框。
 *
 * 关掉 restructuring、只做声明级的压缩（去空白、合并简写），
 * 输出体积略大一点，但规则顺序与源码一致，层叠行为可预期。
 */
const CSSMIN_OPTIONS = { restructuring: false };

function compile() {
  return src('./src/*.scss')
    .pipe(sass.sync())
    .pipe(autoprefixer({
      browsers: ['ie > 9', 'last 2 versions'],
      cascade: false
    }))
    .pipe(cssmin(CSSMIN_OPTIONS))
    .pipe(dest('./lib'));
}

function copyfont() {
  return src('./src/fonts/**')
    .pipe(cssmin(CSSMIN_OPTIONS))
    .pipe(dest('./lib/fonts'));
}

exports.build = series(compile, copyfont);
