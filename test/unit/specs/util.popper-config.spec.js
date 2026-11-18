import {
  setPopperConfig,
  getPopperConfig,
  resolveContainer,
  resolveBoundaries
} from 'hzq-ui/src/utils/popper-config';
import { PopupManager } from 'hzq-ui/src/utils/popup';

describe('Utils:PopperConfig', () => {
  afterEach(() => {
    setPopperConfig({ appendTo: null, boundariesElement: null, boundariesPadding: null, zIndex: null });
  });

  it('setPopperConfig merges partial keys', () => {
    setPopperConfig({ appendTo: '.app', zIndex: 3000 });
    setPopperConfig({ boundariesElement: 'window' });

    const cfg = getPopperConfig();
    expect(cfg.appendTo).to.equal('.app');
    expect(cfg.boundariesElement).to.equal('window');
    expect(cfg.zIndex).to.equal(3000);
  });

  it('setPopperConfig falls back to defaults on null', () => {
    setPopperConfig({ appendTo: '.app', boundariesPadding: 20 });
    setPopperConfig({ appendTo: null, boundariesPadding: null });

    const cfg = getPopperConfig();
    expect(cfg.appendTo).to.equal('body');
    expect(cfg.boundariesElement).to.equal('viewport');
    expect(cfg.boundariesPadding).to.equal(undefined);
  });

  it('getPopperConfig returns a copy', () => {
    const cfg = getPopperConfig();
    cfg.appendTo = '.changed';
    expect(getPopperConfig().appendTo).to.not.equal('.changed');
  });

  it('resolveContainer: selector hit', () => {
    const el = document.createElement('div');
    el.id = 'popper-container';
    document.body.appendChild(el);

    expect(resolveContainer('#popper-container')).to.equal(el);

    document.body.removeChild(el);
  });

  it('resolveContainer: selector miss falls back to body', () => {
    expect(resolveContainer('#not-exist-container')).to.equal(document.body);
  });

  it('resolveContainer: function returning null falls back to body', () => {
    expect(resolveContainer(() => null)).to.equal(document.body);
  });

  it('resolveContainer: element is returned as is', () => {
    const el = document.createElement('div');
    expect(resolveContainer(el)).to.equal(el);
  });

  it('resolveBoundaries: selector hit returns element', () => {
    const el = document.createElement('div');
    el.id = 'popper-boundary';
    document.body.appendChild(el);

    expect(resolveBoundaries('#popper-boundary')).to.equal(el);

    document.body.removeChild(el);
  });

  it('resolveBoundaries: selector miss falls back to viewport', () => {
    // 未知字符串若透传给 popper，_getBoundaries 会算出 NaN 边界而不报错
    expect(resolveBoundaries('#not-exist-boundary')).to.equal('viewport');
  });

  it('resolveBoundaries: popper keywords pass through', () => {
    expect(resolveBoundaries('viewport')).to.equal('viewport');
    expect(resolveBoundaries('window')).to.equal('window');
    expect(resolveBoundaries('scrollParent')).to.equal('scrollParent');
  });

  it('resolveBoundaries: invalid value falls back to viewport', () => {
    expect(resolveBoundaries({})).to.equal('viewport');
    expect(resolveBoundaries(null)).to.equal('viewport');
  });

  it('zIndex writes into PopupManager', () => {
    setPopperConfig({ zIndex: 7000 });
    expect(PopupManager.nextZIndex()).to.equal(7000);
  });
});
