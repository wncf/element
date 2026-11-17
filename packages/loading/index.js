import directive from './src/directive';
import service from './src/index';
import { setConfig } from './src/config';

export default {
  install(Vue, options = {}) {
    setConfig(options);
    Vue.use(directive);
    Vue.prototype.$loading = service;
  },
  directive,
  service,
  setConfig
};
