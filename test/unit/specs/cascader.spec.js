import {
  createTest,
  createVue,
  destroyVM,
  waitImmediate,
  wait,
  triggerEvent
} from '../util';
import Cascader from 'packages/cascader';

const options = [{
  value: 'zhejiang',
  label: 'Zhejiang',
  children: [{
    value: 'hangzhou',
    label: 'Hangzhou',
    children: [{
      value: 'xihu',
      label: 'West Lake'
    }, {
      value: 'binjiang',
      label: 'Bin Jiang'
    }]
  }, {
    value: 'ningbo',
    label: 'NingBo',
    children: [{
      value: 'jiangbei',
      label: 'Jiang Bei'
    }, {
      value: 'jiangdong',
      label: 'Jiang Dong',
      disabled: true
    }]
  }]
}, {
  value: 'jiangsu',
  label: 'Jiangsu',
  disabled: true,
  children: [{
    value: 'nanjing',
    label: 'Nanjing',
    children: [{
      value: 'zhonghuamen',
      label: 'Zhong Hua Men'
    }]
  }]
}];

const getMenus = el => el.querySelectorAll('.hzq-cascader-menu');
const getOptions = (el, menuIndex) => getMenus(el)[menuIndex].querySelectorAll('.hzq-cascader-node');
const selectedValue = ['zhejiang', 'hangzhou', 'xihu'];
const getCloseButton = el => el.querySelectorAll('i.hzq-tag__close');

describe('Cascader', () => {
  let vm;
  afterEach(() => {
    destroyVM(vm);
  });

  it('create', () => {
    vm = createTest(Cascader, true);
    expect(vm.$el).to.exist;
  });

  it('toggle dropdown visible', async() => {
    vm = createTest(Cascader, true);
    expect(vm.$refs.popper.style.display).to.equal('none');
    vm.$el.click();
    await waitImmediate();
    expect(vm.$refs.popper.style.display).to.includes('');
    vm.$el.click();
    await wait(500);
    expect(vm.$refs.popper.style.display).to.includes('none');
  });

  it('expand and check', async() => {
    vm = createTest({
      template: `
        <hzq-cascader
          ref="cascader"
          v-model="value"
          :options="options"></hzq-cascader>
      `,
      data() {
        return {
          value: [],
          options
        };
      }
    }, true);

    const { body } = document;
    const expandHandler = sinon.spy();
    const changeHandler = sinon.spy();

    vm.$refs.cascader.$on('expand-change', expandHandler);
    vm.$refs.cascader.$on('change', changeHandler);

    getOptions(body, 0)[0].click();
    await waitImmediate();
    expect(expandHandler.calledOnceWith(['zhejiang'])).to.be.true;
    getOptions(body, 1)[0].click();
    await waitImmediate();
    const checkedOption = getOptions(body, 2)[0];
    checkedOption.click();
    await waitImmediate();
    expect(changeHandler.calledOnceWith(selectedValue)).to.be.true;
    expect(vm.value).to.deep.equal(selectedValue);
    expect(checkedOption.querySelector('i.hzq-icon-check')).to.exist;
    expect(vm.$el.querySelector('input').value).to.equal('Zhejiang / Hangzhou / West Lake');
  });

  it('disabled', async() => {
    vm = createTest(Cascader, {
      disabled: true
    }, true);
    expect(vm.$el.className).to.includes('is-disabled');
    vm.$el.click();
    await waitImmediate();
    expect(vm.$refs.popper.style.display).to.includes('none');
  });

  it('with default value', async() => {
    vm = createVue({
      template: `
        <hzq-cascader
          v-model="value"
          :options="options"></hzq-cascader>
      `,
      data() {
        return {
          value: selectedValue,
          options
        };
      }
    }, true);

    const el = vm.$el;
    await waitImmediate();
    expect(getMenus(el).length).to.equal(3);
    expect(getOptions(el, 2)[0].querySelector('i').className).to.includes('hzq-icon-check');
    expect(vm.$el.querySelector('input').value).to.equal('Zhejiang / Hangzhou / West Lake');
  });

  it('async set selected value', async() => {
    vm = createVue({
      template: `
        <hzq-cascader
          v-model="value"
          :options="options"></hzq-cascader>
      `,
      data() {
        return {
          value: [],
          options
        };
      }
    }, true);

    const el = vm.$el;
    vm.value = selectedValue;
    await waitImmediate();
    expect(getMenus(el).length).to.equal(3);
    expect(getOptions(el, 2)[0].querySelector('i').className).to.includes('hzq-icon-check');
    expect(vm.$el.querySelector('input').value).to.equal('Zhejiang / Hangzhou / West Lake');
  });

  it('default value with async options', async() => {
    vm = createVue({
      template: `
        <hzq-cascader
          v-model="value"
          :options="options"></hzq-cascader>
      `,
      data() {
        return {
          value: selectedValue,
          options: []
        };
      }
    }, true);

    const el = vm.$el;
    vm.options = options;
    await waitImmediate();
    expect(getMenus(el).length).to.equal(3);
    expect(getOptions(el, 2)[0].querySelector('i').className).to.includes('hzq-icon-check');
    expect(vm.$el.querySelector('input').value).to.equal('Zhejiang / Hangzhou / West Lake');
  });

  it('clearable', async() => {
    vm = createVue({
      template: `
        <hzq-cascader
          v-model="value"
          :options="options"
          clearable></hzq-cascader>
      `,
      data() {
        return {
          value: selectedValue,
          options
        };
      }
    }, true);

    triggerEvent(vm.$el, 'mouseenter');
    await waitImmediate();
    const closeBtn = vm.$el.querySelector('i.hzq-input__icon');
    expect(closeBtn).to.exist;
    closeBtn.click();
    await waitImmediate();
    expect(vm.value).to.deep.equal([]);
  });

  it('show last level label', async() => {
    vm = createVue({
      template: `
        <hzq-cascader
          v-model="value"
          :options="options"
          :show-all-levels="false"></hzq-cascader>
      `,
      data() {
        return {
          value: selectedValue,
          options
        };
      }
    }, true);

    const el = vm.$el;
    await waitImmediate();
    expect(getMenus(el).length).to.equal(3);
    expect(getOptions(el, 2)[0].querySelector('i').className).to.includes('hzq-icon-check');
    expect(vm.$el.querySelector('input').value).to.equal('West Lake');
  });

  it('multiple mode', async() => {
    vm = createVue({
      template: `
        <hzq-cascader
          v-model="value"
          :options="options"
          :disabled="disabled"
          :props="props"></hzq-cascader>
      `,
      data() {
        return {
          value: [],
          options,
          disabled: false,
          props: {
            multiple: true
          }
        };
      }
    }, true);

    getOptions(document.body, 0)[0].querySelector('.hzq-checkbox input').click();
    await waitImmediate();
    expect(vm.value.length).to.equal(3);
    expect(getCloseButton(vm.$el).length).to.equal(3);

    const tags = vm.$el.querySelectorAll('.hzq-tag');
    const closeBtn = tags[0].querySelector('.hzq-tag__close');
    expect(tags.length).to.equal(3);
    expect(closeBtn).to.exist;
    closeBtn.click();
    await waitImmediate();
    expect(vm.value.length).to.equal(2);
    expect(vm.$el.querySelectorAll('.hzq-tag').length).to.equal(2);

    vm.disabled = true;
    await waitImmediate();
    expect(getCloseButton(vm.$el).length).to.equal(0);
  });

  it('click leaf node should check in multiple mode', async() => {
    vm = createVue({
      template: `
        <hzq-cascader
          v-model="value"
          :options="options"
          :props="props"></hzq-cascader>
      `,
      data() {
        return {
          value: [],
          options,
          props: {
            multiple: true
          }
        };
      }
    }, true);

    getOptions(document.body, 0)[0].click();
    await waitImmediate();
    getOptions(document.body, 1)[0].click();
    await waitImmediate();
    expect(vm.value.length).to.equal(0);

    getOptions(document.body, 2)[0].click();
    await waitImmediate();
    expect(vm.value).to.deep.equal([['zhejiang', 'hangzhou', 'xihu']]);
    expect(getCloseButton(vm.$el).length).to.equal(1);
  });

  it('clearable in multiple mode', async() => {
    vm = createVue({
      template: `
        <hzq-cascader
          v-model="value"
          :options="options"
          :props="props"
          clearable></hzq-cascader>
      `,
      data() {
        return {
          value: [],
          options,
          props: {
            multiple: true,
            emitPath: false
          }
        };
      }
    }, true);
    vm.value = ['xihu', 'binjiang', 'jiangbei', 'jiangdong'];
    await waitImmediate();
    expect(getOptions(document.body, 0)[0].querySelector('.hzq-checkbox.is-checked')).to.exist;
    triggerEvent(vm.$el, 'mouseenter');
    await waitImmediate();
    const closeBtn = vm.$el.querySelector('i.hzq-input__icon');
    expect(closeBtn).to.exist;
    closeBtn.click();
    await waitImmediate();
    expect(vm.value.length).to.equal(1);
  });

  it('collapse tags', async() => {
    vm = createVue({
      template: `
        <hzq-cascader
          v-model="value"
          :options="options"
          :props="props"
          collapse-tags></hzq-cascader>
      `,
      data() {
        return {
          value: ['xihu', 'binjiang', 'jiangbei', 'jiangdong'],
          options,
          props: {
            multiple: true,
            emitPath: false
          }
        };
      }
    }, true);
    await waitImmediate();
    const tags = vm.$el.querySelectorAll('.hzq-tag');
    expect(tags.length).to.equal(2);
    expect(tags[0].querySelector('.hzq-tag__close')).to.exist;
    expect(tags[1].querySelector('.hzq-tag__close')).to.be.null;
    tags[0].querySelector('.hzq-tag__close').click();
    expect(tags[1].textContent).to.equal('+ 3');
    await waitImmediate();
    expect(vm.value.length).to.equal(3);
    vm.$el.querySelector('.hzq-tag .hzq-tag__close').click();
    await waitImmediate();
    vm.$el.querySelector('.hzq-tag .hzq-tag__close').click();
    await waitImmediate();
    expect(vm.$el.querySelector('.hzq-tag')).to.exist;
    // disabled tag can not be closed
    expect(vm.$el.querySelector('.hzq-tag .hzq-tag__close')).to.be.null;
  });

  it('multiple tags stay in one line and mark overflow', async() => {
    vm = createVue({
      template: `
        <hzq-cascader
          v-model="value"
          :options="options"
          :props="props"
          style="width: 180px;"></hzq-cascader>
      `,
      data() {
        return {
          value: ['xihu', 'binjiang', 'jiangbei', 'jiangdong'],
          options,
          props: {
            multiple: true,
            emitPath: false
          }
        };
      }
    }, true);
    await waitImmediate();
    const tags = vm.$el.querySelector('.hzq-cascader__tags');
    const tagsWrap = vm.$el.querySelector('.hzq-cascader__tags-wrap');
    const inputInner = vm.$el.querySelector('.hzq-input__inner');
    expect(tagsWrap).to.exist;
    expect(vm.$el.querySelectorAll('.hzq-tag').length).to.equal(4);
    expect(window.getComputedStyle(tags).flexWrap).to.equal('nowrap');
    expect(tagsWrap.classList.contains('is-overflow')).to.be.true;
    expect(tagsWrap.querySelector('.hzq-tag.is-overflow-tail')).to.exist;
    expect(parseFloat(inputInner.style.height)).to.equal(32);
  });

  it('filterable', async() => {
    vm = createVue({
      template: `
        <hzq-cascader
          v-model="value"
          :options="options"
          filterable></hzq-cascader>
      `,
      data() {
        return {
          value: [],
          options
        };
      }
    }, true);
    const el = vm.$el;
    const { body } = document;
    const input = el.querySelector('input');
    el.click();
    await waitImmediate();
    input.value = 'Zhejiang';
    triggerEvent(input, 'input');
    await wait(300);
    expect(body.querySelector('.hzq-cascader__suggestion-list')).to.exist;
    expect(body.querySelectorAll('.hzq-cascader__suggestion-item').length).to.equal(3);
    body.querySelectorAll('.hzq-cascader__suggestion-item')[0].click();
    await waitImmediate();
    expect(vm.value).to.deep.equal(selectedValue);
  });

  it('filter method', async() => {
    vm = createVue({
      template: `
        <hzq-cascader
          v-model="value"
          :options="options"
          :filter-method="filterMethod"
          filterable></hzq-cascader>
      `,
      data() {
        return {
          value: [],
          options
        };
      },
      methods: {
        filterMethod(node, keyword) {
          const { text, path } = node;
          return text.includes(keyword) || path.includes(keyword);
        }
      }
    }, true);
    const el = vm.$el;
    const { body } = document;
    const input = el.querySelector('input');
    el.click();
    await waitImmediate();
    input.value = 'Zhejiang';
    triggerEvent(input, 'input');
    await wait(300);
    expect(body.querySelectorAll('.hzq-cascader__suggestion-item').length).to.equal(3);
    input.value = 'xihu';
    triggerEvent(input, 'input');
    await wait(300);
    expect(body.querySelector('.hzq-cascader__suggestion-item').textContent).to.equal('Zhejiang / Hangzhou / West Lake');
  });
});
