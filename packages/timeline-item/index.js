import HzqTimelineItem from '../timeline/src/item';

/* istanbul ignore next */
HzqTimelineItem.install = function(Vue) {
  Vue.component(HzqTimelineItem.name, HzqTimelineItem);
};

export default HzqTimelineItem;
