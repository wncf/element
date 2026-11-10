<template>
  <hzq-popover
    v-model="visible"
    placement="bottom-end"
    trigger="click"
    popper-class="theme-switcher__popper"
    :width="248">
    <div class="theme-switcher__panel">
      <div class="theme-switcher__header">
        <span class="theme-switcher__title">主题</span>
        <button type="button" class="theme-switcher__reset" @click="handleReset">重置</button>
      </div>

      <div class="theme-switcher__row">
        <span class="theme-switcher__label">模式</span>
        <hzq-radio-group v-model="mode" size="mini" @change="handleModeChange">
          <hzq-radio-button label="light">浅色</hzq-radio-button>
          <hzq-radio-button label="dark">深色</hzq-radio-button>
        </hzq-radio-group>
      </div>

      <div class="theme-switcher__row">
        <span class="theme-switcher__label">预设</span>
        <hzq-radio-group v-model="preset" size="mini" @change="handlePresetChange">
          <hzq-radio-button label="default">默认</hzq-radio-button>
          <hzq-radio-button label="green">绿色</hzq-radio-button>
        </hzq-radio-group>
      </div>

      <div class="theme-switcher__row">
        <span class="theme-switcher__label">主色</span>
        <hzq-color-picker
          v-model="primary"
          size="mini"
          :predefine="PREDEFINE_COLORS"
          @change="handlePrimaryChange"
        />
        <span class="theme-switcher__token">{{ primary || '跟随预设' }}</span>
      </div>

      <p class="theme-switcher__hint">
        只设主色，light-1..9 / hover / shade 按当前明暗模式自动重算。
      </p>
    </div>

    <button
      slot="reference"
      type="button"
      class="theme-switcher__trigger"
      title="主题设置"
      aria-label="主题设置">
      <i class="hzq-icon-setting"></i>
    </button>
  </hzq-popover>
</template>

<script>
import { applyTheme, setThemeMode, getThemeMode, resetTheme } from 'main/utils/theme';

// 绿色预设由编译期 CSS 提供（palette.scss 的 $--brand-modes），运行期只切类即可
const GREEN_PRESET_CLASS = 'theme-green';

// 快捷色，真正的衍生档由 applyTheme 推导，这里不需要维护第二套色板
const PREDEFINE_COLORS = ['#2563eb', '#16a34a', '#7c3aed', '#dc2626', '#0ea5e9'];

export default {
  name: 'ThemeSwitcher',

  data() {
    return {
      PREDEFINE_COLORS,
      visible: false,
      mode: 'light',
      preset: 'default',
      primary: ''
    };
  },

  mounted() {
    this.syncFromDom();
  },

  methods: {
    getThemeRoot() {
      return this.$isServer ? null : document.documentElement;
    },

    // 把 DOM 上的既有状态读回面板，避免刷新后面板与实际主题不一致
    syncFromDom() {
      const root = this.getThemeRoot();
      if (!root) return;

      this.mode = getThemeMode(root);
      this.preset = root.classList.contains(GREEN_PRESET_CLASS) ? 'green' : 'default';
      this.primary = root.style.getPropertyValue('--hzq-color-primary').trim();
    },

    handleModeChange(mode) {
      const root = this.getThemeRoot();
      if (!root) return;

      setThemeMode(mode, root);
      this.$emit('change');
    },

    handlePresetChange(preset) {
      const root = this.getThemeRoot();
      if (!root) return;

      // 预设是编译期的，先交还控制权，否则行内主色会压过预设
      resetTheme(root);
      this.primary = '';
      root.classList.toggle(GREEN_PRESET_CLASS, preset === 'green');
      this.$emit('change');
    },

    handlePrimaryChange(color) {
      const root = this.getThemeRoot();
      if (!root) return;

      if (!color) {
        resetTheme(root);
        this.$emit('change');
        return;
      }

      applyTheme({ primary: color }, root);
      this.preset = 'default';
      this.$emit('change');
    },

    handleReset() {
      const root = this.getThemeRoot();
      if (!root) return;

      resetTheme(root);
      root.classList.remove(GREEN_PRESET_CLASS);
      setThemeMode('light', root);
      this.mode = 'light';
      this.preset = 'default';
      this.primary = '';
      this.$emit('change');
    }
  }
};
</script>

<style>
.theme-switcher__trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid var(--hzq-border-color-base);
  border-radius: 4px;
  background: transparent;
  color: var(--hzq-text-color-secondary);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  transition: color .2s, border-color .2s;

  &:hover,
  .is-active & {
    color: var(--hzq-color-primary);
    border-color: var(--hzq-color-primary);
  }

  &:focus {
    outline: none;
  }
}

.theme-switcher__panel {
  padding: 4px 2px;
}

.theme-switcher__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.theme-switcher__title {
  font-size: 13px;
  font-weight: 600;
  color: var(--hzq-text-color-primary);
}

.theme-switcher__reset {
  padding: 0;
  border: none;
  background: none;
  font-size: 12px;
  color: var(--hzq-color-primary);
  cursor: pointer;
}

.theme-switcher__row {
  display: flex;
  align-items: center;
  margin-top: 12px;

  .hzq-radio-group {
    flex: 1;
    display: flex;
  }

  .hzq-radio-button {
    flex: 1;
  }

  .hzq-radio-button__inner {
    width: 100%;
    padding-left: 0;
    padding-right: 0;
  }
}

.theme-switcher__label {
  width: 34px;
  flex-shrink: 0;
  font-size: 12px;
  color: var(--hzq-text-color-secondary);
}

.theme-switcher__token {
  margin-left: 8px;
  font-size: 12px;
  color: var(--hzq-text-color-placeholder);
}

.theme-switcher__hint {
  margin: 12px 0 0;
  font-size: 12px;
  line-height: 1.6;
  color: var(--hzq-text-color-secondary);
}
</style>
