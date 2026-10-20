import Vue from 'vue';
import dialog, { resetDialogService } from 'packages/dialog/src/dialog-service';

describe('$dialog', () => {
  afterEach(done => {
    resetDialogService();
    setTimeout(done, 50);
  });

  function getVisibleWrappers() {
    return Array.from(document.querySelectorAll('.el-dialog__wrapper')).filter(wrapper => {
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
      expect(wrapper.querySelector('.el-dialog__title').textContent).to.equal('提示');
      expect(wrapper.textContent).to.include('通知内容');
      expect(wrapper.querySelector('.el-dialog__footer')).to.not.exist;
      done();
    }, 100);
  });

  it('accepts string as content shortcut', done => {
    dialog('快捷内容');

    setTimeout(() => {
      expect(document.body.textContent).to.include('快捷内容');
      expect(getVisibleWrappers()[0].querySelector('.el-dialog__footer')).to.not.exist;
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
      const buttons = document.querySelector('.el-dialog__footer').querySelectorAll('.el-button');
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
      expect(document.querySelector('.el-dialog--bordered')).to.exist;
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
      expect(document.querySelector('.el-dialog--bordered')).to.not.exist;
      done();
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
      expect(document.querySelector('.el-dialog').style.width).to.equal('380px');
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
      document.querySelector('.el-dialog__footer .el-button--primary').click();
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
      document.querySelector('.el-dialog__headerbtn').click();
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
      const buttons = document.querySelector('.el-dialog__footer').querySelectorAll('.el-button');
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
      expect(document.querySelector('.el-dialog__footer')).to.not.exist;
      expect(confirmed).to.be.false;
      done();
    }, 100);
  });

  it('nested dialog opens immediately when stack is true', done => {
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

  it('queue shows dialogs sequentially', done => {
    dialog({
      title: 'first',
      type: 'alert',
      content: 'first dialog'
    });
    dialog({
      title: 'second',
      type: 'alert',
      content: 'second dialog'
    });

    setTimeout(() => {
      expect(getVisibleWrappers().length).to.equal(1);
      expect(document.body.textContent).to.include('first dialog');
      expect(document.body.textContent).to.not.include('second dialog');

      document.querySelector('.el-dialog__headerbtn').click();

      setTimeout(() => {
        expect(getVisibleWrappers().length).to.equal(1);
        expect(document.body.textContent).to.include('second dialog');
        done();
      }, 1000);
    }, 100);
  });
});
