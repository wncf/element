<template>
  <div class="preview-section">
    <preview-block section-id="alert" title="Alert 警告">
      <el-alert title="成功提示" type="success" show-icon />
      <el-alert title="消息提示" type="info" show-icon style="margin-top: 12px;" />
      <el-alert title="警告提示" type="warning" description="带辅助文案" show-icon style="margin-top: 12px;" />
      <el-alert title="错误提示" type="error" show-icon style="margin-top: 12px;" />
      <el-alert title="不可关闭" type="info" :closable="false" style="margin-top: 12px;" />
    </preview-block>

    <preview-block section-id="loading" title="Loading 加载">
      <el-button :size="size" type="primary" :loading="loading" @click="handleLoading">
        点击加载
      </el-button>
      <div v-loading="loading" class="preview-loading-box" style="margin-left: 16px;">
        加载区域
      </div>
    </preview-block>

    <preview-block section-id="message" title="Message 消息提示">
      <el-button :size="size" @click="$message('这是一条消息')">普通消息</el-button>
      <el-button :size="size" type="success" @click="$message.success('成功消息')">成功</el-button>
      <el-button :size="size" type="warning" @click="$message.warning('警告消息')">警告</el-button>
      <el-button :size="size" type="danger" @click="$message.error('错误消息')">错误</el-button>
    </preview-block>

    <preview-block section-id="dialog-service" title="$dialog 命令式弹窗">
      <el-button :size="size" @click="openDialogAlert">Alert</el-button>
      <el-button :size="size" type="primary" @click="openDialogConfirm">Confirm</el-button>
      <el-button :size="size" @click="openDialogQueue">队列演示</el-button>
      <el-button :size="size" type="warning" @click="openDialogNested">嵌套弹窗</el-button>
      <el-button :size="size" @click="openDialogBorder">分割线 border</el-button>
    </preview-block>

    <preview-block section-id="notification" title="Notification 通知">
      <el-button :size="size" @click="openNotification('success')">成功</el-button>
      <el-button :size="size" @click="openNotification('warning')">警告</el-button>
      <el-button :size="size" @click="openNotification('error')">错误</el-button>
    </preview-block>
  </div>
</template>

<script>
import PreviewBlock from '../PreviewBlock.vue'

export default {
  name: 'NoticeSection',

  components: { PreviewBlock },

  props: {
    size: {
      type: String,
      default: 'default'
    }
  },

  data() {
    return {
      loading: false
    }
  },

  methods: {
    handleLoading() {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 1500)
    },

    openDialogAlert() {
      this.$dialog({
        title: '提示',
        type: 'alert',
        width: 380,
        content: '这是一段通知内容'
      })
    },

    openDialogConfirm() {
      this.$dialog(
        {
          title: '提示',
          type: 'confirm',
          width: 380,
          confirm: (instance) => {
            instance.loading = true
            setTimeout(() => {
              instance.loading = false
              instance.visible = false
              this.$message.success('已确认')
            }, 800)
          },
          cancel: () => {
            this.$message.info('已取消')
          }
        },
        h => h('p', { style: { margin: 0 } }, '此操作将永久删除，是否继续？')
      )
    },

    openDialogQueue() {
      this.$dialog({ title: '队列 1', type: 'alert', content: '第一个弹窗' })
      this.$dialog({ title: '队列 2', type: 'alert', content: '关闭上一个后显示' })
    },

    openDialogNested() {
      const vm = this
      this.$dialog(
        {
          title: '外层弹窗',
          type: 'alert',
          width: 420
        },
        h => h('div', [
          h('p', { style: { margin: '0 0 12px', lineHeight: '1.6' } }, '点击下方按钮可在当前弹窗之上再打开一层，ESC 会优先关闭最上层。'),
          h('el-button', {
            props: { type: 'primary', size: vm.size },
            on: { click: vm.openDialogNestedInner }
          }, '打开内层弹窗')
        ])
      )
    },

    openDialogNestedInner() {
      this.$dialog(
        {
          title: '内层弹窗',
          type: 'confirm',
          width: 360,
          stack: true,
          confirm: (instance) => {
            instance.visible = false
            this.$message.success('内层已确认')
          },
          cancel: () => {
            this.$message.info('内层已取消')
          }
        },
        h => h('p', { style: { margin: 0 } }, '这是第二层弹窗，关闭后外层仍然保留。')
      )
    },

    openDialogBorder() {
      this.$dialog(
        {
          title: '带分割线',
          type: 'confirm',
          width: 420,
          border: true,
          confirm: (instance) => {
            instance.visible = false
          }
        },
        h => h('p', { style: { margin: 0 } }, 'header / 内容 / footer 之间会有分割线')
      )
    },

    openNotification(type) {
      this.$notify({
        title: '通知',
        message: '这是一条通知消息',
        type
      })
    }
  }
}
</script>
