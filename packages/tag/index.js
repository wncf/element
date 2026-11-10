import HzqTag from './src/tag';

/* istanbul ignore next */
HzqTag.install = function(Vue) {
  Vue.component(HzqTag.name, HzqTag);
};

export default HzqTag;
