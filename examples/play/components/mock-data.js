export const cityOptions = [
  { label: '上海', value: 'shanghai' },
  { label: '北京', value: 'beijing' },
  { label: '广州', value: 'guangzhou' },
  { label: '深圳', value: 'shenzhen' }
]

export const cascaderOptions = [
  {
    value: 'zhejiang',
    label: '浙江',
    children: [
      { value: 'hangzhou', label: '杭州' },
      { value: 'ningbo', label: '宁波' },
      { value: 'wenzhou', label: '温州' },
      { value: 'jiaxing', label: '嘉兴' }
    ]
  },
  {
    value: 'jiangsu',
    label: '江苏',
    children: [
      { value: 'nanjing', label: '南京' },
      { value: 'suzhou', label: '苏州' },
      { value: 'wuxi', label: '无锡' },
      { value: 'changzhou', label: '常州' }
    ]
  },
  {
    value: 'guangdong',
    label: '广东',
    children: [
      { value: 'guangzhou', label: '广州' },
      { value: 'shenzhen', label: '深圳' },
      { value: 'zhuhai', label: '珠海' }
    ]
  },
  {
    value: 'anhui',
    label: '安徽',
    disabled: true,
    children: [
      { value: 'hefei', label: '合肥' }
    ]
  }
]

export const cascaderManyValue = [
  ['zhejiang', 'hangzhou'],
  ['zhejiang', 'ningbo'],
  ['zhejiang', 'wenzhou'],
  ['jiangsu', 'nanjing'],
  ['jiangsu', 'suzhou'],
  ['jiangsu', 'wuxi'],
  ['guangdong', 'guangzhou'],
  ['guangdong', 'shenzhen']
]

export const tableData = [
  { date: '2026-09-01', name: '张三', address: '上海市浦东新区' },
  { date: '2026-09-02', name: '李四', address: '北京市朝阳区' },
  { date: '2026-09-03', name: '王五', address: '广州市天河区' }
]

export const treeData = [
  {
    label: '一级 1',
    children: [
      { label: '二级 1-1', children: [{ label: '三级 1-1-1' }] },
      { label: '二级 1-2' }
    ]
  },
  {
    label: '一级 2',
    children: [
      { label: '二级 2-1' },
      { label: '二级 2-2' }
    ]
  }
]

export const autocompleteRestaurants = [
  { value: '三全鲜食（北新泾店）', address: '长宁区新渔路144号' },
  { value: 'Hot honey 首尔炸鸡（仙霞路）', address: '上海市长宁区淞虹路661号' },
  { value: '新旺角茶餐厅', address: '上海市普陀区真北路988号' }
]
