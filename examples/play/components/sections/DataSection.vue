<template>
  <div class="preview-section">
    <preview-block section-id="table" title="Table 表格">
      <el-table :data="tableData" :size="size" stripe border style="width: 100%;">
        <el-table-column type="selection" width="48" />
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="address" label="地址" />
        <el-table-column label="状态" width="90">
          <template slot-scope="scope">
            <el-tag :size="size" :type="scope.$index === 1 ? 'success' : 'info'">
              {{ scope.$index === 1 ? '成功' : '默认' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </preview-block>

    <preview-block section-id="tag" title="Tag 标签">
      <div class="preview-row">
        <span class="preview-label">类型</span>
        <el-tag>默认</el-tag>
        <el-tag type="success">成功</el-tag>
        <el-tag type="info">信息</el-tag>
        <el-tag type="warning">警告</el-tag>
        <el-tag type="danger">危险</el-tag>
      </div>
      <div class="preview-row">
        <span class="preview-label">效果</span>
        <el-tag effect="dark">Dark</el-tag>
        <el-tag effect="plain">朴素</el-tag>
        <el-tag closable>可关闭</el-tag>
        <el-tag :size="size">跟随 Size</el-tag>
      </div>
    </preview-block>

    <preview-block section-id="progress" title="Progress 进度条">
      <el-progress :percentage="50" />
      <el-progress :percentage="100" status="success" style="margin-top: 12px;" />
      <el-progress :percentage="80" status="warning" style="margin-top: 12px;" />
      <el-progress :percentage="40" status="exception" style="margin-top: 12px;" />
      <div class="preview-row" style="margin-top: 16px;">
        <el-progress type="circle" :percentage="25" :width="80" />
        <el-progress type="circle" :percentage="100" status="success" :width="80" style="margin-left: 16px;" />
        <el-progress type="circle" :percentage="50" status="exception" :width="80" style="margin-left: 16px;" />
      </div>
    </preview-block>

    <preview-block section-id="tree" title="Tree 树形控件">
      <el-tree
        :data="treeData"
        show-checkbox
        default-expand-all
        :props="{ children: 'children', label: 'label' }"
      />
    </preview-block>

    <preview-block section-id="pagination" title="Pagination 分页">
      <el-pagination
        :current-page="pagination.page"
        :page-size="10"
        :size="size"
        layout="total, prev, pager, next"
        :total="100"
        @current-change="val => pagination.page = val"
      />
      <el-pagination
        background
        :current-page="pagination.page"
        :page-sizes="[10, 20, 50]"
        :page-size="10"
        :size="size"
        layout="sizes, prev, pager, next, jumper"
        :total="100"
        style="margin-top: 12px;"
        @current-change="val => pagination.page = val"
      />
    </preview-block>

    <preview-block section-id="badge" title="Badge 标记">
      <el-badge :value="12" class="preview-badge-item">
        <el-button :size="size">评论</el-button>
      </el-badge>
      <el-badge :value="200" :max="99" class="preview-badge-item">
        <el-button :size="size">消息</el-button>
      </el-badge>
      <el-badge value="new" class="preview-badge-item">
        <el-button :size="size">标签</el-button>
      </el-badge>
      <el-badge is-dot class="preview-badge-item">
        <el-button :size="size">圆点</el-button>
      </el-badge>
    </preview-block>

    <preview-block section-id="avatar" title="Avatar 头像">
      <el-avatar icon="el-icon-user-solid" />
      <el-avatar>U</el-avatar>
      <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
      <el-avatar shape="square">方</el-avatar>
      <el-avatar :size="smallAvatar">小</el-avatar>
    </preview-block>

    <preview-block section-id="skeleton" title="Skeleton 骨架屏">
      <el-skeleton :rows="3" animated />
    </preview-block>

    <preview-block section-id="empty" title="Empty 空状态">
      <el-empty description="暂无数据">
        <el-button :size="size" type="primary">去创建</el-button>
      </el-empty>
    </preview-block>

    <preview-block section-id="descriptions" title="Descriptions 描述列表">
      <el-descriptions title="用户信息" :column="2" :size="size" border>
        <el-descriptions-item label="用户名">张三</el-descriptions-item>
        <el-descriptions-item label="手机号">13800138000</el-descriptions-item>
        <el-descriptions-item label="居住地">上海市</el-descriptions-item>
        <el-descriptions-item label="备注">Element UI Playground</el-descriptions-item>
      </el-descriptions>
    </preview-block>

    <preview-block section-id="result" title="Result 结果">
      <el-row :gutter="16">
        <el-col :span="8">
          <el-result icon="success" title="成功" sub-title="操作已完成" />
        </el-col>
        <el-col :span="8">
          <el-result icon="warning" title="警告" sub-title="请检查内容" />
        </el-col>
        <el-col :span="8">
          <el-result icon="error" title="失败" sub-title="请稍后重试" />
        </el-col>
      </el-row>
    </preview-block>

    <preview-block section-id="statistic" title="Statistic 统计数值">
      <el-row :gutter="16">
        <el-col :span="8">
          <el-statistic title="活跃用户" :value="268500" />
        </el-col>
        <el-col :span="8">
          <el-statistic title="转化率" :value="93.2" suffix="%" />
        </el-col>
        <el-col :span="8">
          <el-statistic title="反馈" :value="128" />
        </el-col>
      </el-row>
    </preview-block>
  </div>
</template>

<script>
import PreviewBlock from '../PreviewBlock.vue'
import { tableData, treeData } from '../mock-data'

export default {
  name: 'DataSection',

  components: { PreviewBlock },

  props: {
    size: {
      type: String,
      default: 'default'
    }
  },

  data() {
    return {
      tableData,
      treeData,
      pagination: { page: 1 }
    }
  },

  computed: {
    smallAvatar() {
      return this.size === 'mini' ? 24 : 32
    }
  }
}
</script>
