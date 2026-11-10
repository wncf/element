<template>
  <div class="preview-section">
    <preview-block section-id="table" title="Table 表格">
      <hzq-table
        :data="tableData"
        :size="size"
        stripe
        border
        style="width: 100%;"
      >
        <hzq-table-column type="selection" width="48" />
        <hzq-table-column prop="date" label="日期" width="120" />
        <hzq-table-column prop="name" label="姓名" width="100" />
        <hzq-table-column prop="address" label="地址" />
        <hzq-table-column label="状态" width="90">
          <template slot-scope="scope">
            <hzq-tag
              :size="size"
              :type="scope.$index === 1 ? 'success' : 'info'"
            >
              {{ scope.$index === 1 ? "成功" : "默认" }}
            </hzq-tag>
          </template>
        </hzq-table-column>
      </hzq-table>
    </preview-block>

    <preview-block section-id="tag" title="Tag 标签">
      <div class="preview-row">
        <span class="preview-label">类型</span>
        <hzq-tag>默认</hzq-tag>
        <hzq-tag type="success">成功</hzq-tag>
        <hzq-tag type="info">信息</hzq-tag>
        <hzq-tag type="warning">警告</hzq-tag>
        <hzq-tag type="danger">危险</hzq-tag>
      </div>
      <div class="preview-row">
        <span class="preview-label">效果</span>
        <hzq-tag effect="dark">Dark</hzq-tag>
        <hzq-tag effect="plain">朴素</hzq-tag>
        <hzq-tag closable>可关闭</hzq-tag>
        <hzq-tag :size="size">跟随 Size</hzq-tag>
      </div>
    </preview-block>

    <preview-block section-id="progress" title="Progress 进度条">
      <hzq-progress :percentage="50" />
      <hzq-progress
        :percentage="100"
        status="success"
        style="margin-top: 12px;"
      />
      <hzq-progress
        :percentage="80"
        status="warning"
        style="margin-top: 12px;"
      />
      <hzq-progress
        :percentage="40"
        status="exception"
        style="margin-top: 12px;"
      />
      <div class="preview-row" style="margin-top: 16px;">
        <hzq-progress type="circle" :percentage="25" :width="80" />
        <hzq-progress
          type="circle"
          :percentage="100"
          status="success"
          :width="80"
          style="margin-left: 16px;"
        />
        <hzq-progress
          type="circle"
          :percentage="50"
          status="exception"
          :width="80"
          style="margin-left: 16px;"
        />
      </div>
    </preview-block>

    <preview-block section-id="tree" title="Tree 树形控件">
      <hzq-tree
        :data="treeData"
        show-checkbox
        default-expand-all
        :props="{ children: 'children', label: 'label' }"
      />
    </preview-block>

    <preview-block section-id="pagination" title="Pagination 分页">
      <hzq-pagination
        :current-page="pagination.page"
        :page-size="10"
        :size="size"
        layout="total, prev, pager, next"
        :total="100"
        @current-change="(val) => (pagination.page = val)"
      />
      <hzq-pagination
        background
        :current-page="pagination.page"
        :page-sizes="[10, 20, 50]"
        :page-size="10"
        :size="size"
        layout="sizes, prev, pager, next, jumper"
        :total="100"
        style="margin-top: 12px;"
        @current-change="(val) => (pagination.page = val)"
      />
    </preview-block>

    <preview-block section-id="badge" title="Badge 标记">
      <hzq-badge :value="12" class="preview-badge-item">
        <hzq-button :size="size">评论</hzq-button>
      </hzq-badge>
      <hzq-badge :value="200" :max="99" class="preview-badge-item">
        <hzq-button :size="size">消息</hzq-button>
      </hzq-badge>
      <hzq-badge value="new" class="preview-badge-item">
        <hzq-button :size="size">标签</hzq-button>
      </hzq-badge>
      <hzq-badge is-dot class="preview-badge-item">
        <hzq-button :size="size">圆点</hzq-button>
      </hzq-badge>
    </preview-block>

    <preview-block section-id="avatar" title="Avatar 头像">
      <hzq-avatar icon="hzq-icon-user-solid" />
      <hzq-avatar>U</hzq-avatar>
      <hzq-avatar
        src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
      />
      <hzq-avatar shape="square">方</hzq-avatar>
      <hzq-avatar :size="avatarSize">小</hzq-avatar>
    </preview-block>

    <preview-block section-id="skeleton" title="Skeleton 骨架屏">
      <hzq-skeleton :rows="3" animated />
    </preview-block>

    <preview-block section-id="empty" title="Empty 空状态">
      <hzq-empty description="暂无数据">
        <hzq-button :size="size" type="primary">去创建</hzq-button>
      </hzq-empty>
    </preview-block>

    <preview-block section-id="descriptions" title="Descriptions 描述列表">
      <hzq-descriptions title="用户信息" :column="2" :size="size" border>
        <hzq-descriptions-item label="用户名">张三</hzq-descriptions-item>
        <hzq-descriptions-item label="手机号">13800138000</hzq-descriptions-item>
        <hzq-descriptions-item label="居住地">上海市</hzq-descriptions-item>
        <hzq-descriptions-item label="备注"
          >Element UI Playground</hzq-descriptions-item
        >
      </hzq-descriptions>
    </preview-block>

    <preview-block section-id="result" title="Result 结果">
      <hzq-row :gutter="16">
        <hzq-col :span="8">
          <hzq-result icon="success" title="成功" sub-title="操作已完成" />
        </hzq-col>
        <hzq-col :span="8">
          <hzq-result icon="warning" title="警告" sub-title="请检查内容" />
        </hzq-col>
        <hzq-col :span="8">
          <hzq-result icon="error" title="失败" sub-title="请稍后重试" />
        </hzq-col>
      </hzq-row>
    </preview-block>

    <preview-block section-id="statistic" title="Statistic 统计数值">
      <hzq-row :gutter="16">
        <hzq-col :span="8">
          <hzq-statistic title="活跃用户" :value="268500" />
        </hzq-col>
        <hzq-col :span="8">
          <hzq-statistic title="转化率" :value="93.2" suffix="%" />
        </hzq-col>
        <hzq-col :span="8">
          <hzq-statistic title="反馈" :value="128" />
        </hzq-col>
      </hzq-row>
    </preview-block>
  </div>
</template>

<script>
import PreviewBlock from "../PreviewBlock.vue";
import { tableData, treeData } from "../mock-data";

export default {
  name: "DataSection",

  components: { PreviewBlock },

  props: {
    size: {
      type: String,
      default: "default",
    },
  },

  data() {
    return {
      tableData,
      treeData,
      pagination: { page: 1 },
    };
  },

  computed: {
    // 头像只有 large/medium/small 三档，这里把预览侧的四档映射成具体像素，
    // 让 Large 与 Medium 也能看出差别（large 40 / medium 36 / small 28 / mini 24）
    avatarSize() {
      const sizeMap = { large: 40, medium: 36, small: 28, mini: 24 };
      return sizeMap[this.size] || 36;
    },
  },
};
</script>
