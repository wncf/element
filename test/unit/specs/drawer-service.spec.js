import Vue from 'vue';
import drawer, { resetDrawerService } from 'packages/drawer/src/drawer-service';

describe('$drawer', () => {
  afterEach(done => {
    resetDrawerService();
    setTimeout(done, 50);
  });

  function getVisibleWrappers() {
    return Array.from(document.querySelectorAll('.hzq-drawer__wrapper')).filter(wrapper => {
      return wrapper.style.display !== 'none';
    });
  }

  it('installs on Vue.prototype', () => {
    expect(Vue.prototype.$drawer).to.equal(drawer);
  });

  it('creates alert drawer with content', done => {
    drawer({
      title: '抽屉标题',
      type: 'alert',
      content: '抽屉内容'
    });

    setTimeout(() => {
      const wrapper = getVisibleWrappers()[0];
      expect(wrapper).to.exist;
      expect(wrapper.querySelector('.hzq-drawer__header').textContent).to.include('抽屉标题');
      expect(wrapper.textContent).to.include('抽屉内容');
      // alert 类型没有底部按钮
      expect(wrapper.querySelector('.hzq-drawer-service__footer')).to.not.exist;
      done();
    }, 100);
  });

  it('accepts string as content shortcut', done => {
    drawer('快捷内容');

    setTimeout(() => {
      expect(document.body.textContent).to.include('快捷内容');
      expect(document.querySelector('.hzq-drawer-service__footer')).to.not.exist;
      done();
    }, 100);
  });

  it('creates confirm drawer with footer buttons', done => {
    drawer({
      title: '确认',
      type: 'confirm',
      content: '是否继续',
      confirmButtonText: '同意',
      cancelButtonText: '拒绝'
    });

    setTimeout(() => {
      const buttons = document.querySelector('.hzq-drawer-service__footer').querySelectorAll('.hzq-button');
      expect(buttons.length).to.equal(2);
      expect(buttons[0].textContent).to.include('拒绝');
      expect(buttons[1].textContent).to.include('同意');
      done();
    }, 100);
  });

  it('applies direction to the drawer element', done => {
    drawer({
      title: '方向',
      content: '从左弹出',
      direction: 'ltr'
    });

    setTimeout(() => {
      const panel = document.querySelector('.hzq-drawer');
      expect(panel.classList.contains('ltr')).to.be.true;
      done();
    }, 100);
  });

  it('normalizes numeric size to px', done => {
    drawer({
      title: '宽度',
      size: 380,
      content: 'test'
    });

    setTimeout(() => {
      expect(document.querySelector('.hzq-drawer').style.width).to.equal('380px');
      done();
    }, 100);
  });

  it('keeps percentage size as is', done => {
    drawer({
      title: '宽度',
      size: '30%',
      content: 'test'
    });

    setTimeout(() => {
      expect(document.querySelector('.hzq-drawer').style.width).to.equal('30%');
      done();
    }, 100);
  });

  it('adds bordered class when border is true', done => {
    drawer({
      title: 'border',
      type: 'confirm',
      content: 'with border',
      border: true
    });

    setTimeout(() => {
      expect(document.querySelector('.hzq-drawer--bordered')).to.exist;
      done();
    }, 100);
  });

  it('has no bordered class by default', done => {
    drawer({
      title: 'no border',
      content: 'plain'
    });

    setTimeout(() => {
      expect(document.querySelector('.hzq-drawer--bordered')).to.not.exist;
      done();
    }, 100);
  });

  it('supports render function content', done => {
    drawer({
      title: 'render'
    }, h => h('span', { class: 'drawer-render-target' }, 'render content'));

    setTimeout(() => {
      expect(document.querySelector('.drawer-render-target')).to.exist;
      expect(document.querySelector('.drawer-render-target').textContent).to.equal('render content');
      done();
    }, 100);
  });

  it('confirm callback receives instance api', done => {
    drawer({
      title: 'confirm',
      type: 'confirm',
      content: 'confirm test',
      confirm: instance => {
        expect(instance.visible).to.equal(true);
        instance.loading = true;
        expect(instance.loading).to.equal(true);
        instance.close();
        done();
      }
    });

    setTimeout(() => {
      document.querySelector('.hzq-drawer-service__footer .hzq-button--primary').click();
    }, 100);
  });

  it('closing programmatically does not fire cancel', done => {
    let cancelled = false;

    drawer({
      title: 'confirm',
      type: 'confirm',
      content: 'programmatic close',
      cancel: () => {
        cancelled = true;
      },
      confirm: instance => {
        instance.close();
      }
    });

    setTimeout(() => {
      document.querySelector('.hzq-drawer-service__footer .hzq-button--primary').click();

      setTimeout(() => {
        expect(cancelled).to.be.false;
        expect(document.querySelector('.hzq-drawer__wrapper')).to.not.exist;
        done();
      }, 500);
    }, 100);
  });

  it('cancel callback on header close', done => {
    let cancelled = false;

    drawer({
      title: 'alert',
      content: 'cancel test',
      cancel: () => {
        cancelled = true;
      }
    });

    setTimeout(() => {
      document.querySelector('.hzq-drawer__close-btn').click();
      setTimeout(() => {
        expect(cancelled).to.be.true;
        done();
      }, 500);
    }, 100);
  });

  it('cancel callback on footer cancel button', done => {
    let cancelled = false;

    drawer({
      title: 'confirm',
      type: 'confirm',
      content: 'cancel button',
      cancel: () => {
        cancelled = true;
      }
    });

    setTimeout(() => {
      const buttons = document.querySelector('.hzq-drawer-service__footer').querySelectorAll('.hzq-button');
      buttons[0].click();
      setTimeout(() => {
        expect(cancelled).to.be.true;
        done();
      }, 500);
    }, 100);
  });

  it('ignores confirm callback for alert type', done => {
    let confirmed = false;

    drawer({
      title: 'alert',
      content: 'alert only',
      confirm: () => {
        confirmed = true;
      }
    });

    setTimeout(() => {
      expect(document.querySelector('.hzq-drawer-service__footer')).to.not.exist;
      expect(confirmed).to.be.false;
      done();
    }, 100);
  });

  it('nested drawer opens immediately when stack is true', done => {
    drawer({
      title: 'outer',
      content: 'outer content'
    });

    setTimeout(() => {
      expect(getVisibleWrappers().length).to.equal(1);

      drawer({
        title: 'inner',
        content: 'inner content',
        stack: true
      });

      setTimeout(() => {
        expect(getVisibleWrappers().length).to.equal(2);
        expect(document.body.textContent).to.include('outer content');
        expect(document.body.textContent).to.include('inner content');
        done();
      }, 100);
    }, 100);
  });

  it('queue shows drawers sequentially', done => {
    drawer({
      title: 'first',
      content: 'first drawer'
    });
    drawer({
      title: 'second',
      content: 'second drawer'
    });

    setTimeout(() => {
      expect(getVisibleWrappers().length).to.equal(1);
      expect(document.body.textContent).to.include('first drawer');
      expect(document.body.textContent).to.not.include('second drawer');

      document.querySelector('.hzq-drawer__close-btn').click();

      setTimeout(() => {
        expect(getVisibleWrappers().length).to.equal(1);
        expect(document.body.textContent).to.include('second drawer');
        done();
      }, 1200);
    }, 100);
  });
});
