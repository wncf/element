import HzqAutocomplete from './src/autocomplete';

/* istanbul ignore next */
HzqAutocomplete.install = function(Vue) {
  Vue.component(HzqAutocomplete.name, HzqAutocomplete);
};

export default HzqAutocomplete;
