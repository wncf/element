<template>
  <div class="component-preview">
    <aside class="component-preview__sidebar">
      <div class="component-preview__sidebar-header">
        <h2 class="component-preview__title">组件预览</h2>
        <p class="component-preview__subtitle">共 {{ ALL_SECTIONS.length }} 个组件</p>
      </div>

      <div class="component-preview__search">
        <el-input
          v-model="keyword"
          size="small"
          prefix-icon="el-icon-search"
          placeholder="搜索组件"
          clearable
        />
      </div>

      <el-radio-group v-model="globalSize" size="mini" class="component-preview__size">
        <el-radio-button label="default">Default</el-radio-button>
        <el-radio-button label="medium">Medium</el-radio-button>
        <el-radio-button label="small">Small</el-radio-button>
        <el-radio-button label="mini">Mini</el-radio-button>
      </el-radio-group>

      <el-scrollbar class="component-preview__nav-scroll">
        <nav class="component-preview__nav">
          <div
            v-for="group in filteredGroups"
            :key="group.key"
            class="component-preview__nav-group"
          >
            <div class="component-preview__nav-group-title">{{ group.name }}</div>
            <a
              v-for="section in group.sections"
              :key="section.id"
              :href="'#' + section.id"
              class="component-preview__nav-link"
              :class="{ 'is-active': activeSection === section.id }"
              @click.prevent="scrollToSection(section.id)"
            >
              {{ section.label }}
            </a>
          </div>
          <el-empty v-if="!filteredGroups.length" description="无匹配组件" :image-size="60" />
        </nav>
      </el-scrollbar>

      <theme-panel />
    </aside>

    <main ref="main" class="component-preview__main" @scroll="handleScroll">
      <header class="component-preview__toolbar">
        <span>Element UI 全组件 Playground</span>
        <el-button :size="globalSize" @click="scrollToTop">回到顶部</el-button>
      </header>

      <div class="component-preview__content">
        <div v-for="group in PREVIEW_GROUPS" :key="group.key" class="component-preview__group">
          <h2 class="component-preview__group-title">{{ group.name }}</h2>
          <component :is="sectionMap[group.key]" :size="globalSize" />
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { PREVIEW_GROUPS, ALL_SECTIONS } from './config'
import BasicSection from './sections/BasicSection.vue'
import FormSection from './sections/FormSection.vue'
import DataSection from './sections/DataSection.vue'
import NoticeSection from './sections/NoticeSection.vue'
import NavSection from './sections/NavSection.vue'
import OtherSection from './sections/OtherSection.vue'
import ThemePanel from './ThemePanel.vue'

export default {
  name: 'ComponentPreview',

  components: {
    ThemePanel
  },

  data() {
    return {
      PREVIEW_GROUPS,
      ALL_SECTIONS,
      keyword: '',
      globalSize: 'default',
      activeSection: ALL_SECTIONS[0] ? ALL_SECTIONS[0].id : '',
      sectionMap: {
        basic: BasicSection,
        form: FormSection,
        data: DataSection,
        notice: NoticeSection,
        navigation: NavSection,
        others: OtherSection
      }
    }
  },

  computed: {
    filteredGroups() {
      const keyword = this.keyword.trim().toLowerCase()
      if (!keyword) return PREVIEW_GROUPS

      return PREVIEW_GROUPS.map(group => ({
        ...group,
        sections: group.sections.filter(section => {
          return section.label.toLowerCase().includes(keyword) ||
            section.id.includes(keyword)
        })
      })).filter(group => group.sections.length)
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.initFromHash()
      if (!this.getSectionIdFromHash()) {
        this.updateActiveSection()
      }
    })
    window.addEventListener('hashchange', this.handleHashChange)
  },

  beforeDestroy() {
    window.removeEventListener('hashchange', this.handleHashChange)
  },

  methods: {
    getSectionIdFromHash() {
      const hash = window.location.hash.replace(/^#/, '')
      if (!hash) return ''
      return ALL_SECTIONS.some(section => section.id === hash) ? hash : ''
    },

    updateHash(id) {
      if (!id) return
      const base = `${window.location.pathname}${window.location.search}`
      history.replaceState(null, '', `${base}#${id}`)
    },

    clearHash() {
      history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
    },

    scrollToSection(id, smooth = true) {
      const el = document.getElementById(id)
      if (!el || !this.$refs.main) return

      const mainTop = this.$refs.main.getBoundingClientRect().top
      const elTop = el.getBoundingClientRect().top
      const offset = this.$refs.main.scrollTop + (elTop - mainTop) - 16

      this.$refs.main.scrollTo({
        top: offset,
        behavior: smooth ? 'smooth' : 'auto'
      })
      this.activeSection = id
      this.updateHash(id)
    },

    initFromHash() {
      const id = this.getSectionIdFromHash()
      if (id) {
        this.scrollToSection(id, false)
      }
    },

    handleHashChange() {
      const id = this.getSectionIdFromHash()
      if (id) {
        this.scrollToSection(id, true)
      }
    },

    scrollToTop() {
      this.clearHash()
      if (this.$refs.main) {
        this.$refs.main.scrollTo({ top: 0, behavior: 'smooth' })
      }
      if (ALL_SECTIONS[0]) {
        this.activeSection = ALL_SECTIONS[0].id
      }
    },

    handleScroll() {
      this.updateActiveSection()
    },

    updateActiveSection() {
      if (!this.$refs.main) return

      const scrollTop = this.$refs.main.scrollTop
      const mainTop = this.$refs.main.getBoundingClientRect().top
      let current = ALL_SECTIONS[0] ? ALL_SECTIONS[0].id : ''

      ALL_SECTIONS.forEach(section => {
        const el = document.getElementById(section.id)
        if (!el) return
        if (el.getBoundingClientRect().top - mainTop <= 80) {
          current = section.id
        }
      })

      if (scrollTop < 20 && ALL_SECTIONS[0]) {
        current = ALL_SECTIONS[0].id
      }

      this.activeSection = current
    }
  }
}
</script>

<style scoped>
.component-preview {
  display: flex;
  height: 100%;
  overflow: hidden;
  background: var(--el-bg-color-page);
}

.component-preview__sidebar {
  width: 260px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--el-bg-color);
  border-right: 1px solid var(--el-border-color-lighter);
}

.component-preview__sidebar-header {
  padding: 20px 16px 8px;
}

.component-preview__title {
  margin: 0;
  font-size: 18px;
  color: var(--el-text-color-primary);
}

.component-preview__subtitle {
  margin: 6px 0 0;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.component-preview__search {
  box-sizing: border-box;
  width: 100%;
  padding: 0 16px;
  margin-bottom: 12px;
}

.component-preview__search >>> .el-input {
  display: block;
}

.component-preview__size {
  box-sizing: border-box;
  display: flex;
  width: 100%;
  padding: 0 16px 12px;
}

.component-preview__size >>> .el-radio-button {
  flex: 1;
}

.component-preview__size >>> .el-radio-button__inner {
  width: 100%;
  padding-left: 0;
  padding-right: 0;
}

.component-preview__nav-scroll {
  flex: 1;
  min-height: 0;
}

.component-preview__nav {
  padding: 0 8px 16px;
}

.component-preview__nav-group {
  margin-bottom: 12px;
}

.component-preview__nav-group-title {
  padding: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--el-text-color-secondary);
}

.component-preview__nav-link {
  display: block;
  padding: 8px 12px;
  margin-bottom: 2px;
  font-size: 13px;
  color: var(--el-text-color-regular);
  text-decoration: none;
  border-radius: 6px;
  transition: background 0.15s, color 0.15s;
}

.component-preview__nav-link:hover {
  background: var(--el-bg-color-page);
  color: var(--el-color-primary);
}

.component-preview__nav-link.is-active {
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  font-weight: 500;
}

.component-preview__main {
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: auto;
}

.component-preview__toolbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-lighter);
  backdrop-filter: blur(4px);
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.component-preview__content {
  padding: 16px 24px 48px;
  max-width: 960px;
}

.component-preview__group {
  margin-bottom: 32px;
}

.component-preview__group-title {
  margin: 0 0 16px;
  padding-bottom: 8px;
  font-size: 20px;
  color: var(--el-text-color-primary);
  border-bottom: 2px solid var(--el-color-primary);
}
</style>

<style>
.component-preview .preview-block {
  margin-bottom: 20px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  overflow: hidden;
}

.component-preview .preview-block__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--el-fill-color-lighter);
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.component-preview .preview-block__title {
  margin: 0;
  font-size: 15px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.component-preview .preview-block__body {
  padding: 16px;
}

.component-preview .preview-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 12px;
}

.component-preview .preview-row:last-child {
  margin-bottom: 0;
}

.component-preview .preview-row--stack {
  display: block;
}

.component-preview .preview-row--stack > * + * {
  margin-top: 12px;
}

.component-preview .preview-label {
  width: 72px;
  flex-shrink: 0;
  margin-right: 8px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.component-preview .preview-demo-box {
  height: 48px;
  line-height: 48px;
  text-align: center;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  border-radius: 6px;
}

.component-preview .preview-container {
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
  overflow: hidden;
}

.component-preview .preview-container .el-header,
.component-preview .preview-container .el-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

.component-preview .preview-container .el-aside {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-color-success-light-9);
  color: var(--el-color-success);
}

.component-preview .preview-container .el-main {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-color-warning-light-9);
  color: var(--el-color-warning);
}

.component-preview .preview-badge-item {
  margin-right: 24px;
}

.component-preview .el-avatar + .el-avatar {
  margin-left: 12px;
}

.component-preview .preview-loading-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 60px;
  border: 1px dashed var(--el-border-color-base);
  border-radius: 6px;
  color: var(--el-text-color-secondary);
  vertical-align: middle;
}

.component-preview .preview-inline-tip {
  margin-left: 12px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.component-preview .preview-card {
  max-width: 360px;
}

.component-preview .preview-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.component-preview .preview-card__header-left {
  display: flex;
  align-items: center;
  min-width: 0;
}

.component-preview .preview-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-right: 10px;
  border-radius: 8px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  flex-shrink: 0;
}

.component-preview .preview-card__title {
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.component-preview .preview-card__legend {
  margin: 0;
  padding: 0;
  list-style: none;
}

.component-preview .preview-card__legend li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 13px;
}

.component-preview .preview-card__legend li:last-child {
  margin-bottom: 0;
}

.component-preview .preview-card__legend-name {
  display: inline-flex;
  align-items: center;
  color: var(--el-text-color-regular);
}

.component-preview .preview-card__legend-name i {
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-right: 8px;
  border-radius: 50%;
}

.component-preview .preview-card__legend-value {
  color: var(--el-text-color-primary);
  font-weight: 500;
}

.component-preview .preview-carousel-item {
  height: 120px;
  line-height: 120px;
  text-align: center;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  font-size: 24px;
}

.component-preview .preview-infinite-list {
  height: 160px;
  margin: 0;
  padding: 0;
  list-style: none;
  overflow-y: auto;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
}

.component-preview .preview-infinite-list__item {
  padding: 10px 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  font-size: 13px;
  color: var(--el-text-color-regular);
}

.component-preview .el-link + .el-link {
  margin-left: 12px;
}

.component-preview .el-tag + .el-tag {
  margin-left: 8px;
}
</style>
