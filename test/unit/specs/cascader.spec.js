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

  it('tag size follows the component size and is 6px shorter than the input', async() => {
    const cases = [
      // 输入框高度含上下各 1px 边框，标签再矮 6px 才不会顶到边框
      { size: 'large', expected: 'large', tagHeight: 30 },
      { size: 'medium', expected: 'medium', tagHeight: 26 },
      { size: 'small', expected: 'small', tagHeight: 22 },
      { size: 'mini', expected: 'mini', tagHeight: 18 },
      // 未指定 size 时按默认档（medium）处理
      { size: undefined, expected: 'medium', tagHeight: 26 }
    ];

    for (const item of cases) {
      vm = createVue({
        template: `
          <hzq-cascader
            v-model="value"
            :options="options"
            :size="size"
            :props="props"></hzq-cascader>
        `,
        data() {
          return {
            value: [],
            options,
            size: item.size,
            props: { multiple: true }
          };
        }
      }, true);

      getOptions(document.body, 0)[0].querySelector('.hzq-checkbox input').click();
      await waitImmediate();

      const tag = vm.$el.querySelector('.hzq-tag');
      expect(tag, `size=${item.size}`).to.exist;
      // 档位修饰符仍跟随 size，用于内边距、字号与关闭图标缩放
      expect(tag.classList.contains(`hzq-tag--${item.expected}`), `size=${item.size}`).to.be.true;
      // 高度由 cascader 样式按档位收缩
      expect(tag.getBoundingClientRect().height, `size=${item.size}`).to.equal(item.tagHeight);

      destroyVM(vm);
    }
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
    // 主输入框只读，筛选走面板顶部的搜索框
    expect(el.querySelector('input').readOnly).to.be.true;

    el.click();
    await wait(100);

    const searchInput = vm.$children[0].$refs.searchInput;
    expect(searchInput).to.exist;

    searchInput.value = 'Zhejiang';
    triggerEvent(searchInput, 'input');
    await wait(300);
    expect(body.querySelector('.hzq-cascader__suggestion-list')).to.exist;
    expect(body.querySelectorAll('.hzq-cascader__suggestion-item').length).to.equal(3);
    body.querySelectorAll('.hzq-cascader__suggestion-item')[0].click();
    await waitImmediate();
    expect(vm.value).to.deep.equal(selectedValue);
  });

  it('filterable shows empty text when nothing matches', async() => {
    vm = createVue({
      template: `
        <hzq-cascader
          v-model="value"
          :options="options"
          filterable></hzq-cascader>
      `,
      data() {
        return { value: [], options };
      }
    }, true);

    const el = vm.$el;
    const { body } = document;
    el.click();
    await wait(100);

    // cascader 是模板里的子组件，ref 取不到外层 wrapper 上
    const cascader = vm.$children[0];
    const searchInput = cascader.$refs.searchInput;
    expect(searchInput, 'panel search input should exist').to.exist;
    searchInput.value = 'zzzzzz';
    triggerEvent(searchInput, 'input');
    await wait(300);

    const empty = body.querySelector('.hzq-cascader__empty-text');
    expect(empty).to.exist;
    expect(empty.textContent.trim()).to.equal('暂无内容');
    expect(body.querySelectorAll('.hzq-cascader__suggestion-item').length).to.equal(0);
  });

  it('change event passes the raw option nodes as second argument', async() => {
    vm = createVue({
      template: `
        <hzq-cascader
          ref="cascader"
          v-model="value"
          :options="options"></hzq-cascader>
      `,
      data() {
        return { value: [], options };
      }
    }, true);

    const cascader = vm.$refs.cascader;
    const changeHandler = sinon.spy();
    cascader.$on('change', changeHandler);

    getOptions(document.body, 0)[0].click();
    await waitImmediate();
    getOptions(document.body, 1)[0].click();
    await waitImmediate();
    getOptions(document.body, 2)[0].click();
    await waitImmediate();

    expect(changeHandler.calledOnce).to.be.true;
    const [val, nodes] = changeHandler.firstCall.args;
    expect(val).to.deep.equal(selectedValue);
    expect(nodes).to.have.lengthOf(1);
    expect(nodes[0]).to.equal(options[0].children[0].children[0]);

    // 清除时第二参为空数组
    const clearHandler = sinon.spy();
    cascader.$on('change', clearHandler);
    cascader.handleClear();
    await waitImmediate();
    expect(clearHandler.calledOnce).to.be.true;
    expect(clearHandler.firstCall.args[0]).to.deep.equal([]);
    expect(clearHandler.firstCall.args[1]).to.deep.equal([]);
  });

  it('change event passes checked nodes in multiple mode', async() => {
    vm = createVue({
      template: `
        <hzq-cascader
          ref="cascader"
          v-model="value"
          :options="options"
          :props="props"></hzq-cascader>
      `,
      data() {
        return { value: [], options, props: { multiple: true } };
      }
    }, true);

    const cascader = vm.$refs.cascader;
    const changeHandler = sinon.spy();
    cascader.$on('change', changeHandler);

    getOptions(document.body, 0)[0].querySelector('.hzq-checkbox input').click();
    await waitImmediate();

    expect(changeHandler.called).to.be.true;
    const [val, nodes] = changeHandler.lastCall.args;
    expect(val).to.deep.equal([
      ['zhejiang', 'hangzhou', 'xihu'],
      ['zhejiang', 'hangzhou', 'binjiang'],
      ['zhejiang', 'ningbo', 'jiangbei']
    ]);
    expect(nodes).to.have.lengthOf(3);
    expect(nodes[0]).to.equal(options[0].children[0].children[0]);
    expect(nodes[1]).to.equal(options[0].children[0].children[1]);
    expect(nodes[2]).to.equal(options[0].children[1].children[0]);
  });

  it('valueCompat expands leaf values to full paths in multiple mode', async() => {
    vm = createVue({
      template: `
        <hzq-cascader
          ref="cascader"
          v-model="value"
          :options="options"
          :props="props"
          value-compat></hzq-cascader>
      `,
      data() {
        return {
          value: ['xihu', 'jiangbei'],
          options,
          props: { multiple: true }
        };
      }
    }, true);

    await waitImmediate();
    const cascader = vm.$refs.cascader;
    expect(cascader.checkedValue).to.deep.equal([
      ['zhejiang', 'hangzhou', 'xihu'],
      ['zhejiang', 'ningbo', 'jiangbei']
    ]);
    expect(vm.$el.querySelectorAll('.hzq-tag').length).to.equal(2);

    // 运行中改值同样归一化
    vm.value = ['binjiang'];
    await waitImmediate();
    expect(cascader.checkedValue).to.deep.equal([
      ['zhejiang', 'hangzhou', 'binjiang']
    ]);
  });

  it('valueCompat expands a single leaf value in single mode', async() => {
    vm = createVue({
      template: `
        <hzq-cascader
          ref="cascader"
          v-model="value"
          :options="options"
          value-compat></hzq-cascader>
      `,
      data() {
        return { value: ['xihu'], options };
      }
    }, true);

    await waitImmediate();
    const cascader = vm.$refs.cascader;
    expect(cascader.checkedValue).to.deep.equal(selectedValue);
    expect(vm.$el.querySelector('input').value).to.equal('Zhejiang / Hangzhou / West Lake');
  });

  it('valueCompat keeps unknown values untouched', async() => {
    vm = createVue({
      template: `
        <hzq-cascader
          ref="cascader"
          v-model="value"
          :options="options"
          value-compat></hzq-cascader>
      `,
      data() {
        return { value: ['not-exist'], options };
      }
    }, true);

    await waitImmediate();
    const cascader = vm.$refs.cascader;
    expect(cascader.checkedValue).to.deep.equal(['not-exist']);
    expect(cascader.presentText).to.equal(null);
  });

  it('manual popoverTrigger does not toggle on click', async() => {
    vm = createVue({
      template: `
        <hzq-cascader
          ref="cascader"
          v-model="value"
          :options="options"
          popover-trigger="manual"></hzq-cascader>
      `,
      data() {
        return { value: [], options };
      }
    }, true);

    const cascader = vm.$refs.cascader;
    vm.$el.click();
    await waitImmediate();
    expect(cascader.dropDownVisible).to.be.false;

    // 外部调用公共方法仍可开合
    cascader.toggleDropDownVisible(true);
    await waitImmediate();
    expect(cascader.dropDownVisible).to.be.true;
    expect(cascader.$refs.popper.style.display).to.not.equal('none');

    cascader.toggleDropDownVisible(false);
    await waitImmediate();
    expect(cascader.dropDownVisible).to.be.false;
  });

  it('remove-tag passes the tag index', async() => {
    vm = createVue({
      template: `
        <hzq-cascader
          ref="cascader"
          v-model="value"
          :options="options"
          :props="props"></hzq-cascader>
      `,
      data() {
        return {
          value: ['xihu', 'binjiang', 'jiangbei'],
          options,
          props: { multiple: true, emitPath: false }
        };
      }
    }, true);

    await waitImmediate();
    const cascader = vm.$refs.cascader;
    const removeHandler = sinon.spy();
    cascader.$on('remove-tag', removeHandler);

    vm.$el.querySelectorAll('.hzq-tag')[1].querySelector('.hzq-tag__close').click();
    await waitImmediate();
    expect(removeHandler.calledOnce).to.be.true;
    expect(removeHandler.firstCall.args[0]).to.equal('binjiang');
    expect(removeHandler.firstCall.args[1]).to.equal(1);

    // 只剩最后一项时 index 为 0
    vm.$el.querySelectorAll('.hzq-tag')[0].querySelector('.hzq-tag__close').click();
    await waitImmediate();
    expect(removeHandler.lastCall.args[1]).to.equal(0);
    vm.$el.querySelector('.hzq-tag__close').click();
    await waitImmediate();
    expect(removeHandler.lastCall.args[1]).to.equal(0);
  });

  it('clearing the search input restores the cascader panel', async() => {
    vm = createVue({
      template: `
        <hzq-cascader
          v-model="value"
          :options="options"
          filterable></hzq-cascader>
      `,
      data() {
        return { value: [], options };
      }
    }, true);

    const el = vm.$el;
    const { body } = document;
    el.click();
    await wait(100);

    const cascader = vm.$children[0];
    const searchInput = cascader.$refs.searchInput;

    searchInput.value = 'Zhejiang';
    triggerEvent(searchInput, 'input');
    await wait(300);
    expect(cascader.panel.$el.style.display).to.equal('none');

    searchInput.value = '';
    triggerEvent(searchInput, 'input');
    await wait(300);
    expect(body.querySelector('.hzq-cascader__suggestion-list').closest('.hzq-cascader__dropdown').querySelector('.hzq-cascader-menu')).to.exist;
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
    el.click();
    await wait(100);

    const searchInput = vm.$children[0].$refs.searchInput;
    searchInput.value = 'Zhejiang';
    triggerEvent(searchInput, 'input');
    await wait(300);
    expect(body.querySelectorAll('.hzq-cascader__suggestion-item').length).to.equal(3);

    searchInput.value = 'xihu';
    triggerEvent(searchInput, 'input');
    await wait(300);
    expect(body.querySelector('.hzq-cascader__suggestion-item').textContent).to.equal('Zhejiang / Hangzhou / West Lake');
  });
});
