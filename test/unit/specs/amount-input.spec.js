import { createVue, destroyVM, triggerEvent, waitImmediate } from '../util';
import {
  sanitizeAmount,
  clampAmount,
  normalizeAmount
} from 'element-ui/src/utils/amount';

const OPTIONS = {
  precision: 2,
  min: 0,
  max: Infinity,
  allowNegative: false
};

function setValue(input, value) {
  input.value = value;
  triggerEvent(input, 'input');
}

describe('AmountInput', () => {
  describe('utils', () => {
    it('只保留数字和一个小数点', () => {
      expect(sanitizeAmount('12abc', OPTIONS)).to.equal('12');
      expect(sanitizeAmount('1.2.3', OPTIONS)).to.equal('1.23');
      expect(sanitizeAmount('', OPTIONS)).to.equal('');
    });

    it('去掉千分位并把全角转成半角', () => {
      expect(sanitizeAmount('1,234.56', OPTIONS)).to.equal('1234.56');
      expect(sanitizeAmount('１２３．４５', OPTIONS)).to.equal('123.45');
    });

    it('不允许负数时负号进不来', () => {
      expect(sanitizeAmount('-12', OPTIONS)).to.equal('12');
      expect(sanitizeAmount('-12', { ...OPTIONS, allowNegative: true })).to.equal('-12');
    });

    it('超出精度的小数位直接丢弃', () => {
      expect(sanitizeAmount('1.234', OPTIONS)).to.equal('1.23');
      // 整数模式连小数点一起舍去（粘贴 "1,234.56" 得到 1234，而不是 123456）
      expect(sanitizeAmount('1.234', { ...OPTIONS, precision: 0 })).to.equal('1');
      expect(sanitizeAmount('1,234.56', { ...OPTIONS, precision: 0 })).to.equal('1234');
    });

    it('去掉整数部分的前导零', () => {
      expect(sanitizeAmount('007.5', OPTIONS)).to.equal('7.5');
      expect(sanitizeAmount('0', OPTIONS)).to.equal('0');
    });

    it('max 立即收敛，min 给整数前缀留余地', () => {
      expect(clampAmount('1005', { max: 1000 })).to.equal('1000');
      // min=100 时输入 5 不能马上变成 100，否则 500 永远输不进去
      expect(clampAmount('5', { min: 100 })).to.equal('5');
      // 已经进入小数部分，说明整数位封顶了，这时才收敛
      expect(clampAmount('5.5', { min: 100 })).to.equal('100');
    });

    it('失焦时补齐小数位', () => {
      expect(normalizeAmount('12', OPTIONS)).to.equal('12.00');
      expect(normalizeAmount('12.5', OPTIONS)).to.equal('12.50');
    });

    it('空值保持空，不会被补成 0.00', () => {
      expect(normalizeAmount('', OPTIONS)).to.equal('');
      expect(normalizeAmount('-', { ...OPTIONS, allowNegative: true })).to.equal('');
    });

    it('失焦时硬收敛到范围', () => {
      expect(normalizeAmount('-5', OPTIONS)).to.equal('0.00');
      expect(normalizeAmount('2000', { ...OPTIONS, max: 1000 })).to.equal('1000.00');
    });
  });

  describe('component', () => {
    let vm;
    afterEach(() => {
      destroyVM(vm);
    });

    function createAmountInput(template, data, methods) {
      return createVue({ template, data, methods }, true);
    }

    it('初值按精度补齐并回写', async() => {
      vm = createAmountInput(
        '<el-amount-input v-model="amount" />',
        () => ({ amount: '12' })
      );
      await waitImmediate();

      expect(vm.amount).to.equal('12.00');
      expect(vm.$el.querySelector('input').value).to.equal('12.00');
    });

    it('过滤非法字符', async() => {
      vm = createAmountInput(
        '<el-amount-input v-model="amount" />',
        () => ({ amount: '' })
      );
      const input = vm.$el.querySelector('input');

      setValue(input, '12a.3b');
      await waitImmediate();

      expect(vm.amount).to.equal('12.3');
      expect(input.value).to.equal('12.3');
    });

    it('超过精度的小数位输不进去', async() => {
      vm = createAmountInput(
        '<el-amount-input v-model="amount" />',
        () => ({ amount: '' })
      );
      const input = vm.$el.querySelector('input');

      setValue(input, '1.234');
      await waitImmediate();

      expect(vm.amount).to.equal('1.23');
    });

    it('默认不接受负数', async() => {
      vm = createAmountInput(
        '<el-amount-input v-model="amount" />',
        () => ({ amount: '' })
      );
      const input = vm.$el.querySelector('input');

      setValue(input, '-12');
      await waitImmediate();

      expect(vm.amount).to.equal('12');
    });

    it('allow-negative 时可以输入负数', async() => {
      vm = createAmountInput(
        '<el-amount-input v-model="amount" allow-negative />',
        () => ({ amount: '' })
      );
      const input = vm.$el.querySelector('input');

      setValue(input, '-12.5');
      await waitImmediate();

      expect(vm.amount).to.equal('-12.5');
    });

    it('min 在整数前缀时不提前收敛', async() => {
      vm = createAmountInput(
        '<el-amount-input v-model="amount" :min="100" />',
        () => ({ amount: '' })
      );
      const input = vm.$el.querySelector('input');

      setValue(input, '5');
      await waitImmediate();
      expect(vm.amount).to.equal('5');

      setValue(input, '50');
      await waitImmediate();
      expect(vm.amount).to.equal('50');

      setValue(input, '500');
      await waitImmediate();
      expect(vm.amount).to.equal('500');
    });

    it('超过 max 立即截断', async() => {
      vm = createAmountInput(
        '<el-amount-input v-model="amount" :max="1000" />',
        () => ({ amount: '' })
      );
      const input = vm.$el.querySelector('input');

      setValue(input, '1005');
      await waitImmediate();

      expect(vm.amount).to.equal('1000');
      expect(input.value).to.equal('1000');
    });

    it('失焦补齐小数位并抛 change', async() => {
      const changes = [];

      vm = createAmountInput(
        '<el-amount-input v-model="amount" @change="handleChange" />',
        () => ({ amount: '' }),
        { handleChange(value) { changes.push(value); } }
      );
      const input = vm.$el.querySelector('input');

      setValue(input, '12.5');
      await waitImmediate();
      triggerEvent(input, 'blur');
      await waitImmediate();

      expect(vm.amount).to.equal('12.50');
      expect(changes).to.deep.equal(['12.50']);
    });

    it('空值失焦后保持空', async() => {
      vm = createAmountInput(
        '<el-amount-input v-model="amount" />',
        () => ({ amount: '' })
      );
      const input = vm.$el.querySelector('input');

      triggerEvent(input, 'blur');
      await waitImmediate();

      expect(vm.amount).to.equal('');
    });

    it('整数模式下小数点及其后面被舍去', async() => {
      vm = createAmountInput(
        '<el-amount-input v-model="amount" :precision="0" />',
        () => ({ amount: '' })
      );
      const input = vm.$el.querySelector('input');

      setValue(input, '12.56');
      await waitImmediate();

      expect(vm.amount).to.equal('12');
      expect(input.value).to.equal('12');
    });

    it('只输入负号时不会被吞掉', async() => {
      vm = createAmountInput(
        '<el-amount-input v-model="amount" allow-negative />',
        () => ({ amount: '' })
      );
      const input = vm.$el.querySelector('input');

      setValue(input, '-');
      await waitImmediate();

      expect(vm.amount).to.equal('-');
      expect(input.value).to.equal('-');
    });

    it('过滤掉中间字符后光标不跳到末尾', async() => {
      vm = createAmountInput(
        '<el-amount-input v-model="amount" />',
        () => ({ amount: '' })
      );
      const input = vm.$el.querySelector('input');

      input.focus();
      input.value = '1a2';
      input.setSelectionRange(2, 2);
      triggerEvent(input, 'input');

      expect(input.value).to.equal('12');
      expect(input.selectionStart).to.equal(1);
    });

    it('外部改值时退出编辑态并规范化', async() => {
      vm = createAmountInput(
        '<el-amount-input v-model="amount" />',
        () => ({ amount: '' })
      );
      const input = vm.$el.querySelector('input');

      setValue(input, '12');
      await waitImmediate();

      vm.amount = '99';
      await waitImmediate();

      expect(vm.amount).to.equal('99.00');
      expect(input.value).to.equal('99.00');
    });

    it('清空时抛出 input / change / clear', async() => {
      const events = [];

      vm = createAmountInput(
        '<el-amount-input ref="amount" v-model="amount" clearable @change="onChange" @clear="onClear" />',
        () => ({ amount: '12.00' }),
        {
          onChange(value) { events.push(['change', value]); },
          onClear() { events.push(['clear']); }
        }
      );
      await waitImmediate();

      vm.$refs.amount.clear();
      await waitImmediate();

      expect(vm.amount).to.equal('');
      expect(vm.$el.querySelector('input').value).to.equal('');
      expect(events).to.deep.equal([['change', ''], ['clear']]);
    });

    it('组字期间不改写输入框内容', async() => {
      vm = createAmountInput(
        '<el-amount-input v-model="amount" />',
        () => ({ amount: '' })
      );
      const input = vm.$el.querySelector('input');

      triggerEvent(input, 'compositionstart');
      setValue(input, '１２');
      await waitImmediate();
      expect(input.value).to.equal('１２');
      expect(vm.amount).to.equal('');

      triggerEvent(input, 'compositionend');
      await waitImmediate();

      expect(vm.amount).to.equal('12');
      expect(input.value).to.equal('12');
    });

    it('沿用 el-input 的类名并透传原生属性', () => {
      vm = createAmountInput(
        '<el-amount-input placeholder="请输入金额" size="small" />',
        () => ({})
      );

      expect(vm.$el.classList.contains('el-input--small')).to.be.true;
      expect(vm.$el.classList.contains('el-amount-input')).to.be.true;
      expect(vm.$el.querySelector('input').getAttribute('placeholder')).to.equal('请输入金额');
      expect(vm.$el.querySelector('input').getAttribute('inputmode')).to.equal('decimal');
    });

    it('挂载时的规范化不触发校验', async() => {
      vm = createVue({
        template: `
          <el-form :model="form" :rules="rules">
            <el-form-item prop="amount" ref="item">
              <el-amount-input v-model="form.amount" />
            </el-form-item>
          </el-form>
        `,
        data() {
          return {
            form: { amount: '12' },
            rules: { amount: [{ required: true, message: '请输入金额', trigger: 'blur' }] }
          };
        }
      }, true);
      await waitImmediate();

      expect(vm.form.amount).to.equal('12.00');
      expect(vm.$refs.item.validateState).to.equal('');
    });

    it('输入和失焦都会通知表单校验', async() => {
      vm = createVue({
        template: `
          <el-form :model="form" :rules="rules">
            <el-form-item prop="amount" ref="item">
              <el-amount-input v-model="form.amount" />
            </el-form-item>
          </el-form>
        `,
        data() {
          return {
            form: { amount: '' },
            rules: {
              amount: [
                { required: true, message: '请输入金额', trigger: 'blur' },
                {
                  validator(rule, value, callback) {
                    // 用 change 规则验证"边输边校验"是否真的被触发
                    callback(value !== '' && Number(value) > 100 ? new Error('不能超过 100') : undefined);
                  },
                  trigger: 'change'
                }
              ]
            }
          };
        }
      }, true);
      const input = vm.$el.querySelector('input');

      setValue(input, '200');
      await waitImmediate();
      expect(vm.$refs.item.validateState).to.equal('error');

      setValue(input, '50');
      await waitImmediate();
      expect(vm.$refs.item.validateState).to.equal('success');

      setValue(input, '');
      triggerEvent(input, 'blur');
      await waitImmediate();
      expect(vm.$refs.item.validateState).to.equal('error');
    });
  });
});
