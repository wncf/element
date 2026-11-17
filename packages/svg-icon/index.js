import SvgIcon from './src/svg-icon.vue';
import {
  registerSvgIcons,
  ensureSvgIconInjected,
  hasSvgIcon,
  getSvgIconContent,
  getRegisteredSvgIcons,
  clearSvgIcons
} from './src/registry';

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

/* istanbul ignore next */
SvgIcon.install = function(Vue) {
  Vue.component(SvgIcon.name, SvgIcon);
};

export {
  SvgIcon,
  registerSvgIcons,
  ensureSvgIconInjected,
  hasSvgIcon,
  getSvgIconContent,
  getRegisteredSvgIcons,
  clearSvgIcons
};

export default SvgIcon;
