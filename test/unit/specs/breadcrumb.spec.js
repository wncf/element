import { createVue, destroyVM } from '../util';

describe('Breadcrumb', () => {
  let vm;
  afterEach(() => {
    destroyVM(vm);
  });

  it('create', done => {
    vm = createVue(`
      <hzq-breadcrumb separator=">">
        <hzq-breadcrumb-item to="/">首页</hzq-breadcrumb-item>
        <hzq-breadcrumb-item>活动管理</hzq-breadcrumb-item>
        <hzq-breadcrumb-item>活动列表</hzq-breadcrumb-item>
        <hzq-breadcrumb-item>活动详情</hzq-breadcrumb-item>
      </hzq-breadcrumb>
    `);
    vm.$nextTick(_ => {
      expect(vm.$el.querySelector('.hzq-breadcrumb__separator').innerText).to.equal('>');
      done();
    });
  });
});
