<template>
  <div class="preview-section">
    <preview-block section-id="dialog" title="Dialog 对话框">
      <hzq-button :size="size" type="primary" @click="dialogVisible = true">默认</hzq-button>
      <hzq-button :size="size" @click="dialogCenterVisible = true">居中</hzq-button>
      <hzq-dialog title="提示" :visible.sync="dialogVisible" width="400px">
        <span>这是一段 Dialog 内容</span>
        <span slot="footer">
          <hzq-button @click="dialogVisible = false">取 消</hzq-button>
          <hzq-button type="primary" @click="dialogVisible = false">确 定</hzq-button>
        </span>
      </hzq-dialog>
      <hzq-dialog title="居中对话框" :visible.sync="dialogCenterVisible" width="400px" center>
        <span>center 布局</span>
        <span slot="footer">
          <hzq-button type="primary" @click="dialogCenterVisible = false">知道了</hzq-button>
        </span>
      </hzq-dialog>
    </preview-block>

    <preview-block section-id="drawer" title="Drawer 抽屉">
      <hzq-button :size="size" type="primary" @click="drawerVisible = true">右侧</hzq-button>
      <hzq-button :size="size" @click="drawerLeftVisible = true">左侧</hzq-button>
      <hzq-drawer title="抽屉标题" :visible.sync="drawerVisible" direction="rtl" size="320px">
        <div style="padding: 0 20px;">右侧抽屉</div>
      </hzq-drawer>
      <hzq-drawer title="左侧抽屉" :visible.sync="drawerLeftVisible" direction="ltr" size="320px">
        <div style="padding: 0 20px;">左侧抽屉</div>
      </hzq-drawer>
    </preview-block>

    <preview-block section-id="popover" title="Popover 弹出框">
      <hzq-popover placement="top" width="200" trigger="hover" content="Hover 激活">
        <hzq-button slot="reference" :size="size">Hover</hzq-button>
      </hzq-popover>
      <hzq-popover placement="right" width="200" trigger="click" content="Click 激活">
        <hzq-button slot="reference" :size="size" style="margin-left: 12px;">Click</hzq-button>
      </hzq-popover>
    </preview-block>

    <preview-block section-id="popconfirm" title="Popconfirm 气泡确认">
      <hzq-popconfirm title="确定删除吗？" @confirm="$message.success('已确认')">
        <hzq-button slot="reference" :size="size" type="danger">删除</hzq-button>
      </hzq-popconfirm>
    </preview-block>

    <preview-block section-id="card" title="Card 卡片">
      <hzq-card class="preview-card" shadow="never" style="margin-bottom: 16px;">
        <div slot="header">无阴影卡片</div>
        shadow="never"
      </hzq-card>
      <hzq-card class="preview-card">
        <div slot="header" class="preview-card__header">
          <div class="preview-card__header-left">
            <span class="preview-card__icon">
              <i class="hzq-icon-pie-chart" />
            </span>
            <span class="preview-card__title">企业类型占比</span>
          </div>
          <hzq-tag size="small" effect="plain">5 种类型</hzq-tag>
        </div>
        <ul class="preview-card__legend">
          <li v-for="item in cardLegend" :key="item.name">
            <span class="preview-card__legend-name">
              <i :style="{ backgroundColor: item.color }" />
              {{ item.name }}
            </span>
            <span class="preview-card__legend-value">{{ item.value }}%</span>
          </li>
        </ul>
      </hzq-card>
    </preview-block>

    <preview-block section-id="carousel" title="Carousel 走马灯">
      <hzq-carousel height="120px" style="width: 360px;">
        <hzq-carousel-item v-for="item in 4" :key="item">
          <div class="preview-carousel-item">{{ item }}</div>
        </hzq-carousel-item>
      </hzq-carousel>
      <hzq-carousel height="120px" type="card" style="width: 100%; margin-top: 16px;" indicator-position="outside">
        <hzq-carousel-item v-for="item in 3" :key="'card-' + item">
          <div class="preview-carousel-item">卡片 {{ item }}</div>
        </hzq-carousel-item>
      </hzq-carousel>
    </preview-block>

    <preview-block section-id="collapse" title="Collapse 折叠面板">
      <hzq-collapse v-model="collapseActive">
        <hzq-collapse-item title="一致性 Consistency" name="1">
          <div>与现实生活一致</div>
        </hzq-collapse-item>
        <hzq-collapse-item title="反馈 Feedback" name="2">
          <div>控制反馈</div>
        </hzq-collapse-item>
        <hzq-collapse-item title="禁用" name="3" disabled>
          <div>不可展开</div>
        </hzq-collapse-item>
      </hzq-collapse>
      <hzq-collapse accordion v-model="collapseAccordion" style="margin-top: 16px;">
        <hzq-collapse-item title="手风琴 1" name="1">只展开一项</hzq-collapse-item>
        <hzq-collapse-item title="手风琴 2" name="2">另一项</hzq-collapse-item>
      </hzq-collapse>
    </preview-block>

    <preview-block section-id="timeline" title="Timeline 时间线">
      <hzq-timeline>
        <hzq-timeline-item timestamp="2026/9/1" placement="top" type="primary">创建服务</hzq-timeline-item>
        <hzq-timeline-item timestamp="2026/9/2" placement="top" type="success">初步完成</hzq-timeline-item>
        <hzq-timeline-item timestamp="2026/9/3" placement="top" type="warning">持续迭代</hzq-timeline-item>
        <hzq-timeline-item timestamp="2026/9/4" placement="top" type="danger">异常记录</hzq-timeline-item>
      </hzq-timeline>
    </preview-block>

    <preview-block section-id="divider" title="Divider 分割线">
      <span>文本前</span>
      <hzq-divider direction="vertical" />
      <span>文本后</span>
      <hzq-divider content-position="left">分割线</hzq-divider>
    </preview-block>

    <preview-block section-id="image" title="Image 图片">
      <hzq-image
        style="width: 120px; height: 80px;"
        src="https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg"
        fit="cover"
      />
    </preview-block>

    <preview-block section-id="backtop" title="Backtop 回到顶部">
      <p class="preview-inline-tip">页面右下角可见回到顶部按钮（需页面滚动）</p>
      <hzq-backtop :visibility-height="100" />
    </preview-block>

    <preview-block section-id="infinite-scroll" title="InfiniteScroll 无限滚动">
      <ul
        v-infinite-scroll="loadMore"
        class="preview-infinite-list"
        infinite-scroll-disabled="infiniteDisabled"
      >
        <li v-for="item in infiniteList" :key="item" class="preview-infinite-list__item">
          列表项 {{ item }}
        </li>
      </ul>
    </preview-block>
  </div>
</template>

<script>
import PreviewBlock from '../PreviewBlock.vue'

export default {
  name: 'OtherSection',

  components: { PreviewBlock },

  props: {
    size: {
      type: String,
      default: 'default'
    }
  },

  data() {
    return {
      dialogVisible: false,
      dialogCenterVisible: false,
      drawerVisible: false,
      drawerLeftVisible: false,
      collapseActive: ['1'],
      collapseAccordion: '1',
      infiniteList: 10,
      infiniteLoading: false,
      cardLegend: [
        { name: '私营企业', value: 38, color: '#409EFF' },
        { name: '国有企业', value: 22, color: '#7B61FF' },
        { name: '外资企业', value: 18, color: '#13C2C2' },
        { name: '合资企业', value: 12, color: '#E6A23C' },
        { name: '其他', value: 10, color: '#67C23A' }
      ]
    }
  },

  computed: {
    infiniteDisabled() {
      return this.infiniteLoading || this.infiniteList >= 30
    }
  },

  methods: {
    loadMore() {
      if (this.infiniteLoading || this.infiniteList >= 30) return
      this.infiniteLoading = true
      setTimeout(() => {
        this.infiniteList += 5
        this.infiniteLoading = false
      }, 500)
    }
  }
}
</script>
