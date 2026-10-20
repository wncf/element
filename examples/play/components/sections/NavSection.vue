<template>
  <div class="preview-section">
    <preview-block section-id="menu" title="Menu 导航菜单">
      <el-menu :default-active="menuActive" mode="horizontal">
        <el-menu-item index="1">处理中心</el-menu-item>
        <el-submenu index="2">
          <template slot="title">我的工作台</template>
          <el-menu-item index="2-1">选项1</el-menu-item>
          <el-menu-item index="2-2">选项2</el-menu-item>
        </el-submenu>
        <el-menu-item index="3" disabled>禁用项</el-menu-item>
      </el-menu>
      <el-menu :default-active="menuActive" style="width: 220px; margin-top: 16px;">
        <el-menu-item index="1">处理中心</el-menu-item>
        <el-submenu index="2">
          <template slot="title">我的工作台</template>
          <el-menu-item index="2-1">选项1</el-menu-item>
          <el-menu-item index="2-2">选项2</el-menu-item>
        </el-submenu>
      </el-menu>
    </preview-block>

    <preview-block section-id="tabs" title="Tabs 标签页">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="用户管理" name="first">默认样式</el-tab-pane>
        <el-tab-pane label="配置管理" name="second">配置管理内容</el-tab-pane>
        <el-tab-pane label="禁用" name="disabled" disabled>不可选</el-tab-pane>
      </el-tabs>
      <el-tabs v-model="activeCardTab" type="card" style="margin-top: 16px;">
        <el-tab-pane label="卡片一" name="a">卡片样式</el-tab-pane>
        <el-tab-pane label="卡片二" name="b">内容二</el-tab-pane>
      </el-tabs>
      <el-tabs v-model="activeBorderTab" type="border-card" style="margin-top: 16px;">
        <el-tab-pane label="边框一" name="a">边框卡片</el-tab-pane>
        <el-tab-pane label="边框二" name="b">内容二</el-tab-pane>
      </el-tabs>
    </preview-block>

    <preview-block section-id="breadcrumb" title="Breadcrumb 面包屑">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>活动管理</el-breadcrumb-item>
        <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-top: 12px;">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>详情</el-breadcrumb-item>
      </el-breadcrumb>
    </preview-block>

    <preview-block section-id="page-header" title="PageHeader 页头">
      <el-page-header content="详情页面" @back="() => {}" />
    </preview-block>

    <preview-block section-id="dropdown" title="Dropdown 下拉菜单">
      <el-dropdown trigger="click" @command="handleCommand">
        <el-button :size="size" type="primary">
          点击<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="a">黄金糕</el-dropdown-item>
          <el-dropdown-item command="b">狮子头</el-dropdown-item>
          <el-dropdown-item command="c" divided>螺蛳粉</el-dropdown-item>
          <el-dropdown-item command="d" disabled>禁用项</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown trigger="hover" style="margin-left: 12px;">
        <el-button :size="size">
          悬停<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>操作一</el-dropdown-item>
          <el-dropdown-item>操作二</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown split-button type="primary" :size="size" style="margin-left: 12px;" @command="handleCommand">
        更多菜单
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="more">更多</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <span v-if="dropdownCommand" class="preview-inline-tip">当前：{{ dropdownCommand }}</span>
    </preview-block>

    <preview-block section-id="steps" title="Steps 步骤条">
      <el-steps :active="stepActive" finish-status="success">
        <el-step title="步骤 1" description="已完成" />
        <el-step title="步骤 2" description="进行中" />
        <el-step title="步骤 3" description="待处理" />
      </el-steps>
      <el-steps :active="1" process-status="error" style="margin-top: 20px;">
        <el-step title="提交" />
        <el-step title="审核失败" />
        <el-step title="完成" />
      </el-steps>
      <div style="margin-top: 12px;">
        <el-button :size="size" @click="stepActive = Math.max(0, stepActive - 1)">上一步</el-button>
        <el-button :size="size" type="primary" @click="stepActive = Math.min(3, stepActive + 1)">下一步</el-button>
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
