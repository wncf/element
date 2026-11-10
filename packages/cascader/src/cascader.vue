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
    @click="() => toggleDropDownVisible(readonly ? undefined : true)"
    @keydown="handleKeyDown">

    <hzq-input
      ref="input"
      v-model="multiple ? presentText : inputValue"
      :size="realSize"
      :placeholder="inputPlaceholder"
      :readonly="readonly"
      :disabled="isDisabled"
      :validate-event="false"
      :class="{ 'is-focus': dropDownVisible }"
      @focus="handleFocus"
      @blur="handleBlur"
      @input="handleInput">
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
          @click.stop="toggleDropDownVisible()"></i>
      </template>
    </hzq-input>

    <div v-if="multiple" class="hzq-cascader__tags">
      <div class="hzq-cascader__tags-wrap">
        <hzq-tag
          v-for="tag in presentTags"
          :key="tag.key"
          type="info"
          :size="tagSize"
          :hit="tag.hitState"
          :closable="tag.closable"
          disable-transitions
          @close="deleteTag(tag)">
          <span>{{ tag.text }}</span>
        </hzq-tag>
      </div>
      <input
        v-if="filterable && !isDisabled"
        v-model.trim="inputValue"
        type="text"
        class="hzq-cascader__search-input"
        :placeholder="presentTags.length ? '' : placeholder"
        @input="e => handleInput(inputValue, e)"
        @click.stop="toggleDropDownVisible(true)"
        @keydown.delete="handleDelete">
    </div>

    <transition name="el-zoom-in-top" @after-leave="handleDropdownLeave">
      <div
        v-show="dropDownVisible"
        ref="popper"
        :class="['hzq-popper', 'hzq-cascader__dropdown', popperClass]">
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
              <span>{{ item.text }}</span>
              <i v-if="item.checked" class="hzq-icon-check"></i>
            </li>
          </template>
          <slot v-else name="empty">
            <li class="hzq-cascader__empty-text">{{ t('el.cascader.noMatch') }}</li>
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
    popperClass: String
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
    tagSize() {
      return ['small', 'mini'].indexOf(this.realSize) > -1
        ? 'mini'
        : 'small';
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
    readonly() {
      return !this.filterable || this.multiple;
    },
    // 多选 + 可搜索时输入区由 hzq-cascader__search-input 承担（内层 input 是 readonly），
    // 内层 input 若同时渲染 placeholder 会与搜索框的叠在一起变成重影
    inputPlaceholder() {
      const hasSearchInput = this.multiple && this.filterable && !this.isDisabled;
      return hasSearchInput ? '' : this.placeholder;
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
    }
  },

  watch: {
    disabled() {
      this.computePresentContent();
    },
    value(val) {
      if (!isEqual(val, this.checkedValue)) {
        this.checkedValue = val;
        this.computePresentContent();
      }
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
        this.$emit('change', val);
        this.dispatch('HzqFormItem', 'el.form.change', [val]);
      }
    },
    options: {
      handler: function() {
        this.$nextTick(this.computePresentContent);
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
      this.computePresentContent();
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
          this.toggleDropDownVisible();
          break;
        case KeyCode.down:
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
    handleInput(val, event) {
      !this.dropDownVisible && this.toggleDropDownVisible(true);

      if (event && event.isComposing) return;
      if (val) {
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
      const { checkedValue } = this;
      const current = tag.node.getValueByOption();
      const val = checkedValue.find(n => isEqual(n, current));
      this.checkedValue = checkedValue.filter(n => !isEqual(n, current));
      this.$emit('remove-tag', val);
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
        inputInner.style.height = lockedHeight + 'px';
        const tagsWrap = tags.querySelector('.hzq-cascader__tags-wrap');
        if (tagsWrap && !this.collapseTags) {
          this.syncTagsOverflow(tagsWrap);
        }
        if (this.dropDownVisible) {
          this.updatePopper();
        }
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

