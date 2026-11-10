import HzqDialog from './src/component';
import dialog from './src/dialog-service';

HzqDialog.install = function(Vue) {
  Vue.component(HzqDialog.name, HzqDialog);
};

HzqDialog.dialog = dialog;

export default HzqDialog;
export { dialog };
