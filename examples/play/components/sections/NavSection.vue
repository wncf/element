<template>
  <div class="preview-section">
    <preview-block section-id="menu" title="Menu 导航菜单">
      <hzq-menu :default-active="menuActive" mode="horizontal">
        <hzq-menu-item index="1">处理中心</hzq-menu-item>
        <hzq-submenu index="2">
          <template slot="title">我的工作台</template>
          <hzq-menu-item index="2-1">选项1</hzq-menu-item>
          <hzq-menu-item index="2-2">选项2</hzq-menu-item>
        </hzq-submenu>
        <hzq-menu-item index="3" disabled>禁用项</hzq-menu-item>
      </hzq-menu>
      <hzq-menu :default-active="menuActive" style="width: 220px; margin-top: 16px;">
        <hzq-menu-item index="1">处理中心</hzq-menu-item>
        <hzq-submenu index="2">
          <template slot="title">我的工作台</template>
          <hzq-menu-item index="2-1">选项1</hzq-menu-item>
          <hzq-menu-item index="2-2">选项2</hzq-menu-item>
        </hzq-submenu>
      </hzq-menu>
    </preview-block>

    <preview-block section-id="tabs" title="Tabs 标签页">
      <hzq-tabs v-model="activeTab">
        <hzq-tab-pane label="用户管理" name="first">默认样式</hzq-tab-pane>
        <hzq-tab-pane label="配置管理" name="second">配置管理内容</hzq-tab-pane>
        <hzq-tab-pane label="禁用" name="disabled" disabled>不可选</hzq-tab-pane>
      </hzq-tabs>
      <hzq-tabs v-model="activeCardTab" type="card" style="margin-top: 16px;">
        <hzq-tab-pane label="卡片一" name="a">卡片样式</hzq-tab-pane>
        <hzq-tab-pane label="卡片二" name="b">内容二</hzq-tab-pane>
      </hzq-tabs>
      <hzq-tabs v-model="activeBorderTab" type="border-card" style="margin-top: 16px;">
        <hzq-tab-pane label="边框一" name="a">边框卡片</hzq-tab-pane>
        <hzq-tab-pane label="边框二" name="b">内容二</hzq-tab-pane>
      </hzq-tabs>
    </preview-block>

    <preview-block section-id="breadcrumb" title="Breadcrumb 面包屑">
      <hzq-breadcrumb separator="/">
        <hzq-breadcrumb-item>首页</hzq-breadcrumb-item>
        <hzq-breadcrumb-item>活动管理</hzq-breadcrumb-item>
        <hzq-breadcrumb-item>活动列表</hzq-breadcrumb-item>
      </hzq-breadcrumb>
      <hzq-breadcrumb separator-class="hzq-icon-arrow-right" style="margin-top: 12px;">
        <hzq-breadcrumb-item>首页</hzq-breadcrumb-item>
        <hzq-breadcrumb-item>详情</hzq-breadcrumb-item>
      </hzq-breadcrumb>
    </preview-block>

    <preview-block section-id="page-header" title="PageHeader 页头">
      <hzq-page-header content="详情页面" @back="() => {}" />
    </preview-block>

    <preview-block section-id="dropdown" title="Dropdown 下拉菜单">
      <hzq-dropdown trigger="click" @command="handleCommand">
        <hzq-button :size="size" type="primary">
          点击<i class="hzq-icon-arrow-down hzq-icon--right" />
        </hzq-button>
        <hzq-dropdown-menu slot="dropdown">
          <hzq-dropdown-item command="a">黄金糕</hzq-dropdown-item>
          <hzq-dropdown-item command="b">狮子头</hzq-dropdown-item>
          <hzq-dropdown-item command="c" divided>螺蛳粉</hzq-dropdown-item>
          <hzq-dropdown-item command="d" disabled>禁用项</hzq-dropdown-item>
        </hzq-dropdown-menu>
      </hzq-dropdown>
      <hzq-dropdown trigger="hover" style="margin-left: 12px;">
        <hzq-button :size="size">
          悬停<i class="hzq-icon-arrow-down hzq-icon--right" />
        </hzq-button>
        <hzq-dropdown-menu slot="dropdown">
          <hzq-dropdown-item>操作一</hzq-dropdown-item>
          <hzq-dropdown-item>操作二</hzq-dropdown-item>
        </hzq-dropdown-menu>
      </hzq-dropdown>
      <hzq-dropdown split-button type="primary" :size="size" style="margin-left: 12px;" @command="handleCommand">
        更多菜单
        <hzq-dropdown-menu slot="dropdown">
          <hzq-dropdown-item command="more">更多</hzq-dropdown-item>
        </hzq-dropdown-menu>
      </hzq-dropdown>
      <span v-if="dropdownCommand" class="preview-inline-tip">当前：{{ dropdownCommand }}</span>
    </preview-block>

    <preview-block section-id="steps" title="Steps 步骤条">
      <hzq-steps :active="stepActive" finish-status="success">
        <hzq-step title="步骤 1" description="已完成" />
        <hzq-step title="步骤 2" description="进行中" />
        <hzq-step title="步骤 3" description="待处理" />
      </hzq-steps>
      <hzq-steps :active="1" process-status="error" style="margin-top: 20px;">
        <hzq-step title="提交" />
        <hzq-step title="审核失败" />
        <hzq-step title="完成" />
      </hzq-steps>
      <div style="margin-top: 12px;">
        <hzq-button :size="size" @click="stepActive = Math.max(0, stepActive - 1)">上一步</hzq-button>
        <hzq-button :size="size" type="primary" @click="stepActive = Math.min(3, stepActive + 1)">下一步</hzq-button>
      </div>
    </preview-block>
  </div>
</template>

<script>
import PreviewBlock from '../PreviewBlock.vue'

export default {
  name: 'NavSection',

  components: { PreviewBlock },

  props: {
    size: {
      type: String,
      default: 'default'
    }
  },

  data() {
    return {
      menuActive: '1',
      activeTab: 'first',
      activeCardTab: 'a',
      activeBorderTab: 'a',
      dropdownCommand: '',
      stepActive: 1
    }
  },

  methods: {
    handleCommand(command) {
      this.dropdownCommand = command
    }
  }
}
</script>
