import { createVue, destroyVM, waitImmediate } from '../util';

describe('Steps', () => {
  let vm;
  afterEach(() => {
    destroyVM(vm);
  });

  it('create', () => {
    vm = createVue(`
      <hzq-steps>
        <hzq-step title="step1"></hzq-step>
        <hzq-step title="step2"></hzq-step>
        <hzq-step title="step3"></hzq-step>
      </hzq-steps>
    `);

    expect(vm.$el.querySelectorAll('.hzq-step')).to.length(3);
  });

  it('space', async() => {
    vm = createVue(`
      <hzq-steps>
        <hzq-step title="step1"></hzq-step>
        <hzq-step title="step2"></hzq-step>
        <hzq-step title="step3"></hzq-step>
      </hzq-steps>
    `, true);

    const vm2 = createVue(`
      <hzq-steps :space="100">
        <hzq-step title="step1"></hzq-step>
        <hzq-step title="step2"></hzq-step>
        <hzq-step title="step3"></hzq-step>
        <hzq-step title="step4"></hzq-step>
      </hzq-steps>
    `, true);

    await waitImmediate();
    const stepElm = vm.$el.querySelector('.hzq-step');
    const stepElm2 = vm2.$el.querySelector('.hzq-step');
    expect(getComputedStyle(stepElm).flexBasis).to.equal('50%');
    expect(getComputedStyle(stepElm2).flexBasis).to.equal('100px');
  });

  it('processStatus', done => {
    vm = createVue(`
      <hzq-steps :active="1" process-status="error">
        <hzq-step title="step1"></hzq-step>
        <hzq-step title="step2"></hzq-step>
        <hzq-step title="step3"></hzq-step>
      </hzq-steps>
    `);

    vm.$nextTick(_ => {
      expect(vm.$el.querySelectorAll('.hzq-step__head.is-error')).to.length(1);
      done();
    });
  });

  it('update processStatus', done => {
    vm = createVue({
      template: `
        <hzq-steps :active="1" :process-status="processStatus">
          <hzq-step title="abc"></hzq-step>
          <hzq-step title="abc2"></hzq-step>
        </hzq-steps>
      `,
      data() {
        return { processStatus: 'error' };
      }
    });

    vm.$nextTick(_ => {
      expect(vm.$el.querySelectorAll('.hzq-step__head.is-error')).to.length(1);
      vm.processStatus = 'process';
      vm.$nextTick(_ => {
        expect(vm.$el.querySelectorAll('.hzq-step__head.is-process')).to.length(1);
        done();
      });
    });
  });

  it('finishStatus', done => {
    vm = createVue(`
      <hzq-steps :active="1" finish-status="error">
        <hzq-step title="abc"></hzq-step>
        <hzq-step title="abc2"></hzq-step>
      </hzq-steps>
    `);

    vm.$nextTick(_ => {
      expect(vm.$el.querySelectorAll('.hzq-step__head.is-error')).to.length(1);
      done();
    });
  });

  it('active', done => {
    vm = createVue({
      template: `
        <hzq-steps :active="active" finish-status="error">
          <hzq-step title="abc"></hzq-step>
          <hzq-step title="abc2"></hzq-step>
        </hzq-steps>
      `,

      data() {
        return { active: 0 };
      }
    });

    vm.$nextTick(_ => {
      expect(vm.$el.querySelectorAll('.hzq-step__head.is-error')).to.length(0);
      vm.active = 2;
      vm.$nextTick(_ => {
        expect(vm.$el.querySelectorAll('.hzq-step__head.is-error')).to.length(2);
        done();
      });
    });
  });

  it('create vertical', () => {
    vm = createVue(`
      <hzq-steps direction="vertical">
        <hzq-step title="aaa"></hzq-step>
        <hzq-step title="bbb"></hzq-step>
      </hzq-steps>
    `);

    expect(vm.$el.querySelector('.is-vertical')).to.exist;
  });

  it('vertical:height', async() => {
    vm = createVue(`
      <hzq-steps direction="vertical" :space="200">
        <hzq-step title="aaa"></hzq-step>
        <hzq-step title="bbb"></hzq-step>
      </hzq-steps>
    `, true);

    await waitImmediate();
    const stepElm = vm.$el.querySelector('.hzq-step');
    expect(getComputedStyle(stepElm).flexBasis).to.equal('200px');
  });

  it('step:status=error', done => {
    vm = createVue(`
      <hzq-steps :active="2" process-status="process" finish-status="success" direction="horizontal">
        <hzq-step title="step1"></hzq-step>
        <hzq-step title="step2" status="error"></hzq-step>
        <hzq-step title="step3"></hzq-step>
      </hzq-steps>
    `);

    vm.$nextTick(_ => {
      const errorLine = vm.$el.querySelector('.hzq-step:nth-child(2) .hzq-step__line-inner');
      expect(errorLine.getBoundingClientRect().width).to.equal(0);
      const nextStep = vm.$el.querySelector('.hzq-step:nth-child(3) .hzq-step__head');
      expect(nextStep.classList.contains('is-wait')).to.equal(true);
      done();
    });
  });
});
