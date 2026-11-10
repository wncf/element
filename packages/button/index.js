import HzqButton from './src/button';

/* istanbul ignore next */
HzqButton.install = function(Vue) {
  Vue.component(HzqButton.name, HzqButton);
};

export default HzqButton;
