import { createVue, destroyVM } from '../util';

describe('Divider', () => {
  let vm;
  afterEach(() => {
    destroyVM(vm);
  });

  it('content', () => {
    vm = createVue({
      template: `
          <hzq-divider>我是一条完美分割线！</hzq-divider>
      `
    });

    expect(vm.$el).to.property('textContent').to.include('我是一条完美分割线！');
  });

  it('direction', () => {
    vm = createVue({
      template: `
          <hzq-divider direction="vertical">我是一条完美分割线！</hzq-divider>
      `
    });

    expect(vm.$el.className).to.include('hzq-divider--vertical');
  });

  it('apply class to divider', () => {
    vm = createVue({
      template: `
        <hzq-divider direction="vertical" class="my-divider">我是一条完美分割线！</hzq-divider>
      `
    });
    expect(vm.$el.className).to.include('my-divider');
  });
});
