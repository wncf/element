<template>
  <div class="preview-section">
    <preview-block section-id="layout" title="Layout 布局">
      <el-row :gutter="12">
        <el-col :span="24"><div class="preview-demo-box">span: 24</div></el-col>
      </el-row>
      <el-row :gutter="12" style="margin-top: 12px;">
        <el-col :span="16"><div class="preview-demo-box">span: 16</div></el-col>
        <el-col :span="8"><div class="preview-demo-box">span: 8</div></el-col>
      </el-row>
      <el-row :gutter="12" style="margin-top: 12px;">
        <el-col :span="8"><div class="preview-demo-box">span: 8</div></el-col>
        <el-col :span="8"><div class="preview-demo-box">span: 8</div></el-col>
        <el-col :span="8"><div class="preview-demo-box">span: 8</div></el-col>
      </el-row>
    </preview-block>

    <preview-block section-id="container" title="Container 布局容器">
      <el-container class="preview-container">
        <el-header height="40px">Header</el-header>
        <el-container>
          <el-aside width="120px">Aside</el-aside>
          <el-main>Main</el-main>
        </el-container>
        <el-footer height="40px">Footer</el-footer>
      </el-container>
    </preview-block>

    <preview-block section-id="button" title="Button 按钮">
      <div class="preview-row">
        <span class="preview-label">基础</span>
        <el-button :size="size">默认</el-button>
        <el-button :size="size" type="primary">主要</el-button>
        <el-button :size="size" type="success">成功</el-button>
        <el-button :size="size" type="warning">警告</el-button>
        <el-button :size="size" type="danger">危险</el-button>
        <el-button :size="size" type="info">信息</el-button>
      </div>
      <div class="preview-row">
        <span class="preview-label">朴素</span>
        <el-button :size="size" plain>默认</el-button>
        <el-button :size="size" type="primary" plain>主要</el-button>
        <el-button :size="size" type="success" plain>成功</el-button>
        <el-button :size="size" type="warning" plain>警告</el-button>
        <el-button :size="size" type="danger" plain>危险</el-button>
        <el-button :size="size" type="info" plain>信息</el-button>
      </div>
      <div class="preview-row">
        <span class="preview-label">圆角</span>
        <el-button :size="size" round>圆角</el-button>
        <el-button :size="size" type="primary" round>主要</el-button>
        <el-button :size="size" type="success" circle icon="el-icon-check" />
        <el-button :size="size" type="danger" circle icon="el-icon-delete" />
        <el-button :size="size" icon="el-icon-search" circle />
      </div>
      <div class="preview-row">
        <span class="preview-label">状态</span>
        <el-button :size="size" type="primary" disabled>禁用</el-button>
        <el-button :size="size" type="primary" loading>加载中</el-button>
        <el-button :size="size" type="text">文字按钮</el-button>
        <el-button :size="size" type="primary" icon="el-icon-edit">图标</el-button>
      </div>
      <div class="preview-row">
        <span class="preview-label">按钮组</span>
        <el-button-group>
          <el-button :size="size" icon="el-icon-arrow-left">上一页</el-button>
          <el-button :size="size">下一页<i class="el-icon-arrow-right el-icon--right" /></el-button>
        </el-button-group>
      </div>
    </preview-block>

    <preview-block section-id="link" title="Link 文字链接">
      <div class="preview-row">
        <span class="preview-label">基础</span>
        <el-link>默认</el-link>
        <el-link type="primary">主要</el-link>
        <el-link type="success">成功</el-link>
        <el-link type="warning">警告</el-link>
        <el-link type="danger">危险</el-link>
        <el-link type="info">信息</el-link>
      </div>
      <div class="preview-row">
        <span class="preview-label">状态</span>
        <el-link :underline="false">无下划线</el-link>
        <el-link disabled>禁用</el-link>
        <el-link type="primary" disabled>主要禁用</el-link>
        <el-link type="primary" icon="el-icon-edit">带图标</el-link>
      </div>
      <div class="preview-row">
        <span class="preview-label">加载</span>
        <el-link loading>默认</el-link>
        <el-link type="primary" loading>主要</el-link>
        <el-link type="success" loading>成功</el-link>
        <el-link type="warning" loading>警告</el-link>
        <el-link type="danger" loading>危险</el-link>
        <el-link type="info" loading>信息</el-link>
      </div>
      <div class="preview-row">
        <span class="preview-label">加载+</span>
        <el-link loading icon="el-icon-edit">覆盖图标</el-link>
        <el-link type="primary" loading :underline="false">无下划线</el-link>
        <el-link type="primary" loading disabled>加载禁用</el-link>
        <el-link type="primary" :loading="linkLoading" @click="startLinkLoading">
          {{ linkLoading ? '请求中' : '点击加载' }}
        </el-link>
      </div>
    </preview-block>
  </div>
</template>

<script>
import PreviewBlock from '../PreviewBlock.vue'

export default {
  name: 'BasicSection',

  components: { PreviewBlock },

  props: {
    size: {
      type: String,
      default: 'default'
    }
  },

  data() {
    return {
      linkLoading: false
    }
  },

  methods: {
    startLinkLoading() {
      if (this.linkLoading) return
      this.linkLoading = true
      setTimeout(() => {
        this.linkLoading = false
      }, 1500)
    }
  }
}
</script>
