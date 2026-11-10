import HzqFormBuilder from './src/form-builder.vue';

/* istanbul ignore next */
HzqFormBuilder.install = function(Vue) {
  Vue.component(HzqFormBuilder.name, HzqFormBuilder);
};

export default HzqFormBuilder;
