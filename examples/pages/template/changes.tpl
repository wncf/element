<style>
  .page-changes {
    max-width: 900px;
    margin: 0 auto;
    padding: 60px 20px 100px;
    box-sizing: border-box;

    h1 {
      font-size: 32px;
      font-weight: normal;
      color: var(--hzq-text-color-primary);
      margin: 0 0 12px;
    }

    > p.lead {
      font-size: 15px;
      line-height: 1.8;
      color: var(--hzq-text-color-regular);
      margin: 0 0 12px;
    }

    .changes-meta {
      margin: 20px 0 40px;
      padding: 16px 20px;
      border-left: 3px solid var(--hzq-color-primary);
      background-color: var(--hzq-fill-color-light);
      font-size: 13px;
      line-height: 1.8;
      color: var(--hzq-text-color-regular);

      code {
        padding: 2px 6px;
        border-radius: 3px;
        background-color: var(--hzq-fill-color);
        color: var(--hzq-color-primary);
        font-family: Consolas, Monaco, monospace;
      }
    }

    .changes-summary {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 50px;

      .changes-card {
        flex: 1 1 180px;
        padding: 18px 20px;
        border: 1px solid var(--hzq-border-color-light);
        border-radius: 6px;

        strong {
          display: block;
          font-size: 26px;
          font-weight: 600;
          line-height: 1.2;
          color: var(--hzq-color-primary);
        }

        span {
          display: block;
          margin-top: 6px;
          font-size: 13px;
          color: var(--hzq-text-color-secondary);
        }
      }
    }

    h2 {
      margin: 56px 0 20px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--hzq-border-color-light);
      font-size: 24px;
      font-weight: normal;
      color: var(--hzq-text-color-primary);
    }

    h3 {
      margin: 36px 0 14px;
      font-size: 17px;
      color: var(--hzq-text-color-primary);

      .tag-new,
      .tag-change,
      .tag-remove {
        display: inline-block;
        margin-left: 8px;
        padding: 1px 7px;
        border-radius: 3px;
        font-size: 12px;
        font-weight: normal;
        vertical-align: 2px;
      }

      // 标签用半透明底 + 亮色文字，浅色/深色下都能读清
      .tag-new {
        color: #2f9e44;
        background-color: rgba(47, 158, 68, .16);
      }

      .tag-change {
        color: #b26a00;
        background-color: rgba(230, 162, 60, .18);
      }

      .tag-remove {
        color: #c92a2a;
        background-color: rgba(220, 38, 38, .14);
      }
    }

    .theme-dark & {
      .tag-new { color: #6ee7a0; }
      .tag-change { color: #fbbf24; }
      .tag-remove { color: #f87171; }
    }

    p {
      margin: 0 0 12px;
      font-size: 14px;
      line-height: 1.8;
      color: var(--hzq-text-color-regular);
    }

    ul {
      margin: 0 0 16px;
      padding-left: 20px;
      font-size: 14px;
      line-height: 1.9;
      color: var(--hzq-text-color-regular);
    }

    code {
      padding: 2px 6px;
      border-radius: 3px;
      background-color: var(--hzq-fill-color);
      color: var(--hzq-color-primary);
      font-family: Consolas, Monaco, monospace;
      font-size: 13px;
    }

    pre {
      margin: 0 0 18px;
      padding: 16px 20px;
      border-radius: 4px;
      background-color: var(--hzq-fill-color-light);
      overflow-x: auto;

      code {
        padding: 0;
        background: none;
        font-size: 13px;
        line-height: 1.7;
      }
    }

    table {
      width: 100%;
      margin-bottom: 24px;
      border-collapse: collapse;
      font-size: 13px;
      line-height: 1.6;

      th, td {
        padding: 10px 12px;
        border-bottom: 1px solid var(--hzq-border-color-light);
        text-align: left;
        vertical-align: top;
      }

      th {
        color: var(--hzq-text-color-secondary);
        font-weight: normal;
        white-space: nowrap;
      }

      td {
        color: var(--hzq-text-color-regular);
      }

      td code {
        white-space: nowrap;
      }
    }

    .breaking {
      margin: 0 0 18px;
      padding: 14px 18px;
      border-left: 3px solid var(--hzq-color-warning);
      background-color: var(--hzq-color-warning-light-9);
      font-size: 13px;
      line-height: 1.8;
      color: var(--hzq-text-color-regular);
    }
  }

  @media (max-width: 768px) {
    .page-changes {
      padding: 30px 16px 60px;

      h1 {
        font-size: 24px;
      }

      table {
        display: block;
        overflow-x: auto;
      }
    }
  }
</style>
<template>
  <div class="page-container page-changes">
    <h1>改造记录</h1>
    <p class="lead">
      本仓库基于 <a href="https://github.com/ElemeFE/element" target="_blank">Element UI</a> 2.15.14 二次开发，
      在保持 Vue 2 与原有组件 API 的前提下，补齐了深色模式、主题 token、尺寸梯级、金额输入与配置化表单等能力。
      本页按模块记录<strong>相对原版的实际差异</strong>，标注哪些是新增、哪些是行为变更、哪些需要调用方改代码。
    </p>

    <div class="changes-meta">
      对照基线：上游提交 <code>290e68ea</code>（release 2.15.14）→ 本仓库当前工作区，
      共 <code>214</code> 个文件、<code>+21043 / -1342</code> 行。<br>
      统计口径：<code>git diff 290e68ea</code>。组件改动 <code>71</code> 个文件、文档改动 <code>81</code> 个文件。
    </div>

    <div class="changes-summary">
      <div class="changes-card">
        <strong>2</strong>
        <span>新增组件（AmountInput、FormBuilder）</span>
      </div>
      <div class="changes-card">
        <strong>1</strong>
        <span>新增命令式 API（$dialog）</span>
      </div>
      <div class="changes-card">
        <strong>4</strong>
        <span>尺寸档位（large / medium / small / mini）</span>
      </div>
      <div class="changes-card">
        <strong>2</strong>
        <span>主题轴（品牌色 × 明暗模式）</span>
      </div>
    </div>

    <h2>一、新增能力</h2>

    <h3>AmountInput 金额输入<span class="tag-new">新增组件</span></h3>
    <p>
      专为金额场景设计的输入框，<code>v-model</code> 的值统一为<strong>字符串</strong>（用 Number 往返会丢精度）。
      未套用 <code>hzq-input</code>，而是直接持有原生 input，以避免双重 <code>emit</code> 与光标错乱，但样式类名沿用 <code>hzq-input</code> 体系。
    </p>
    <table>
      <tr><th>参数</th><th>说明</th><th>类型</th><th>默认值</th></tr>
      <tr><td><code>precision</code></td><td>小数位数，0 表示只收整数；超出精度的输入直接截断而非四舍五入</td><td>number (0–20 整数)</td><td>2</td></tr>
      <tr><td><code>min</code> / <code>max</code></td><td>取值范围，失焦时硬收敛</td><td>number</td><td>null / Infinity</td></tr>
      <tr><td><code>allowNegative</code></td><td>是否允许负数；为 false 时下限强制为 0，即使传了负的 <code>min</code></td><td>boolean</td><td>false</td></tr>
      <tr><td><code>clearable</code></td><td>是否可清空</td><td>boolean</td><td>false</td></tr>
      <tr><td><code>validateEvent</code></td><td>是否派发 <code>el.form.change</code> / <code>el.form.blur</code></td><td>boolean</td><td>true</td></tr>
    </table>
    <p>
      编辑过程中即时清洗：过滤非数字字符、全角转半角、去掉千分位与货币符号；
      <strong>编辑中不补齐小数位，失焦时才补齐到 <code>precision</code> 位</strong>，输入法组字期间不改写内容。
    </p>

    <h3>FormBuilder 配置化表单<span class="tag-new">新增组件</span></h3>
    <p>
      用一份字段配置数组渲染整个表单。字段组件、props、事件、插槽、校验规则与栅格布局都写在配置里，
      适合「表单很多、结构大同小异」的增删改查页面。详见 <a href="#/zh-CN/component/form-builder">FormBuilder 文档</a>。
    </p>

    <h3>$dialog 命令式弹窗<span class="tag-new">新增 API</span></h3>
    <p>
      新增 <code>Vue.prototype.$dialog(options, renderFn?)</code>，用于替代原先的 <code>$msgbox</code> / <code>$alert</code> / <code>$confirm</code>。
      <code>renderFn</code> 接收 <code>h</code>，优先级高于 <code>content</code>。
    </p>
    <table>
      <tr><th>选项</th><th>说明</th><th>默认值</th></tr>
      <tr><td><code>type</code></td><td><code>'alert'</code>（无底部按钮）或 <code>'confirm'</code>（取消 + 确定）</td><td><code>'alert'</code></td></tr>
      <tr><td><code>content</code></td><td>字符串或 VNode</td><td><code>''</code></td></tr>
      <tr><td><code>maskClose</code> / <code>escClose</code> / <code>showClose</code></td><td>遮罩点击 / ESC / 右上角关闭按钮</td><td>false / true / true</td></tr>
      <tr><td><code>confirm</code> / <code>cancel</code></td><td>回调，可返回 Promise；<code>confirm</code> 的 rejection 会被吞掉</td><td>—</td></tr>
      <tr><td><code>stack</code></td><td>叠在上一个弹窗之上，而不是排队等待</td><td>false</td></tr>
      <tr><td><code>border</code></td><td>header / body / footer 之间加分割线</td><td>false</td></tr>
    </table>
    <p>
      <strong>队列行为</strong>：默认同一时刻只显示一个，后续调用排队，上一个关闭后延迟 500ms 才弹出；<code>stack: true</code> 则立即叠加。
      返回的实例代理提供 <code>visible</code>、<code>loading</code>、<code>close()</code>。
    </p>

    <h2>二、组件行为变更</h2>

    <h3>Dialog 对话框<span class="tag-change">默认行为变更</span></h3>
    <div class="breaking">
      <strong>需要留意：</strong>不传 <code>top</code> 时，对话框从「距顶 15vh」变为<strong>垂直居中</strong>；
      <code>draggable</code> 默认为 <code>true</code>，头部可直接拖动。需要旧行为请显式写 <code>:draggable="false"</code> 并指定 <code>top</code>。
    </div>
    <ul>
      <li>新增 <code>draggable</code>（boolean，默认 <code>true</code>）：拖动时改用绝对定位，<code>afterLeave</code> 时复位。</li>
      <li><code>top</code> 默认值由 <code>'15vh'</code> 改为 <code>''</code>，空值走 flex 垂直居中。</li>
      <li>关闭图标由字体图标改为内联 SVG。</li>
      <li><code>append-to-body</code> 的挂载时机从 <code>mounted</code> 推迟到首次可见。</li>
    </ul>

    <h3>MessageBox 消息弹框<span class="tag-remove">已下线</span></h3>
    <div class="breaking">
      <strong>破坏性变更：</strong><code>MessageBox</code> 已从入口移除 —— <code>src/index.js</code> 不再 import / 注册它，
      <code>Vue.prototype</code> 上的 <code>$msgbox</code>、<code>$alert</code>、<code>$confirm</code>、<code>$prompt</code> 全部删除，
      <code>components.json</code> 与主题 <code>index.scss</code> 也移除了对应条目。
      <code>packages/message-box</code> 源码与对应主题样式已一并删除，无法再按路径引入，必须迁移。
    </div>
    <p>迁移建议：改用 <code>this.$dialog({...})</code> 或 <code>hzq-dialog</code> 组件。</p>

    <h3>Link 文字链接<span class="tag-change">新增属性</span></h3>
    <ul>
      <li>新增 <code>loading</code>（boolean，默认 <code>false</code>）：显示 <code>hzq-icon-loading</code> 替代 <code>icon</code>，<code>href</code> 置空，点击不触发 <code>click</code>，并去掉 hover 下划线。</li>
    </ul>

    <h3>Pagination 分页<span class="tag-change">新增属性</span></h3>
    <ul>
      <li>新增 <code>size</code>（<code>large</code> / <code>medium</code> / <code>small</code> / <code>mini</code>），页码、翻页按钮与跳页输入框统一跟随档位缩放。</li>
      <li><code>small</code> 布尔写法保留，等价于 <code>size="small"</code>。</li>
      <li><strong>默认高度由 28px 变为 32px</strong>（对齐 <code>medium</code> 档），圆角改为跟随按钮圆角。</li>
    </ul>

    <h3>Cascader 级联选择器<span class="tag-change">交互变更</span></h3>
    <ul>
      <li><strong>多选模式下点击行即可勾选/取消叶子节点</strong>（原来多选时点击行只展开）。</li>
      <li>多选标签区改为<strong>单行不换行、溢出省略</strong>，输入框高度锁定在当前尺寸档，不再被标签撑高。</li>
      <li>多选 + <code>filterable</code> 时内层 input 的 placeholder 置空，避免与搜索框重影。</li>
      <li>尺寸映射表新增 <code>large</code> 档，整体下调一档（36 / 32 / 28 / 24）。</li>
    </ul>

    <h3>Select 选择器<span class="tag-change">缺陷修复</span></h3>
    <ul>
      <li>修复可搜索单选在关闭下拉后选中标签丢失的问题（不再清空 <code>selectedLabel</code>）。</li>
      <li>尺寸兜底表新增 <code>large</code>，默认高度由 40px 调整为 32px。</li>
    </ul>

    <h3>DatePicker / DateTimePicker<span class="tag-change">样式变更</span></h3>
    <ul>
      <li>日期面板底部「此刻 / 清除 / 确定」按钮由 <code>mini</code> 改为 <code>small</code>。</li>
      <li>新增 <code>large</code> 尺寸档完整样式。</li>
      <li>范围选择器改为 flex 布局，两个输入框等分剩余宽度。</li>
    </ul>

    <h3>Progress / Rate / Popconfirm / Empty<span class="tag-change">深色模式适配</span></h3>
    <ul>
      <li>内联样式的默认色由写死色值改为 <code>var(--el-*)</code> token，切换主题或深色模式时不再残留浅色。</li>
      <li>Empty 内置插画的 9 档灰改为 <code>--hzq-empty-fill-color-1..9</code>，随明暗模式整组翻转。</li>
      <li><strong>注意：</strong>若代码读取这些 prop 的默认值（如 <code>define-back-color</code>、<code>void-color</code>），现在拿到的是 <code>var(...)</code> 字符串而非色值。</li>
    </ul>

    <h2>三、主题与尺寸体系</h2>

    <h3>主题 token 化<span class="tag-change">结构性变更</span></h3>
    <p>
      新增 <code>common/palette.scss</code>（原始色板）与 <code>common/tokens.scss</code>（语义 token 输出层），
      <code>var.scss</code> 中所有语义色都改为引用 <code>var(--el-*)</code>。每个品牌色输出 13 个变量：
    </p>
    <pre><code>--hzq-color-{name}
--hzq-color-{name}-rgb
--hzq-color-{name}-light-1 ... -light-9
--hzq-color-{name}-hover
--hzq-color-{name}-shade</code></pre>
    <p>
      品牌轴（默认 / <code>.theme-green</code>）× 明暗轴（<code>:root</code> / <code>.theme-dark</code>）按笛卡尔积输出，两类可叠加使用。
      <strong>主色由 <code>#409EFF</code> 改为 <code>#2563eb</code>，danger 由 <code>#F56C6C</code> 改为 <code>#dc2626</code></strong>。
    </p>
    <p>
      深色模式使用带蓝调的 slate 色系（`#0f172a` 页面底 / `#1e293b` 卡片底 / `#243347` 浮层底），
      而不是纯中性灰，面板之间靠明度差分层，详见
      <a href="#/zh-CN/component/custom-theme">自定义主题</a>。
    </p>
    <p>新增运行期工具 <code>src/utils/theme.js</code>，可在浏览器里直接换主题色：</p>
    <pre><code>import { applyTheme, setThemeMode, resetTheme } from 'element-ui/src/utils/theme';

applyTheme({ primary: '#16a34a' });  // 自动推导 light-1..9 / hover / shade
setThemeMode('dark');                // 切换根元素 theme-dark 类
resetTheme();                        // 撤销行内 token，交还编译期主题</code></pre>

    <h3>尺寸梯级<span class="tag-change">结构性变更</span></h3>
    <p>
      四档控件的总高、字号与内容区高度集中在 <code>common/var.scss</code> 的「Size ladder」一组变量里，改一处即可让所有组件同步缩放：
    </p>
    <table>
      <tr><th>档位</th><th>总高</th><th>内容区高度</th><th>字号</th></tr>
      <tr><td><code>large</code></td><td>36px</td><td>34px</td><td>14px</td></tr>
      <tr><td><code>medium</code>（默认）</td><td>32px</td><td>30px</td><td>13px</td></tr>
      <tr><td><code>small</code></td><td>28px</td><td>26px</td><td>12px</td></tr>
      <tr><td><code>mini</code></td><td>24px</td><td>22px</td><td>12px</td></tr>
    </table>
    <div class="breaking">
      <strong>默认值变化：</strong>输入类组件高度 40px → 32px，<code>$--font-size-base</code> 14px → 13px，
      <code>$--border-radius-base</code> 4px → 3px，按钮圆角 6px，Dialog 圆角 12px。
      依赖精确像素的旧页面需要复核。
    </div>

    <h2>四、工具函数</h2>

    <h3>amount.js 金额处理<span class="tag-new">新增</span></h3>
    <p>与 Vue 无关的纯函数模块，可脱离组件单独使用（如表格展示、导出）。</p>
    <table>
      <tr><th>导出</th><th>说明</th></tr>
      <tr><td><code>toHalfWidth</code></td><td>全角数字、<code>．</code>、<code>－</code> 转半角</td></tr>
      <tr><td><code>sanitizeAmount</code></td><td>清洗为编辑态文本：只留数字与至多一个小数点，超精度直接截断</td></tr>
      <tr><td><code>parseAmount</code></td><td>转数字；空串与 <code>-</code> / <code>.</code> / <code>-.</code> 返回 <code>null</code></td></tr>
      <tr><td><code>clampAmount</code></td><td>即时收敛到 <code>[min, max]</code>，但整数部分仍可继续输入时不收敛</td></tr>
      <tr><td><code>normalizeAmount</code></td><td>失焦用：补齐小数位并硬收敛</td></tr>
    </table>

    <h2>五、导入方式变化</h2>
    <ul>
      <li><strong>新增</strong>：<code>AmountInput</code>（<code>ElAmountInput</code>）、<code>FormBuilder</code>（<code>ElFormBuilder</code>）、<code>Vue.prototype.$dialog</code>。</li>
      <li><strong>移除</strong>：<code>MessageBox</code> 及其四个原型方法。</li>
      <li>按需引入清单 <code>components.json</code> 同步增删，<code>web-types.json</code> 与 <code>types/*.d.ts</code> 已更新。</li>
    </ul>
  </div>
</template>
