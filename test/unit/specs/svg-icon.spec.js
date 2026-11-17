import { createVue, destroyVM } from '../util';
import {
  registerSvgIcons,
  hasSvgIcon,
  getRegisteredSvgIcons,
  clearSvgIcons
} from 'hzq-ui/packages/svg-icon';

describe('SvgIcon', () => {
  let vm;

  afterEach(() => {
    if (vm) destroyVM(vm);
    vm = null;
    clearSvgIcons();
  });

  describe('registerSvgIcons', () => {
    it('拼接前缀与图标名', () => {
      const result = registerSvgIcons(['base-arrow', 'base-book'], { prefix: 'crm' });

      expect(result).to.deep.equal(['crm-base-arrow', 'crm-base-book']);
      expect(hasSvgIcon('crm-base-arrow')).to.be.true;
      expect(hasSvgIcon('base-arrow')).to.be.false;
    });

    it('已带前缀的名字不会被重复拼接', () => {
      const result = registerSvgIcons(['crm-base-arrow'], { prefix: 'crm' });

      expect(result).to.deep.equal(['crm-base-arrow']);
      expect(getRegisteredSvgIcons()).to.have.length(1);
    });

    it('支持传入 { name: content } 映射', () => {
      registerSvgIcons({ star: '<svg/>', heart: '<svg/>' }, { prefix: 'biz' });

      expect(getRegisteredSvgIcons()).to.deep.equal(['biz-star', 'biz-heart']);
    });

    it('缺少 prefix 时报错', () => {
      expect(() => registerSvgIcons(['a'])).to.throw(/prefix/);
      expect(() => registerSvgIcons(['a'], {})).to.throw(/prefix/);
    });

    it('保留前缀被拒绝', () => {
      expect(() => registerSvgIcons(['a'], { prefix: 'hzq' })).to.throw(/保留/);
      expect(() => registerSvgIcons(['a'], { prefix: 'el' })).to.throw(/保留/);
    });

    it('同名图标重复注册时报错', () => {
      registerSvgIcons(['arrow'], { prefix: 'crm' });

      expect(() => registerSvgIcons(['arrow'], { prefix: 'crm' })).to.throw(/重复注册/);
    });

    it('silent 模式下重复注册只告警并跳过', () => {
      registerSvgIcons(['arrow'], { prefix: 'crm' });
      const result = registerSvgIcons(['arrow', 'book'], { prefix: 'crm', silent: true });

      // arrow 被跳过，book 正常注册
      expect(result).to.deep.equal(['crm-book']);
    });

    it('不同前缀可以注册同名图标', () => {
      registerSvgIcons(['arrow'], { prefix: 'crm' });
      registerSvgIcons(['arrow'], { prefix: 'biz' });

      expect(getRegisteredSvgIcons()).to.deep.equal(['crm-arrow', 'biz-arrow']);
    });
  });

  describe('运行时注入', () => {
    const svg = '<svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z"/></svg>';

    it('传 { 名称: svg内容 } 时注入 symbol', () => {
      registerSvgIcons({ arrow: svg }, { prefix: 'crm' });

      const symbol = document.getElementById('icon-crm-arrow');
      expect(symbol).to.exist;
      expect(symbol.nodeName.toLowerCase()).to.equal('symbol');
      expect(symbol.getAttribute('viewBox')).to.equal('0 0 24 24');
      expect(symbol.querySelector('path')).to.exist;
    });

    it('没有 viewBox 时用 width/height 推导', () => {
      registerSvgIcons(
        { dot: '<svg width="16" height="16"><circle r="8"/></svg>' },
        { prefix: 'crm' }
      );

      const symbol = document.getElementById('icon-crm-dot');
      expect(symbol.getAttribute('viewBox')).to.equal('0 0 16 16');
    });

    it('缺少 xmlns 时自动补齐，节点处于 SVG 命名空间', () => {
      registerSvgIcons(
        { plain: '<svg viewBox="0 0 24 24"><path d="M12 3l9 18H3z"/></svg>' },
        { prefix: 'crm' }
      );

      const symbol = document.getElementById('icon-crm-plain');
      expect(symbol).to.exist;
      const path = symbol.querySelector('path');
      expect(path).to.exist;
      // 命名空间缺失会导致浏览器不渲染，这是之前图标空白的根因
      expect(path.namespaceURI).to.equal('http://www.w3.org/2000/svg');
      expect(symbol.namespaceURI).to.equal('http://www.w3.org/2000/svg');
    });

    it('内容为空时告警并跳过', () => {
      registerSvgIcons({ blank: '<svg viewBox="0 0 24 24"></svg>' }, { prefix: 'crm', silent: true });

      expect(document.getElementById('icon-crm-blank')).to.not.exist;
    });

    it('重复注册被拒绝，不会重复注入', () => {
      registerSvgIcons({ arrow: svg }, { prefix: 'crm' });
      expect(() => registerSvgIcons({ arrow: svg }, { prefix: 'crm' })).to.throw(/重复注册/);
      expect(document.querySelectorAll('#icon-crm-arrow').length).to.equal(1);
    });

    it('非法内容只告警不抛错', () => {
      registerSvgIcons({ bad: 'not an svg' }, { prefix: 'crm', silent: true });

      expect(document.getElementById('icon-crm-bad')).to.not.exist;
    });

    it('清空注册表时移除已注入的 symbol', () => {
      registerSvgIcons({ arrow: svg }, { prefix: 'crm' });
      expect(document.getElementById('icon-crm-arrow')).to.exist;

      clearSvgIcons();
      expect(document.getElementById('icon-crm-arrow')).to.not.exist;
    });

    it('组件挂载时能引用到注入的 symbol', () => {
      registerSvgIcons({ arrow: svg }, { prefix: 'crm' });
      vm = createVue({
        template: '<hzq-svg-icon name="crm-arrow" />'
      }, true);

      const use = vm.$el.querySelector('use');
      const href = use.getAttribute('xlink:href') || use.getAttribute('href');
      expect(href).to.equal('#icon-crm-arrow');
      expect(document.getElementById('icon-crm-arrow')).to.exist;
    });
  });

  describe('component', () => {
    it('渲染 use 并指向 icon-{name}', () => {
      vm = createVue({
        template: '<hzq-svg-icon name="crm-base-arrow" />'
      }, true);

      const use = vm.$el.querySelector('use');
      expect(use).to.exist;
      // xlink:href 在 DOM 里是 xlink:href 属性
      const href = use.getAttribute('xlink:href') || use.getAttribute('href');
      expect(href).to.equal('#icon-crm-base-arrow');
    });

    it('默认尺寸 1em，可覆盖', () => {
      vm = createVue({
        template: `
          <div>
            <hzq-svg-icon ref="a" name="a" />
            <hzq-svg-icon ref="b" name="b" size="24px" />
          </div>
        `
      }, true);

      // 尺寸写在行内 style 上，否则会被 CSS 的 width/height 覆盖
      expect(vm.$refs.a.$el.style.width).to.equal('1em');
      expect(vm.$refs.a.$el.style.height).to.equal('1em');
      expect(vm.$refs.b.$el.style.width).to.equal('24px');
      expect(vm.$refs.b.$el.style.height).to.equal('24px');
    });

    it('size 传数字时补上 px 单位', () => {
      vm = createVue({
        template: '<hzq-svg-icon name="a" :size="32" />'
      }, true);

      expect(vm.$el.style.width).to.equal('32px');
      expect(vm.$el.style.height).to.equal('32px');
    });

    it('行内尺寸不会被主题 CSS 覆盖', () => {
      vm = createVue({
        template: '<hzq-svg-icon name="a" size="48px" />'
      }, true);

      // 真实布局尺寸应为 48px，而不是 CSS 里的 1em
      expect(vm.$el.getBoundingClientRect().width).to.equal(48);
    });

    it('color 写入 style，className 写入 class', () => {
      vm = createVue({
        template: '<hzq-svg-icon name="a" color="#409EFF" class-name="my-icon" />'
      }, true);

      expect(vm.$el.style.color).to.equal('rgb(64, 158, 255)');
      expect(vm.$el.classList.contains('my-icon')).to.be.true;
      expect(vm.$el.classList.contains('hzq-svg-icon')).to.be.true;
    });
  });
});
