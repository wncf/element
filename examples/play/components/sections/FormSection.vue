<template>
  <div class="preview-section">
    <preview-block section-id="radio" title="Radio 单选框">
      <div class="preview-row">
        <span class="preview-label">基础</span>
        <el-radio-group v-model="form.radio" :size="size">
          <el-radio label="1">选项 A</el-radio>
          <el-radio label="2">选项 B</el-radio>
          <el-radio label="3" disabled>禁用</el-radio>
        </el-radio-group>
      </div>
      <div class="preview-row">
        <span class="preview-label">边框</span>
        <el-radio v-model="form.radioBorder" label="1" border :size="size">备选</el-radio>
        <el-radio v-model="form.radioBorder" label="2" border :size="size">选中</el-radio>
        <el-radio v-model="form.radioBorder" label="3" border disabled :size="size">禁用</el-radio>
      </div>
      <div class="preview-row">
        <span class="preview-label">按钮</span>
        <el-radio-group v-model="form.radioBtn" :size="size">
          <el-radio-button label="上海" />
          <el-radio-button label="北京" />
          <el-radio-button label="广州" disabled />
        </el-radio-group>
      </div>
    </preview-block>

    <preview-block section-id="checkbox" title="Checkbox 多选框">
      <div class="preview-row">
        <span class="preview-label">基础</span>
        <el-checkbox-group v-model="form.checkbox" :size="size">
          <el-checkbox label="美食" />
          <el-checkbox label="电影" />
          <el-checkbox label="运动" disabled />
        </el-checkbox-group>
      </div>
      <div class="preview-row">
        <span class="preview-label">半选</span>
        <el-checkbox :indeterminate="true" :value="false">半选</el-checkbox>
        <el-checkbox :value="true">选中</el-checkbox>
        <el-checkbox disabled>未选禁用</el-checkbox>
        <el-checkbox :value="true" disabled>选中禁用</el-checkbox>
      </div>
      <div class="preview-row">
        <span class="preview-label">边框</span>
        <el-checkbox-group v-model="form.checkboxBorder" :size="size">
          <el-checkbox label="备选" border />
          <el-checkbox label="选中" border />
        </el-checkbox-group>
      </div>
      <div class="preview-row">
        <span class="preview-label">按钮</span>
        <el-checkbox-group v-model="form.checkboxBtn" :size="size">
          <el-checkbox-button label="上海" />
          <el-checkbox-button label="北京" />
          <el-checkbox-button label="广州" />
        </el-checkbox-group>
      </div>
    </preview-block>

    <preview-block section-id="input" title="Input 输入框">
      <div class="preview-row">
        <el-input v-model="form.input" :size="size" placeholder="请输入内容" style="width: 200px;" />
        <el-input v-model="form.input" :size="size" placeholder="带图标" prefix-icon="el-icon-search" style="width: 200px; margin-left: 12px;" />
        <el-input v-model="form.input" :size="size" clearable placeholder="可清空" style="width: 200px; margin-left: 12px;" />
      </div>
      <div class="preview-row">
        <el-input v-model="form.password" :size="size" show-password placeholder="密码" style="width: 200px;" />
        <el-input :size="size" disabled placeholder="禁用" style="width: 200px; margin-left: 12px;" />
        <el-input v-model="form.input" :size="size" maxlength="20" show-word-limit placeholder="字数限制" style="width: 200px; margin-left: 12px;" />
      </div>
      <div class="preview-row">
        <el-input :size="size" placeholder="组合" style="width: 280px;">
          <template slot="prepend">Http://</template>
          <template slot="append">.com</template>
        </el-input>
      </div>
      <div class="preview-row">
        <el-input v-model="form.textarea" type="textarea" :rows="2" placeholder="文本域" style="width: 360px;" />
      </div>
    </preview-block>

    <preview-block section-id="input-number" title="InputNumber 计数器">
      <el-input-number v-model="form.number" :size="size" :min="1" :max="10" />
      <el-input-number v-model="form.number" :size="size" disabled style="margin-left: 12px;" />
      <el-input-number v-model="form.number" :size="size" controls-position="right" style="margin-left: 12px;" />
    </preview-block>

    <preview-block section-id="amount-input" title="AmountInput 金额输入">
      <div class="preview-row">
        <span class="preview-label">两位小数</span>
        <el-amount-input v-model="form.amount" :size="size" placeholder="不能输入负数" style="width: 180px;" />
        <span class="preview-label" style="width: auto; margin-left: 12px;">值：{{ form.amount || '空' }}</span>
      </div>
      <div class="preview-row">
        <span class="preview-label">范围</span>
        <el-amount-input v-model="form.amountRange" :size="size" :min="1" :max="1000" placeholder="1 ~ 1000" style="width: 180px;" />
        <span class="preview-label" style="width: auto; margin-left: 12px;">值：{{ form.amountRange || '空' }}</span>
      </div>
      <div class="preview-row">
        <span class="preview-label">精度</span>
        <el-amount-input v-model="form.amountInt" :size="size" :precision="0" placeholder="只收整数" style="width: 140px;" />
        <el-amount-input v-model="form.amountFour" :size="size" :precision="4" placeholder="四位小数" style="width: 160px; margin-left: 12px;" />
      </div>
      <div class="preview-row">
        <span class="preview-label">状态</span>
        <el-amount-input v-model="form.amountNegative" :size="size" allow-negative placeholder="允许负数" style="width: 140px;" />
        <el-amount-input v-model="form.amount" :size="size" clearable placeholder="可清空" style="width: 140px; margin-left: 12px;" />
        <el-amount-input :size="size" :value="'88.80'" disabled placeholder="禁用" style="width: 140px; margin-left: 12px;" />
      </div>
    </preview-block>

    <preview-block section-id="select" title="Select 选择器">
      <el-select v-model="form.select" :size="size" clearable placeholder="可清空" style="width: 180px;">
        <el-option v-for="item in cityOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="form.select" :size="size" filterable placeholder="可搜索" style="width: 180px; margin-left: 12px;">
        <el-option v-for="item in cityOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="form.select" :size="size" disabled placeholder="禁用" style="width: 160px; margin-left: 12px;">
        <el-option label="上海" value="shanghai" />
      </el-select>
      <el-select
        v-model="form.selectMultiple"
        :size="size"
        multiple
        collapse-tags
        placeholder="多选"
        style="width: 220px; margin-left: 12px;"
      >
        <el-option label="Vue" value="vue" />
        <el-option label="React" value="react" />
        <el-option label="Angular" value="angular" />
      </el-select>
    </preview-block>

    <preview-block section-id="cascader" title="Cascader 级联选择器">
      <div class="preview-row">
        <span class="preview-label">基础</span>
        <el-cascader v-model="form.cascader" :size="size" :options="cascaderOptions" clearable placeholder="可清空" style="width: 220px;" />
        <el-cascader v-model="form.cascaderEmpty" :size="size" :options="cascaderOptions" placeholder="请选择" style="width: 220px; margin-left: 12px;" />
      </div>
      <div class="preview-row">
        <span class="preview-label">状态</span>
        <el-cascader v-model="form.cascaderFilter" :size="size" :options="cascaderOptions" filterable clearable placeholder="可搜索" style="width: 220px;" />
        <el-cascader :size="size" :options="cascaderOptions" disabled placeholder="禁用空值" style="width: 180px; margin-left: 12px;" />
        <el-cascader v-model="form.cascader" :size="size" :options="cascaderOptions" disabled placeholder="禁用有值" style="width: 220px; margin-left: 12px;" />
      </div>
      <div class="preview-row">
        <span class="preview-label">展示</span>
        <el-cascader v-model="form.cascaderLast" :size="size" :options="cascaderOptions" :show-all-levels="false" clearable placeholder="仅末级" style="width: 180px;" />
        <el-cascader v-model="form.cascaderSep" :size="size" :options="cascaderOptions" separator=" - " clearable placeholder="自定义分隔符" style="width: 220px; margin-left: 12px;" />
      </div>
      <div class="preview-row">
        <span class="preview-label">触发</span>
        <el-cascader v-model="form.cascaderHover" :size="size" :options="cascaderOptions" :props="{ expandTrigger: 'hover' }" clearable placeholder="hover 展开" style="width: 220px;" />
        <el-cascader v-model="form.cascaderStrict" :size="size" :options="cascaderOptions" :props="{ checkStrictly: true }" clearable placeholder="可选任意一级" style="width: 220px; margin-left: 12px;" />
      </div>
      <div class="preview-row">
        <span class="preview-label">多选</span>
        <el-cascader v-model="form.cascaderMultiEmpty" :size="size" :options="cascaderOptions" :props="{ multiple: true }" clearable placeholder="多选空" style="width: 180px;" />
        <el-cascader v-model="form.cascaderMultiFilterEmpty" :size="size" :options="cascaderOptions" :props="{ multiple: true }" filterable clearable placeholder="多选搜索空" style="width: 200px; margin-left: 12px;" />
        <el-cascader v-model="form.cascaderMultiple" :size="size" :options="cascaderOptions" :props="{ multiple: true }" clearable placeholder="多选少量" style="width: 260px; margin-left: 12px;" />
        <el-cascader v-model="form.cascaderMultiOne" :size="size" :options="cascaderOptions" :props="{ multiple: true }" clearable placeholder="多选单个" style="width: 200px; margin-left: 12px;" />
      </div>
      <div class="preview-row">
        <span class="preview-label">省略</span>
        <el-cascader v-model="form.cascaderMultiMany" :size="size" :options="cascaderOptions" :props="{ multiple: true }" clearable placeholder="多选溢出 180" style="width: 180px;" />
        <el-cascader v-model="form.cascaderMultiMany" :size="size" :options="cascaderOptions" :props="{ multiple: true }" clearable placeholder="多选溢出 220" style="width: 220px; margin-left: 12px;" />
        <el-cascader v-model="form.cascaderMultiMany" :size="size" :options="cascaderOptions" :props="{ multiple: true }" clearable placeholder="多选溢出 320" style="width: 320px; margin-left: 12px;" />
      </div>
      <div class="preview-row">
        <span class="preview-label">折叠</span>
        <el-cascader v-model="form.cascaderCollapse" :size="size" :options="cascaderOptions" :props="{ multiple: true }" collapse-tags clearable placeholder="collapse-tags" style="width: 220px;" />
        <el-cascader v-model="form.cascaderMultiLast" :size="size" :options="cascaderOptions" :props="{ multiple: true }" :show-all-levels="false" clearable placeholder="仅末级多选" style="width: 220px; margin-left: 12px;" />
        <el-cascader v-model="form.cascaderMultiMany" :size="size" :options="cascaderOptions" :props="{ multiple: true }" disabled placeholder="多选禁用" style="width: 220px; margin-left: 12px;" />
      </div>
      <div class="preview-row">
        <span class="preview-label">多选+</span>
        <el-cascader
          v-model="form.cascaderMultiFilter"
          :size="size"
          :options="cascaderOptions"
          :props="{ multiple: true }"
          filterable
          clearable
          placeholder="多选可搜索"
          style="width: 320px;"
        />
        <el-cascader
          v-model="form.cascaderMultiFilterMany"
          :size="size"
          :options="cascaderOptions"
          :props="{ multiple: true }"
          filterable
          clearable
          placeholder="搜索+溢出"
          style="width: 220px; margin-left: 12px;"
        />
        <el-cascader
          v-model="form.cascaderMultiStrict"
          :size="size"
          :options="cascaderOptions"
          :props="{ multiple: true, checkStrictly: true }"
          clearable
          placeholder="多选任意一级"
          style="width: 240px; margin-left: 12px;"
        />
        <el-cascader :size="size" :options="[]" placeholder="空数据" style="width: 180px; margin-left: 12px;" />
      </div>
    </preview-block>

    <preview-block section-id="switch" title="Switch 开关">
      <el-switch v-model="form.switch" />
      <el-switch v-model="form.switchOff" style="margin-left: 16px;" />
      <el-switch v-model="form.switch" active-text="开" inactive-text="关" style="margin-left: 16px;" />
      <el-switch v-model="form.switch" disabled style="margin-left: 16px;" />
      <el-switch :value="false" disabled style="margin-left: 16px;" />
    </preview-block>

    <preview-block section-id="slider" title="Slider 滑块">
      <el-slider v-model="form.slider" style="width: 280px;" />
      <el-slider v-model="form.sliderRange" range style="width: 280px; margin-top: 16px;" />
      <el-slider v-model="form.slider" disabled style="width: 280px; margin-top: 16px;" />
    </preview-block>

    <preview-block section-id="time-picker" title="TimePicker 时间选择器">
      <el-time-picker v-model="form.time" :size="size" placeholder="选择时间" />
      <el-time-select v-model="form.timeSelect" :size="size" placeholder="时间点" style="margin-left: 12px;" />
      <el-time-picker v-model="form.time" :size="size" disabled placeholder="禁用" style="margin-left: 12px;" />
    </preview-block>

    <preview-block section-id="date-picker" title="DatePicker 日期选择器">
      <el-date-picker v-model="form.date" :size="size" type="date" placeholder="选择日期" />
      <el-date-picker v-model="form.month" :size="size" type="month" placeholder="月份" style="margin-left: 12px;" />
      <el-date-picker v-model="form.dateRange" :size="size" type="daterange" start-placeholder="开始" end-placeholder="结束" style="margin-left: 12px; width: 260px;" />
    </preview-block>

    <preview-block section-id="datetime-picker" title="DateTimePicker 日期时间">
      <el-date-picker v-model="form.datetime" :size="size" type="datetime" placeholder="选择日期时间" />
      <el-date-picker v-model="form.datetimeRange" :size="size" type="datetimerange" start-placeholder="开始" end-placeholder="结束" style="margin-left: 12px; width: 320px;" />
    </preview-block>

    <preview-block section-id="upload" title="Upload 上传">
      <el-upload action="#" :auto-upload="false" :file-list="form.fileList">
        <el-button :size="size" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">演示模式，不会实际上传</div>
      </el-upload>
    </preview-block>

    <preview-block section-id="color-picker" title="ColorPicker 颜色选择器">
      <el-color-picker v-model="form.color" :size="size" />
      <el-color-picker v-model="form.color" :size="size" show-alpha style="margin-left: 12px;" />
      <el-color-picker :size="size" disabled style="margin-left: 12px;" />
    </preview-block>

    <preview-block section-id="autocomplete" title="Autocomplete 自动补全">
      <el-autocomplete
        v-model="form.autocomplete"
        :size="size"
        :fetch-suggestions="querySearch"
        placeholder="请输入内容"
        style="width: 280px;"
      />
      <el-autocomplete
        v-model="form.autocomplete"
        :size="size"
        disabled
        :fetch-suggestions="querySearch"
        placeholder="禁用"
        style="width: 200px; margin-left: 12px;"
      />
    </preview-block>

    <preview-block section-id="form" title="Form 表单">
      <el-form :model="form" :size="size" label-width="80px" style="max-width: 420px;">
        <el-form-item label="名称" required>
          <el-input v-model="form.input" />
        </el-form-item>
        <el-form-item label="区域">
          <el-select v-model="form.select" placeholder="请选择" style="width: 100%;">
            <el-option v-for="item in cityOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="错误" error="请输入正确内容">
          <el-input value="" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary">提交</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </preview-block>
  </div>
</template>

<script>
import PreviewBlock from '../PreviewBlock.vue'
import { cityOptions, cascaderOptions, cascaderManyValue, autocompleteRestaurants } from '../mock-data'

export default {
  name: 'FormSection',

  components: { PreviewBlock },

  props: {
    size: {
      type: String,
      default: 'default'
    }
  },

  data() {
    return {
      cityOptions,
      cascaderOptions,
      form: {
        radio: '1',
        radioBorder: '2',
        radioBtn: '上海',
        checkbox: ['美食'],
        checkboxBorder: ['选中'],
        checkboxBtn: ['上海'],
        input: '',
        password: '',
        textarea: '',
        number: 1,
        amount: '',
        amountRange: '12.50',
        amountInt: '3',
        amountFour: '1.2345',
        amountNegative: '-8.80',
        select: '',
        selectMultiple: ['vue'],
        cascader: ['zhejiang', 'hangzhou'],
        cascaderEmpty: [],
        cascaderFilter: ['jiangsu', 'nanjing'],
        cascaderLast: ['zhejiang', 'hangzhou'],
        cascaderSep: ['jiangsu', 'suzhou'],
        cascaderHover: [],
        cascaderStrict: ['zhejiang'],
        cascaderMultiEmpty: [],
        cascaderMultiFilterEmpty: [],
        cascaderMultiple: [['zhejiang', 'hangzhou'], ['jiangsu', 'nanjing']],
        cascaderMultiOne: [['zhejiang', 'hangzhou']],
        cascaderMultiMany: cascaderManyValue.slice(),
        cascaderCollapse: [['zhejiang', 'hangzhou'], ['jiangsu', 'nanjing'], ['jiangsu', 'suzhou']],
        cascaderMultiLast: cascaderManyValue.slice(),
        cascaderMultiFilter: [['zhejiang', 'ningbo'], ['jiangsu', 'suzhou']],
        cascaderMultiFilterMany: cascaderManyValue.slice(),
        cascaderMultiStrict: [['zhejiang'], ['jiangsu', 'nanjing']],
        switch: true,
        switchOff: false,
        slider: 30,
        sliderRange: [20, 60],
        time: '',
        timeSelect: '',
        date: '',
        month: '',
        dateRange: '',
        datetime: '',
        datetimeRange: '',
        fileList: [{ name: 'demo.pdf', url: '#' }],
        color: '#409EFF',
        autocomplete: ''
      }
    }
  },

  methods: {
    querySearch(queryString, cb) {
      const results = queryString
        ? autocompleteRestaurants.filter(item => item.value.toLowerCase().includes(queryString.toLowerCase()))
        : autocompleteRestaurants
      cb(results)
    }
  }
}
</script>
