/* 一次性脚本：把 common/var.scss 的叶子颜色定义指向 token。
 * 每条规则必须唯一命中，否则报错退出，避免误改。用完即删。 */
const fs = require('fs');

const file = 'packages/theme-chalk/src/common/var.scss';
const rules = [
  // 文字 / 图标
  ['$--font-color-disabled-base: #bbb !default;', '$--font-color-disabled-base: var(--el-text-color-disabled) !default;'],
  ['$--icon-color: #666 !default;', '$--icon-color: var(--el-text-color-regular) !default;'],
  ['$--select-multiple-input-color: #666 !default;', '$--select-multiple-input-color: var(--el-text-color-regular) !default;'],
  ['$--select-dropdown-empty-color: #999 !default;', '$--select-dropdown-empty-color: var(--el-text-color-secondary) !default;'],
  ['$--dialog-close-btn-color: #909399 !default;', '$--dialog-close-btn-color: var(--el-text-color-secondary) !default;'],
  ['$--dialog-close-btn-hover-color: #606266 !default;', '$--dialog-close-btn-hover-color: var(--el-text-color-regular) !default;'],
  // 组件底色（原来直接写 $--color-white 的地方）
  ['$--checkbox-background-color: $--color-white !default;', '$--checkbox-background-color: var(--el-bg-color) !default;'],
  ['$--radio-input-background-color: $--color-white !default;', '$--radio-input-background-color: var(--el-bg-color) !default;'],
  ['$--radio-checked-input-background-color: $--color-white !default;', '$--radio-checked-input-background-color: var(--el-bg-color) !default;'],
  ['$--input-background-color: $--color-white !default;', '$--input-background-color: var(--el-bg-color) !default;'],
  ['$--input-focus-fill: $--color-white !default;', '$--input-focus-fill: var(--el-bg-color) !default;'],
  ['$--button-default-background-color: $--color-white !default;', '$--button-default-background-color: var(--el-fill-color-blank) !default;'],
  ['$--button-disabled-background-color: $--color-white !default;', '$--button-disabled-background-color: var(--el-fill-color-blank) !default;'],
  ['$--dialog-background-color: $--color-white !default;', '$--dialog-background-color: var(--el-bg-color) !default;'],
  ['$--table-header-background-color: $--color-white !default;', '$--table-header-background-color: var(--el-bg-color) !default;'],
  ['$--pagination-background-color: $--color-white !default;', '$--pagination-background-color: var(--el-bg-color) !default;'],
  ['$--pagination-button-disabled-background-color: $--color-white !default;', '$--pagination-button-disabled-background-color: var(--el-fill-color-blank) !default;'],
  ['$--menu-background-color: $--color-white !default;', '$--menu-background-color: var(--el-bg-color) !default;'],
  ['$--collapse-header-background-color: $--color-white !default;', '$--collapse-header-background-color: var(--el-bg-color) !default;'],
  ['$--collapse-content-background-color: $--color-white !default;', '$--collapse-content-background-color: var(--el-bg-color) !default;'],
  ['$--backtop-background-color: $--color-white !default;', '$--backtop-background-color: var(--el-bg-color) !default;'],
  // 弹层底色
  ['$--select-option-disabled-background: $--color-white !default;', '$--select-option-disabled-background: var(--el-bg-color-overlay) !default;'],
  ['$--select-dropdown-background: $--color-white !default;', '$--select-dropdown-background: var(--el-bg-color-overlay) !default;'],
  ['$--popover-background-color: $--color-white !default;', '$--popover-background-color: var(--el-bg-color-overlay) !default;'],
  ['$--cascader-menu-fill: $--fill-base !default;', '$--cascader-menu-fill: var(--el-bg-color-overlay) !default;'],
  // 勾选/选中图标必须保持"纯白"，不能跟随底色
  ['$--checkbox-checked-icon-color: $--fill-base !default;', '$--checkbox-checked-icon-color: $--color-white !default;'],
  // 填充色
  ['$--checkbox-disabled-input-fill: #edf2fc !default;', '$--checkbox-disabled-input-fill: var(--el-fill-color-dark) !default;'],
  ['$--message-background-color: #edf2fc !default;', '$--message-background-color: var(--el-fill-color-dark) !default;'],
  ['$--cascader-tag-background: #f0f2f5;', '$--cascader-tag-background: var(--el-fill-color);'],
  ['$--dialog-close-btn-background: #f2f3f5 !default;', '$--dialog-close-btn-background: var(--el-fill-color) !default;'],
  ['$--dialog-close-btn-hover-background: #eef0f4 !default;', '$--dialog-close-btn-hover-background: var(--el-fill-color-dark) !default;'],
  ['$--descriptions-item-bordered-label-background: #fafafa !default;', '$--descriptions-item-bordered-label-background: var(--el-fill-color-lighter) !default;'],
  ['$--skeleton-color: #f2f2f2 !default;', '$--skeleton-color: var(--el-fill-color-light) !default;'],
  ['$--skeleton-to-color: #e6e6e6 !default;', '$--skeleton-to-color: var(--el-fill-color-darker) !default;'],
  ['$--group-option-fill-hover: rgba($--color-black, 0.06) !default;', '$--group-option-fill-hover: var(--el-fill-color-light) !default;'],
  ['$--tab-header-fill-active: rgba($--color-black, 0.06) !default;', '$--tab-header-fill-active: var(--el-fill-color-light) !default;'],
  ['$--tab-header-fill-hover: rgba($--color-black, 0.06) !default;', '$--tab-header-fill-hover: var(--el-fill-color-light) !default;'],
  // 边框 / 分割线
  ['$--tab-border-line: 1px solid #e4e4e4 !default;', '$--tab-border-line: 1px solid var(--el-border-color-light) !default;'],
  ['$--datepicker-inner-border-color: #e4e4e4 !default;', '$--datepicker-inner-border-color: var(--el-border-color-light) !default;'],
  // 品牌色衍生
  ['$--calendar-selected-background-color: #F2F8FE !default;', '$--calendar-selected-background-color: var(--el-color-primary-light-9) !default;'],
  ['$--slider-button-hover-color: mix($--color-primary, black, 97%) !default;', '$--slider-button-hover-color: var(--el-color-primary-shade) !default;'],
  // 中性/杂项
  ['$--avatar-background-color: #C0C4CC !default;', '$--avatar-background-color: var(--el-text-color-placeholder) !default;'],
  ['$--svg-monochrome-grey: #DCDDE0 !default;', '$--svg-monochrome-grey: var(--el-fill-color-darker) !default;'],
  ['$--scrollbar-background-color: rgba($--color-text-secondary, .3) !default;', '$--scrollbar-background-color: var(--el-scrollbar-thumb-color) !default;'],
  ['$--scrollbar-hover-background-color: rgba($--color-text-secondary, .5) !default;', '$--scrollbar-hover-background-color: var(--el-scrollbar-thumb-color) !default;'],
  // 深色模式下必须换底的气泡
  ['$--tooltip-fill: $--color-text-primary !default;', '$--tooltip-fill: var(--el-tooltip-bg-color) !default;'],
  ['$--tooltip-border-color: $--color-text-primary !default;', '$--tooltip-border-color: var(--el-tooltip-bg-color) !default;']
];

let source = fs.readFileSync(file, 'utf8');
const failed = [];

rules.forEach(([from, to]) => {
  const hits = source.split(from).length - 1;
  if (hits !== 1) {
    failed.push(`${hits} 次命中: ${from}`);
    return;
  }
  source = source.replace(from, to);
});

if (failed.length > 0) {
  console.log('以下规则未唯一命中，未写入：');
  failed.forEach(item => console.log('  ' + item));
  process.exit(1);
}

// token 输出文件放在最后，保证它读到的是本文件已解析完成的变量
source = source.replace(/\s*$/, '\n\n/* 语义 token 输出：必须放在最后，此时上面所有变量已解析完成 */\n@import "./tokens";\n');
fs.writeFileSync(file, source);
console.log(`已应用 ${rules.length} 条规则并追加 tokens 导入`);
