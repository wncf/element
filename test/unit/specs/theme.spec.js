import {
  parseColor,
  mixColor,
  createBrandTokens,
  applyTheme,
  setThemeMode,
  getThemeMode,
  resetTheme
} from 'element-ui/src/utils/theme';

// 期望值全部取自编译产物（packages/theme-chalk/lib/index.css），
// 用来锁住"JS 推导 == Sass mix()"，两边算法漂移会立刻失败。
const PRIMARY = '#2563eb';
const PRIMARY_RGB = { r: 37, g: 99, b: 235 };
const WHITE = { r: 255, g: 255, b: 255 };

function readToken(name) {
  return window.getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

describe('Utils:theme', () => {
  const root = document.documentElement;

  afterEach(() => {
    resetTheme(root);
    setThemeMode('light', root);
  });

  describe('parseColor', () => {
    it('parses long hex', () => {
      expect(parseColor(PRIMARY)).to.deep.equal(PRIMARY_RGB);
    });

    it('parses short hex', () => {
      expect(parseColor('#abc')).to.deep.equal({ r: 170, g: 187, b: 204 });
    });

    it('parses rgb and rgba', () => {
      expect(parseColor('rgb(1, 2, 3)')).to.deep.equal({ r: 1, g: 2, b: 3 });
      expect(parseColor('rgba(1, 2, 3, 0.5)')).to.deep.equal({ r: 1, g: 2, b: 3 });
    });

    it('rejects unknown formats', () => {
      expect(parseColor('red')).to.be.null;
      expect(parseColor('')).to.be.null;
      expect(parseColor(null)).to.be.null;
    });
  });

  describe('mixColor', () => {
    it('matches Sass mix()', () => {
      expect(mixColor(WHITE, PRIMARY_RGB, 0.1)).to.deep.equal({ r: 59, g: 115, b: 237 });
    });
  });

  describe('createBrandTokens', () => {
    it('derives all tokens of one color', () => {
      const tokens = createBrandTokens('primary', PRIMARY_RGB, WHITE);

      expect(Object.keys(tokens).length).to.equal(13);
      expect(tokens['--el-color-primary']).to.equal('#2563eb');
      expect(tokens['--el-color-primary-rgb']).to.equal('37, 99, 235');
      expect(tokens['--el-color-primary-light-1']).to.equal('#3b73ed');
      expect(tokens['--el-color-primary-light-7']).to.equal('#bed0f9');
      expect(tokens['--el-color-primary-light-9']).to.equal('#e9effd');
      expect(tokens['--el-color-primary-hover']).to.equal('#5182ef');
      expect(tokens['--el-color-primary-shade']).to.equal('#2159d4');
    });
  });

  describe('applyTheme', () => {
    it('only rewrites the colors it is given', () => {
      const successBefore = readToken('--el-color-success-light-1');

      applyTheme({ primary: '#16a34a' }, root);

      expect(readToken('--el-color-primary')).to.equal('#16a34a');
      expect(readToken('--el-color-primary-light-1')).to.equal('#2dac5c');
      expect(readToken('--el-color-success-light-1')).to.equal(successBefore);
    });

    it('ignores invalid colors', () => {
      applyTheme({ primary: 'not-a-color' }, root);

      expect(root.style.getPropertyValue('--el-color-primary')).to.equal('');
    });

    it('re-derives the owned color when the mode changes', () => {
      applyTheme({ primary: '#16a34a' }, root);
      setThemeMode('dark', root);

      expect(getThemeMode(root)).to.equal('dark');
      expect(readToken('--el-color-primary-light-1')).to.equal('#169545');
    });
  });

  describe('resetTheme', () => {
    it('gives the theme back to the stylesheet', () => {
      applyTheme({ primary: '#16a34a' }, root);
      resetTheme(root);

      expect(root.style.getPropertyValue('--el-color-primary')).to.equal('');
      expect(readToken('--el-color-primary')).to.equal('#2563eb');
    });
  });
});
