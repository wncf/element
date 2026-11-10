import { createVue, destroyVM, triggerEvent, waitImmediate } from '../util';
import {
  parsePath,
  getValueByPath,
  setValueByPath,
  resolveCondition,
  mergeFieldRules,
  normalizeFields,
  normalizeOptions,
  resolveOptionComponent,
  resolveForwardedSlots
} from 'hzq-ui/src/utils/form-builder';

const SELECT_OPTIONS = [
  { label: '区域一', value: 'shanghai' },
  { label: '区域二', value: 'beijing', disabled: true }
];

function setInputValue(input, value) {
  input.value = value;
  triggerEvent(input, 'input');
}

describe('FormBuilder', () => {
  describe('utils', () => {
    it('解析并读写嵌套路径', () => {
      expect(parsePath('a.b.c')).to.deep.equal(['a', 'b', 'c']);
      expect(parsePath('list[0].id')).to.deep.equal(['list', '0', 'id']);
      expect(parsePath('')).to.deep.equal([]);

      const model = { user: { name: '张三' }, list: [{ id: 1 }] };
      expect(getValueByPath(model, 'user.name')).to.equal('张三');
      expect(getValueByPath(model, 'list[0].id')).to.equal(1);
      expect(getValueByPath(model, 'missing.deep')).to.equal(undefined);
    });

    it('写值时自动补出中间层级', () => {
      const vue = { $set: (target, key, value) => { target[key] = value; } };
      const model = {};

      setValueByPath(model, 'a.b', 1, vue);
      expect(model.a.b).to.equal(1);

      setValueByPath(model, 'list[0].id', 2, vue);
      expect(model.list[0].id).to.equal(2);
    });

    it('下标路径创建的中间层是数组而不是对象', () => {
      const vue = { $set: (target, key, value) => { target[key] = value; } };
      const model = {};

      setValueByPath(model, 'list[0].id', 2, vue);
      expect(Array.isArray(model.list)).to.be.true;
      expect(model.list).to.deep.equal([{ id: 2 }]);

      // 后端的列表接口通常直接消费它，push 必须可用
      model.list.push({ id: 3 });
      expect(model.list).to.have.length(2);
    });

    it('条件既支持布尔值也支持函数', () => {
      expect(resolveCondition(true)).to.be.true;
      expect(resolveCondition(undefined)).to.be.false;
      expect(resolveCondition(model => model.type === 'fixed', { type: 'fixed' })).to.be.true;
      expect(resolveCondition(model => model.type === 'fixed', { type: 'dynamic' })).to.be.false;
    });

    it('required 生成默认文案，且同时监听 blur 与 change', () => {
      const rules = mergeFieldRules({ label: '金额', required: true }, {});

      expect(rules).to.have.length(1);
      expect(rules[0].required).to.be.true;
      expect(rules[0].message).to.equal('金额不能为空');
      expect(rules[0].trigger).to.deep.equal(['blur', 'change']);
    });

    it('字段规则与表单级规则合并，而不是互相覆盖', () => {
      const field = {
        prop: 'amount',
        required: true,
        rules: [{ min: 1, message: '至少为 1', trigger: 'change' }]
      };
      const rules = mergeFieldRules(field, {
        amount: [{ type: 'number', message: '必须是数字', trigger: 'change' }]
      });

      expect(rules).to.have.length(3);
      expect(rules[1].message).to.equal('至少为 1');
      expect(rules[2].message).to.equal('必须是数字');
    });

    it('没有任何规则时返回 undefined', () => {
      expect(mergeFieldRules({ prop: 'name' }, {})).to.equal(undefined);
    });

    it('归一化字段配置时补 key 且不改动原对象', () => {
      const source = [{ prop: 'name' }, { label: '无 prop 的标题' }];
      const fields = normalizeFields(source);

      expect(fields[0].key).to.equal('name');
      expect(fields[0].type).to.equal('field');
      expect(fields[1].key).to.equal('field-1');
      expect(source[0].key).to.equal(undefined);
    });

    it('按组件名推断选项子组件', () => {
      expect(resolveOptionComponent({
        component: 'hzq-select',
        options: SELECT_OPTIONS
      })).to.equal('hzq-option');

      expect(resolveOptionComponent({
        component: 'hzq-radio-group',
        options: SELECT_OPTIONS
      })).to.equal('hzq-radio');

      // 没有 options 时说明选项由插槽提供
      expect(resolveOptionComponent({ component: 'hzq-select', options: [] })).to.equal('');
    });

    it('选项数据按 optionProps 映射成 label / value', () => {
      const options = normalizeOptions(
        [{ name: '一', id: 1, off: true }],
        { label: 'name', value: 'id', disabled: 'off' }
      );

      expect(options).to.deep.equal([{ label: '一', value: 1, disabled: true }]);
    });

    it('插槽配置支持数组与映射对象两种写法', () => {
      expect(resolveForwardedSlots(['prefix'])).to.deep.equal([
        { target: 'prefix', source: 'prefix' }
      ]);
      expect(resolveForwardedSlots({ prefix: 'myPrefix' })).to.deep.equal([
        { target: 'prefix', source: 'myPrefix' }
      ]);
      expect(resolveForwardedSlots()).to.deep.equal([]);
    });
  });

  describe('component', () => {
    let vm;

    afterEach(() => {
      destroyVM(vm);
    });

    function createBuilder(template, data, methods, components) {
      return createVue({ template, data, methods, components }, true);
    }

    it('按配置渲染字段与标签', () => {
      vm = createBuilder(
        '<hzq-form-builder v-model="form" :fields="fields" label-width="80px" />',
        () => ({
          form: { name: '', amount: '' },
          fields: [
            { prop: 'name', label: '姓名', component: 'hzq-input' },
            { prop: 'amount', label: '金额', component: 'hzq-amount-input' }
          ]
        })
      );

      const labels = vm.$el.querySelectorAll('.hzq-form-item__label');
      expect(labels).to.have.length(2);
      expect(labels[0].textContent.trim()).to.equal('姓名');
      expect(labels[1].textContent.trim()).to.equal('金额');
      expect(vm.$el.querySelectorAll('.hzq-form-item')).to.have.length(2);
    });

    it('输入值写回 model', async() => {
      vm = createBuilder(
        '<hzq-form-builder v-model="form" :fields="fields" />',
        () => ({
          form: { name: '' },
          fields: [{ prop: 'name', label: '姓名', component: 'hzq-input' }]
        })
      );
      const input = vm.$el.querySelector('input');

      setInputValue(input, '张三');
      await waitImmediate();

      expect(vm.form.name).to.equal('张三');
    });

    it('支持嵌套路径', async() => {
      vm = createBuilder(
        '<hzq-form-builder v-model="form" :fields="fields" />',
        () => ({
          form: { user: { name: '' } },
          fields: [{ prop: 'user.name', label: '姓名', component: 'hzq-input' }]
        })
      );

      setInputValue(vm.$el.querySelector('input'), '李四');
      await waitImmediate();

      expect(vm.form.user.name).to.equal('李四');
    });

    it('required 自动生成校验规则', async() => {
      vm = createBuilder(
        '<hzq-form-builder ref="builder" v-model="form" :fields="fields" />',
        () => ({
          form: { name: '' },
          fields: [{ prop: 'name', label: '姓名', component: 'hzq-input', required: true }]
        })
      );

      let valid = true;
      vm.$refs.builder.validate(result => { valid = result; });
      await waitImmediate();

      expect(valid).to.be.false;
      expect(vm.$el.querySelector('.hzq-form-item__error').textContent.trim()).to.equal('姓名不能为空');
    });

    it('字段配了 required 时表单级 rules 依然生效', async() => {
      vm = createBuilder(
        '<hzq-form-builder ref="builder" v-model="form" :fields="fields" :rules="rules" />',
        () => ({
          form: { amount: '' },
          fields: [{ prop: 'amount', label: '金额', component: 'hzq-input', required: true }],
          rules: {
            amount: [{ pattern: /^\d+$/, message: '只能填数字', trigger: 'change' }]
          }
        })
      );

      vm.form.amount = 'abc';
      let valid = true;
      vm.$refs.builder.validate(result => { valid = result; });
      await waitImmediate();

      expect(valid).to.be.false;
      expect(vm.$el.querySelector('.hzq-form-item__error').textContent.trim()).to.equal('只能填数字');
    });

    it('select 按 options 自动渲染选项', async() => {
      vm = createBuilder(
        '<hzq-form-builder v-model="form" :fields="fields" />',
        () => ({
          form: { region: '' },
          fields: [{
            prop: 'region',
            label: '区域',
            component: 'hzq-select',
            options: SELECT_OPTIONS
          }]
        })
      );
      await waitImmediate();

      const items = Array.from(vm.$el.querySelectorAll('.hzq-select-dropdown__item'));
      expect(items).to.have.length(2);
      expect(items[0].textContent.trim()).to.equal('区域一');
      expect(items[1].classList.contains('is-disabled')).to.be.true;
    });

    it('options 配合 optionProps 对接接口数据', async() => {
      vm = createBuilder(
        '<hzq-form-builder v-model="form" :fields="fields" />',
        () => ({
          form: { region: '' },
          fields: [{
            prop: 'region',
            label: '区域',
            component: 'hzq-select',
            options: [{ name: '甲', code: 'a' }],
            optionProps: { label: 'name', value: 'code' }
          }]
        })
      );
      await waitImmediate();

      const items = vm.$el.querySelectorAll('.hzq-select-dropdown__item');
      expect(items[0].textContent.trim()).to.equal('甲');
    });

    it('radio-group 按 options 渲染单选项', () => {
      vm = createBuilder(
        '<hzq-form-builder v-model="form" :fields="fields" />',
        () => ({
          form: { type: '' },
          fields: [{
            prop: 'type',
            label: '类型',
            component: 'hzq-radio-group',
            options: SELECT_OPTIONS
          }]
        })
      );

      expect(vm.$el.querySelectorAll('.hzq-radio')).to.have.length(2);
    });

    it('component 传组件对象', async() => {
      const LocalInput = {
        name: 'LocalInput',
        props: { value: String },
        template: '<input class="local-input" :value="value" @input="$emit(\'input\', $event.target.value)">'
      };

      vm = createBuilder(
        '<hzq-form-builder v-model="form" :fields="fields" />',
        () => ({
          form: { name: '' },
          fields: [{ prop: 'name', label: '姓名', component: LocalInput }]
        }),
        {},
        { LocalInput }
      );

      const input = vm.$el.querySelector('.local-input');
      expect(input).to.exist;

      setInputValue(input, '王五');
      await waitImmediate();

      expect(vm.form.name).to.equal('王五');
    });

    it('slot 整块接管字段', async() => {
      vm = createBuilder(
        `<hzq-form-builder v-model="form" :fields="fields">
          <template slot="customName" slot-scope="scope">
            <b class="custom-field">{{ scope.field.label }}:{{ scope.value }}</b>
            <button type="button" class="custom-set" @click="scope.setValue('来自插槽')">设置</button>
          </template>
        </hzq-form-builder>`,
        () => ({
          form: { name: '初始' },
          fields: [{ prop: 'name', label: '姓名', slot: 'customName' }]
        })
      );

      expect(vm.$el.querySelector('.custom-field').textContent).to.equal('姓名:初始');

      vm.$el.querySelector('.custom-set').click();
      await waitImmediate();

      expect(vm.form.name).to.equal('来自插槽');
    });

    it('labelSlot 自定义标签内容', () => {
      vm = createBuilder(
        `<hzq-form-builder v-model="form" :fields="fields">
          <span slot="nameLabel" slot-scope="scope" class="custom-label">★{{ scope.field.label }}</span>
        </hzq-form-builder>`,
        () => ({
          form: { name: '' },
          fields: [{
            prop: 'name',
            label: '姓名',
            component: 'hzq-input',
            labelSlot: 'nameLabel'
          }]
        })
      );

      expect(vm.$el.querySelector('.custom-label').textContent).to.equal('★姓名');
    });

    it('slots 把插槽转进字段组件', () => {
      vm = createBuilder(
        `<hzq-form-builder v-model="form" :fields="fields">
          <template slot="namePrefix">
            <span class="prefix-slot">￥</span>
          </template>
        </hzq-form-builder>`,
        () => ({
          form: { amount: '' },
          fields: [{
            prop: 'amount',
            label: '金额',
            component: 'hzq-input',
            slots: { prefix: 'namePrefix' }
          }]
        })
      );

      expect(vm.$el.querySelector('.prefix-slot')).to.exist;
    });

    it('hidden 为真时整块不渲染，但 model 里的值保留', async() => {
      vm = createBuilder(
        '<hzq-form-builder v-model="form" :fields="fields" />',
        () => ({
          form: { type: 'dynamic', name: '张三' },
          fields: [
            { prop: 'type', label: '类型', component: 'hzq-input' },
            {
              prop: 'name',
              label: '姓名',
              component: 'hzq-input',
              hidden: model => model.type === 'dynamic'
            }
          ]
        })
      );

      expect(vm.$el.querySelectorAll('.hzq-form-item')).to.have.length(1);
      expect(vm.form.name).to.equal('张三');

      vm.form.type = 'fixed';
      await waitImmediate();

      expect(vm.$el.querySelectorAll('.hzq-form-item')).to.have.length(2);
    });

    it('disabled 支持函数，随 model 变化', async() => {
      vm = createBuilder(
        '<hzq-form-builder v-model="form" :fields="fields" />',
        () => ({
          form: { locked: true, name: '' },
          fields: [{
            prop: 'name',
            label: '姓名',
            component: 'hzq-input',
            disabled: model => model.locked
          }]
        })
      );

      expect(vm.$el.querySelector('input').disabled).to.be.true;

      vm.form.locked = false;
      await waitImmediate();

      expect(vm.$el.querySelector('input').disabled).to.be.false;
    });

    it('props 透传给字段组件', () => {
      vm = createBuilder(
        '<hzq-form-builder v-model="form" :fields="fields" />',
        () => ({
          form: { name: '' },
          fields: [{
            prop: 'name',
            label: '姓名',
            component: 'hzq-input',
            props: { placeholder: '请输入姓名', maxlength: 10 }
          }]
        })
      );

      const input = vm.$el.querySelector('input');
      expect(input.getAttribute('placeholder')).to.equal('请输入姓名');
      expect(input.getAttribute('maxlength')).to.equal('10');
    });

    it('events 回调能拿到字段上下文', async() => {
      const calls = [];

      vm = createBuilder(
        '<hzq-form-builder v-model="form" :fields="fields" />',
        () => ({
          form: { name: '' },
          fields: [{
            prop: 'name',
            label: '姓名',
            component: 'hzq-input',
            events: {
              input(value, ctx) {
                calls.push({ value, prop: ctx.prop, label: ctx.field.label });
              }
            }
          }]
        })
      );

      setInputValue(vm.$el.querySelector('input'), '张三');
      await waitImmediate();

      expect(calls).to.deep.equal([{ value: '张三', prop: 'name', label: '姓名' }]);
    });

    it('span 累计成行，满了自动换行', () => {
      vm = createBuilder(
        '<hzq-form-builder v-model="form" :fields="fields" />',
        () => ({
          form: { a: '', b: '', c: '' },
          fields: [
            { prop: 'a', label: 'A', component: 'hzq-input', span: 12 },
            { prop: 'b', label: 'B', component: 'hzq-input', span: 12 },
            { prop: 'c', label: 'C', component: 'hzq-input' }
          ]
        })
      );

      const rows = vm.$el.querySelectorAll('.hzq-form-builder__row');
      expect(rows).to.have.length(2);
      expect(rows[0].querySelectorAll('.hzq-form-builder__col')).to.have.length(2);
      expect(rows[1].querySelectorAll('.hzq-form-builder__col')).to.have.length(1);
    });

    it('columns 控制等分列数', () => {
      vm = createBuilder(
        '<hzq-form-builder v-model="form" :fields="fields" :columns="3" />',
        () => ({
          form: { a: '', b: '', c: '' },
          fields: [
            { prop: 'a', label: 'A', component: 'hzq-input' },
            { prop: 'b', label: 'B', component: 'hzq-input' },
            { prop: 'c', label: 'C', component: 'hzq-input' }
          ]
        })
      );

      const col = vm.$el.querySelector('.hzq-form-builder__col');
      expect(parseFloat(col.style.width)).to.be.closeTo(33.333, 0.01);
      expect(vm.$el.querySelectorAll('.hzq-form-builder__row')).to.have.length(1);
    });

    it('columns 除不尽时按个数分行，不会多挤一列', () => {
      vm = createBuilder(
        '<hzq-form-builder v-model="form" :fields="fields" :columns="5" />',
        () => ({
          form: { a: '', b: '', c: '', d: '', e: '', f: '' },
          fields: ['a', 'b', 'c', 'd', 'e', 'f'].map(prop => ({
            prop,
            label: prop,
            component: 'hzq-input'
          }))
        })
      );

      const rows = vm.$el.querySelectorAll('.hzq-form-builder__row');
      expect(rows).to.have.length(2);
      expect(rows[0].querySelectorAll('.hzq-form-builder__col')).to.have.length(5);
      expect(rows[1].querySelectorAll('.hzq-form-builder__col')).to.have.length(1);
    });

    it('gutter 换算成左右内边距与负外边距', () => {
      vm = createBuilder(
        '<hzq-form-builder v-model="form" :fields="fields" :gutter="20" />',
        () => ({
          form: { a: '', b: '' },
          fields: [
            { prop: 'a', label: 'A', component: 'hzq-input', span: 12 },
            { prop: 'b', label: 'B', component: 'hzq-input', span: 12 }
          ]
        })
      );

      const row = vm.$el.querySelector('.hzq-form-builder__row');
      const col = vm.$el.querySelector('.hzq-form-builder__col');
      expect(row.style.marginLeft).to.equal('-10px');
      expect(col.style.paddingLeft).to.equal('10px');
    });

    it('title 与 divider 只做展示，不参与数据', () => {
      vm = createBuilder(
        '<hzq-form-builder v-model="form" :fields="fields" />',
        () => ({
          form: { name: '' },
          fields: [
            { type: 'title', label: '基本信息' },
            { prop: 'name', label: '姓名', component: 'hzq-input' },
            { type: 'divider', label: '更多' }
          ]
        })
      );

      expect(vm.$el.querySelector('.hzq-form-builder__title').textContent.trim()).to.equal('基本信息');
      expect(vm.$el.querySelectorAll('.hzq-form-item')).to.have.length(1);
      expect(vm.$el.querySelector('.hzq-divider')).to.exist;
    });

    it('tip 渲染在字段下方', () => {
      vm = createBuilder(
        '<hzq-form-builder v-model="form" :fields="fields" />',
        () => ({
          form: { name: '' },
          fields: [{
            prop: 'name',
            label: '姓名',
            component: 'hzq-input',
            tip: '请填写真实姓名'
          }]
        })
      );

      expect(vm.$el.querySelector('.hzq-form-builder__tip').textContent).to.equal('请填写真实姓名');
    });

    it('showActions 校验通过后抛 submit', async() => {
      const events = [];

      vm = createBuilder(
        `<hzq-form-builder
          v-model="form"
          :fields="fields"
          show-actions
          submit-text="保存"
          @submit="onSubmit"
          @invalid="onInvalid"
          @reset="onReset"
        />`,
        () => ({
          form: { name: '' },
          fields: [{ prop: 'name', label: '姓名', component: 'hzq-input', required: true }]
        }),
        {
          onSubmit(model) { events.push(['submit', model.name]); },
          onInvalid() { events.push(['invalid']); },
          onReset() { events.push(['reset']); }
        }
      );

      const buttons = vm.$el.querySelectorAll('.hzq-form-builder__actions button');
      expect(buttons).to.have.length(2);
      expect(buttons[0].textContent.trim()).to.equal('保存');

      buttons[0].click();
      await waitImmediate();
      expect(events).to.deep.equal([['invalid']]);

      vm.form.name = '张三';
      await waitImmediate();
      buttons[0].click();
      await waitImmediate();
      expect(events[1]).to.deep.equal(['submit', '张三']);

      buttons[1].click();
      await waitImmediate();
      expect(events[2]).to.deep.equal(['reset']);
      expect(vm.form.name).to.equal('');
    });

    it('不传 show-actions 时不渲染按钮', () => {
      vm = createBuilder(
        '<hzq-form-builder v-model="form" :fields="fields" />',
        () => ({
          form: { name: '' },
          fields: [{ prop: 'name', label: '姓名', component: 'hzq-input' }]
        })
      );

      expect(vm.$el.querySelector('.hzq-form-builder__actions')).to.not.exist;
    });

    it('field-change 抛出字段与值', async() => {
      const changes = [];

      vm = createBuilder(
        '<hzq-form-builder v-model="form" :fields="fields" @field-change="onFieldChange" />',
        () => ({
          form: { name: '' },
          fields: [{ prop: 'name', label: '姓名', component: 'hzq-input' }]
        }),
        {
          onFieldChange(prop, value) { changes.push([prop, value]); }
        }
      );

      setInputValue(vm.$el.querySelector('input'), '张三');
      await waitImmediate();

      expect(changes).to.deep.equal([['name', '张三']]);
    });

    it('透传 el-form 的尺寸与 label 位置', () => {
      vm = createBuilder(
        '<hzq-form-builder v-model="form" :fields="fields" size="small" label-position="top" />',
        () => ({
          form: { name: '' },
          fields: [{ prop: 'name', label: '姓名', component: 'hzq-input' }]
        })
      );

      expect(vm.$el.classList.contains('hzq-form--label-top')).to.be.true;
      expect(vm.$el.querySelector('.hzq-form-item').classList.contains('hzq-form-item--small')).to.be.true;
    });

    it('透传 el-form 的行内错误、状态图标与必填星号', () => {
      vm = createBuilder(
        '<hzq-form-builder v-model="form" :fields="fields" inline-message status-icon hide-required-asterisk />',
        () => ({
          form: { name: '' },
          fields: [{ prop: 'name', label: '姓名', component: 'hzq-input', required: true }]
        })
      );

      const form = vm.$children[0];
      expect(form.inlineMessage).to.be.true;
      expect(form.statusIcon).to.be.true;
      expect(form.hideRequiredAsterisk).to.be.true;
      // 星号被隐藏后，必填标记不再渲染
      expect(vm.$el.querySelector('.hzq-form-item__label').textContent.indexOf('*')).to.equal(-1);
    });
  });
});
