import HzqTable from './src/table';

/* istanbul ignore next */
HzqTable.install = function(Vue) {
  Vue.component(HzqTable.name, HzqTable);
};

export default HzqTable;
