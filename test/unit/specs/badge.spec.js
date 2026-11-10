import { createTest, createVue, destroyVM } from '../util';
import Badge from 'packages/badge';

describe('Badge', () => {
  let vm;
  afterEach(() => {
    destroyVM(vm);
  });

  it('value', () => {
    vm = createTest(Badge, { value: 80 });
    expect(vm.content).to.equal(80);
  });

  it('is fixed', () => {
    vm = createVue(`
      <hzq-badge>
        <button>click</button>
      </hzq-badge>
    `);

    expect(vm.$el.querySelector('.hzq-badge__content.is-fixed')).to.exist;
  });

  it('is dot', () => {
    vm = createVue(`
      <hzq-badge is-dot>
        <button>click</button>
      </hzq-badge>
    `);

    expect(vm.$el.querySelector('.hzq-badge__content.is-dot')).to.exist;
  });

  it('is dot with type', () => {
    vm = createVue(`
      <hzq-badge is-dot type="success">
        <button>click</button>
      </hzq-badge>
    `);

    expect(vm.$el.querySelector('.hzq-badge__content.is-dot')).to.exist;
    expect(vm.$el.querySelector('.hzq-badge__content.hzq-badge__content--success.is-dot')).to.exist;
  });

  it('max', () => {
    vm = createTest(Badge, { max: 100, value: 200 });
    expect(vm.content).to.equal('100+');
    vm = createTest(Badge, { max: 100, value: 80 });
    expect(vm.content).to.equal(80);
  });
});
