<template>
  <div
    class="demo-block"
    :class="[blockClass, { 'hover': hovering }]"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false">
    <div class="source">
      <slot name="source"></slot>
    </div>
    <div class="meta" ref="meta">
      <div class="description" v-if="$slots.default">
        <slot></slot>
      </div>
      <div class="highlight">
        <slot name="highlight"></slot>
      </div>
    </div>
    <div
      class="demo-block-control"
      ref="control"
      :class="{ 'is-fixed': fixedControl }"
      @click="isExpanded = !isExpanded">
      <transition name="arrow-slide">
        <i :class="[iconClass, { 'hovering': hovering }]"></i>
      </transition>
      <transition name="text-slide">
        <span v-show="hovering">{{ controlText }}</span>
      </transition>
      <hzq-tooltip effect="dark" :content="langConfig['tooltip-text']" placement="right">
        <transition name="text-slide">
          <hzq-button
            v-show="hovering || isExpanded"
            size="small"
            type="text"
            class="control-button"
            @click.stop="goCodepen">
            {{ langConfig['button-text'] }}
          </hzq-button>
        </transition>
      </hzq-tooltip>
    </div>
  </div>
</template>

<style lang="scss">
  .demo-block {
    border: solid 1px var(--hzq-border-color-base);
    border-radius: 3px;
    transition: .2s;

    &.hover {
      box-shadow: 0 0 8px 0 rgba(232, 237, 250, .6), 0 2px 4px 0 rgba(232, 237, 250, .5);
    }

    code {
      font-family: Menlo, Monaco, Consolas, Courier, monospace;
    }

    .demo-button {
      float: right;
    }

    .source {
      padding: 24px;
    }

    .meta {
      background-color: var(--hzq-fill-color-light);
      border-top: solid 1px var(--hzq-border-color-light);
      overflow: hidden;
      height: 0;
      transition: height .2s;
    }

    .description {
      padding: 20px;
      box-sizing: border-box;
      border: solid 1px var(--hzq-border-color-base);
      border-radius: 3px;
      font-size: 14px;
      line-height: 22px;
      color: var(--hzq-text-color-regular);
      word-break: break-word;
      margin: 10px;
      background-color: var(--hzq-bg-color);

      p {
        margin: 0;
        line-height: 26px;
      }

      code {
        color: var(--hzq-text-color-regular);
        background-color: var(--hzq-color-primary-light-9);
        margin: 0 4px;
        display: inline-block;
        padding: 1px 5px;
        font-size: 12px;
        border-radius: 3px;
        height: 18px;
        line-height: 18px;
      }
    }

    .highlight {
      pre {
        margin: 0;
      }

      code.hljs {
        margin: 0;
        border: none;
        max-height: none;
        border-radius: 0;

        &::before {
          content: none;
        }
      }
    }

    .demo-block-control {
      border-top: solid 1px var(--hzq-border-color-light);
      height: 44px;
      box-sizing: border-box;
      background-color: var(--hzq-bg-color);
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      text-align: center;
      margin-top: -1px;
      color: var(--hzq-text-color-placeholder);
      cursor: pointer;
      position: relative;
    
      &.is-fixed {
        position: fixed;
        bottom: 0;
        width: 868px;
      }

      i {
        font-size: 16px;
        line-height: 44px;
        transition: .3s;
        &.hovering {
          transform: translateX(-40px);
        }
      }

      > span {
        position: absolute;
        transform: translateX(-30px);
        font-size: 14px;
        line-height: 44px;
        transition: .3s;
        display: inline-block;
      }

      &:hover {
        color: #409EFF;
        background-color: var(--hzq-fill-color-light);
      }

      & .text-slide-enter,
      & .text-slide-leave-active {
        opacity: 0;
        transform: translateX(10px);
      }
      
      .control-button {
        line-height: 26px;
        position: absolute;
        top: 0;
        right: 0;
        font-size: 14px;
        padding-left: 5px;
        padding-right: 25px;
      }
    }

    /* 深色模式：代码高亮主题来自 CDN 的 color-brewer.css，是浅色的固定色板，
       无法逐条 token 化，这里整体压暗底色并提亮文字，避免深色页里出现白块 */
    .theme-dark & {
      box-shadow: none;

      .meta {
        background-color: var(--hzq-fill-color-lighter);
        border-top-color: var(--hzq-border-color-light);
      }

      .description {
        background-color: var(--hzq-bg-color);
        border-color: var(--hzq-border-color-light);
        color: var(--hzq-text-color-regular);
      }

      code.hljs {
        background-color: var(--hzq-fill-color-lighter) !important;
        border-color: var(--hzq-border-color-light) !important;
        color: var(--hzq-text-color-regular) !important;

        .hljs-keyword,
        .hljs-selector-tag,
        .hljs-built_in,
        .hljs-name,
        .hljs-tag {
          color: #7dd3fc !important;
        }

        .hljs-string,
        .hljs-title,
        .hljs-section,
        .hljs-attribute,
        .hljs-literal,
        .hljs-template-tag,
        .hljs-template-variable,
        .hljs-type,
        .hljs-addition {
          color: #86efac !important;
        }

        .hljs-comment,
        .hljs-quote,
        .hljs-deletion,
        .hljs-meta {
          color: #94a3b8 !important;
        }

        .hljs-number,
        .hljs-symbol,
        .hljs-bullet,
        .hljs-link,
        .hljs-variable,
        .hljs-attr {
          color: #fca5a5 !important;
        }
      }
    }
  }
</style>

<script type="text/babel">
  import compoLang from '../i18n/component.json';
  import Element from 'main/index.js';
  import { stripScript, stripStyle, stripTemplate } from '../util';
  const { version } = Element;

  export default {
    data() {
      return {
        codepen: {
          script: '',
          html: '',
          style: ''
        },
        hovering: false,
        isExpanded: false,
        fixedControl: false,
        scrollParent: null
      };
    },

    methods: {
      goCodepen() {
        // since 2.6.2 use code rather than jsfiddle https://blog.codepen.io/documentation/api/prefill/
        const { script, html, style } = this.codepen;
        const resourcesTpl = '<scr' + 'ipt src="//unpkg.com/vue@2/dist/vue.js"></scr' + 'ipt>' +
        '\n<scr' + `ipt src="//unpkg.com/element-ui@${ version }/lib/index.js"></scr` + 'ipt>';
        let jsTpl = (script || '').replace(/export default/, 'var Main =').trim();
        let htmlTpl = `${resourcesTpl}\n<div id="app">\n${html.trim()}\n</div>`;
        let cssTpl = `@import url("//unpkg.com/element-ui@${ version }/lib/theme-chalk/index.css");\n${(style || '').trim()}\n`;
        jsTpl = jsTpl
          ? jsTpl + '\nvar Ctor = Vue.extend(Main)\nnew Ctor().$mount(\'#app\')'
          : 'new Vue().$mount(\'#app\')';
        const data = {
          js: jsTpl,
          css: cssTpl,
          html: htmlTpl
        };
        const form = document.getElementById('fiddle-form') || document.createElement('form');
        while (form.firstChild) {
          form.removeChild(form.firstChild);
        }
        form.method = 'POST';
        form.action = 'https://codepen.io/pen/define/';
        form.target = '_blank';
        form.style.display = 'none';

        const input = document.createElement('input');
        input.setAttribute('name', 'data');
        input.setAttribute('type', 'hidden');
        input.setAttribute('value', JSON.stringify(data));

        form.appendChild(input);
        document.body.appendChild(form);

        form.submit();
      },

      scrollHandler() {
        const { top, bottom, left } = this.$refs.meta.getBoundingClientRect();
        this.fixedControl = bottom > document.documentElement.clientHeight &&
          top + 44 <= document.documentElement.clientHeight;
        this.$refs.control.style.left = this.fixedControl ? `${ left }px` : '0';
      },

      removeScrollHandler() {
        this.scrollParent && this.scrollParent.removeEventListener('scroll', this.scrollHandler);
      }
    },

    computed: {
      lang() {
        return this.$route.path.split('/')[1];
      },

      langConfig() {
        return compoLang.filter(config => config.lang === this.lang)[0]['demo-block'];
      },

      blockClass() {
        return `demo-${ this.lang } demo-${ this.$router.currentRoute.path.split('/').pop() }`;
      },

      iconClass() {
        return this.isExpanded ? 'hzq-icon-caret-top' : 'hzq-icon-caret-bottom';
      },

      controlText() {
        return this.isExpanded ? this.langConfig['hide-text'] : this.langConfig['show-text'];
      },

      codeArea() {
        return this.$el.getElementsByClassName('meta')[0];
      },

      codeAreaHeight() {
        if (this.$el.getElementsByClassName('description').length > 0) {
          return this.$el.getElementsByClassName('description')[0].clientHeight +
            this.$el.getElementsByClassName('highlight')[0].clientHeight + 20;
        }
        return this.$el.getElementsByClassName('highlight')[0].clientHeight;
      }
    },

    watch: {
      isExpanded(val) {
        this.codeArea.style.height = val ? `${ this.codeAreaHeight + 1 }px` : '0';
        if (!val) {
          this.fixedControl = false;
          this.$refs.control.style.left = '0';
          this.removeScrollHandler();
          return;
        }
        setTimeout(() => {
          this.scrollParent = document.querySelector('.page-component__scroll > .hzq-scrollbar__wrap');
          this.scrollParent && this.scrollParent.addEventListener('scroll', this.scrollHandler);
          this.scrollHandler();
        }, 200);
      }
    },

    created() {
      const highlight = this.$slots.highlight;
      if (highlight && highlight[0]) {
        let code = '';
        let cur = highlight[0];
        if (cur.tag === 'pre' && (cur.children && cur.children[0])) {
          cur = cur.children[0];
          if (cur.tag === 'code') {
            code = cur.children[0].text;
          }
        }
        if (code) {
          this.codepen.html = stripTemplate(code);
          this.codepen.script = stripScript(code);
          this.codepen.style = stripStyle(code);
        }
      }
    },

    mounted() {
      this.$nextTick(() => {
        let highlight = this.$el.getElementsByClassName('highlight')[0];
        if (this.$el.getElementsByClassName('description').length === 0) {
          highlight.style.width = '100%';
          highlight.borderRight = 'none';
        }
      });
    },

    beforeDestroy() {
      this.removeScrollHandler();
    }
  };
</script>
