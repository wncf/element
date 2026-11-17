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
      在保持 Vue 2 与原有组件 API 的前提下，补齐了深色模式、主题 token、尺寸梯级、全局字体、金额输入与配置化表单等能力。
      本页按模块记录<strong>相对原版的实际差异</strong>，标注哪些是新增、哪些是行为变更、哪些需要调用方改代码。
    </p>

    <div class="changes-meta">
      对照基线：上游提交 <code>290e68ea</code>（release 2.15.14）→ 本仓库当前工作区，
      共 <code>759</code> 个文件、<code>+31746 / -23706</code> 行。<br>
      统计口径：<code>git diff 290e68ea</code>。组件改动 <code>277</code> 个文件、文档改动 <code>263</code> 个文件。<br>
      包名 <code>hzq-ui</code>，版本 <code>1.0.0</code>，命名空间由 <code>el-</code> 改为 <code>hzq-</code>。
    </div>

    <div class="changes-summary">
      <div class="changes-card">
        <strong>3</strong>
        <span>新增组件（AmountInput、FormBuilder、SvgIcon）</span>
      </div>
      <div class="changes-card">
        <strong>2</strong>
        <span>下线组件（MessageBox、Popconfirm）</span>
      </div>
      <div class="changes-card">
        <strong>3</strong>
        <span>新增命令式 API（$dialog、$drawer、$tooltip）</span>
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

    <h2>一、命名空间改名</h2>

    <p>
      最根本的一处改造：整库命名空间由 <code>el</code> 改为 <code>hzq</code>，
      使本库能与宿主环境里的官方 <code>element-ui</code> 并存而不互相覆盖。
    </p>
    <table>
      <tr><th>层面</th><th>原版</th><th>本库</th></tr>
      <tr><td>包名</td><td><code>element-ui</code></td><td><code>hzq-ui</code></td></tr>
      <tr><td>CSS 类名</td><td><code>.el-button</code></td><td><code>.hzq-button</code></td></tr>
      <tr><td>CSS 变量</td><td><code>--el-color-primary</code></td><td><code>--hzq-color-primary</code></td></tr>
      <tr><td>组件注册名</td><td><code>ElButton</code></td><td><code>HzqButton</code></td></tr>
      <tr><td>模板标签</td><td><code>&lt;el-button&gt;</code></td><td><code>&lt;hzq-button&gt;</code></td></tr>
      <tr><td>主题类</td><td><code>.theme-dark</code></td><td><code>.hzq-theme-dark</code></td></tr>
      <tr><td>全局配置</td><td><code>$ELEMENT</code></td><td><code>$HZQ</code></td></tr>
      <tr><td>图标字体</td><td><code>element-icons</code></td><td><code>hzq-icons</code></td></tr>
    </table>
    <div class="breaking">
      <strong>破坏性变更：</strong>所有模板标签、类名选择器、CSS 变量引用都要跟着改。
      尤其注意几类<strong>不会报错但会静默失效</strong>的地方：
      <ul>
        <li>JS 里按组件名做的父子通信（<code>componentName: 'HzqCheckbox'</code>、<code>dispatch/broadcast</code> 的目标名）</li>
        <li>局部注册的变量名（<code>components: { HzqInput }</code> 会注册成 <code>hzq-input</code>）</li>
        <li>属性选择器（<code>[class*=hzq-col-]</code>）与 SCSS 插值（<code>--hzq-#{$key}</code>）</li>
        <li>硬编码在 JS 字符串里的类名（如 <code>querySelector('.hzq-autocomplete-suggestion__list')</code>）</li>
      </ul>
    </div>
    <p>
      <code>packages.json</code> 版本号同步改为 <code>1.0.0</code> —— API 已有破坏性变更，
      沿用 <code>2.15.x</code> 会让人误以为可以无缝替换原版。
    </p>

    <h2>二、新增能力</h2>

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

    <h3>SvgIcon 业务图标<span class="tag-new">新增组件</span></h3>
    <p>
      用于接入业务方自己的 SVG 图标，与系统内置的 iconfont 图标命名空间互相隔离。
      采用 <strong>svg-sprite</strong> 方案：使用方的 <code>svg-sprite-loader</code> 把 SVG 打成
      <code>&lt;symbol id="icon-[name]"&gt;</code>，组件用 <code>&lt;use&gt;</code> 引用，
      现有构建配置无需改造，也不会让每个图标内联一份 <code>&lt;path&gt;</code> 撑大 DOM。
    </p>
    <pre><code>import { registerSvgIcons } from 'hzq-ui/packages/svg-icon';

// 前缀必填，且不能是 el / hzq
registerSvgIcons(['base-arrow', 'base-book'], { prefix: 'crm' });
// 结果：crm-base-arrow、crm-base-book</code></pre>
    <p>
      也可以直接在初始化时传入：<code>Vue.use(HZQUI, { svgIcons: { prefix: 'crm', icons } })</code>。
      注册时校验前缀合法性，同名图标重复注册会抛错（传 <code>{ silent: true }</code> 则只告警并跳过）。
    </p>
    <p>使用：<code>&lt;hzq-svg-icon name="crm-base-arrow" size="24px" /&gt;</code>，<code>size</code> 默认 <code>1em</code> 跟随字号。</p>

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

    <h3>$drawer 函数式抽屉<span class="tag-new">新增 API</span></h3>
    <p>
      新增 <code>Vue.prototype.$drawer(options, renderFn?)</code>，与 <code>$dialog</code> 同一套队列与实例代理机制，
      但对应 <code>hzq-drawer</code>，多了尺寸与方向控制。两者各自维护独立队列，互不阻塞。
    </p>
    <table>
      <tr><th>选项</th><th>说明</th><th>默认值</th></tr>
      <tr><td><code>type</code></td><td><code>'alert'</code>（无底部按钮）或 <code>'confirm'</code>（取消 + 确定）</td><td><code>'alert'</code></td></tr>
      <tr><td><code>size</code></td><td>尺寸，数字补 <code>px</code>，百分比原样使用</td><td><code>''</code></td></tr>
      <tr><td><code>direction</code></td><td><code>ltr</code> / <code>rtl</code> / <code>ttb</code> / <code>btt</code></td><td><code>'rtl'</code></td></tr>
      <tr><td><code>content</code></td><td>字符串或 VNode</td><td><code>''</code></td></tr>
      <tr><td><code>maskClose</code> / <code>escClose</code> / <code>showClose</code></td><td>遮罩点击 / ESC / 右上角关闭按钮</td><td>false / true / true</td></tr>
      <tr><td><code>withHeader</code></td><td>是否渲染头部</td><td>true</td></tr>
      <tr><td><code>confirm</code> / <code>cancel</code></td><td>回调，可返回 Promise；<code>confirm</code> 的 rejection 会被吞掉</td><td>—</td></tr>
      <tr><td><code>stack</code></td><td>叠在上一个抽屉之上，而不是排队等待</td><td>false</td></tr>
      <tr><td><code>border</code></td><td>面板加边框样式</td><td>false</td></tr>
    </table>
    <div class="breaking">
      <strong>使用限制：</strong><code>hzq-drawer</code> 只有 <code>title</code> 与默认插槽，没有 <code>footer</code> 插槽。
      <code>type: 'confirm'</code> 的按钮追加在内容之后，不会固定在面板底部；需要固定底部时请自行控制布局。
    </div>

    <h3>v-tooltip 指令与 $tooltip<span class="tag-new">新增 API</span></h3>
    <p>
      新增单行省略 + 溢出提示能力，用于表格单元格、列表标题等<strong>宽度受限、文字可能被截断</strong>的场景。
      指令给元素注入 <code>overflow: hidden; text-overflow: ellipsis; white-space: nowrap</code>，
      悬浮时用 <code>scrollWidth &gt; clientWidth</code>（容差 1px，含直接子节点）判断是否真的被截断，
      <strong>只有被截断才提示</strong>。
    </p>
    <pre v-pre><code>&lt;!-- 内容取元素文本，仅在截断时提示 --&gt;
&lt;span v-tooltip style="width: 220px;"&gt;{{ row.remark }}&lt;/span&gt;

&lt;!-- 用绑定值作为提示内容 --&gt;
&lt;span v-tooltip="row.remark" style="width: 220px;"&gt;{{ row.remark }}&lt;/span&gt;

&lt;!-- 悬浮即提示，不判断溢出 --&gt;
&lt;hzq-button v-tooltip.always="'刷新'"&gt;图标按钮&lt;/hzq-button&gt;</code></pre>
    <table>
      <tr><th>写法</th><th>说明</th></tr>
      <tr><td><code>v-tooltip</code></td><td>内容取元素文本，溢出时才提示，注入省略样式</td></tr>
      <tr><td><code>v-tooltip="text"</code></td><td>用绑定值（String / Number）作为提示内容</td></tr>
      <tr><td><code>v-tooltip="{ ... }"</code></td><td>对象写法：<code>content</code>、<code>placement</code>、<code>effect</code>、<code>maxWidth</code>、<code>offset</code>、<code>popperClass</code>、<code>delay</code>、<code>disabled</code>、<code>always</code>、<code>ellipsis</code></td></tr>
      <tr><td><code>v-tooltip:bottom-start</code></td><td>指令参数指定方向</td></tr>
      <tr><td><code>v-tooltip.always</code></td><td>悬浮即提示，不判断溢出</td></tr>
      <tr><td><code>v-tooltip.ellipsis</code></td><td>强制注入省略样式（配合 <code>.always</code> 使用）</td></tr>
      <tr><td><code>v-tooltip.no-ellipsis</code></td><td>不注入省略样式</td></tr>
      <tr><td><code>v-tooltip.light</code></td><td>浅色主题</td></tr>
    </table>
    <p>
      配置优先级：<strong>对象字段 &gt; 修饰符 / 指令参数 &gt; 默认值</strong>。默认延迟 <code>200ms</code>。
      指令底层是命令式的 <code>Vue.prototype.$tooltip(options)</code>，返回 <code>{ hide(), update() }</code>，
      鼠标离开后自动关闭，也可以手动控制：
    </p>
    <pre><code>const handle = this.$tooltip({
  target: this.$refs.el.$el,
  content: '完整提示文字',
  placement: 'top',   // 默认 top
  effect: 'dark',     // dark | light
  maxWidth: 360
});
handle.update();     // 重新定位
handle.hide();       // 主动关闭</code></pre>
    <div class="breaking">
      <strong>使用限制：</strong>
      <ul>
        <li><code>$tooltip</code> 是<strong>全局单例</strong>，同一时刻只有一个提示，重复调用会替换上一个。</li>
        <li>注入的是<strong>行内样式</strong>，<code>unbind</code> 时按原值还原；会覆盖元素原有的 <code>overflow</code> / <code>text-overflow</code> / <code>white-space</code>。</li>
        <li><strong>不修改 <code>display</code></strong>：<code>&lt;span&gt;</code>、<code>&lt;a&gt;</code> 等 inline 元素上 <code>text-overflow</code> 不生效，需自行设 <code>display: inline-block</code> 并给出宽度。</li>
        <li>元素没有宽度约束时不会截断，也就不会提示——这是有意为之，避免短文本也弹浮层。</li>
        <li>浮层<strong>可移入</strong>：离开触发元素后有 <code>150ms</code> 缓冲，期间移入浮层即可停留并<strong>选中复制完整文字</strong>；拖选过程中鼠标划出浮层也不会关闭。</li>
      </ul>
    </div>
    <p>
      <strong>v-for / 大表格场景</strong>：浮层是全局单例，无论列表渲染多少元素，body 下始终只有一个
      <code>.hzq-tooltip__popper</code> 节点，隐藏时保留复用，<strong>不随元素数量增长</strong>。
      每元素只多挂一个状态对象和 2 个事件监听，溢出检测仅在 <code>mouseenter</code> 时计算；
      元素被移除（删除、分页、虚拟滚动回收）时，指令会解绑监听并释放单例对它的引用。
      不要在同一个元素上同时使用 <code>v-tooltip</code> 与表格列的 <code>show-overflow-tooltip</code> ——
      后者是每个单元格一个 <code>hzq-tooltip</code> 组件实例，与单例浮层叠加会重复提示。
    </p>

    <h2>三、组件行为变更</h2>

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

    <h3>Popconfirm 气泡确认框<span class="tag-remove">已下线</span></h3>
    <div class="breaking">
      <strong>破坏性变更：</strong><code>Popconfirm</code> 已整体移除 —— <code>src/index.js</code> 不再 import / 注册，
      <code>components.json</code>、主题 <code>index.scss</code>、<code>web-types.json</code> 与 <code>types/element-ui.d.ts</code>
      的对应条目一并删除，<code>types/popconfirm.d.ts</code> 已删除，四个语种的文档页与侧边栏入口也已摘除。
      <code>packages/popconfirm</code> 源码与 <code>theme-chalk/src/popconfirm.scss</code> 已删除，无法再按路径引入。
    </div>
    <p>
      下线原因：它只是「<code>trigger="click"</code> 的 Popover + 一行文字 + 两个按钮」的语法糖，
      自身没有定位、弹层或样式能力（源码仅 104 行，样式 12 行布局），<code>content</code> 属性还被明确忽略，
      用 <code>hzq-popover</code> 加插槽即可等价实现，独立的组件、类型、四语文档与测试的维护成本高于其便利性。
    </p>
    <p>迁移建议：改用 <code>hzq-popover</code>，内容区自行放文案与按钮：</p>
    <pre><code>&lt;hzq-popover trigger="click" width="220"&gt;
  &lt;div&gt;
    &lt;p&gt;确定删除该项吗？&lt;/p&gt;
    &lt;div style="text-align: right"&gt;
      &lt;hzq-button size="mini" type="text"&gt;取消&lt;/hzq-button&gt;
      &lt;hzq-button size="mini" type="primary"&gt;确定&lt;/hzq-button&gt;
    &lt;/div&gt;
  &lt;/div&gt;
  &lt;hzq-button slot="reference" type="danger"&gt;删除&lt;/hzq-button&gt;
&lt;/hzq-popover&gt;</code></pre>
    <p>
      语言包中的 <code>el.popconfirm.confirmButtonText</code> / <code>cancelButtonText</code> 已从全部 60 个语言包移除，
      迁移后需要自行提供按钮文案。
    </p>

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
      <li><strong>启用 <code>checkStrictly</code> 时，非叶子节点也支持点击整行选中</strong>，单选与多选行为一致；不再需要精确点中左侧的单选/复选框图标。</li>
      <li>多选标签区改为<strong>单行不换行、溢出省略</strong>，输入框高度锁定在当前尺寸档，不再被标签撑高。</li>
      <li>尺寸映射表新增 <code>large</code> 档，整体下调一档（36 / 32 / 28 / 24）。</li>
    </ul>

    <h3>Cascader 可搜索改版<span class="tag-change">破坏性变更</span></h3>
    <div class="breaking">
      <strong>需要留意：</strong>启用 <code>filterable</code> 后，<strong>主输入框不再接受手动输入</strong>（固定只读），
      只在框内展示已选值。筛选统一改到下拉面板顶部的常驻搜索框。
      依赖「在输入框里直接打字筛选」的业务代码需要调整使用方式。
    </div>
    <ul>
      <li>面板顶部新增常驻搜索框，占位文案由 <code>el.cascader.searchPlaceholder</code> 提供（默认「请输入搜索词」）。</li>
      <li>输入关键词后，整个面板替换为<strong>扁平结果列表</strong>，每项显示完整路径（如「续期 / 鞋子」），当前选中项右侧打勾。</li>
      <li>无匹配结果时展示<strong>「暂无内容」</strong>（新增 <code>el.cascader.noContent</code>，原「无匹配数据」保留给 <code>noMatch</code>）。</li>
      <li>清空搜索词后自动恢复到级联面板。</li>
      <li>多选模式下不再向标签区插入内嵌搜索输入框，标签与搜索框完全分离。</li>
      <li>全部 60 个语言包同步补充 <code>searchPlaceholder</code> 与 <code>noContent</code> 两个键。</li>
    </ul>

    <h3>Cascader 多选标签尺寸<span class="tag-change">样式变更</span></h3>
    <ul>
      <li>标签高度改为按输入框档位<strong>减 6px</strong>，避免顶到输入框的上下边框：large 30px、medium 26px、small 22px、mini 18px。</li>
      <li>标签的尺寸修饰符仍跟随 <code>size</code>（内边距、字号、关闭图标缩放），仅高度由 cascader 样式覆盖。</li>
    </ul>

    <h3>Select 选择器<span class="tag-change">缺陷修复</span></h3>
    <ul>
      <li>修复可搜索单选在关闭下拉后选中标签丢失的问题（不再清空 <code>selectedLabel</code>）。</li>
      <li>尺寸兜底表新增 <code>large</code>，默认高度由 40px 调整为 32px。</li>
      <li><strong>新增 <code>options</code> 属性</strong>：传入选项数组即可渲染，无需手写 <code>hzq-option</code>；支持 <code>label</code> / <code>value</code> / <code>disabled</code> / <code>key</code> 以及 <code>render(h, option)</code> 自定义下拉内容。</li>
      <li>传入非空 <code>options</code> 时忽略默认插槽；传空数组或不传时仍走插槽渲染。</li>
      <li><code>render</code> 只影响下拉列表的展示，筛选与已选值仍使用 <code>label</code>。</li>
    </ul>
    <div class="breaking">
      <strong>内部结构调整：</strong>组件内部用于收集 <code>HzqOption</code> 实例的数组由 <code>options</code> 改名为 <code>optionInstances</code>，
      <code>options</code> 这个名字让给新增的 prop。仅影响直接读取组件内部状态（如 <code>this.$refs.select.options</code>）的代码；
      常规用法中插槽选项的写法完全不变。
    </div>

    <h3>Tabs 标签页<span class="tag-change">破坏性变更</span></h3>
    <div class="breaking">
      <strong>需要留意：</strong>面板默认改为「切走即销毁」—— 切走的标签页内容会从 DOM 移除，
      再次进入时重新挂载，<strong>表单输入、滚动位置、组件内部状态都会丢失</strong>。
      需要保留状态请给该 <code>hzq-tab-pane</code> 显式加 <code>load="lazy"</code>。
    </div>
    <ul>
      <li>新增 <code>hzq-tab-pane</code> 的 <code>load</code> 属性（string，默认 <code>'once'</code>）：
        <code>once</code> 只在激活期间挂载；<code>lazy</code> 首次激活时挂载并一直保留；<code>all</code> 首屏全部挂载并一直保留。</li>
      <li>移除 <code>hzq-tab-pane</code> 的 <code>lazy</code> 属性，改用 <code>load="lazy"</code>。</li>
      <li>移除 <code>hzq-tabs</code> 的 <code>stretch</code> 属性。</li>
      <li>标签栏改为 flex 布局，宽度<strong>按内容自适应</strong>，不再撑满容器；右侧留白可用于放置操作按钮。</li>
      <li>移除 <code>.hzq-tabs__nav-wrap::after</code> 底部横线，需要横线请在使用方自行通过 CSS 添加。</li>
      <li><code>type="card"</code> 改为分段控件造型：外层浅色圆角容器 + 内嵌圆角选中块，与内容区之间不再有连线。</li>
    </ul>
    <p>
      不受控场景（不传 <code>v-model</code> / <code>value</code>）且面板均显式命名时，
      现在会自动回落到第一个面板，不会出现一个面板都不渲染的情况。
    </p>

    <h3>Upload 上传<span class="tag-change">破坏性变更</span></h3>
    <div class="breaking">
      <strong>破坏性变更：</strong>移除 <code>list-type</code>、<code>show-file-list</code>、<code>on-preview</code> 三个属性，
      内置的文件列表（<code>upload-list.vue</code> 与 <code>hzq-upload-list</code> 样式块）一并删除。
      文件列表改由新增的 <code>file-list</code> 作用域插槽自行渲染，布局与样式完全交给调用方。
    </div>
    <ul>
      <li>新增 <code>file-list</code> 作用域插槽，参数 <code>{ list }</code>，为文件对象数组；不写该插槽即不显示列表（等价于旧的 <code>:show-file-list="false"</code>）。</li>
      <li>插槽内容作为触发器与 <code>tip</code> 的<strong>兄弟节点</strong>渲染，组件不包裹容器、不规定上下位置。卡片墙等需要与触发器平行的场景，给根节点加 <code>display: inline-flex; flex-wrap: wrap</code> 即可。</li>
      <li>新增公开方法 <code>remove(file)</code>：用户在自己的删除按钮里调用，组件负责中断请求、从列表移除并触发 <code>on-remove</code>，同时仍然遵守 <code>before-remove</code> 的拦截。</li>
      <li><strong>列表区域不再触发文件选择框</strong>：点击事件只绑在触发器的 <code>.hzq-upload</code> 根节点上，列表已是它的兄弟节点。</li>
      <li>所有文件统一通过 <code>URL.createObjectURL</code> 生成 <code>url</code> 作为预览地址（原先仅 <code>picture</code> / <code>picture-card</code> 生成），组件销毁时统一 revoke；非图片文件忽略该字段即可。</li>
      <li>移除根节点上的 <code>hzq-upload--{listType}</code> 修饰类与对应样式，照片墙的虚线框改由调用方自行实现。</li>
      <li>旧属性会通过 Migrating 混入在控制台给出废弃提示。</li>
    </ul>
    <p>迁移建议：把原来的 <code>list-type="text"</code> 列表替换为插槽渲染，删除改用 <code>remove(file)</code>：</p>
    <pre v-pre><code>&lt;hzq-upload ref="upload" action="/api/upload" :file-list="files"&gt;
  &lt;hzq-button&gt;点击上传&lt;/hzq-button&gt;

  &lt;template slot="file-list" slot-scope="{ list }"&gt;
    &lt;ul class="my-list"&gt;
      &lt;li v-for="item in list" :key="item.uid"&gt;
        {{ item.name }}
        &lt;span v-if="item.status === 'uploading'"&gt;{{ item.percentage }}%&lt;/span&gt;
        &lt;i class="hzq-icon-close" @click="$refs.upload.remove(item)"&gt;&lt;/i&gt;
      &lt;/li&gt;
    &lt;/ul&gt;
  &lt;/template&gt;
&lt;/hzq-upload&gt;</code></pre>
    <p>
      文件对象字段保持不变：<code>uid</code> / <code>name</code> / <code>size</code> /
      <code>status</code>（<code>ready</code> / <code>uploading</code> / <code>success</code> / <code>fail</code>）/
      <code>percentage</code> / <code>raw</code> / <code>url</code> / <code>response</code>。
    </p>

    <h3>DatePicker / DateTimePicker<span class="tag-change">样式变更</span></h3>
    <ul>
      <li>日期面板底部「此刻 / 清除 / 确定」按钮由 <code>mini</code> 改为 <code>small</code>。</li>
      <li>新增 <code>large</code> 尺寸档完整样式。</li>
      <li>范围选择器改为 flex 布局，两个输入框等分剩余宽度。</li>
      <li>面板视觉参考 view-design 重构：日期/月份/年份统一 14px 字号与 32×32 圆角方块单元格，悬停改为浅色底，今天改用右上角小圆点。</li>
      <li>范围选中条由圆角胶囊改为平铺连续色带（<code>background-clip: content-box</code> 实现上下内缩 2px）。</li>
      <li>去掉标题下方的分隔线，标题与日历间距收紧；区间面板内边距与单日期面板对齐。</li>
    </ul>
    <div class="breaking">
      <strong>尺寸变化：</strong>为容纳更大的单元格，面板宽度调整 —— 单日期 <code>322px → 256px</code>（含侧栏 <code>438 → 372</code>），
      日期区间 <code>520px → 508px</code>。若有页面依赖原面板宽度做定位或并排布局，需要复核。
    </div>

    <h3>Progress / Rate / Empty<span class="tag-change">深色模式适配</span></h3>
    <ul>
      <li>内联样式的默认色由写死色值改为 <code>var(--el-*)</code> token，切换主题或深色模式时不再残留浅色。</li>
      <li><strong>Popconfirm</strong> 原有的深色适配随组件下线一并移除，见上文「Popconfirm 气泡确认框」。</li>
      <li>Empty 内置插画的 9 档灰改为 <code>--hzq-empty-fill-color-1..9</code>，随明暗模式整组翻转。</li>
      <li><strong>注意：</strong>若代码读取这些 prop 的默认值（如 <code>define-back-color</code>、<code>void-color</code>），现在拿到的是 <code>var(...)</code> 字符串而非色值。</li>
    </ul>

    <h2>四、主题与尺寸体系</h2>

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
      深色模式使用带蓝调的 slate 色系（<code>#0f172a</code> 页面底 / <code>#1e293b</code> 卡片底 / <code>#243347</code> 浮层底），
      而不是纯中性灰，面板之间靠明度差分层。中性色板定义在
      <code>common/palette.scss</code> 的 <code>$--neutrals-dark</code>，改这一处即可整体换色。
    </p>
    <p>新增运行期工具 <code>src/utils/theme.js</code>，可在浏览器里直接换主题色：</p>
    <pre><code>import { applyTheme, setThemeMode, resetTheme } from 'hzq-ui/src/utils/theme';

applyTheme({ primary: '#16a34a' });  // 自动推导 light-1..9 / hover / shade
setThemeMode('dark');                // 切换 hzq-theme-dark 类
resetTheme();                        // 撤销行内 token，交还编译期主题</code></pre>

    <h3>作用域隔离<span class="tag-new">新增能力</span></h3>
    <p>
      微前端场景下子应用与宿主共用同一个 <code>document.documentElement</code>，
      token 默认挂在 <code>:root</code> 会导致子应用切主题时把宿主一起改掉。
      为此 token 的根选择器抽成了 SCSS 变量 <code>$--token-scope</code>（默认 <code>:root</code>），
      运行期对应 <code>configureThemeScope(selector)</code>：
    </p>
    <pre><code>// 构建期（SCSS）
$--token-scope: '[data-hzq-scope]';

// 运行期（JS）
import { configureThemeScope } from 'hzq-ui/src/utils/theme';
configureThemeScope('[data-hzq-scope]');</code></pre>
    <p>
      产物中所有 token 会变成 <code>[data-hzq-scope]{ --hzq-color-primary: ... }</code>，
      明暗与品牌预设自动拼在其后（<code>[data-hzq-scope].hzq-theme-dark</code> 等），
      不再出现裸 <code>:root</code>。两处选择器必须一致，否则 JS 读不到 CSS 里的 token。
    </p>

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

    <h3>全局字体<span class="tag-change">结构性变更</span></h3>
    <p>
      字体族统一改为 <strong>Noto Sans SC</strong>，定义在 <code>common/var.scss</code> 的
      <code>$--font-family</code>，改这一处即可整体换字体：
    </p>
    <pre><code>$--font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI',
  'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue',
  Helvetica, Arial, sans-serif !default;</code></pre>
    <p>
      生效范围是 <code>body</code> 与 <code>button</code> / <code>input</code> /
      <code>select</code> / <code>textarea</code> 四个原生表单控件 —— 这几类元素不继承
      <code>body</code> 的字体，必须显式声明。
    </p>
    <div class="breaking">
      <strong>字体文件不在库内加载。</strong><code>@font-face</code> 由使用方的宿主环境提供
      （main-app 与 crmx-web 都已在入口样式里引入 Noto Sans SC 变量字体），
      组件库只声明字体栈，避免重复下载。若在未引入该字体的页面单独使用，会回退到
      <code>PingFang SC</code> / <code>Microsoft YaHei</code> 等系统字体。
    </div>
    <p>
      另外修正了 <code>statistic</code> 的货币/数字容器：原来写死
      <code>font-family: Sans-serif</code> 会绕开全局字体，现改为 <code>inherit</code>。
    </p>

    <h2>五、工具函数</h2>

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

    <h2>六、导入方式变化</h2>
    <ul>
      <li><strong>新增</strong>：<code>AmountInput</code>（<code>ElAmountInput</code>）、<code>FormBuilder</code>（<code>ElFormBuilder</code>）、<code>Vue.prototype.$dialog</code>、<code>Vue.prototype.$drawer</code>。</li>
      <li><strong>移除</strong>：<code>MessageBox</code> 及其四个原型方法；<code>Popconfirm</code>（改用 <code>Popover</code> 自行组装）。</li>
      <li>按需引入清单 <code>components.json</code> 同步增删，<code>web-types.json</code> 与 <code>types/*.d.ts</code> 已更新。</li>
    </ul>

    <h2>七、构建配置</h2>

    <h3>dart-sass 替换 node-sass<span class="tag-change">构建变更</span></h3>
    <p>
      <code>node-sass</code> 是原生模块，必须匹配 Node ABI 且需要预编译二进制，在 Windows 上还要 Python 2 兜底编译。
      改为纯 JS 的 <code>sass</code>（dart-sass）后，安装不再依赖编译工具链，换 Node 版本或换机器都无需额外处理。
    </p>
    <table>
      <tr><th>依赖</th><th>变化</th></tr>
      <tr><td><code>node-sass</code></td><td>移除</td></tr>
      <tr><td><code>sass</code></td><td>新增，锁定 <code>&gt;=1.32.13 &lt;1.61.0</code>（1.61 起要求 Node 14+）</td></tr>
      <tr><td><code>gulp-sass</code></td><td><code>^4.0.2 → ^5.1.0</code>，5.x 不再依赖 node-sass</td></tr>
      <tr><td><code>sass-loader</code></td><td>保持 <code>^7.1.0</code>，通过 <code>implementation</code> 选项指定实现</td></tr>
    </table>
    <ul>
      <li>断点 map 的值统一改为字符串：dart-sass 插值 map 时不会展开成 <code>max-width: 767px</code>，<code>res()</code> mixin 同时去掉 <code>inspect()</code>。</li>
      <li>全部除法改用 <code>math.div()</code>，<code>!global</code> 守卫变量改为 <code>!default</code> 声明后再赋值，消除全部 dart-sass 弃用警告。</li>
      <li>play 页面的 <code>&gt;&gt;&gt;</code> 深度选择器改为 <code>::v-deep</code>，原写法会被 sass 判为非法选择器而整条丢弃。</li>
    </ul>
    <p>
      <strong>产物一致性：</strong>替换后与 node-sass 逐条比对，2843 个选择器的声明内容完全一致，
      差异仅为引号、小数前导零、百分比精度、图标字符转义等格式层面。
    </p>

    <h2>八、开发指南</h2>

    <h3>浮层层级管理<span class="tag-new">新增文档</span></h3>
    <p>
      补充浮层层级的统一说明：静态 Sass 变量（<code>$--index-normal</code> / <code>$--index-top</code> / <code>$--index-popper</code>）、
      <code>PopupManager</code> 的运行时取号与弹窗栈、以及新浮层组件接入 <code>Popup</code> / <code>vue-popper</code> mixin 的方式。
    </p>
    <p>核心约束：不要写死大数字 <code>z-index</code>，浮层必须追加到 <code>body</code>，祖先元素带 <code>transform</code> 会让内部 <code>z-index</code> 失效。</p>
  </div>
</template>
