import Drawer from './src/main';
import drawer from './src/drawer-service';

/* istanbul ignore next */
Drawer.install = function(Vue) {
  Vue.component(Drawer.name, Drawer);
};

Drawer.drawer = drawer;

export default Drawer;
export { drawer };
