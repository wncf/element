<template>
  <div class="theme-panel">
    <div class="theme-panel__header">
      <span class="theme-panel__title">主题</span>
      <hzq-button type="text" size="mini" @click="handleReset">重置</hzq-button>
    </div>

    <div class="theme-panel__row">
      <span class="theme-panel__label">模式</span>
      <hzq-radio-group v-model="mode" size="mini" @change="handleModeChange">
        <hzq-radio-button label="light">浅色</hzq-radio-button>
        <hzq-radio-button label="dark">深色</hzq-radio-button>
      </hzq-radio-group>
    </div>

    <div class="theme-panel__row">
      <span class="theme-panel__label">预设</span>
      <hzq-radio-group v-model="preset" size="mini" @change="handlePresetChange">
        <hzq-radio-button label="default">默认</hzq-radio-button>
        <hzq-radio-button label="green">绿色</hzq-radio-button>
      </hzq-radio-group>
    </div>

    <div class="theme-panel__row">
      <span class="theme-panel__label">主色</span>
      <hzq-color-picker
        v-model="primary"
        size="mini"
        :predefine="PREDEFINE_COLORS"
        @change="handlePrimaryChange"
      />
      <span class="theme-panel__token">{{ tokenSummary }}</span>
    </div>

    <p class="theme-panel__hint">
      只设主色，light-1..9 / hover / shade 按当前明暗模式自动重算。
    </p>
  </div>
</template>

<script>
import { applyTheme, setThemeMode, getThemeMode, resetTheme } from 'hzq-ui/src/utils/theme';

// 绿色预设由编译期 CSS 提供（palette.scss 的 $--brand-modes），运行期只切类即可
const GREEN_PRESET_CLASS = 'theme-green';

// 快捷色，真正的衍生档由 applyTheme 推导，这里不需要维护第二套色板
const PREDEFINE_COLORS = ['#2563eb', '#16a34a', '#7c3aed', '#dc2626', '#0ea5e9'];

export default {
  name: 'ThemePanel',

  data() {
    return {
      PREDEFINE_COLORS,
      mode: 'light',
      preset: 'default',
      primary: ''
    };
  },

  computed: {
    tokenSummary() {
      return this.primary || '跟随预设';
    }
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
    },

    handlePresetChange(preset) {
      const root = this.getThemeRoot();
      if (!root) return;

      // 预设是编译期的，先交还控制权，否则行内主色会压过预设
      resetTheme(root);
      this.primary = '';
      root.classList.toggle(GREEN_PRESET_CLASS, preset === 'green');
    },

    handlePrimaryChange(color) {
      const root = this.getThemeRoot();
      if (!root) return;

      if (!color) {
        resetTheme(root);
        return;
      }

      applyTheme({ primary: color }, root);
      this.preset = 'default';
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
    }
  }
};
</script>

<style scoped>
.theme-panel {
  padding: 12px 16px 16px;
  border-top: 1px solid var(--hzq-border-color-lighter);
}

.theme-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.theme-panel__title {
  font-size: 13px;
  font-weight: 600;
  color: var(--hzq-text-color-primary);
}

.theme-panel__row {
  display: flex;
  align-items: center;
  margin-top: 8px;
}

.theme-panel__label {
  width: 32px;
  flex-shrink: 0;
  font-size: 12px;
  color: var(--hzq-text-color-secondary);
}

.theme-panel__row >>> .hzq-radio-group {
  flex: 1;
  display: flex;
}

.theme-panel__row >>> .hzq-radio-button {
  flex: 1;
}

.theme-panel__row >>> .hzq-radio-button__inner {
  width: 100%;
  padding-left: 0;
  padding-right: 0;
}

.theme-panel__token {
  margin-left: 8px;
  font-size: 12px;
  color: var(--hzq-text-color-placeholder);
}

.theme-panel__hint {
  margin: 10px 0 0;
  font-size: 12px;
  line-height: 1.6;
  color: var(--hzq-text-color-secondary);
}
</style>
