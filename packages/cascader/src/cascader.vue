<template>
  <div
    ref="reference"
    :class="[
      'hzq-cascader',
      realSize && `hzq-cascader--${realSize}`,
      { 'is-disabled': isDisabled }
    ]"
    v-clickoutside="() => toggleDropDownVisible(false)"
    @mouseenter="inputHover = true"
    @mouseleave="inputHover = false"
    @click="handleTriggerClick"
    @keydown="handleKeyDown">

    <!-- 输入框只负责展示已选值，筛选统一放到面板顶部的搜索框 -->
    <hzq-input
      ref="input"
      v-model="multiple ? presentText : inputValue"
      :size="realSize"
      :placeholder="placeholder"
      :readonly="true"
      :disabled="isDisabled"
      :validate-event="false"
      :class="{ 'is-focus': dropDownVisible }"
      @focus="handleFocus"
      @blur="handleBlur">
      <template slot="suffix">
        <i
          v-if="clearBtnVisible"
          key="clear"
          class="hzq-input__icon hzq-icon-circle-close"
          @click.stop="handleClear"></i>
        <i
          v-else
          key="arrow-down"
          :class="[
            'hzq-input__icon',
            'hzq-icon-arrow-down',
            dropDownVisible && 'is-reverse'
          ]"
          @click.stop="handleTriggerClick"></i>
      </template>
    </hzq-input>

    <div
      v-if="multiple"
      class="hzq-cascader__tags"
      :class="{ 'hzq-cascader__tags--adaptive': tagsWrap }">
      <div
        class="hzq-cascader__tags-wrap"
        :class="{ 'hzq-cascader__tags--wrap': tagsWrap }">
        <hzq-tag
          v-for="tag in presentTags"
          :key="tag.key"
          type="info"
          :size="tagSize"
          :hit="tag.hitState"
          :closable="tag.closable"
          disable-transitions
          @close="deleteTag(tag)">
          <span :style="tagTextStyle">{{ tag.text }}</span>
        </hzq-tag>
      </div>
    </div>

    <transition name="el-zoom-in-top" @after-leave="handleDropdownLeave">
      <div
        v-show="dropDownVisible"
        ref="popper"
        :class="['hzq-popper', 'hzq-cascader__dropdown', popperClass]">
        <!-- 可搜索：面板顶部常驻搜索框，输入后整个面板替换为扁平结果列表 -->
        <div v-if="filterable" class="hzq-cascader__search">
          <i class="hzq-icon-search hzq-cascader__search-icon"></i>
          <input
            ref="searchInput"
            v-model.trim="inputValue"
            type="text"
            class="hzq-cascader__search-input"
            :placeholder="searchPlaceholder"
            :disabled="isDisabled"
            @input="handleInput">
        </div>
        <hzq-cascader-panel
          ref="panel"
          v-show="!filtering"
          v-model="checkedValue"
          :options="options"
          :props="config"
          :border="false"
          :render-label="$scopedSlots.default"
          @expand-change="handleExpandChange"
          @close="toggleDropDownVisible(false)"></hzq-cascader-panel>
        <hzq-scrollbar
          ref="suggestionPanel"
          v-if="filterable"
          v-show="filtering"
          tag="ul"
          class="hzq-cascader__suggestion-panel"
          view-class="hzq-cascader__suggestion-list"
          @keydown.native="handleSuggestionKeyDown">
          <template v-if="suggestions.length">
            <li
              v-for="(item, index) in suggestions"
              :key="item.uid"
              :class="[
                'hzq-cascader__suggestion-item',
                item.checked && 'is-checked'
              ]"
              :tabindex="-1"
              @click="handleSuggestionClick(index)">
              <!-- 作用域插槽只替换建议项内容，点击行为仍由外层 li 负责 -->
              <slot name="suggestion" :item="item" :index="index" :keyword="inputValue">
                <span>{{ item.text }}</span>
                <i v-if="item.checked" class="hzq-icon-check"></i>
              </slot>
            </li>
          </template>
          <slot v-else name="empty">
            <li class="hzq-cascader__empty-text">{{ t('el.cascader.noContent') }}</li>
          </slot>
        </hzq-scrollbar>
      </div>
    </transition>
  </div>
</template>

<script>
import Popper from 'hzq-ui/src/utils/vue-popper';
import Clickoutside from 'hzq-ui/src/utils/clickoutside';
import Emitter from 'hzq-ui/src/mixins/emitter';
import Locale from 'hzq-ui/src/mixins/locale';
import Migrating from 'hzq-ui/src/mixins/migrating';
import HzqInput from 'hzq-ui/packages/input';
import HzqTag from 'hzq-ui/packages/tag';
import HzqScrollbar from 'hzq-ui/packages/scrollbar';
import HzqCascaderPanel from 'hzq-ui/packages/cascader-panel';
import AriaUtils from 'hzq-ui/src/utils/aria-utils';
import { t } from 'hzq-ui/src/locale';
import { isEqual, isEmpty, kebabCase } from 'hzq-ui/src/utils/util';
import { isUndefined, isFunction } from 'hzq-ui/src/utils/types';
import { isDef } from 'hzq-ui/src/utils/shared';
import { addResizeListener, removeResizeListener } from 'hzq-ui/src/utils/resize-event';
import debounce from 'throttle-debounce/debounce';

const { keys: KeyCode } = AriaUtils;
const MigratingProps = {
  expandTrigger: {
    newProp: 'expandTrigger',
    type: String
  },
  changeOnSelect: {
    newProp: 'checkStrictly',
    type: Boolean
  },
  hoverThreshold: {
    newProp: 'hoverThreshold',
    type: Number
  }
};

const PopperMixin = {
  props: {
    placement: {
      type: String,
      default: 'bottom-start'
    },
    appendToBody: Popper.props.appendToBody,
    visibleArrow: {
      type: Boolean,
      default: true
    },
    arrowOffset: Popper.props.arrowOffset,
    offset: Popper.props.offset,
    boundariesPadding: Popper.props.boundariesPadding,
    popperOptions: Popper.props.popperOptions,
    transformOrigin: Popper.props.transformOrigin
  },
  methods: Popper.methods,
  data: Popper.data,
  beforeDestroy: Popper.beforeDestroy
};

// 与 var.scss 的尺寸梯级保持一致：large 36 / medium 32 / small 28 / mini 24。
// 多选锁高时用它兜底，正常情况下取实测高度
const InputSizeMap = {
  large: 36,
  medium: 32,
  small: 28,
  mini: 24
};

export default {
  name: 'HzqCascader',

  directives: { Clickoutside },

  mixins: [PopperMixin, Emitter, Locale, Migrating],

  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },

  components: {
    HzqInput,
    HzqTag,
    HzqScrollbar,
    HzqCascaderPanel
  },

  props: {
    value: {},
    options: Array,
    props: Object,
    size: String,
    placeholder: {
      type: String,
      default: () => t('el.cascader.placeholder')
    },
    disabled: Boolean,
    clearable: Boolean,
    filterable: Boolean,
    filterMethod: Function,
    separator: {
      type: String,
      default: ' / '
    },
    showAllLevels: {
      type: Boolean,
      default: true
    },
    collapseTags: Boolean,
    debounce: {
      type: Number,
      default: 300
    },
    beforeFilter: {
      type: Function,
      default: () => (() => {})
    },
    popperClass: String,
    // 允许 v-model 传入「只有末级值」的数组，组件会按 options 补全为完整路径
    valueCompat: {
      type: Boolean,
      default: false
    },
    // 下拉层的触发方式：click 为点击输入框切换，manual 完全由外部控制
    popoverTrigger: {
      type: String,
      default: 'click',
      validator: value => ['click', 'manual'].indexOf(value) > -1
    },
    // 多选标签换行显示：不换行时（默认）保持 1.1.1 的单行截断行为
    tagsWrap: {
      type: Boolean,
      default: false
    },
    // 单个标签的最大宽度，数字按 px 处理；留空表示不限制
    tagMaxWidth: {
      type: [String, Number],
      default: ''
    }
  },

  data() {
    return {
      dropDownVisible: false,
      checkedValue: this.value,
      inputHover: false,
      inputValue: null,
      presentText: null,
      presentTags: [],
      checkedNodes: [],
      filtering: false,
      suggestions: [],
      inputInitialHeight: 0,
      pressDeleteCount: 0
    };
  },

  computed: {
    realSize() {
      const _elFormItemSize = (this.elFormItem || {}).elFormItemSize;
      return this.size || _elFormItemSize || (this.$HZQ || {}).size;
    },
    // 标签沿用输入框的档位（内边距、字号、关闭图标缩放随档位变化）；
    // 高度不取 tag 的档位值，而是在 cascader.scss 里按「输入框高度 - 6px」单独设置
    tagSize() {
      const size = this.realSize;
      return ['large', 'medium', 'small', 'mini'].indexOf(size) > -1 ? size : 'medium';
    },
    isDisabled() {
      return this.disabled || (this.elForm || {}).disabled;
    },
    config() {
      const config = this.props || {};
      const { $attrs } = this;

      Object
        .keys(MigratingProps)
        .forEach(oldProp => {
          const { newProp, type } = MigratingProps[oldProp];
          let oldValue = $attrs[oldProp] || $attrs[kebabCase(oldProp)];
          if (isDef(oldProp) && !isDef(config[newProp])) {
            if (type === Boolean && oldValue === '') {
              oldValue = true;
            }
            config[newProp] = oldValue;
          }
        });

      return config;
    },
    multiple() {
      return this.config.multiple;
    },
    leafOnly() {
      return !this.config.checkStrictly;
    },
    // config 只含调用方传入的键，emitPath 的默认值在 panel 里，这里按默认 true 处理
    emitPath() {
      return this.config.emitPath !== false;
    },
    // 面板搜索框的提示语
    searchPlaceholder() {
      return t('el.cascader.searchPlaceholder');
    },
    clearBtnVisible() {
      if (!this.clearable || this.isDisabled || this.filtering || !this.inputHover) {
        return false;
      }

      return this.multiple
        ? !!this.checkedNodes.filter(node => !node.isDisabled).length
        : !!this.presentText;
    },
    panel() {
      return this.$refs.panel;
    },
    // 标签文字的最大宽度样式，仅在传入 tagMaxWidth 时生效，
    // 直接作用于 tag 内部 span，超长文字仍按 existing 的 ellipsis 规则截断
    tagTextStyle() {
      const { tagMaxWidth } = this;
      if (tagMaxWidth === '' || tagMaxWidth === null || tagMaxWidth === undefined) return null;
      // 纯数字（含数字字符串）按 px 处理，其余按原样透传（如 '10em'、'30%'）
      const width = typeof tagMaxWidth === 'number' || /^\d+(\.\d+)?$/.test(String(tagMaxWidth))
        ? `${tagMaxWidth}px`
        : tagMaxWidth;
      return { maxWidth: width };
    }
  },

  watch: {
    disabled() {
      this.computePresentContent();
    },
    value(val) {
      this.syncValue(val);
    },
    checkedValue(val) {
      const { value, dropDownVisible } = this;
      const { checkStrictly, multiple } = this.config;

      if (!isEqual(val, value) || isUndefined(value)) {
        this.computePresentContent();
        // hide dropdown when single mode
        if (!multiple && !checkStrictly && dropDownVisible) {
          this.toggleDropDownVisible(false);
        }

        this.$emit('input', val);
        this.$emit('change', val, this.getChangeNodes(val));
        this.dispatch('HzqFormItem', 'el.form.change', [val]);
      }
    },
    options: {
      handler: function() {
        this.$nextTick(() => {
          // options 异步到达后重新归一化，避免末级值回显缺失
          if (this.valueCompat) this.syncValue(this.value);
          this.computePresentContent();
        });
      },
      deep: true
    },
    presentText(val) {
      this.inputValue = val;
    },
    presentTags(val, oldVal) {
      if (this.multiple && (val.length || oldVal.length)) {
        this.$nextTick(this.updateStyle);
      }
    },
    realSize() {
      this.$nextTick(this.updateStyle);
    },
    tagsWrap() {
      this.$nextTick(this.updateStyle);
    },
    tagMaxWidth() {
      this.$nextTick(this.updateStyle);
    },
    filtering(val) {
      this.$nextTick(this.updatePopper);
    }
  },

  mounted() {
    const { input } = this.$refs;
    if (input && input.$el) {
      this.inputInitialHeight = input.$el.offsetHeight || InputSizeMap[this.realSize] || 32;
    }

    if (!this.isEmptyValue(this.value)) {
      this.syncValue(this.value);
    }

    this.filterHandler = debounce(this.debounce, () => {
      const { inputValue } = this;

      if (!inputValue) {
        this.filtering = false;
        return;
      }

      const before = this.beforeFilter(inputValue);
      if (before && before.then) {
        before.then(this.getSuggestions);
      } else if (before !== false) {
        this.getSuggestions();
      } else {
        this.filtering = false;
      }
    });

    addResizeListener(this.$el, this.updateStyle);
  },

  beforeDestroy() {
    removeResizeListener(this.$el, this.updateStyle);
  },

  methods: {
    getMigratingConfig() {
      return {
        props: {
          'expand-trigger': 'expand-trigger is removed, use `props.expandTrigger` instead.',
          'change-on-select': 'change-on-select is removed, use `props.checkStrictly` instead.',
          'hover-threshold': 'hover-threshold is removed, use `props.hoverThreshold` instead'
        },
        events: {
          'active-item-change': 'active-item-change is renamed to expand-change'
        }
      };
    },
    handleTriggerClick() {
      // manual 模式下开合完全交给外部，点击输入框与箭头都不再切换
      if (this.popoverTrigger === 'manual') return;
      this.toggleDropDownVisible();
    },
    /**
     * 公开 API：控制下拉层显隐，不传 visible 时按当前状态取反
     */
    toggleDropDownVisible(visible) {
      if (this.isDisabled) return;

      const { dropDownVisible } = this;
      const { input } = this.$refs;
      visible = isDef(visible) ? visible : !dropDownVisible;
      if (visible !== dropDownVisible) {
        this.dropDownVisible = visible;
        if (visible) {
          this.$nextTick(() => {
            this.updatePopper();
            this.panel.scrollIntoView();
          });
        }
        input.$refs.input.setAttribute('aria-expanded', visible);
        this.$emit('visible-change', visible);
      }
    },
    handleDropdownLeave() {
      this.filtering = false;
      this.inputValue = this.presentText;
      this.doDestroy();
    },
    handleKeyDown(event) {
      switch (event.keyCode) {
        case KeyCode.enter:
          if (this.popoverTrigger === 'manual') break;
          this.toggleDropDownVisible();
          break;
        case KeyCode.down:
          if (this.popoverTrigger === 'manual') break;
          this.toggleDropDownVisible(true);
          this.focusFirstNode();
          event.preventDefault();
          break;
        case KeyCode.esc:
        case KeyCode.tab:
          this.toggleDropDownVisible(false);
          break;
      }
    },
    handleFocus(e) {
      this.$emit('focus', e);
    },
    handleBlur(e) {
      this.$emit('blur', e);
    },
    // 面板搜索框输入：有值走筛选，清空则回到级联面板
    handleInput(event) {
      // 输入法组字期间不触发筛选，否则拼音会被当成关键词
      if (event && event.isComposing) return;

      if (this.inputValue) {
        this.filterHandler();
      } else {
        this.filtering = false;
      }
    },
    handleClear() {
      this.presentText = '';
      this.panel.clearCheckedNodes();
    },
    handleExpandChange(value) {
      this.$nextTick(this.updatePopper.bind(this));
      this.$emit('expand-change', value);
      this.$emit('active-item-change', value); // Deprecated
    },
    focusFirstNode() {
      this.$nextTick(() => {
        const { filtering } = this;
        const { popper, suggestionPanel } = this.$refs;
        let firstNode = null;

        if (filtering && suggestionPanel) {
          firstNode = suggestionPanel.$el.querySelector('.hzq-cascader__suggestion-item');
        } else {
          const firstMenu = popper.querySelector('.hzq-cascader-menu');
          firstNode = firstMenu.querySelector('.hzq-cascader-node[tabindex="-1"]');
        }

        if (firstNode) {
          firstNode.focus();
          !filtering && firstNode.click();
        }
      });
    },
    computePresentContent() {
      // nextTick is required, because checked nodes may not change right now
      this.$nextTick(() => {
        if (this.config.multiple) {
          this.computePresentTags();
          this.presentText = this.presentTags.length ? ' ' : null;
        } else {
          this.computePresentText();
        }
      });
    },
    isEmptyValue(val) {
      const { multiple } = this;
      const { emitPath } = this.panel.config;
      if (multiple || emitPath) {
        return isEmpty(val);
      }
      return false;
    },
    // value 变化与初始化统一走这里：valueCompat 开启时先把末级值补全成完整路径
    syncValue(val) {
      const next = this.valueCompat ? this.normalizeValue(val) : val;
      if (!isEqual(next, this.checkedValue)) {
        this.checkedValue = next;
      }
      this.computePresentContent();
    },
    // 归一化失败的场景一律原值透传，不清空也不报错
    normalizeValue(val) {
      const { panel, multiple } = this;

      if (!this.valueCompat || !this.emitPath || !panel || !panel.getNodeByValue) {
        return val;
      }
      if (!Array.isArray(val) || !val.length) return val;

      return multiple
        ? this.normalizeMultiLeafValue(val)
        : this.normalizeSingleLeafValue(val);
    },
    // 多选：一维数组视为末级值数组，逐项补全；任一节点查不到则整体透传
    normalizeMultiLeafValue(val) {
      if (Array.isArray(val[0])) return val;

      const paths = [];
      for (let i = 0; i < val.length; i++) {
        const node = this.panel.getNodeByValue(val[i]);
        if (!node || !node.isLeaf) return val;
        paths.push(node.getValueByOption());
      }
      return paths.length ? paths : val;
    },
    // 单选：仅当是叶子节点且完整路径确实更长时才补全
    normalizeSingleLeafValue(val) {
      if (val.length !== 1 || Array.isArray(val[0])) return val;

      const node = this.panel.getNodeByValue(val[0]);
      if (!node || !node.isLeaf) return val;

      const path = node.getValueByOption();
      return Array.isArray(path) && path.length > val.length ? path : val;
    },
    // change 事件第二参：当前选中节点对应的原始 option 数组
    getChangeNodes(val) {
      const { panel, multiple } = this;
      if (!panel || !panel.getCheckedNodes) return [];

      if (multiple) {
        // panel 自身 checkedValue 尚未同步到最新值时（外部改 value），按 val 反查，保证与第一参一致
        if (isEqual(panel.checkedValue, val)) {
          return (panel.getCheckedNodes(this.leafOnly) || [])
            .filter(node => node && node.data)
            .map(node => node.data);
        }
        return this.getNodesByValue(val);
      }

      if (this.isEmptyValue(val)) return [];
      const node = panel.getNodeByValue(val);
      return node && node.data ? [node.data] : [];
    },
    getNodesByValue(val) {
      if (!Array.isArray(val)) return [];

      return val
        .map(item => {
          const value = Array.isArray(item)
            ? item[item.length - 1]
            : item;
          const node = this.panel.getNodeByValue(value);
          return node && node.data ? node.data : null;
        })
        .filter(Boolean);
    },
    computePresentText() {
      const { checkedValue, config } = this;
      if (!this.isEmptyValue(checkedValue)) {
        const node = this.panel.getNodeByValue(checkedValue);
        if (node && (config.checkStrictly || node.isLeaf)) {
          this.presentText = node.getText(this.showAllLevels, this.separator);
          return;
        }
      }
      this.presentText = null;
    },
    computePresentTags() {
      const { isDisabled, leafOnly, showAllLevels, separator, collapseTags } = this;
      const checkedNodes = this.getCheckedNodes(leafOnly);
      const tags = [];

      const genTag = node => ({
        node,
        key: node.uid,
        text: node.getText(showAllLevels, separator),
        hitState: false,
        closable: !isDisabled && !node.isDisabled
      });

      if (checkedNodes.length) {
        const [first, ...rest] = checkedNodes;
        const restCount = rest.length;
        tags.push(genTag(first));

        if (restCount) {
          if (collapseTags) {
            tags.push({
              key: -1,
              text: `+ ${restCount}`,
              closable: false
            });
          } else {
            rest.forEach(node => tags.push(genTag(node)));
          }
        }
      }

      this.checkedNodes = checkedNodes;
      this.presentTags = tags;
    },
    getSuggestions() {
      let { filterMethod } = this;

      if (!isFunction(filterMethod)) {
        filterMethod = (node, keyword) => node.text.includes(keyword);
      }

      const suggestions = this.panel.getFlattedNodes(this.leafOnly)
        .filter(node => {
          if (node.isDisabled) return false;
          node.text = node.getText(this.showAllLevels, this.separator) || '';
          return filterMethod(node, this.inputValue);
        });

      if (this.multiple) {
        this.presentTags.forEach(tag => {
          tag.hitState = false;
        });
      } else {
        suggestions.forEach(node => {
          node.checked = isEqual(this.checkedValue, node.getValueByOption());
        });
      }

      this.filtering = true;
      this.suggestions = suggestions;
      this.$nextTick(this.updatePopper);
    },
    handleSuggestionKeyDown(event) {
      const { keyCode, target } = event;
      switch (keyCode) {
        case KeyCode.enter:
          target.click();
          break;
        case KeyCode.up:
          const prev = target.previousElementSibling;
          prev && prev.focus();
          break;
        case KeyCode.down:
          const next = target.nextElementSibling;
          next && next.focus();
          break;
        case KeyCode.esc:
        case KeyCode.tab:
          this.toggleDropDownVisible(false);
          break;
      }
    },
    handleDelete() {
      const { inputValue, pressDeleteCount, presentTags } = this;
      const lastIndex = presentTags.length - 1;
      const lastTag = presentTags[lastIndex];
      this.pressDeleteCount = inputValue ? 0 : pressDeleteCount + 1;

      if (!lastTag) return;

      if (this.pressDeleteCount) {
        if (lastTag.hitState) {
          this.deleteTag(lastTag);
        } else {
          lastTag.hitState = true;
        }
      }
    },
    handleSuggestionClick(index) {
      const { multiple } = this;
      const targetNode = this.suggestions[index];

      if (multiple) {
        const { checked } = targetNode;
        targetNode.doCheck(!checked);
        this.panel.calculateMultiCheckedValue();
      } else {
        this.checkedValue = targetNode.getValueByOption();
        this.toggleDropDownVisible(false);
      }
    },
    deleteTag(tag) {
      const { checkedValue, presentTags } = this;
      const current = tag.node.getValueByOption();
      const val = checkedValue.find(n => isEqual(n, current));
      const index = presentTags.indexOf(tag);
      this.checkedValue = checkedValue.filter(n => !isEqual(n, current));
      this.$emit('remove-tag', val, index);
    },
    syncTagsOverflow(tagsWrap) {
      const tagEls = tagsWrap.querySelectorAll('.hzq-tag');
      tagEls.forEach(tag => {
        tag.style.display = '';
        tag.classList.remove('is-overflow-tail');
      });
      if (!tagEls.length) {
        tagsWrap.classList.remove('is-overflow');
        return;
      }

      const maxWidth = tagsWrap.clientWidth;
      const ellipsisWidth = 12;
      let used = 0;
      let lastVisible = -1;
      for (let i = 0; i < tagEls.length; i++) {
        const style = window.getComputedStyle(tagEls[i]);
        const margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
        const extra = i < tagEls.length - 1 ? ellipsisWidth : 0;
        const width = tagEls[i].offsetWidth + margin;
        if (used + width + extra <= maxWidth + 0.5) {
          used += width;
          lastVisible = i;
        } else {
          break;
        }
      }
      if (lastVisible < 0) lastVisible = 0;

      const overflowing = lastVisible < tagEls.length - 1;
      tagEls.forEach((tag, index) => {
        if (index > lastVisible) tag.style.display = 'none';
      });
      if (overflowing) {
        tagsWrap.classList.add('is-overflow');
        tagEls[lastVisible].classList.add('is-overflow-tail');
      } else {
        tagsWrap.classList.remove('is-overflow');
      }
    },
    updateStyle() {
      const { $el, inputInitialHeight } = this;
      if (this.$isServer || !$el) return;

      const { suggestionPanel } = this.$refs;
      const inputInner = $el.querySelector('.hzq-input__inner');

      if (!inputInner) return;

      const tags = $el.querySelector('.hzq-cascader__tags');
      let suggestionPanelEl = null;

      if (suggestionPanel && (suggestionPanelEl = suggestionPanel.$el)) {
        const suggestionList = suggestionPanelEl.querySelector('.hzq-cascader__suggestion-list');
        suggestionList.style.minWidth = inputInner.offsetWidth + 'px';
      }

      if (tags) {
        const lockedHeight = InputSizeMap[this.realSize] || inputInitialHeight || 32;
        const tagsWrap = tags.querySelector('.hzq-cascader__tags-wrap');
        if (this.tagsWrap && tagsWrap) {
          // 换行模式：输入框高度跟随标签高度增长，标签交给 CSS 换行 + 限高滚动
          this.syncTagsWrapHeight(tagsWrap, lockedHeight, inputInner);
        } else {
          inputInner.style.height = lockedHeight + 'px';
          if (tagsWrap && !this.collapseTags) {
            this.syncTagsOverflow(tagsWrap);
          }
        }
        if (this.dropDownVisible) {
          this.updatePopper();
        }
      }
    },
    // 换行模式下按标签实际高度撑高输入框：标签高出单行时额外留 6px 内边距，
    // 与 select 的 resetInputHeight 保持一致；未超出时仍取档位高度
    syncTagsWrapHeight(tagsWrap, minHeight, inputInner) {
      // 换行模式下不做单行溢出折叠，清掉可能残留的内联隐藏样式
      tagsWrap.querySelectorAll('.hzq-tag').forEach(tag => {
        tag.style.display = '';
        tag.classList.remove('is-overflow-tail');
      });
      tagsWrap.classList.remove('is-overflow');

      const tagsHeight = Math.round(tagsWrap.getBoundingClientRect().height);
      const height = tagsHeight > minHeight ? tagsHeight + 6 : minHeight;
      const next = `${Math.max(height, minHeight)}px`;
      if (inputInner.style.height !== next) {
        inputInner.style.height = next;
      }
    },

    /**
     * public methods
    */
    getCheckedNodes(leafOnly) {
      return this.panel.getCheckedNodes(leafOnly);
    }
  }
};
</script>

