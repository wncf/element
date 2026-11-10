import { createVue, destroyVM } from '../util';

describe('Col', () => {
  let vm;
  afterEach(() => {
    destroyVM(vm);
  });

  it('create', () => {
    vm = createVue({
      template: `
        <hzq-col :span="12">
        </hzq-col>
      `
    }, true);
    let colElm = vm.$el;
    expect(colElm.classList.contains('hzq-col')).to.be.true;
  });
  it('span', () => {
    vm = createVue({
      template: `
        <hzq-col :span="12">
        </hzq-col>
      `
    }, true);
    let colElm = vm.$el;
    expect(colElm.classList.contains('hzq-col-12')).to.be.true;
  });
  it('pull', () => {
    vm = createVue({
      template: `
        <hzq-col :span="12" :pull="3">
        </hzq-col>
      `
    }, true);
    let colElm = vm.$el;
    expect(colElm.classList.contains('hzq-col-pull-3')).to.be.true;
  });
  it('push', () => {
    vm = createVue({
      template: `
        <hzq-col :span="12" :push="3">
        </hzq-col>
      `
    }, true);
    let colElm = vm.$el;
    expect(colElm.classList.contains('hzq-col-push-3')).to.be.true;
  });
  it('gutter', () => {
    vm = createVue({
      template: `
        <hzq-row :gutter="20">
          <hzq-col :span="12" ref="col">
          </hzq-col>
        </hzq-row>
      `
    }, true);
    let colElm = vm.$refs.col.$el;
    expect(colElm.style.paddingLeft === '10px').to.be.true;
    expect(colElm.style.paddingRight === '10px').to.be.true;
  });
  it('responsive', () => {
    vm = createVue({
      template: `
        <hzq-row :gutter="20">
          <hzq-col ref="col" :sm="{ span: 4, offset: 2 }" :md="8" :lg="{ span: 6, offset: 3 }">
          </hzq-col>
        </hzq-row>
      `
    }, true);
    let colElm = vm.$refs.col.$el;
    expect(colElm.classList.contains('hzq-col-sm-4')).to.be.true;
    expect(colElm.classList.contains('hzq-col-sm-offset-2')).to.be.true;
    expect(colElm.classList.contains('hzq-col-lg-6')).to.be.true;
    expect(colElm.classList.contains('hzq-col-lg-offset-3')).to.be.true;
    expect(colElm.classList.contains('hzq-col-md-8')).to.be.true;
  });
});
