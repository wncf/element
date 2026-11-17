import navConfig from './nav.config';

// 文档站已精简为仅中文，语言维度保留在路由 meta 中供组件读取
const LANG = 'zh-CN';

// require.ensure 的 chunkName 必须是字符串字面量，传变量会让 webpack 无法识别
const load = function(name) {
  return r => require.ensure([], () =>
    r(require(`./pages/zh-CN/${name}.vue`)),
  'zh-CN');
};

const loadDocs = function(path) {
  return r => require.ensure([], () =>
    r(require(`./docs/zh-CN${path}.md`)),
  'zh-CN');
};

const registerRoute = (navConfig) => {
  let route = [];
  let navs = navConfig[LANG];
  route.push({
    path: `/${ LANG }/component`,
    // 安装/快速上手等指南页已移除，组件页默认进入第一个组件文档
    redirect: `/${ LANG }/component/layout`,
    component: load('component'),
    children: []
  });
  navs.forEach(nav => {
    if (nav.href) return;
    if (nav.groups) {
      nav.groups.forEach(group => {
        group.list.forEach(nav => {
          addRoute(nav);
        });
      });
    } else if (nav.children) {
      nav.children.forEach(nav => {
        addRoute(nav);
      });
    } else {
      addRoute(nav);
    }
  });
  function addRoute(page) {
    const component = page.path === '/changelog'
      ? load('changelog')
      : loadDocs(page.path);
    let child = {
      path: page.path.slice(1),
      meta: {
        title: page.title || page.name,
        description: page.description,
        lang: LANG
      },
      name: 'component-' + LANG + (page.title || page.name),
      component: component.default || component
    };

    route[0].children.push(child);
  }

  return route;
};

let route = registerRoute(navConfig);

const themeRoute = {
  path: `/${ LANG }/theme`,
  component: load('theme-nav'),
  children: [
    {
      path: '/', // 主题管理
      name: 'theme' + LANG,
      meta: { lang: LANG },
      component: load('theme')
    },
    {
      path: 'preview', // 主题预览编辑
      name: 'theme-preview-' + LANG,
      meta: { lang: LANG },
      component: load('theme-preview')
    }]
};

const indexRoute = {
  path: `/${ LANG }`, // 首页
  meta: { lang: LANG },
  name: 'home' + LANG,
  component: load('index')
};

const changesRoute = {
  path: `/${ LANG }/changes`, // 改造记录
  meta: { lang: LANG },
  name: 'changes' + LANG,
  component: load('changes')
};

route = route.concat([themeRoute, changesRoute, indexRoute]);

route.push({
  path: '/play',
  name: 'play',
  component: require('./play/index.vue')
});

route = route.concat([{
  path: '/',
  redirect: `/${ LANG }`
}, {
  path: '*',
  redirect: `/${ LANG }`
}]);

export default route;
