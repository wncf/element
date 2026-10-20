import ElDialog from './src/component';
import dialog from './src/dialog-service';

ElDialog.install = function(Vue) {
  Vue.component(ElDialog.name, ElDialog);
};

ElDialog.dialog = dialog;

export default ElDialog;
export { dialog };
