import { createVue, destroyVM } from '../util';

describe('Popconfirm', () => {
  let vm;
  afterEach(() => {
    destroyVM(vm);
  });

  describe('trigger', () => {
    const createVM = () => {
      return createVue(`
        <div>
          <hzq-popconfirm
            ref="popover"
            title="content">
            <button slot="reference">trigger</button>
          </hzq-popconfirm>
        </div>
      `, true);
    };
    it('click', () => {
      vm = createVM();
      vm.$el.querySelector('button').click();
      document.body.click();
      expect(document.body.querySelector('.hzq-popconfirm__action').style.display).to.equal('');
    });
  });

});
