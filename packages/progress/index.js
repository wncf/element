import HzqProgress from './src/progress';

/* istanbul ignore next */
HzqProgress.install = function(Vue) {
  Vue.component(HzqProgress.name, HzqProgress);
};

export default HzqProgress;
