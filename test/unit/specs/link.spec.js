import { createTest, createVue, destroyVM, wait } from '../util';
import Link from 'packages/link';

describe('Link', () => {
  let vm;
  afterEach(() => {
    destroyVM(vm);
  });

  it('create', () => {
    vm = createTest(Link, {
      type: 'primary'
    }, true);
    let linkElm = vm.$el;
    expect(linkElm.classList.contains('el-link--primary')).to.be.true;
  });
  it('icon', () => {
    vm = createTest(Link, {
      icon: 'el-icon-search'
    }, true);
    let linkElm = vm.$el;
    expect(linkElm.querySelector('.el-icon-search')).to.be.ok;
  });
  it('href', () => {
    vm = createTest(Link, {
      href: 'https://element.eleme.io/'
    }, true);
    let linkElm = vm.$el;
    expect(linkElm.getAttribute('href')).to.be.equal('https://element.eleme.io/');
  });
  it('target', () => {
    vm = createVue(`
    <el-link href="https://element.eleme.io" target="_blank">
      default
    </el-link>
    `);
    let linkElm = vm.$el;
    expect(linkElm.getAttribute('target')).to.be.equal('_blank');
  });
  it('disabled', () => {
    vm = createTest(Link, {
      disabled: true
    }, true);
    let linkElm = vm.$el;
    expect(linkElm.classList.contains('is-disabled')).to.be.true;
  });

  it('loading', () => {
    vm = createTest(Link, {
      loading: true,
      icon: 'el-icon-edit',
      href: 'https://element.eleme.io/'
    }, true);
    let linkElm = vm.$el;
    expect(linkElm.classList.contains('is-loading')).to.be.true;
    expect(linkElm.querySelector('.el-icon-loading')).to.be.ok;
    expect(linkElm.querySelector('.el-icon-edit')).to.not.exist;
    expect(linkElm.getAttribute('href')).to.not.exist;
  });

  it('click', async() => {
    let result;
    vm = createVue({
      template: `
        <el-link @click="handleClick"></el-link>
      `,
      methods: {
        handleClick(evt) {
          result = evt;
        }
      }
    }, true);
    vm.$el.click();
    await wait();
    expect(result).to.exist;
  });

  it('loading works with disabled and type', () => {
    vm = createTest(Link, {
      loading: true,
      disabled: true,
      type: 'success',
      underline: true
    }, true);
    let linkElm = vm.$el;
    expect(linkElm.classList.contains('is-loading')).to.be.true;
    expect(linkElm.classList.contains('is-disabled')).to.be.true;
    expect(linkElm.classList.contains('el-link--success')).to.be.true;
    expect(linkElm.classList.contains('is-underline')).to.be.false;
  });

  it('loading implies disabled', async() => {
    let result;
    vm = createVue({
      template: `
        <el-link loading @click="handleClick">loading</el-link>
      `,
      methods: {
        handleClick(evt) {
          result = evt;
        }
      }
    }, true);
    vm.$el.click();
    await wait();
    expect(result).to.not.exist;
  });

});

