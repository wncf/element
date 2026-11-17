<template>
  <div id="app" :class="{ 'is-component': isComponent }">
    <main-header v-if="lang !== 'play'"></main-header>
    <div class="main-cnt">
      <router-view></router-view>
    </div>
    <main-footer v-if="lang !== 'play' && !isComponent"></main-footer>
  </div>
</template>

<script>
  import { use } from 'main/locale';
  import zhLocale from 'main/locale/lang/zh-CN';

  // 文档站仅保留中文，组件库语言固定为 zh-CN
  use(zhLocale);

  export default {
    name: 'app',

    computed: {
      lang() {
        return this.$route.path.split('/')[1] || 'zh-CN';
      },
      isComponent() {
        return /^component-/.test(this.$route.name || '');
      }
    },

    methods: {
      suggestJump() {
        if (process.env.NODE_ENV !== 'production') return;

        const href = location.href;
        const preferGithub = localStorage.getItem('PREFER_GITHUB');
        const cnHref = href.indexOf('eleme.cn') > -1 || href.indexOf('element-cn') > -1 || href.indexOf('element.faas') > -1;
        if (cnHref || preferGithub) return;
        setTimeout(() => {
          if (this.lang !== 'zh-CN') return;
          this.$dialog({
            title: '提示',
            type: 'confirm',
            content: '建议大陆用户访问部署在国内的站点，是否跳转？',
            confirm: () => {
              location.replace('https://element.eleme.cn');
            },
            cancel: () => {
              localStorage.setItem('PREFER_GITHUB', 'true');
            }
          });
        }, 1000);
      }
    },

    mounted() {
      if (this.lang === 'zh-CN') {
        this.suggestJump();
      }
    }
  };
</script>
