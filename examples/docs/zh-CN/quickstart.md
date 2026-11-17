## 快速上手

本节介绍如何在项目中使用 hzq-ui。

### 完整引入

在 `main.js` 中写入以下内容：

```javascript
import Vue from 'vue';
import HZQUI from 'hzq-ui';
import 'hzq-ui/lib/theme-chalk/index.css';
import App from './App.vue';

Vue.use(HZQUI);

new Vue({
  el: '#app',
  render: h => h(App)
});
```

以上代码便完成了引入。样式文件需要单独引入。

完整引入会注册全部组件、指令和全局方法，配置项见 [Vue.use 初始化参数](./#/zh-CN/component/init-options)。

### 按需引入

借助 [babel-plugin-component](https://github.com/QingWei-Li/babel-plugin-component)，可以只引入需要的组件，以减小打包体积。

首先安装：

```bash
npm install babel-plugin-component -D
```

然后将 `.babelrc` 修改为：

```json
{
  "presets": [["es2015", { "modules": false }]],
  "plugins": [
    [
      "component",
      {
        "libraryName": "hzq-ui",
        "styleLibraryName": "theme-chalk"
      }
    ]
  ]
}
```

接下来，如果只需要 Button 和 Select：

```javascript
import Vue from 'vue';
import { Button, Select } from 'hzq-ui';
import App from './App.vue';

Vue.component(Button.name, Button);
Vue.component(Select.name, Select);
/* 或写为
 * Vue.use(Button)
 * Vue.use(Select)
 */

new Vue({
  el: '#app',
  render: h => h(App)
});
```

:::tip
按需引入时，组件名统一以 `hzq-` 为前缀，例如 `Button` 注册为 `hzq-button`。如果使用 `Vue.component(Button.name, Button)` 的写法，`name` 已经包含前缀，无需手动拼接。
:::

### 组件列表

以下是全部可单独引入的组件：

```javascript
import {
  Pagination, Dialog, Autocomplete, Dropdown, DropdownMenu, DropdownItem,
  Menu, Submenu, MenuItem, MenuItemGroup,
  Input, InputNumber, AmountInput,
  Radio, RadioGroup, RadioButton,
  Checkbox, CheckboxButton, CheckboxGroup,
  Switch, Select, Option, OptionGroup,
  Button, ButtonGroup, Table, TableColumn,
  DatePicker, TimeSelect, TimePicker,
  Popover, Tooltip, Breadcrumb, BreadcrumbItem,
  Form, FormBuilder, FormItem,
  Tabs, TabPane, Tag, Tree, Alert, Slider,
  Icon, SvgIcon, Row, Col,
  Upload, Progress, Spinner, Badge, Card, Rate,
  Steps, Step, Carousel, Scrollbar, CarouselItem,
  Collapse, CollapseItem, Cascader, CascaderPanel, ColorPicker, Transfer,
  Container, Header, Aside, Main, Footer,
  Timeline, TimelineItem, Link, Divider, Image, Calendar, Backtop,
  PageHeader, Avatar, Drawer, Statistic,
  Skeleton, SkeletonItem, Empty, Descriptions, DescriptionsItem, Result
} from 'hzq-ui';
```

服务式组件和指令需要单独注册，它们不包含在上面的组件列表里：

```javascript
import Vue from 'vue';
import Loading from 'hzq-ui/packages/loading';
import InfiniteScroll from 'hzq-ui/packages/infinite-scroll';

// 全局方法与指令
Vue.use(InfiniteScroll);
Vue.use(Loading.directive);
Vue.prototype.$loading = Loading.service;
```

完整的全局方法列表见 [Vue.use 初始化参数](./#/zh-CN/component/init-options)。

### TypeScript

包内自带类型声明，`typings` 字段已指向 `types/index.d.ts`，无需额外安装 `@types` 包：

```typescript
import Vue from 'vue';
import HZQUI from 'hzq-ui';

Vue.use(HZQUI);
```

如果在 `tsconfig.json` 中开启了 `esModuleInterop`，上面的默认引入写法可以直接使用。
