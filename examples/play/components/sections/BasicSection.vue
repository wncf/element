<template>
  <div class="preview-section">
    <preview-block section-id="layout" title="Layout 布局">
      <hzq-row :gutter="12">
        <hzq-col :span="24"><div class="preview-demo-box">span: 24</div></hzq-col>
      </hzq-row>
      <hzq-row :gutter="12" style="margin-top: 12px;">
        <hzq-col :span="16"><div class="preview-demo-box">span: 16</div></hzq-col>
        <hzq-col :span="8"><div class="preview-demo-box">span: 8</div></hzq-col>
      </hzq-row>
      <hzq-row :gutter="12" style="margin-top: 12px;">
        <hzq-col :span="8"><div class="preview-demo-box">span: 8</div></hzq-col>
        <hzq-col :span="8"><div class="preview-demo-box">span: 8</div></hzq-col>
        <hzq-col :span="8"><div class="preview-demo-box">span: 8</div></hzq-col>
      </hzq-row>
    </preview-block>

    <preview-block section-id="container" title="Container 布局容器">
      <hzq-container class="preview-container">
        <hzq-header height="40px">Header</hzq-header>
        <hzq-container>
          <hzq-aside width="120px">Aside</hzq-aside>
          <hzq-main>Main</hzq-main>
        </hzq-container>
        <hzq-footer height="40px">Footer</hzq-footer>
      </hzq-container>
    </preview-block>

    <preview-block section-id="button" title="Button 按钮">
      <div class="preview-row">
        <span class="preview-label">基础</span>
        <hzq-button :size="size">默认</hzq-button>
        <hzq-button :size="size" type="primary">主要</hzq-button>
        <hzq-button :size="size" type="success">成功</hzq-button>
        <hzq-button :size="size" type="warning">警告</hzq-button>
        <hzq-button :size="size" type="danger">危险</hzq-button>
        <hzq-button :size="size" type="info">信息</hzq-button>
      </div>
      <div class="preview-row">
        <span class="preview-label">朴素</span>
        <hzq-button :size="size" plain>默认</hzq-button>
        <hzq-button :size="size" type="primary" plain>主要</hzq-button>
        <hzq-button :size="size" type="success" plain>成功</hzq-button>
        <hzq-button :size="size" type="warning" plain>警告</hzq-button>
        <hzq-button :size="size" type="danger" plain>危险</hzq-button>
        <hzq-button :size="size" type="info" plain>信息</hzq-button>
      </div>
      <div class="preview-row">
        <span class="preview-label">圆角</span>
        <hzq-button :size="size" round>圆角</hzq-button>
        <hzq-button :size="size" type="primary" round>主要</hzq-button>
        <hzq-button :size="size" type="success" circle icon="hzq-icon-check" />
        <hzq-button :size="size" type="danger" circle icon="hzq-icon-delete" />
        <hzq-button :size="size" icon="hzq-icon-search" circle />
      </div>
      <div class="preview-row">
        <span class="preview-label">状态</span>
        <hzq-button :size="size" type="primary" disabled>禁用</hzq-button>
        <hzq-button :size="size" type="primary" loading>加载中</hzq-button>
        <hzq-button :size="size" type="text">文字按钮</hzq-button>
        <hzq-button :size="size" type="primary" icon="hzq-icon-edit">图标</hzq-button>
      </div>
      <div class="preview-row">
        <span class="preview-label">按钮组</span>
        <hzq-button-group>
          <hzq-button :size="size" icon="hzq-icon-arrow-left">上一页</hzq-button>
          <hzq-button :size="size">下一页<i class="hzq-icon-arrow-right hzq-icon--right" /></hzq-button>
        </hzq-button-group>
      </div>
    </preview-block>

    <preview-block section-id="link" title="Link 文字链接">
      <div class="preview-row">
        <span class="preview-label">基础</span>
        <hzq-link>默认</hzq-link>
        <hzq-link type="primary">主要</hzq-link>
        <hzq-link type="success">成功</hzq-link>
        <hzq-link type="warning">警告</hzq-link>
        <hzq-link type="danger">危险</hzq-link>
        <hzq-link type="info">信息</hzq-link>
      </div>
      <div class="preview-row">
        <span class="preview-label">状态</span>
        <hzq-link :underline="false">无下划线</hzq-link>
        <hzq-link disabled>禁用</hzq-link>
        <hzq-link type="primary" disabled>主要禁用</hzq-link>
        <hzq-link type="primary" icon="hzq-icon-edit">带图标</hzq-link>
      </div>
      <div class="preview-row">
        <span class="preview-label">加载</span>
        <hzq-link loading>默认</hzq-link>
        <hzq-link type="primary" loading>主要</hzq-link>
        <hzq-link type="success" loading>成功</hzq-link>
        <hzq-link type="warning" loading>警告</hzq-link>
        <hzq-link type="danger" loading>危险</hzq-link>
        <hzq-link type="info" loading>信息</hzq-link>
      </div>
      <div class="preview-row">
        <span class="preview-label">加载+</span>
        <hzq-link loading icon="hzq-icon-edit">覆盖图标</hzq-link>
        <hzq-link type="primary" loading :underline="false">无下划线</hzq-link>
        <hzq-link type="primary" loading disabled>加载禁用</hzq-link>
        <hzq-link type="primary" :loading="linkLoading" @click="startLinkLoading">
          {{ linkLoading ? '请求中' : '点击加载' }}
        </hzq-link>
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
