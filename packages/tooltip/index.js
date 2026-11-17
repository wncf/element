import Tooltip from './src/main';
import TooltipDirective from './src/tooltip-directive';
import { tooltip } from './src/tooltip-service';

/* istanbul ignore next */
Tooltip.install = function(Vue) {
  Vue.component(Tooltip.name, Tooltip);
  Vue.directive('tooltip', TooltipDirective);
};

Tooltip.tooltip = tooltip;
Tooltip.directive = TooltipDirective;

export default Tooltip;
export { tooltip, TooltipDirective };
