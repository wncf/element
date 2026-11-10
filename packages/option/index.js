import HzqOption from '../select/src/option';

/* istanbul ignore next */
HzqOption.install = function(Vue) {
  Vue.component(HzqOption.name, HzqOption);
};

export default HzqOption;
