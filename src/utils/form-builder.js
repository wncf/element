/**
 * 表单构建器的纯函数工具
 *
 * 为什么单独抽出来：路径读写、规则合并、条件求值、配置归一化都是和 Vue 无关的
 * 数据运算，抽出来可以脱离组件单测，业务侧给后端校验、导出等场景也能直接复用。
 *
 * 字段配置（field）的约定见 packages/form-builder/src/form-builder.vue 顶部注释。
 */

// 支持 'user.name' 与 'list[0].id' 两种写法
const PATH_PATTERN = /[^.[\]]+/g;

// 下标形式的键（'0'、'12'）说明这一层应该是数组，
// 创建中间层级时按数组建，否则提交给后端会变成 {"0": {...}} 这样的对象
function isIndexKey(key) {
  return /^\d+$/.test(key);
}

// 组件名 → 选项子组件名。只覆盖表单里最常见的三件套，
// 其余组件（如 hzq-cascader）用 options 数据源驱动，不需要子选项。
const OPTION_CHILD_COMPONENTS = {
  'hzq-select': 'hzq-option',
  'hzq-radio-group': 'hzq-radio',
  'hzq-checkbox-group': 'hzq-checkbox'
};

export function parsePath(path) {
  if (path === null || path === undefined) return [];

  return String(path).match(PATH_PATTERN) || [];
}

export function getValueByPath(model, path) {
  const keys = parsePath(path);

  return keys.reduce((value, key) => (
    value === null || value === undefined ? undefined : value[key]
  ), model);
}

/**
 * 按路径写值。中间层级不存在时顺手创建，避免 prop 配成 'a.b'
 * 而 model 里没有 a 时直接报错。
 *
 * vue 可以不传：在组件里传 this，让新键走 $set 触发响应式；
 * 生成初始 model 时对象还没被 observe，直接赋值即可。
 */
export function setValueByPath(model, path, value, vue) {
  const keys = parsePath(path);
  if (!model || !keys.length) return;

  const set = vue && typeof vue.$set === 'function'
    ? (target, key, val) => vue.$set(target, key, val)
    : (target, key, val) => { target[key] = val; };

  let target = model;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (target[key] === null || typeof target[key] !== 'object') {
      // 下一层是下标就建成数组，保证 'list[0].id' 得到的是 [{ id }] 而不是 { '0': { id } }
      const nextKey = keys[i + 1];
      set(target, key, isIndexKey(nextKey) ? [] : {});
    }
    target = target[key];
  }

  set(target, keys[keys.length - 1], value);
}

/**
 * 条件类配置（hidden / disabled）既允许写死布尔值，也允许写 (model) => boolean
 */
export function resolveCondition(condition, model) {
  if (typeof condition === 'function') return !!condition(model);

  return !!condition;
}

/**
 * 必填规则由 required 自动生成，文案默认「{label}不能为空」。
 * trigger 同时挂 blur 和 change：只挂 blur 的话，用户改完值要在别处点一下才消红。
 */
export function createRequiredRule(field) {
  return {
    required: true,
    message: field.requiredMessage || `${field.label || field.prop}不能为空`,
    trigger: ['blur', 'change']
  };
}

/**
 * 字段自身的规则 + 必填规则 + 表单级 rules 合并成一份。
 *
 * 必须显式合并：el-form-item 只要拿到 rules 就不会再去读 form 的 rules
 * （见 form-item 的 getRules），而 required 自动生成的规则恰恰会让它「有 rules」，
 * 不合并的话表单级规则会被静默忽略。
 */
export function mergeFieldRules(field, formRules) {
  let rules = [];

  if (field.required) rules = rules.concat(createRequiredRule(field));
  if (field.rules && field.rules.length) rules = rules.concat(field.rules);

  const formRule = formRules && field.prop ? formRules[field.prop] : undefined;
  if (formRule) rules = rules.concat(formRule);

  return rules.length ? rules : undefined;
}

/**
 * 归一化字段配置：补 key（v-for 用）、补 type，并复制一份避免改动调用方的配置对象。
 */
export function normalizeFields(fields) {
  return (fields || []).map((field, index) => {
    if (!field) return null;

    const normalized = Object.assign({ type: 'field' }, field);
    normalized.key = field.key || field.prop || `field-${index}`;

    return normalized;
  }).filter(Boolean);
}

/**
 * 选项子组件：优先用配置显式指定的，否则按组件名查表。
 * 没有 options 数据时返回空串，此时子节点交给使用方的插槽。
 */
export function resolveOptionComponent(field, resolvedComponent) {
  if (!field.options || !field.options.length) return '';
  if (field.optionComponent) return field.optionComponent;

  // resolvedComponent 是解析器解析出来的组件（可能来自 fieldType），
  // 优先于 field.component —— 后者在走解析器时本来就是空的
  const component = resolvedComponent || field.component;
  const name = typeof component === 'string'
    ? component
    : (component && component.name);

  return OPTION_CHILD_COMPONENTS[name] || '';
}

/**
 * 把业务数据映射成 { label, value, disabled }，让 hzq-option / hzq-radio 直接可用。
 * optionProps 用于对接 { name, id, off } 这类字段名不一致的接口数据。
 */
export function normalizeOptions(options, optionProps = {}) {
  const {
    label = 'label',
    value = 'value',
    disabled = 'disabled'
  } = optionProps;

  return (options || []).map(item => ({
    label: item[label],
    value: item[value],
    disabled: item[disabled]
  }));
}

/**
 * 使用方写在配置里的 slots 支持两种写法：
 * ['prefix'] 或 { prefix: 'myPrefix' }（目标插槽名 → 使用方插槽名）
 */
export function resolveForwardedSlots(slots) {
  if (!slots) return [];
  if (Array.isArray(slots)) return slots.map(name => ({ target: name, source: name }));

  return Object.keys(slots).map(target => ({ target, source: slots[target] }));
}

/* ------------------------------------------------------------------ *
 * 扩展点二：字段解析器（field-resolver）
 *
 * 库不定义任何"业务字段类型"。遇到不认识的字段就问调用方，
 * 由调用方返回 { component, props, optionComponent }。
 * ------------------------------------------------------------------ */

/**
 * 统一字段解析结果的结构，避免调用方少返回几个键时下游要处处判空。
 */
function normalizeResolution(result) {
  if (!result || !result.component) return null;

  return {
    component: result.component,
    props: result.props || {},
    optionComponent: result.optionComponent || ''
  };
}

/**
 * 解析一个字段该用哪个组件渲染。
 *
 * 优先级：
 *   1. field.component —— 显式指定，永远最高，不走解析器
 *   2. fieldResolver   —— 调用方注入，负责把 fieldType 翻译成组件
 *   3. 返回 null       —— 调用方自己处理（通常是降级成纯文本）
 *
 * 解析器抛错时捕获并返回 null：一个字段配错不该让整个表单白屏。
 */
export function resolveFieldComponent(field, fieldResolver) {
  if (field && field.component) {
    return { component: field.component, props: {}, optionComponent: '' };
  }

  if (typeof fieldResolver !== 'function') return null;

  try {
    return normalizeResolution(fieldResolver(field));
  } catch (e) {
    return null;
  }
}

/**
 * 合并预设 props 与字段自己的 props：字段显式配置覆盖预设默认值。
 * 单独抽出来是因为 resolver 的返回值要在 form-field 里和 field.props 合一次。
 */
export function mergeComponentProps(presetProps, fieldProps) {
  if (!presetProps) return fieldProps || {};

  return Object.assign({}, presetProps, fieldProps || {});
}

/* ------------------------------------------------------------------ *
 * 扩展点三：按字段配置生成初始 model
 *
 * 只做"填坑"，不碰业务：默认值来自 field.defaultValue，
 * 没写时按库自己组件的值形态兜底（这是库对自己组件的知识，不是业务语义）。
 * ------------------------------------------------------------------ */

// 组件名 → 默认值工厂。用工厂而不是字面量：
// 多选类组件拿到共享的数组会在表单之间串值。
// 这里只收库自己的组件，是库对自己组件值形态的知识，不涉及业务语义。
const COMPONENT_DEFAULT_FACTORIES = {
  'hzq-checkbox-group': () => [],
  'hzq-switch': () => false,
  'hzq-rate': () => 0
};

/**
 * 取一个字段的初始值。
 * defaultValue 支持函数形式，每次调用重新求值（如 `() => new Date()`）。
 */
function resolveDefaultValue(field, fieldResolver) {
  if (field.defaultValue !== undefined) {
    return typeof field.defaultValue === 'function' ? field.defaultValue() : field.defaultValue;
  }

  const resolved = resolveFieldComponent(field, fieldResolver);
  const componentName = resolved && typeof resolved.component === 'string'
    ? resolved.component
    : '';

  if (componentName && COMPONENT_DEFAULT_FACTORIES[componentName]) {
    return COMPONENT_DEFAULT_FACTORIES[componentName]();
  }

  // 兜底成空字符串：输入类组件拿到 undefined 会变成非受控，切换时还会告警
  return '';
}

/**
 * 按字段配置生成初始数据对象。
 *
 *   const form = createFormModel(fields);
 *   // 后端数据回来后再合并：后端优先，默认值只补缺失的键
 *   Object.assign(form, backendData);
 *
 * 注意重置语义：hzq-form-item 的初始值是挂载时的快照，
 * 所以一定要「先拿到数据，再渲染表单」，否则点重置会清空回空值。
 */
export function createFormModel(fields, fieldResolver) {
  const model = {};

  normalizeFields(fields).forEach(field => {
    if (field.type !== 'field' || !field.prop) return;

    setValueByPath(model, field.prop, resolveDefaultValue(field, fieldResolver));
  });

  return model;
}
