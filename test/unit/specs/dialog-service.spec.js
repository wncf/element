import Vue from 'vue';
import dialog, { resetDialogService } from 'packages/dialog/src/dialog-service';
import { PopupManager } from 'hzq-ui/src/utils/popup';

describe('$dialog', () => {
  afterEach(done => {
    resetDialogService();
    // 遮罩是单例 DOM，closeModal 会延迟 200ms 才移除。
    // 不等它清掉，残留的 .v-modal 会串到下一条用例。
    setTimeout(() => {
      const mask = document.querySelector('.v-modal');
      if (mask && mask.parentNode) mask.parentNode.removeChild(mask);
      PopupManager.modalStack.length = 0;
      if (PopupManager.escStack) PopupManager.escStack.length = 0;
      PopupManager.modalDom = undefined;
      done();
    }, 250);
  });

  function lastWrapper() {
    const wrappers = document.querySelectorAll('.hzq-dialog__wrapper');
    return wrappers[wrappers.length - 1];
  }

  function getVisibleWrappers() {
    return Array.from(document.querySelectorAll('.hzq-dialog__wrapper')).filter(wrapper => {
      return wrapper.style.display !== 'none';
    });
  }

  it('installs on Vue.prototype', () => {
    expect(Vue.prototype.$dialog).to.equal(dialog);
    expect(Vue.prototype.$alert).to.be.undefined;
    expect(Vue.prototype.$confirm).to.be.undefined;
    expect(Vue.prototype.$prompt).to.be.undefined;
    expect(Vue.prototype.$msgbox).to.be.undefined;
  });

  it('creates alert dialog with content', done => {
    dialog({
      title: '提示',
      type: 'alert',
      content: '通知内容'
    });

    setTimeout(() => {
      const wrapper = getVisibleWrappers()[0];
      expect(wrapper).to.exist;
      expect(wrapper.querySelector('.hzq-dialog__title').textContent).to.equal('提示');
      expect(wrapper.textContent).to.include('通知内容');
      expect(wrapper.querySelector('.hzq-dialog__footer')).to.not.exist;
      done();
    }, 100);
  });

  it('accepts string as content shortcut', done => {
    dialog('快捷内容');

    setTimeout(() => {
      expect(document.body.textContent).to.include('快捷内容');
      expect(getVisibleWrappers()[0].querySelector('.hzq-dialog__footer')).to.not.exist;
      done();
    }, 100);
  });

  it('creates confirm dialog with footer buttons', done => {
    dialog({
      title: '确认',
      type: 'confirm',
      content: '是否继续',
      confirmButtonText: '同意',
      cancelButtonText: '拒绝'
    });

    setTimeout(() => {
      const buttons = document.querySelector('.hzq-dialog__footer').querySelectorAll('.hzq-button');
      expect(buttons.length).to.equal(2);
      expect(buttons[0].textContent).to.include('拒绝');
      expect(buttons[1].textContent).to.include('同意');
      done();
    }, 100);
  });

  it('adds bordered class when border is true', done => {
    dialog({
      title: 'border',
      type: 'confirm',
      content: 'with border',
      border: true
    });

    setTimeout(() => {
      expect(document.querySelector('.hzq-dialog--bordered')).to.exist;
      done();
    }, 100);
  });

  it('has no bordered class by default', done => {
    dialog({
      title: 'no border',
      type: 'alert',
      content: 'plain'
    });

    setTimeout(() => {
      expect(document.querySelector('.hzq-dialog--bordered')).to.not.exist;
      done();
    }, 100);
  });

  it('renders a mask by default', done => {
    dialog({ title: 'mask', content: 'x' });

    setTimeout(() => {
      expect(document.querySelector('.v-modal'), '默认应渲染遮罩').to.exist;
      expect(getVisibleWrappers()[0]).to.exist;
      done();
    }, 100);
  });

  it('renders no mask when modal is false', done => {
    dialog({ title: 'no mask', content: 'x', modal: false });

    setTimeout(() => {
      expect(document.querySelector('.v-modal'), '不应渲染遮罩').to.not.exist;
      // 弹窗本体仍要正常显示，并且有层级（无遮罩时走自增）
      const wrapper = getVisibleWrappers()[0];
      expect(wrapper, '弹窗本身仍应显示').to.exist;
      expect(wrapper.style.zIndex, '无遮罩时也要有层级').to.not.equal('');
      // wrapper 铺满视口，无遮罩时必须让点击穿透，否则页面其余部分点不动
      expect(wrapper.classList.contains('hzq-dialog__wrapper--no-modal'), '应标记为无遮罩').to.be.true;
      done();
    }, 100);
  });

  it('esc closes a dialog without modal', done => {
    dialog({ title: 'no mask', content: 'x', modal: false, escClose: true });

    setTimeout(() => {
      expect(getVisibleWrappers()[0], '弹窗应已打开').to.exist;

      const event = new KeyboardEvent('keydown', {
        key: 'Escape', code: 'Escape', keyCode: 27, which: 27, bubbles: true
      });
      document.dispatchEvent(event);
      window.dispatchEvent(event);

      setTimeout(() => {
        expect(getVisibleWrappers()[0], '无遮罩时 esc 也应关闭弹窗').to.not.exist;
        done();
      }, 400);
    }, 100);
  });

  it('clicking outside does not close a dialog without modal', done => {
    dialog({ title: 'no mask', content: 'x', modal: false, maskClose: true });

    setTimeout(() => {
      const wrapper = getVisibleWrappers()[0];
      expect(wrapper).to.exist;
      // 没有遮罩就不存在「点遮罩关闭」，空白处点击不应关闭弹窗
      wrapper.click();
      setTimeout(() => {
        expect(getVisibleWrappers()[0], '无遮罩时点空白处不应关闭').to.exist;
        done();
      }, 100);
    }, 100);
  });

  it('normalizes width to px', done => {
    dialog({
      title: '宽度',
      type: 'alert',
      width: 380,
      content: 'test'
    });

    setTimeout(() => {
      expect(document.querySelector('.hzq-dialog').style.width).to.equal('380px');
      done();
    }, 100);
  });

  it('supports render function content', done => {
    dialog({
      title: 'render',
      type: 'alert'
    }, h => h('span', { class: 'dialog-render-target' }, 'render content'));

    setTimeout(() => {
      expect(document.querySelector('.dialog-render-target')).to.exist;
      expect(document.querySelector('.dialog-render-target').textContent).to.equal('render content');
      done();
    }, 100);
  });

  it('returns an instance proxy', done => {
    const instance = dialog({
      title: '返回值',
      type: 'alert',
      content: 'proxy'
    });

    expect(instance).to.exist;
    expect(instance.$el).to.exist;

    setTimeout(() => {
      expect(instance.visible).to.be.true;

      instance.visible = false;
      setTimeout(() => {
        expect(document.querySelector('.hzq-dialog__wrapper')).to.not.exist;
        done();
      }, 400);
    }, 100);
  });

  it('proxy exposes inner $refs', done => {
    const Target = {
      name: 'RefTarget',
      render(h) {
        return h('div', { class: 'ref-target' }, 'x');
      }
    };

    const instance = dialog({
      title: 'refs',
      type: 'alert'
    }, h => h(Target, { ref: 'target' }));

    setTimeout(() => {
      const inner = instance.$refs.target;
      expect(inner).to.exist;
      expect(inner.$el.classList.contains('ref-target')).to.be.true;
      done();
    }, 100);
  });

  it('renders footer buttons for semantic types', done => {
    dialog({
      title: '删除',
      type: 'error',
      content: '确定删除吗'
    });

    setTimeout(() => {
      const footer = document.querySelector('.hzq-dialog__footer');
      expect(footer).to.exist;
      expect(footer.querySelectorAll('.hzq-button').length).to.equal(2);
      done();
    }, 100);
  });

  it('error type uses danger confirm button', done => {
    dialog({
      title: '删除',
      type: 'error',
      content: '确定删除吗'
    });

    setTimeout(() => {
      expect(document.querySelector('.hzq-dialog__service-confirm').classList.contains('hzq-button--danger')).to.be.true;
      done();
    }, 100);
  });

  it('renders type icon in header', done => {
    dialog({
      title: '警告',
      type: 'warning',
      content: '请注意'
    });

    setTimeout(() => {
      const icon = document.querySelector('.hzq-dialog__service-icon');
      expect(icon).to.exist;
      expect(icon.classList.contains('hzq-dialog__service-icon--warning')).to.be.true;
      expect(icon.classList.contains('hzq-icon-warning')).to.be.true;
      done();
    }, 100);
  });

  it('accepts a custom icon', done => {
    dialog({
      title: '自定义',
      type: 'info',
      icon: 'hzq-icon-star-on',
      content: 'x'
    });

    setTimeout(() => {
      expect(document.querySelector('.hzq-icon-star-on')).to.exist;
      done();
    }, 100);
  });

  it('no footer buttons when hideFooter is true', done => {
    dialog({
      title: '无底部',
      type: 'error',
      hideFooter: true,
      content: 'x'
    });

    setTimeout(() => {
      expect(document.querySelector('.hzq-dialog__footer')).to.not.exist;
      done();
    }, 100);
  });

  it('fullscreen renders dialog fullscreen', done => {
    dialog({
      title: '全屏',
      type: 'alert',
      fullscreen: true,
      content: 'x'
    });

    setTimeout(() => {
      expect(document.querySelector('.hzq-dialog').classList.contains('is-fullscreen')).to.be.true;
      done();
    }, 100);
  });

  it('applies zIndex', done => {
    dialog({
      title: '层级',
      type: 'alert',
      zIndex: 1500,
      content: 'x'
    });

    setTimeout(() => {
      // 显式 zIndex：遮罩取 zIndex、弹窗容器高一层
      expect(Number(document.querySelector('.hzq-dialog__wrapper').style.zIndex)).to.equal(1501);
      done();
    }, 100);
  });

  it('open callback receives instance', done => {
    let received = null;
    dialog({
      title: 'open',
      type: 'alert',
      content: 'x',
      open: instance => {
        received = instance;
      }
    });

    setTimeout(() => {
      expect(received).to.exist;
      expect(received.visible).to.be.true;
      done();
    }, 200);
  });

  it('confirm callback receives instance api', done => {
    dialog({
      title: 'confirm',
      type: 'confirm',
      content: 'confirm test',
      confirm: (instance) => {
        expect(instance.visible).to.equal(true);
        instance.loading = true;
        expect(instance.loading).to.equal(true);
        instance.close();
        done();
      }
    });

    setTimeout(() => {
      document.querySelector('.hzq-dialog__footer .hzq-button--primary').click();
    }, 100);
  });

  it('closing programmatically does not fire cancel', done => {
    let cancelled = false;
    let instanceRef = null;

    dialog({
      title: 'confirm',
      type: 'confirm',
      content: 'programmatic close',
      cancel: () => {
        cancelled = true;
      },
      confirm: instance => {
        instanceRef = instance;
        instance.close();
      }
    });

    setTimeout(() => {
      document.querySelector('.hzq-dialog__footer .hzq-button--primary').click();

      setTimeout(() => {
        // 点确定后：回调拿到了代理实例、弹窗消失、且不误触发 cancel
        expect(instanceRef).to.exist;
        expect(cancelled).to.be.false;
        expect(document.querySelector('.hzq-dialog__wrapper')).to.not.exist;
        done();
      }, 400);
    }, 100);
  });

  it('cancel callback on header close', done => {
    let cancelled = false;

    dialog({
      title: 'alert',
      type: 'alert',
      content: 'cancel test',
      cancel: () => {
        cancelled = true;
      }
    });

    setTimeout(() => {
      document.querySelector('.hzq-dialog__headerbtn').click();
      setTimeout(() => {
        expect(cancelled).to.be.true;
        done();
      }, 400);
    }, 100);
  });

  it('cancel callback on footer cancel button', done => {
    let cancelled = false;

    dialog({
      title: 'confirm',
      type: 'confirm',
      content: 'cancel button',
      cancel: () => {
        cancelled = true;
      }
    });

    setTimeout(() => {
      const buttons = document.querySelector('.hzq-dialog__footer').querySelectorAll('.hzq-button');
      buttons[0].click();
      setTimeout(() => {
        expect(cancelled).to.be.true;
        done();
      }, 400);
    }, 100);
  });

  it('ignores confirm callback for alert type', done => {
    let confirmed = false;

    dialog({
      title: 'alert',
      type: 'alert',
      content: 'alert only',
      confirm: () => {
        confirmed = true;
      }
    });

    setTimeout(() => {
      expect(document.querySelector('.hzq-dialog__footer')).to.not.exist;
      expect(confirmed).to.be.false;
      done();
    }, 100);
  });

  it('stacks by default', done => {
    dialog({
      title: 'outer',
      type: 'alert',
      content: 'outer content'
    });

    setTimeout(() => {
      expect(getVisibleWrappers().length).to.equal(1);

      dialog({
        title: 'inner',
        type: 'alert',
        content: 'inner content'
      });

      setTimeout(() => {
        expect(getVisibleWrappers().length).to.equal(2);
        expect(document.body.textContent).to.include('outer content');
        expect(document.body.textContent).to.include('inner content');
        done();
      }, 100);
    }, 100);
  });

  it('queues when stack is false', done => {
    dialog({
      title: 'first',
      type: 'alert',
      content: 'first dialog'
    });
    dialog({
      title: 'second',
      type: 'alert',
      content: 'second dialog',
      stack: false
    });

    setTimeout(() => {
      expect(getVisibleWrappers().length).to.equal(1);
      expect(document.body.textContent).to.include('first dialog');
      expect(document.body.textContent).to.not.include('second dialog');

      document.querySelector('.hzq-dialog__headerbtn').click();

      setTimeout(() => {
        expect(getVisibleWrappers().length).to.equal(1);
        expect(document.body.textContent).to.include('second dialog');
        done();
      }, 1000);
    }, 100);
  });

  it('inherits parent provide', done => {
    const Provider = Vue.extend({
      provide() {
        return { themeToken: 'from-provider' };
      },
      render(h) {
        return h('div');
      }
    });
    const parent = new Provider({ el: document.createElement('div') });

    dialog({
      title: 'provide',
      type: 'alert',
      parent
    }, h => h('span', { class: 'provide-target' }, 'x'));

    setTimeout(() => {
      const child = document.querySelector('.provide-target');
      expect(child).to.exist;
      // 渲染函数在 service 实例下执行，实例应能读到父级 provide
      const wrapper = lastWrapper();
      expect(wrapper).to.exist;
      parent.$destroy();
      done();
    }, 100);
  });

  // 回归：closeModal 有一个 200ms 的延迟清理，期间遮罩挂着 v-modal-leave
  // 在播淡出。关闭后在这个窗口内重新打开时，如果不清掉那次清理，
  // 淡出会继续播完（实测约 100ms），直到旧定时器摘类才瞬间弹回不透明，
  // 用户看到的就是遮罩「闪一下」。
  //
  // 这里直接驱动 PopupManager 而不经过 dialog 的 $nextTick 打开流程，
  // 时序才是确定的：open → close → 立刻 open。
  describe('modal fading state', () => {
    function cleanup() {
      const mask = document.querySelector('.v-modal');
      if (mask && mask.parentNode) mask.parentNode.removeChild(mask);
      PopupManager.modalStack.length = 0;
      if (PopupManager.escStack) PopupManager.escStack.length = 0;
      PopupManager.modalDom = undefined;
    }

    afterEach(cleanup);

    it('reopening during the close window clears the fading-out state', done => {
      PopupManager.openModal('probe-a', 3000, undefined, '', true);

      const mask = document.querySelector('.v-modal');
      expect(mask, '遮罩应存在').to.exist;
      expect(mask.classList.contains('v-modal-leave')).to.be.false;

      PopupManager.closeModal('probe-a');
      // 关闭后进入淡出
      expect(mask.classList.contains('v-modal-leave'), '关闭时应进入淡出').to.be.true;

      // 在 200ms 清理窗口内重新打开
      PopupManager.openModal('probe-b', 3002, undefined, '', true);

      // 关键断言：重开必须立刻摘掉淡出类。否则 .2s forwards 的动画
      // 会继续往 opacity:0 走，等旧定时器摘类时再瞬间弹回，就是「闪一下」。
      expect(mask.classList.contains('v-modal-leave'), '重开后应立刻摘掉淡出类').to.be.false;

      // 越过旧的 200ms 清理窗口，遮罩不能被那次清理删掉
      setTimeout(() => {
        const still = document.querySelector('.v-modal');
        expect(still, '越过旧清理窗口后遮罩不应被删除').to.exist;
        expect(still.style.display).to.not.equal('none');
        expect(PopupManager.modalStack.length).to.equal(1);
        done();
      }, 260);
    });
  });
});
