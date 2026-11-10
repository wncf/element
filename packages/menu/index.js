import HzqMenu from './src/menu';

/* istanbul ignore next */
HzqMenu.install = function(Vue) {
  Vue.component(HzqMenu.name, HzqMenu);
};

export default HzqMenu;
