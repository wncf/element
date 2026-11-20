<template>
  <div class="preview-section">
    <preview-block section-id="radio" title="Radio 单选框">
      <div class="preview-row">
        <span class="preview-label">基础</span>
        <hzq-radio-group v-model="form.radio" :size="size">
          <hzq-radio label="1">选项 A</hzq-radio>
          <hzq-radio label="2">选项 B</hzq-radio>
          <hzq-radio label="3" disabled>禁用</hzq-radio>
        </hzq-radio-group>
      </div>
      <div class="preview-row">
        <span class="preview-label">边框</span>
        <hzq-radio v-model="form.radioBorder" label="1" border :size="size">备选</hzq-radio>
        <hzq-radio v-model="form.radioBorder" label="2" border :size="size">选中</hzq-radio>
        <hzq-radio v-model="form.radioBorder" label="3" border disabled :size="size">禁用</hzq-radio>
      </div>
      <div class="preview-row">
        <span class="preview-label">按钮</span>
        <hzq-radio-group v-model="form.radioBtn" :size="size">
          <hzq-radio-button label="上海" />
          <hzq-radio-button label="北京" />
          <hzq-radio-button label="广州" disabled />
        </hzq-radio-group>
      </div>
    </preview-block>

    <preview-block section-id="checkbox" title="Checkbox 多选框">
      <div class="preview-row">
        <span class="preview-label">基础</span>
        <hzq-checkbox-group v-model="form.checkbox" :size="size">
          <hzq-checkbox label="美食" />
          <hzq-checkbox label="电影" />
          <hzq-checkbox label="运动" disabled />
        </hzq-checkbox-group>
      </div>
      <div class="preview-row">
        <span class="preview-label">半选</span>
        <hzq-checkbox :indeterminate="true" :value="false">半选</hzq-checkbox>
        <hzq-checkbox :value="true">选中</hzq-checkbox>
        <hzq-checkbox disabled>未选禁用</hzq-checkbox>
        <hzq-checkbox :value="true" disabled>选中禁用</hzq-checkbox>
      </div>
      <div class="preview-row">
        <span class="preview-label">边框</span>
        <hzq-checkbox-group v-model="form.checkboxBorder" :size="size">
          <hzq-checkbox label="备选" border />
          <hzq-checkbox label="选中" border />
        </hzq-checkbox-group>
      </div>
      <div class="preview-row">
        <span class="preview-label">按钮</span>
        <hzq-checkbox-group v-model="form.checkboxBtn" :size="size">
          <hzq-checkbox-button label="上海" />
          <hzq-checkbox-button label="北京" />
          <hzq-checkbox-button label="广州" />
        </hzq-checkbox-group>
      </div>
    </preview-block>

    <preview-block section-id="input" title="Input 输入框">
      <div class="preview-row">
        <hzq-input v-model="form.input" :size="size" placeholder="请输入内容" style="width: 200px;" />
        <hzq-input v-model="form.input" :size="size" placeholder="带图标" prefix-icon="hzq-icon-search" style="width: 200px; margin-left: 12px;" />
        <hzq-input v-model="form.input" :size="size" clearable placeholder="可清空" style="width: 200px; margin-left: 12px;" />
      </div>
      <div class="preview-row">
        <hzq-input v-model="form.password" :size="size" show-password placeholder="密码" style="width: 200px;" />
        <hzq-input :size="size" disabled placeholder="禁用" style="width: 200px; margin-left: 12px;" />
        <hzq-input v-model="form.input" :size="size" maxlength="20" show-word-limit placeholder="字数限制" style="width: 200px; margin-left: 12px;" />
      </div>
      <div class="preview-row">
        <hzq-input :size="size" placeholder="组合" style="width: 280px;">
          <template slot="prepend">Http://</template>
          <template slot="append">.com</template>
        </hzq-input>
      </div>
      <div class="preview-row">
        <hzq-input v-model="form.textarea" type="textarea" :rows="2" placeholder="文本域" style="width: 360px;" />
      </div>
    </preview-block>

    <preview-block section-id="input-number" title="InputNumber 计数器">
      <hzq-input-number v-model="form.number" :size="size" :min="1" :max="10" />
      <hzq-input-number v-model="form.number" :size="size" disabled style="margin-left: 12px;" />
      <hzq-input-number v-model="form.number" :size="size" controls-position="right" style="margin-left: 12px;" />
    </preview-block>

    <preview-block section-id="amount-input" title="AmountInput 金额输入">
      <div class="preview-row">
        <span class="preview-label">两位小数</span>
        <hzq-amount-input v-model="form.amount" :size="size" placeholder="不能输入负数" style="width: 180px;" />
        <span class="preview-label" style="width: auto; margin-left: 12px;">值：{{ form.amount || '空' }}</span>
      </div>
      <div class="preview-row">
        <span class="preview-label">范围</span>
        <hzq-amount-input v-model="form.amountRange" :size="size" :min="1" :max="1000" placeholder="1 ~ 1000" style="width: 180px;" />
        <span class="preview-label" style="width: auto; margin-left: 12px;">值：{{ form.amountRange || '空' }}</span>
      </div>
      <div class="preview-row">
        <span class="preview-label">精度</span>
        <hzq-amount-input v-model="form.amountInt" :size="size" :precision="0" placeholder="只收整数" style="width: 140px;" />
        <hzq-amount-input v-model="form.amountFour" :size="size" :precision="4" placeholder="四位小数" style="width: 160px; margin-left: 12px;" />
      </div>
      <div class="preview-row">
        <span class="preview-label">状态</span>
        <hzq-amount-input v-model="form.amountNegative" :size="size" allow-negative placeholder="允许负数" style="width: 140px;" />
        <hzq-amount-input v-model="form.amount" :size="size" clearable placeholder="可清空" style="width: 140px; margin-left: 12px;" />
        <hzq-amount-input :size="size" :value="'88.80'" disabled placeholder="禁用" style="width: 140px; margin-left: 12px;" />
      </div>
    </preview-block>

    <preview-block section-id="select" title="Select 选择器">
      <hzq-select v-model="form.select" :size="size" clearable placeholder="可清空" style="width: 180px;">
        <hzq-option v-for="item in cityOptions" :key="item.value" :label="item.label" :value="item.value" />
      </hzq-select>
      <hzq-select v-model="form.select" :size="size" filterable placeholder="可搜索" style="width: 180px; margin-left: 12px;">
        <hzq-option v-for="item in cityOptions" :key="item.value" :label="item.label" :value="item.value" />
      </hzq-select>
      <hzq-select v-model="form.select" :size="size" disabled placeholder="禁用" style="width: 160px; margin-left: 12px;">
        <hzq-option label="上海" value="shanghai" />
      </hzq-select>
      <hzq-select
        v-model="form.selectMultiple"
        :size="size"
        multiple
        collapse-tags
        placeholder="多选"
        style="width: 220px; margin-left: 12px;"
      >
        <hzq-option label="Vue" value="vue" />
        <hzq-option label="React" value="react" />
        <hzq-option label="Angular" value="angular" />
      </hzq-select>
    </preview-block>

    <preview-block section-id="cascader" title="Cascader 级联选择器">
      <div class="preview-row">
        <span class="preview-label">基础</span>
        <hzq-cascader v-model="form.cascader" :size="size" :options="cascaderOptions" clearable placeholder="可清空" style="width: 220px;" />
        <hzq-cascader v-model="form.cascaderEmpty" :size="size" :options="cascaderOptions" placeholder="请选择" style="width: 220px; margin-left: 12px;" />
      </div>
      <div class="preview-row">
        <span class="preview-label">状态</span>
        <hzq-cascader v-model="form.cascaderFilter" :size="size" :options="cascaderOptions" filterable clearable placeholder="可搜索" style="width: 220px;" />
        <hzq-cascader :size="size" :options="cascaderOptions" disabled placeholder="禁用空值" style="width: 180px; margin-left: 12px;" />
        <hzq-cascader v-model="form.cascader" :size="size" :options="cascaderOptions" disabled placeholder="禁用有值" style="width: 220px; margin-left: 12px;" />
      </div>
      <div class="preview-row">
        <span class="preview-label">展示</span>
        <hzq-cascader v-model="form.cascaderLast" :size="size" :options="cascaderOptions" :show-all-levels="false" clearable placeholder="仅末级" style="width: 180px;" />
        <hzq-cascader v-model="form.cascaderSep" :size="size" :options="cascaderOptions" separator=" - " clearable placeholder="自定义分隔符" style="width: 220px; margin-left: 12px;" />
      </div>
      <div class="preview-row">
        <span class="preview-label">触发</span>
        <hzq-cascader v-model="form.cascaderHover" :size="size" :options="cascaderOptions" :props="{ expandTrigger: 'hover' }" clearable placeholder="hover 展开" style="width: 220px;" />
        <hzq-cascader v-model="form.cascaderStrict" :size="size" :options="cascaderOptions" :props="{ checkStrictly: true }" clearable placeholder="可选任意一级" style="width: 220px; margin-left: 12px;" />
      </div>
      <div class="preview-row">
        <span class="preview-label">多选</span>
        <hzq-cascader v-model="form.cascaderMultiEmpty" :size="size" :options="cascaderOptions" :props="{ multiple: true }" clearable placeholder="多选空" style="width: 180px;" />
        <hzq-cascader v-model="form.cascaderMultiFilterEmpty" :size="size" :options="cascaderOptions" :props="{ multiple: true }" filterable clearable placeholder="多选搜索空" style="width: 200px; margin-left: 12px;" />
        <hzq-cascader v-model="form.cascaderMultiple" :size="size" :options="cascaderOptions" :props="{ multiple: true }" clearable placeholder="多选少量" style="width: 260px; margin-left: 12px;" />
        <hzq-cascader v-model="form.cascaderMultiOne" :size="size" :options="cascaderOptions" :props="{ multiple: true }" clearable placeholder="多选单个" style="width: 200px; margin-left: 12px;" />
      </div>
      <div class="preview-row">
        <span class="preview-label">省略</span>
        <hzq-cascader v-model="form.cascaderMultiMany" :size="size" :options="cascaderOptions" :props="{ multiple: true }" clearable placeholder="多选溢出 180" style="width: 180px;" />
        <hzq-cascader v-model="form.cascaderMultiMany" :size="size" :options="cascaderOptions" :props="{ multiple: true }" clearable placeholder="多选溢出 220" style="width: 220px; margin-left: 12px;" />
        <hzq-cascader v-model="form.cascaderMultiMany" :size="size" :options="cascaderOptions" :props="{ multiple: true }" clearable placeholder="多选溢出 320" style="width: 320px; margin-left: 12px;" />
      </div>
      <div class="preview-row">
        <span class="preview-label">折叠</span>
        <hzq-cascader v-model="form.cascaderCollapse" :size="size" :options="cascaderOptions" :props="{ multiple: true }" collapse-tags clearable placeholder="collapse-tags" style="width: 220px;" />
        <hzq-cascader v-model="form.cascaderMultiLast" :size="size" :options="cascaderOptions" :props="{ multiple: true }" :show-all-levels="false" clearable placeholder="仅末级多选" style="width: 220px; margin-left: 12px;" />
        <hzq-cascader v-model="form.cascaderMultiMany" :size="size" :options="cascaderOptions" :props="{ multiple: true }" disabled placeholder="多选禁用" style="width: 220px; margin-left: 12px;" />
      </div>
      <div class="preview-row">
        <span class="preview-label">多选+</span>
        <hzq-cascader
          v-model="form.cascaderMultiFilter"
          :size="size"
          :options="cascaderOptions"
          :props="{ multiple: true }"
          filterable
          clearable
          placeholder="多选可搜索"
          style="width: 320px;"
        />
        <hzq-cascader
          v-model="form.cascaderMultiFilterMany"
          :size="size"
          :options="cascaderOptions"
          :props="{ multiple: true }"
          filterable
          clearable
          placeholder="搜索+溢出"
          style="width: 220px; margin-left: 12px;"
        />
        <hzq-cascader
          v-model="form.cascaderMultiStrict"
          :size="size"
          :options="cascaderOptions"
          :props="{ multiple: true, checkStrictly: true }"
          clearable
          placeholder="多选任意一级"
          style="width: 240px; margin-left: 12px;"
        />
        <hzq-cascader :size="size" :options="[]" placeholder="空数据" style="width: 180px; margin-left: 12px;" />
      </div>
    </preview-block>

    <preview-block section-id="switch" title="Switch 开关">
      <hzq-switch v-model="form.switch" />
      <hzq-switch v-model="form.switchOff" style="margin-left: 16px;" />
      <hzq-switch v-model="form.switch" active-text="开" inactive-text="关" style="margin-left: 16px;" />
      <hzq-switch v-model="form.switch" disabled style="margin-left: 16px;" />
      <hzq-switch :value="false" disabled style="margin-left: 16px;" />
    </preview-block>

    <preview-block section-id="slider" title="Slider 滑块">
      <hzq-slider v-model="form.slider" style="width: 280px;" />
      <hzq-slider v-model="form.sliderRange" range style="width: 280px; margin-top: 16px;" />
      <hzq-slider v-model="form.slider" disabled style="width: 280px; margin-top: 16px;" />
    </preview-block>

    <preview-block section-id="time-picker" title="TimePicker 时间选择器">
      <hzq-time-picker v-model="form.time" :size="size" placeholder="选择时间" />
      <hzq-time-select v-model="form.timeSelect" :size="size" placeholder="时间点" style="margin-left: 12px;" />
      <hzq-time-picker v-model="form.time" :size="size" disabled placeholder="禁用" style="margin-left: 12px;" />
    </preview-block>

    <preview-block section-id="date-picker" title="DatePicker 日期选择器">
      <hzq-date-picker v-model="form.date" :size="size" type="date" placeholder="选择日期" />
      <hzq-date-picker v-model="form.month" :size="size" type="month" placeholder="月份" style="margin-left: 12px;" />
      <hzq-date-picker v-model="form.dateRange" :size="size" type="daterange" start-placeholder="开始" end-placeholder="结束" style="margin-left: 12px; width: 260px;" />
    </preview-block>

    <preview-block section-id="datetime-picker" title="DateTimePicker 日期时间">
      <hzq-date-picker v-model="form.datetime" :size="size" type="datetime" placeholder="选择日期时间" />
      <hzq-date-picker v-model="form.datetimeRange" :size="size" type="datetimerange" start-placeholder="开始" end-placeholder="结束" style="margin-left: 12px; width: 320px;" />
    </preview-block>

    <preview-block section-id="upload" title="Upload 上传">
      <hzq-upload action="#" :auto-upload="false" :file-list="form.fileList">
        <hzq-button :size="size" type="primary">点击上传</hzq-button>
        <div slot="tip" class="hzq-upload__tip">演示模式，不会实际上传</div>
      </hzq-upload>
    </preview-block>

    <preview-block section-id="color-picker" title="ColorPicker 颜色选择器">
      <hzq-color-picker v-model="form.color" :size="size" />
      <hzq-color-picker v-model="form.color" :size="size" show-alpha style="margin-left: 12px;" />
      <hzq-color-picker :size="size" disabled style="margin-left: 12px;" />
    </preview-block>

    <preview-block section-id="autocomplete" title="Autocomplete 自动补全">
      <hzq-autocomplete
        v-model="form.autocomplete"
        :size="size"
        :fetch-suggestions="querySearch"
        placeholder="请输入内容"
        style="width: 280px;"
      />
      <hzq-autocomplete
        v-model="form.autocomplete"
        :size="size"
        disabled
        :fetch-suggestions="querySearch"
        placeholder="禁用"
        style="width: 200px; margin-left: 12px;"
      />
    </preview-block>

    <preview-block section-id="form" title="Form 表单">
      <hzq-form :model="form" :size="size" label-width="80px" style="max-width: 420px;">
        <hzq-form-item label="名称" required>
          <hzq-input v-model="form.input" />
        </hzq-form-item>
        <hzq-form-item label="区域">
          <hzq-select v-model="form.select" placeholder="请选择" style="width: 100%;">
            <hzq-option v-for="item in cityOptions" :key="item.value" :label="item.label" :value="item.value" />
          </hzq-select>
        </hzq-form-item>
        <hzq-form-item label="错误" error="请输入正确内容">
          <hzq-input value="" />
        </hzq-form-item>
        <hzq-form-item>
          <hzq-button type="primary">提交</hzq-button>
          <hzq-button>重置</hzq-button>
        </hzq-form-item>
      </hzq-form>
    </preview-block>

    <preview-block section-id="form-control-bg" title="控件底色 control-bg" tag="controlBg">
      <div class="preview-row">
        <span class="preview-label">表单</span>
        <hzq-radio-group v-model="controlBgForm" size="mini">
          <hzq-radio-button label="">不设置</hzq-radio-button>
          <hzq-radio-button label="card">card 白底</hzq-radio-button>
          <hzq-radio-button label="tint">tint 主题浅底</hzq-radio-button>
        </hzq-radio-group>
      </div>
      <div class="preview-row">
        <span class="preview-label">控件</span>
        <hzq-radio-group v-model="controlBgInput" size="mini">
          <hzq-radio-button label="">跟随表单</hzq-radio-button>
          <hzq-radio-button label="card">card</hzq-radio-button>
          <hzq-radio-button label="tint">tint</hzq-radio-button>
        </hzq-radio-group>
        <span class="preview-label" style="width: auto; margin-left: 12px;">
          实际生效：{{ resolvedControlBgDemo }}
        </span>
      </div>

      <div class="control-bg-demo">
        <hzq-form
          :model="form"
          :size="size"
          label-width="80px"
          :control-bg="controlBgForm"
          class="control-bg-demo__form"
        >
          <hzq-form-item label="输入框">
            <hzq-input v-model="form.input" :control-bg="controlBgInput" placeholder="请输入内容" />
          </hzq-form-item>
          <hzq-form-item label="选择器">
            <hzq-select v-model="form.select" placeholder="请选择" style="width: 100%;">
              <hzq-option
                v-for="item in cityOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </hzq-select>
          </hzq-form-item>
          <hzq-form-item label="计数器">
            <hzq-input-number v-model="form.number" :min="1" :max="10" />
          </hzq-form-item>
          <hzq-form-item label="日期">
            <hzq-date-picker v-model="form.date" type="date" placeholder="选择日期" style="width: 100%;" />
          </hzq-form-item>
          <hzq-form-item label="金额">
            <hzq-amount-input v-model="form.amount" placeholder="请输入金额" />
          </hzq-form-item>
          <hzq-form-item label="文本域">
            <hzq-input v-model="form.textarea" type="textarea" :rows="2" placeholder="请输入" />
          </hzq-form-item>
          <hzq-form-item label="禁用">
            <hzq-input v-model="form.input" disabled placeholder="禁用态" />
          </hzq-form-item>
        </hzq-form>
      </div>

      <p class="control-bg-demo__hint">
        优先级：控件自身 control-bg &gt; 表单 control-bg &gt; 全局（Vue.use 的 controlBg）&gt; 默认 card。
        card 固定为卡片白底（不随主色），tint 跟随主题：默认浅蓝、绿色主题下是极浅的绿、深色主题下比卡片亮一档。
        上方「主题」面板切到绿色预设时，tint 的差别最明显。
      </p>
    </preview-block>

    <preview-block section-id="form-builder" title="FormBuilder 配置化表单">
      <hzq-form-builder
        v-model="builderForm"
        :fields="builderFields"
        :rules="builderRules"
        :size="size"
        label-width="88px"
        :columns="2"
        :gutter="12"
        show-actions
        submit-text="保存"
        @submit="handleBuilderSubmit"
      >
        <template slot="amountLabel" slot-scope="scope">★{{ scope.field.label }}</template>
        <template slot="note" slot-scope="scope">
          <hzq-input v-model="scope.value" type="textarea" :rows="2" placeholder="自定义插槽字段" />
        </template>
      </hzq-form-builder>
      <div class="preview-row">
        <span class="preview-label">提交结果</span>
        <span class="preview-label" style="width: auto;">{{ builderResult || '尚未提交' }}</span>
      </div>
    </preview-block>

    <!--
      表单元素对齐测试：
      所有控件都带 data-align-item 标记，测量脚本按 data-align-group 分组，
      对比同一行内各控件的 getBoundingClientRect().top / height / bottom。
    -->
    <preview-block section-id="form-align" title="表单元素对齐测试" tag="measure">
      <!-- 场景 A：Form 内单个 FormItem，验证外框高度 == 内框高度 -->
      <div class="align-scene">
        <h4 class="align-scene__title">A. Form 内单个 FormItem（外框高度应等于内框高度）</h4>
        <hzq-form :model="form" :size="size" label-width="110px" class="align-form">
          <hzq-form-item label="Input">
            <hzq-input v-model="form.input" data-align-item="input" placeholder="普通" style="width: 220px;" />
          </hzq-form-item>
          <hzq-form-item label="Input 图标">
            <hzq-input
              v-model="form.input"
              data-align-item="input-prefix"
              prefix-icon="hzq-icon-search"
              placeholder="prefix-icon"
              style="width: 220px;"
            />
            <hzq-input
              v-model="form.input"
              data-align-item="input-suffix"
              suffix-icon="hzq-icon-date"
              placeholder="suffix-icon"
              style="width: 220px; margin-left: 12px;"
            />
          </hzq-form-item>
          <hzq-form-item label="Input 状态">
            <hzq-input v-model="form.input" data-align-item="input-clearable" clearable placeholder="clearable" style="width: 220px;" />
            <hzq-input
              v-model="form.password"
              data-align-item="input-password"
              show-password
              placeholder="show-password"
              style="width: 220px; margin-left: 12px;"
            />
            <hzq-input data-align-item="input-disabled" disabled placeholder="disabled" style="width: 220px; margin-left: 12px;" />
          </hzq-form-item>
          <hzq-form-item label="InputNumber">
            <hzq-input-number v-model="form.number" data-align-item="input-number" :min="1" :max="10" style="width: 180px;" />
            <hzq-input-number
              v-model="form.number"
              data-align-item="input-number-no-controls"
              :controls="false"
              style="width: 180px; margin-left: 12px;"
            />
            <hzq-input-number
              v-model="form.number"
              data-align-item="input-number-right"
              controls-position="right"
              style="width: 180px; margin-left: 12px;"
            />
          </hzq-form-item>
          <hzq-form-item label="Select">
            <hzq-select v-model="form.select" data-align-item="select" placeholder="单选" style="width: 220px;">
              <hzq-option v-for="item in cityOptions" :key="item.value" :label="item.label" :value="item.value" />
            </hzq-select>
            <hzq-select
              v-model="form.selectMultiple"
              data-align-item="select-multiple"
              multiple
              collapse-tags
              placeholder="多选"
              style="width: 220px; margin-left: 12px;"
            >
              <hzq-option label="Vue" value="vue" />
              <hzq-option label="React" value="react" />
            </hzq-select>
          </hzq-form-item>
          <hzq-form-item label="DatePicker">
            <hzq-date-picker v-model="form.date" data-align-item="date-picker" type="date" placeholder="date" />
            <hzq-date-picker v-model="form.datetime" data-align-item="datetime-picker" type="datetime" placeholder="datetime" style="margin-left: 12px;" />
            <hzq-date-picker
              v-model="form.dateRange"
              data-align-item="daterange-picker"
              type="daterange"
              start-placeholder="开始"
              end-placeholder="结束"
              style="margin-left: 12px; width: 260px;"
            />
          </hzq-form-item>
          <hzq-form-item label="TimePicker">
            <hzq-time-picker v-model="form.time" data-align-item="time-picker" placeholder="time-picker" />
            <hzq-time-select v-model="form.timeSelect" data-align-item="time-select" placeholder="time-select" style="margin-left: 12px;" />
          </hzq-form-item>
          <hzq-form-item label="Autocomplete">
            <hzq-autocomplete
              v-model="form.autocomplete"
              data-align-item="autocomplete"
              :fetch-suggestions="querySearch"
              placeholder="autocomplete"
              style="width: 220px;"
            />
          </hzq-form-item>
          <hzq-form-item label="Cascader">
            <hzq-cascader
              v-model="form.cascader"
              data-align-item="cascader"
              :options="cascaderOptions"
              clearable
              placeholder="cascader"
              style="width: 220px;"
            />
          </hzq-form-item>
          <hzq-form-item label="Textarea">
            <hzq-input v-model="form.textarea" data-align-item="textarea" type="textarea" :rows="2" placeholder="textarea" style="width: 360px;" />
          </hzq-form-item>
          <hzq-form-item label="Switch">
            <hzq-switch v-model="form.switch" data-align-item="switch" />
          </hzq-form-item>
          <hzq-form-item label="Radio">
            <hzq-radio-group v-model="form.radio" data-align-item="radio">
              <hzq-radio label="1">选项 A</hzq-radio>
              <hzq-radio label="2">选项 B</hzq-radio>
            </hzq-radio-group>
          </hzq-form-item>
          <hzq-form-item label="Checkbox">
            <hzq-checkbox-group v-model="form.checkbox" data-align-item="checkbox">
              <hzq-checkbox label="美食" />
              <hzq-checkbox label="电影" />
            </hzq-checkbox-group>
          </hzq-form-item>
          <hzq-form-item label="Slider">
            <hzq-slider v-model="form.slider" data-align-item="slider" style="width: 280px;" />
          </hzq-form-item>
          <hzq-form-item label="Rate">
            <hzq-rate v-model="form.rate" data-align-item="rate" />
          </hzq-form-item>
          <hzq-form-item label="ColorPicker">
            <hzq-color-picker v-model="form.color" data-align-item="color-picker" />
          </hzq-form-item>
          <hzq-form-item label="Upload">
            <hzq-upload data-align-item="upload" action="#" :auto-upload="false" :file-list="form.fileList">
              <hzq-button type="primary">点击上传</hzq-button>
            </hzq-upload>
          </hzq-form-item>
        </hzq-form>
      </div>

      <!-- 场景 B：模拟表格单元格内并排，验证各控件 top 是否一致 -->
      <div class="align-scene">
        <h4 class="align-scene__title">B. 表格单元格内并排（top 应完全一致）</h4>
        <div class="align-table-wrap">
        <table class="align-table">
          <tbody>
            <tr>
              <td class="align-table__label">{{ size || '默认' }}</td>
              <td class="align-table__cell" data-align-group="b-default">
                <hzq-input v-model="form.input" data-align-item="input" :size="size" placeholder="input" style="width: 130px;" />
                <hzq-input-number v-model="form.number" data-align-item="input-number" :size="size" style="width: 130px;" />
                <hzq-input-number
                  v-model="form.number"
                  data-align-item="input-number-no-controls"
                  :size="size"
                  :controls="false"
                  style="width: 130px;"
                />
                <hzq-select v-model="form.select" data-align-item="select" :size="size" placeholder="select" style="width: 130px;">
                  <hzq-option v-for="item in cityOptions" :key="item.value" :label="item.label" :value="item.value" />
                </hzq-select>
                <hzq-select v-model="form.selectMultiple" data-align-item="select-multiple" :size="size" multiple placeholder="多选" style="width: 130px;">
                  <hzq-option v-for="item in cityOptions" :key="item.value" :label="item.label" :value="item.value" />
                </hzq-select>
                <hzq-date-picker v-model="form.date" data-align-item="date-picker" :size="size" type="date" placeholder="date" style="width: 150px;" />
                <hzq-date-picker
                  v-model="form.datetime"
                  data-align-item="datetime-picker"
                  :size="size"
                  type="datetime"
                  placeholder="datetime"
                  style="width: 180px;"
                />
                <hzq-date-picker
                  v-model="form.dateRange"
                  data-align-item="daterange-picker"
                  :size="size"
                  type="daterange"
                  start-placeholder="开始"
                  end-placeholder="结束"
                  style="width: 240px;"
                />
                <hzq-autocomplete
                  v-model="form.autocomplete"
                  data-align-item="autocomplete"
                  :size="size"
                  :fetch-suggestions="querySearch"
                  placeholder="autocomplete"
                  style="width: 150px;"
                />
                <hzq-cascader
                  v-model="form.cascader"
                  data-align-item="cascader"
                  :size="size"
                  :options="cascaderOptions"
                  placeholder="cascader"
                  style="width: 150px;"
                />
                <hzq-time-picker v-model="form.time" data-align-item="time-picker" :size="size" placeholder="time-picker" style="width: 150px;" />
                <hzq-time-select v-model="form.timeSelect" data-align-item="time-select" :size="size" placeholder="time-select" style="width: 150px;" />
                <hzq-amount-input v-model="form.amount" data-align-item="amount-input" :size="size" placeholder="amount" style="width: 130px;" />
                <hzq-textarea v-model="form.textarea" data-align-item="textarea" :size="size" placeholder="textarea" :rows="1" style="width: 160px;" />
                <hzq-button data-align-item="button" :size="size" type="primary">按钮</hzq-button>
                <hzq-radio-group v-model="form.radio" data-align-item="radio-group" :size="size">
                  <hzq-radio label="1">单选</hzq-radio>
                </hzq-radio-group>
                <hzq-radio-group v-model="form.radio" data-align-item="radio-button" :size="size">
                  <hzq-radio-button label="1">按钮</hzq-radio-button>
                </hzq-radio-group>
                <hzq-checkbox-group v-model="form.checkbox" data-align-item="checkbox-group" :size="size">
                  <hzq-checkbox label="美食">多选</hzq-checkbox>
                </hzq-checkbox-group>
                <hzq-checkbox-group v-model="form.checkboxBtn" data-align-item="checkbox-button" :size="size">
                  <hzq-checkbox-button label="上海">按钮</hzq-checkbox-button>
                </hzq-checkbox-group>
                <hzq-switch v-model="form.switch" data-align-item="switch" />
                <hzq-slider v-model="form.slider" data-align-item="slider" style="width: 120px;" />
                <hzq-rate v-model="form.rate" data-align-item="rate" />
                <hzq-color-picker v-model="form.color" data-align-item="color-picker" :size="size" />
                <span class="align-inline-wrap" data-align-item="upload">
                  <hzq-upload action="#" :show-file-list="false">
                    <hzq-button :size="size" type="primary">上传</hzq-button>
                  </hzq-upload>
                </span>
                <hzq-tag data-align-item="tag" :size="size" type="success">标签</hzq-tag>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>

      <!-- 场景 C：四个尺寸档位重复场景 B -->
      <div v-for="tier in alignSizes" :key="tier" class="align-scene">
        <h4 class="align-scene__title">C. 尺寸 {{ tier }}</h4>
        <div class="align-table-wrap">
        <table class="align-table">
          <tbody>
            <tr>
              <td class="align-table__label">{{ tier }}</td>
              <td class="align-table__cell" :data-align-group="'c-' + tier">
                <hzq-input v-model="form.input" data-align-item="input" :size="tier" placeholder="input" style="width: 130px;" />
                <hzq-input-number v-model="form.number" data-align-item="input-number" :size="tier" style="width: 130px;" />
                <hzq-select v-model="form.select" data-align-item="select" :size="tier" placeholder="select" style="width: 130px;">
                  <hzq-option v-for="item in cityOptions" :key="item.value" :label="item.label" :value="item.value" />
                </hzq-select>
                <hzq-date-picker v-model="form.date" data-align-item="date-picker" :size="tier" type="date" placeholder="date" style="width: 150px;" />
                <hzq-autocomplete
                  v-model="form.autocomplete"
                  data-align-item="autocomplete"
                  :size="tier"
                  :fetch-suggestions="querySearch"
                  placeholder="autocomplete"
                  style="width: 150px;"
                />
                <hzq-cascader
                  v-model="form.cascader"
                  data-align-item="cascader"
                  :size="tier"
                  :options="cascaderOptions"
                  placeholder="cascader"
                  style="width: 150px;"
                />
                <hzq-button data-align-item="button" :size="tier" type="primary">按钮</hzq-button>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>
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
        autocomplete: '',
        rate: 3,
        checkboxSingle: true
      },
      // control-bg 演示：表单层与控件层分别可切换，空串表示"不设置"，交给下一层决定
      controlBgForm: '',
      controlBgInput: '',
      // 场景 C 的尺寸档位；default 由场景 B 覆盖，这里只跑四个显式档位
      alignSizes: ['large', 'medium', 'small', 'mini'],
      builderForm: {
        type: 'fixed',
        name: '',
        amount: '',
        region: '',
        tags: [],
        locked: false,
        note: ''
      },
      builderResult: '',
      builderFields: [],
      builderRules: {
        name: [{ min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }]
      }
    }
  },

  created() {
    // 字段配置是纯前端常量，事件与条件直接写函数：
    // 这样不用额外维护一份 handlers 映射表，也不会有字符串拼错的隐性问题
    this.builderFields = [
      { type: 'title', label: '基本信息' },
      {
        prop: 'type',
        label: '计费方式',
        component: 'hzq-select',
        options: [
          { label: '固定金额', value: 'fixed' },
          { label: '按量计费', value: 'dynamic' }
        ]
      },
      {
        prop: 'name',
        label: '名称',
        component: 'hzq-input',
        required: true,
        props: { placeholder: '请输入名称' }
      },
      {
        prop: 'amount',
        label: '金额',
        labelSlot: 'amountLabel',
        component: 'hzq-amount-input',
        required: true,
        tip: '按量计费时不需要填写',
        props: { placeholder: '请输入金额', precision: 2 },
        hidden: model => model.type === 'dynamic'
      },
      {
        prop: 'region',
        label: '区域',
        component: 'hzq-select',
        options: [
          { label: '上海', value: 'shanghai' },
          { label: '北京', value: 'beijing' }
        ],
        props: { clearable: true }
      },
      {
        prop: 'tags',
        label: '标签',
        component: 'hzq-select',
        options: [
          { label: '重要', value: 'important' },
          { label: '紧急', value: 'urgent' }
        ],
        props: { multiple: true, collapseTags: true }
      },
      {
        prop: 'locked',
        label: '锁定',
        component: 'hzq-switch',
        events: {
          change: (value, ctx) => {
            if (value) ctx.model.region = '';
          }
        }
      },
      { type: 'divider', label: '备注' },
      {
        prop: 'note',
        label: '说明',
        slot: 'note'
      }
    ];
  },

  computed: {
    // 与组件内的解析顺序保持一致，用来在演示区直接显示"这一格最终用的是哪档"
    resolvedControlBgDemo() {
      const global = (this.$HZQ && this.$HZQ.controlBg) || '';
      return this.controlBgInput || this.controlBgForm || global || 'card';
    }
  },

  methods: {
    querySearch(queryString, cb) {
      const results = queryString
        ? autocompleteRestaurants.filter(item => item.value.toLowerCase().includes(queryString.toLowerCase()))
        : autocompleteRestaurants
      cb(results)
    },

    handleBuilderSubmit(model) {
      this.builderResult = JSON.stringify(model);
    }
  }
}
</script>

<style scoped>
/* control-bg 演示区：卡片底色 + 内边距，否则白底控件贴在白页面上看不出边界 */
.control-bg-demo {
  margin-top: 4px;
  padding: 16px 16px 0;
  max-width: 460px;
  border: 1px solid var(--hzq-border-color-lighter);
  border-radius: 6px;
  /* 用卡片色而不是页面色：card 档要和"周围的白"对比才看得出效果 */
  background: var(--hzq-bg-color);
}

.control-bg-demo__hint {
  margin: 10px 0 0;
  max-width: 460px;
  font-size: 12px;
  line-height: 1.7;
  color: var(--hzq-text-color-secondary);
}

/* 对齐测试区：刻意用普通表格 + inline 流，
   不引入 flex/grid，才能真实复现「单元格内并排控件基线不一致」的问题 */
.align-scene {
  margin-bottom: 20px;
  /* 一行控件总宽会超过内容区，允许横向滚动，避免末尾控件被裁掉看不到 */
  overflow-x: auto;
}

.align-scene:last-child {
  margin-bottom: 0;
}

.align-scene__title {
  margin: 0 0 10px;
  font-size: 13px;
  font-weight: 500;
  color: var(--hzq-text-color-regular);
}

.align-form {
  // 内容区宽度要容得下最宽的一行：
  // Input 状态 = 3×220 + 2×12 = 684px，DatePicker = 220+220+260+24 = 724px，
  // 减去 label-width 110px 后需要 ≥ 724px，取 900px 留余量，避免控件换行
  // 被误判成「样式掉下来」。
  max-width: 1010px;
}

// 横向滚动容器：控件一行排开不换行，超出时滚动查看
.align-table-wrap {
  overflow-x: auto;
  max-width: 100%;
}

.align-table {
  width: max-content;
  min-width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.align-table__label {
  width: 64px;
  padding: 8px;
  font-size: 12px;
  color: var(--hzq-text-color-secondary);
  vertical-align: middle;
  background: var(--hzq-fill-color-lighter);
  border: 1px solid var(--hzq-border-color-lighter);
}

.align-table__cell {
  padding: 8px;
  border: 1px solid var(--hzq-border-color-lighter);
  // 所有控件排成一行不换行。单元格本身不设 overflow（table-cell 的 overflow
  // 计算值恒为 visible，设了也不生效），由外层 .align-table-wrap 负责横向滚动。
  white-space: nowrap;
  vertical-align: middle;
}

/* 只给间距，不改 display/vertical-align，避免掩盖被测的默认行为 */
.align-table__cell > * {
  margin-right: 8px;
}

// slider / rate 默认是 display:block，会强制独占一行导致换行。
// 这里仅为「单行并排」的测试场景改成 inline-block，不修改组件自身的默认样式。
.align-table__cell > .hzq-slider,
.align-table__cell > .hzq-rate {
  display: inline-block;
  vertical-align: middle;
}

// checkbox-group 的根元素是 div（块级），在单元格里会独占一行。
// 仅为测试场景改成 inline-block，不修改组件自身的默认样式。
.align-table__cell > .hzq-checkbox-group {
  display: inline-block;
  vertical-align: middle;
  width: auto;
}

// hzq-upload 渲染的外层 div 没有类名，用包裹元素控制对齐
.align-inline-wrap {
  display: inline-block;
  vertical-align: middle;
}

.align-table__cell > *:last-child {
  margin-right: 0;
}
</style>
