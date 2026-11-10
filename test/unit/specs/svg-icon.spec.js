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

      expect(vm.$refs.a.$el.getAttribute('width')).to.equal('1em');
      expect(vm.$refs.b.$el.getAttribute('width')).to.equal('24px');
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
