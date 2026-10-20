export const PREVIEW_GROUPS = [
  {
    name: 'Basic 基础',
    key: 'basic',
    sections: [
      { id: 'layout', label: 'Layout 布局' },
      { id: 'container', label: 'Container 布局容器' },
      { id: 'button', label: 'Button 按钮' },
      { id: 'link', label: 'Link 文字链接' }
    ]
  },
  {
    name: 'Form 表单',
    key: 'form',
    sections: [
      { id: 'radio', label: 'Radio 单选框' },
      { id: 'checkbox', label: 'Checkbox 多选框' },
      { id: 'input', label: 'Input 输入框' },
      { id: 'input-number', label: 'InputNumber 计数器' },
      { id: 'amount-input', label: 'AmountInput 金额输入' },
      { id: 'select', label: 'Select 选择器' },
      { id: 'cascader', label: 'Cascader 级联选择器' },
      { id: 'switch', label: 'Switch 开关' },
      { id: 'slider', label: 'Slider 滑块' },
      { id: 'time-picker', label: 'TimePicker 时间选择器' },
      { id: 'date-picker', label: 'DatePicker 日期选择器' },
      { id: 'datetime-picker', label: 'DateTimePicker 日期时间' },
      { id: 'upload', label: 'Upload 上传' },
      { id: 'color-picker', label: 'ColorPicker 颜色选择器' },
      { id: 'autocomplete', label: 'Autocomplete 自动补全' },
      { id: 'form', label: 'Form 表单' }
    ]
  },
  {
    name: 'Data 数据展示',
    key: 'data',
    sections: [
      { id: 'table', label: 'Table 表格' },
      { id: 'tag', label: 'Tag 标签' },
      { id: 'progress', label: 'Progress 进度条' },
      { id: 'tree', label: 'Tree 树形控件' },
      { id: 'pagination', label: 'Pagination 分页' },
      { id: 'badge', label: 'Badge 标记' },
      { id: 'avatar', label: 'Avatar 头像' },
      { id: 'skeleton', label: 'Skeleton 骨架屏' },
      { id: 'empty', label: 'Empty 空状态' },
      { id: 'descriptions', label: 'Descriptions 描述列表' },
      { id: 'result', label: 'Result 结果' },
      { id: 'statistic', label: 'Statistic 统计数值' }
    ]
  },
  {
    name: 'Notice 反馈',
    key: 'notice',
    sections: [
      { id: 'alert', label: 'Alert 警告' },
      { id: 'loading', label: 'Loading 加载' },
      { id: 'message', label: 'Message 消息提示' },
      { id: 'dialog-service', label: '$dialog 命令式弹窗' },
      { id: 'notification', label: 'Notification 通知' }
    ]
  },
  {
    name: 'Navigation 导航',
    key: 'navigation',
    sections: [
      { id: 'menu', label: 'Menu 导航菜单' },
      { id: 'tabs', label: 'Tabs 标签页' },
      { id: 'breadcrumb', label: 'Breadcrumb 面包屑' },
      { id: 'page-header', label: 'PageHeader 页头' },
      { id: 'dropdown', label: 'Dropdown 下拉菜单' },
      { id: 'steps', label: 'Steps 步骤条' }
    ]
  },
  {
    name: 'Others 其他',
    key: 'others',
    sections: [
      { id: 'dialog', label: 'Dialog 对话框' },
      { id: 'drawer', label: 'Drawer 抽屉' },
      { id: 'popover', label: 'Popover 弹出框' },
      { id: 'popconfirm', label: 'Popconfirm 气泡确认' },
      { id: 'card', label: 'Card 卡片' },
      { id: 'carousel', label: 'Carousel 走马灯' },
      { id: 'collapse', label: 'Collapse 折叠面板' },
      { id: 'timeline', label: 'Timeline 时间线' },
      { id: 'divider', label: 'Divider 分割线' },
      { id: 'image', label: 'Image 图片' },
      { id: 'backtop', label: 'Backtop 回到顶部' },
      { id: 'infinite-scroll', label: 'InfiniteScroll 无限滚动' }
    ]
  }
]

export const ALL_SECTIONS = PREVIEW_GROUPS.reduce((list, group) => {
  return list.concat(group.sections.map(section => ({
    ...section,
    group: group.name
  })))
}, [])
