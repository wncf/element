<style lang="scss">
.component-preview {
  padding-right: 10px;
  &:last-of-type {
    padding-bottom: 20px;
  }
  h4 {
    font-size: 20px;
    margin: 40px 0 20px;
    color: #909399
  }
  .demo-item {
    margin-top: 10px;
    margin-right: 40px;
  }

  .demo-line {
    margin: 15px 0;
  }

  .hzq-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .hzq-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
  }

  .hzq-avatar:not(:last-child) {
    margin-right: 20px;
  }

  .avatar-demo {
    display: flex;
    align-items: center;
  }
}
</style>
<template>
  <div class="component-preview">
    <h4>Button</h4>
    <hzq-row class="demo-line">
      <hzq-button>Default</hzq-button>
      <hzq-button type="primary">Primary</hzq-button>
      <hzq-button type="success">Success</hzq-button>
      <hzq-button type="info">Info</hzq-button>
      <hzq-button type="warning">Warning</hzq-button>
      <hzq-button type="danger">Danger</hzq-button>
    </hzq-row>
    <hzq-row class="demo-line">
      <hzq-button plain>Plain</hzq-button>
      <hzq-button type="primary" plain>Primary</hzq-button>
      <hzq-button type="success" plain>Success</hzq-button>
      <hzq-button type="info" plain>Info</hzq-button>
      <hzq-button type="warning" plain>Warning</hzq-button>
      <hzq-button type="danger" plain>Danger</hzq-button>
    </hzq-row>
    <hzq-row class="demo-line">
      <hzq-button round>Round</hzq-button>
      <hzq-button type="primary" round>Primary</hzq-button>
      <hzq-button type="success" round>Success</hzq-button>
      <hzq-button type="info" round>Info</hzq-button>
      <hzq-button type="warning" round>Warning</hzq-button>
      <hzq-button type="danger" round>Danger</hzq-button>
    </hzq-row>
    <hzq-row class="demo-line">
      <hzq-button icon="hzq-icon-search" circle></hzq-button>
      <hzq-button type="primary" icon="hzq-icon-edit" circle></hzq-button>
      <hzq-button type="success" icon="hzq-icon-check" circle></hzq-button>
      <hzq-button type="info" icon="hzq-icon-message" circle></hzq-button>
      <hzq-button type="warning" icon="hzq-icon-star-off" circle></hzq-button>
      <hzq-button type="danger" icon="hzq-icon-delete" circle></hzq-button>
    </hzq-row>
    <hzq-row class="demo-line">
      <hzq-button>Default</hzq-button>
      <hzq-button size="medium">Medium</hzq-button>
      <hzq-button size="small">Small</hzq-button>
      <hzq-button size="mini">Mini</hzq-button>
    </hzq-row>
    <h4>Radio</h4>
    <hzq-row class="demo-line">
      <hzq-radio v-model="radio" label="1">Option A</hzq-radio>
      <hzq-radio v-model="radio" label="2">Option B</hzq-radio>
    </hzq-row>
    <hzq-row class="demo-line">
      <hzq-radio-group v-model="radio1">
        <hzq-radio-button label="New York"></hzq-radio-button>
        <hzq-radio-button label="Washington"></hzq-radio-button>
        <hzq-radio-button label="Los Angeles"></hzq-radio-button>
        <hzq-radio-button label="Chicago"></hzq-radio-button>
      </hzq-radio-group>
    </hzq-row>
    <hzq-row class="demo-line">
      <hzq-radio v-model="radio2" label="1" border>Option A</hzq-radio>
      <hzq-radio v-model="radio2" label="2" border>Option B</hzq-radio>
    </hzq-row>
    <h4>Checkbox</h4>
    <hzq-row class="demo-line">
      <hzq-checkbox v-model="checked">Option</hzq-checkbox>
    </hzq-row>
    <hzq-row class="demo-line">
      <hzq-checkbox-group v-model="checked1">
        <hzq-checkbox-button v-for="city in ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen']" :label="city" :key="city">{{city}}</hzq-checkbox-button>
      </hzq-checkbox-group>
    </hzq-row>
    <hzq-row class="demo-line">
      <hzq-checkbox v-model="checked2" label="Option1" border></hzq-checkbox>
    </hzq-row>
    <h4>Input</h4>
    <hzq-row style="width: 180px">
      <hzq-input placeholder="Please input" v-model="input"></hzq-input>
    </hzq-row>
    <h4>InputNumber</h4>
    <hzq-row>
      <hzq-input-number v-model="inputNumber" :min="1" :max="10"></hzq-input-number>
    </hzq-row>
    <h4>Select</h4>
    <hzq-row>
      <hzq-select v-model="selectValue" placeholder="Select">
        <hzq-option
          v-for="item in selectOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></hzq-option>
      </hzq-select>
    </hzq-row>
    <h4>Cascader</h4>
    <hzq-row>
      <hzq-cascader :options="cascadeOptions" v-model="cascaderValue"></hzq-cascader>
    </hzq-row>
    <h4>Switch</h4>
    <hzq-row>
      <hzq-switch v-model="switchValue"></hzq-switch>
      <hzq-switch
        style="margin-left: 40px"
        v-model="switchValue"
        active-text="Pay by month"
        inactive-text="Pay by year">
      </hzq-switch>
    </hzq-row>
    <h4>Slider</h4>
    <hzq-row style="width: 380px">
      <hzq-slider v-model="slider"></hzq-slider>
    </hzq-row>
    <h4>DatePicker</h4>
    <hzq-row>
      <hzq-date-picker v-model="datePicker" type="date"></hzq-date-picker>
    </hzq-row>
    <h4>Rate</h4>
    <hzq-row>
      <hzq-rate class="demo-line" v-model="rate"></hzq-rate>
      <hzq-rate
        class="demo-line"
        v-model="rate"
        show-score
        text-color="#ff9900"
        score-template="{value} points">
      </hzq-rate>
    </hzq-row>
    <h4>Transfer</h4>
    <hzq-row>
      <hzq-transfer v-model="transfer" filterable :data="transferData">
        <hzq-button class="transfer-footer" slot="left-footer" size="small">Operation</hzq-button>
        <hzq-button class="transfer-footer" slot="right-footer" size="small">Operation</hzq-button>
      </hzq-transfer>
    </hzq-row>
    <h4>Table</h4>
    <hzq-row>
      <hzq-table :data="tableData" style="width: 70%">
        <hzq-table-column prop="date" label="Date" width="180"></hzq-table-column>
        <hzq-table-column prop="name" label="Name" width="180"></hzq-table-column>
        <hzq-table-column prop="address" label="Address"></hzq-table-column>
      </hzq-table>
    </hzq-row>
    <h4>Tag</h4>
    <hzq-row>
      <hzq-tag class="demo-item" closable>Tag One</hzq-tag>
      <hzq-tag class="demo-item" closable type="success">Tag Two</hzq-tag>
      <hzq-tag class="demo-item" closable type="info">Tag Three</hzq-tag>
      <hzq-tag class="demo-item" closable type="warning">Tag Four</hzq-tag>
      <hzq-tag class="demo-item" closable type="danger">Tag Five</hzq-tag>
    </hzq-row>
    <h4>Progress</h4>
    <hzq-row style="width: 380px">
      <hzq-progress :percentage="20"></hzq-progress>
      <hzq-progress :percentage="60" status="exception"></hzq-progress>
      <hzq-progress :percentage="100" status="success"></hzq-progress>
    </hzq-row>
    <h4>Tree</h4>
    <hzq-row style="width: 380px">
      <hzq-tree :data="treeData" :props="defaultTreeProps" ></hzq-tree>
    </hzq-row>
    <h4>Pagination</h4>
    <hzq-row>
      <hzq-pagination layout="prev, pager, next" :total="1000"></hzq-pagination>
    </hzq-row>
    <h4>Badge</h4>
    <hzq-row>
      <hzq-badge :value="12" class="demo-item">
        <hzq-button size="small">comments</hzq-button>
      </hzq-badge>
      <hzq-badge :value="3" class="demo-item">
        <hzq-button size="small">replies</hzq-button>
      </hzq-badge>
      <hzq-badge :value="1" class="demo-item" type="primary">
        <hzq-button size="small">comments</hzq-button>
      </hzq-badge>
      <hzq-badge :value="2" class="demo-item" type="warning">
        <hzq-button size="small">replies</hzq-button>
      </hzq-badge>
    </hzq-row>
    <h4>Alert</h4>
    <hzq-row style="width: 380px;">
      <hzq-alert class="demo-item" title="success alert" type="success" show-icon></hzq-alert>
      <hzq-alert class="demo-item" title="info alert" type="info" close-text="Gotcha" show-icon></hzq-alert>
      <hzq-alert class="demo-item" title="warning alert" type="warning" show-icon></hzq-alert>
      <hzq-alert
        class="demo-item"
        title="error alert"
        type="error"
        description="more text description"
        show-icon>
      </hzq-alert>
    </hzq-row>
    <h4>Loading</h4>
    <hzq-row>
      <hzq-table :data="tableData" style="width: 90%" v-loading="true">
        <hzq-table-column prop="date" label="Date" width="180"></hzq-table-column>
        <hzq-table-column prop="name" label="Name" width="180"></hzq-table-column>
        <hzq-table-column prop="address" label="Address"></hzq-table-column>
      </hzq-table>
    </hzq-row>
    <h4>Message</h4>
    <hzq-row>
      <div role="alert" class="demo-item hzq-message hzq-message--success hzq-message-fade-leave-active hzq-message-fade-leave-to" style="top: 0;left: 0;width: 100px; opacity: 1; position: relative;transform: none;"><i class="hzq-message__icon hzq-icon-success"></i><p class="hzq-message__content">Congrats, this is a success message.</p><!----></div>
      <div role="alert" class="demo-item hzq-message hzq-message--warning hzq-message-fade-leave-active hzq-message-fade-leave-to" style="top: 0;left: 0;width: 100px; opacity: 1; position: relative;transform: none;"><i class="hzq-message__icon hzq-icon-warning"></i><p class="hzq-message__content">Warning, this is a warning message.</p><!----></div>
      <div role="alert" class="demo-item hzq-message hzq-message--info hzq-message-fade-leave-active hzq-message-fade-leave-to" style="top: 0;left: 0;width: 100px; opacity: 1; position: relative;transform: none;"><i class="hzq-message__icon hzq-icon-info"></i><p class="hzq-message__content">This is a message.</p><!----></div>
      <div role="alert" class="demo-item hzq-message hzq-message--error is-closable hzq-message-fade-leave-active hzq-message-fade-leave-to" style="top: 0;left: 0;width: 100px; opacity: 1; position: relative;transform: none;"><i class="hzq-message__icon hzq-icon-error"></i><p class="hzq-message__content">Oops, this is a error message.</p><i class="hzq-message__closeBtn hzq-icon-close"></i></div>
    </hzq-row>
    <h4>Notification</h4>
    <hzq-row>
      <div role="alert" class="hzq-notification right" style="position: relative; left: 0;"><!----><div class="hzq-notification__group"><span class="hzq-notification__title">Notification</span><div class="hzq-notification__content"><div>This is a message </div></div><div class="hzq-notification__closeBtn hzq-icon-close"></div></div></div>
    </hzq-row>
    <h4>Menu</h4>
    <hzq-row>
      <hzq-menu :default-active="menu" class="hzq-menu-demo" mode="horizontal">
        <hzq-menu-item index="1">Processing Center</hzq-menu-item>
        <hzq-submenu index="2">
          <template slot="title">Workspace</template>
          <hzq-menu-item index="2-1">item one</hzq-menu-item>
          <hzq-menu-item index="2-2">item two</hzq-menu-item>
          <hzq-menu-item index="2-3">item three</hzq-menu-item>
          <hzq-submenu index="2-4">
            <template slot="title">item four</template>
            <hzq-menu-item index="2-4-1">item one</hzq-menu-item>
            <hzq-menu-item index="2-4-2">item two</hzq-menu-item>
            <hzq-menu-item index="2-4-3">item three</hzq-menu-item>
          </hzq-submenu>
        </hzq-submenu>
        <hzq-menu-item index="3" disabled>Info</hzq-menu-item>
        <hzq-menu-item index="4">
          <a href="https://www.ele.me" target="_blank">Orders</a>
        </hzq-menu-item>
      </hzq-menu>
      <hzq-menu
        default-active="2"
        class="demo-line"
      >
        <hzq-submenu index="1">
          <template slot="title">
            <i class="hzq-icon-location"></i>
            <span>Navigator One</span>
          </template>
          <hzq-menu-item-group title="Group One">
            <hzq-menu-item index="1-1">item one</hzq-menu-item>
            <hzq-menu-item index="1-2">item one</hzq-menu-item>
          </hzq-menu-item-group>
          <hzq-menu-item-group title="Group Two">
            <hzq-menu-item index="1-3">item three</hzq-menu-item>
          </hzq-menu-item-group>
          <hzq-submenu index="1-4">
            <template slot="title">item four</template>
            <hzq-menu-item index="1-4-1">item one</hzq-menu-item>
          </hzq-submenu>
        </hzq-submenu>
        <hzq-menu-item index="2">
          <i class="hzq-icon-menu"></i>
          <span>Navigator Two</span>
        </hzq-menu-item>
        <hzq-menu-item index="3" disabled>
          <i class="hzq-icon-document"></i>
          <span>Navigator Three</span>
        </hzq-menu-item>
        <hzq-menu-item index="4">
          <i class="hzq-icon-setting"></i>
          <span>Navigator Four</span>
        </hzq-menu-item>
      </hzq-menu>
    </hzq-row>
    <h4>Tabs</h4>
    <hzq-row>
      <hzq-tabs v-model="tab" class="demo-item">
        <hzq-tab-pane label="User" name="first">User</hzq-tab-pane>
        <hzq-tab-pane label="Config" name="second">Config</hzq-tab-pane>
        <hzq-tab-pane label="Role" name="third">Role</hzq-tab-pane>
        <hzq-tab-pane label="Task" name="fourth">Task</hzq-tab-pane>
      </hzq-tabs>
      <hzq-tabs type="card" class="demo-item">
        <hzq-tab-pane label="User">User</hzq-tab-pane>
        <hzq-tab-pane label="Config">Config</hzq-tab-pane>
        <hzq-tab-pane label="Role">Role</hzq-tab-pane>
        <hzq-tab-pane label="Task">Task</hzq-tab-pane>
      </hzq-tabs>
    </hzq-row>
    <h4>Dialog</h4>
    <hzq-row>
      <div role="dialog" aria-modal="true" aria-label="Tips" class="hzq-dialog" style="margin: 0"><div class="hzq-dialog__header"><span class="hzq-dialog__title">Tips</span><button type="button" aria-label="Close" class="hzq-dialog__headerbtn"><i class="hzq-dialog__close hzq-icon hzq-icon-close"></i></button></div><div class="hzq-dialog__body"><span>This is a message</span> </div><div class="hzq-dialog__footer"><span class="dialog-footer"><button type="button" class="hzq-button hzq-button--default"><!----><!----><span>Cancel</span></button> <button type="button" class="hzq-button hzq-button--primary"><!----><!----><span>Confirm</span></button></span></div></div>
    </hzq-row>
    <h4>Tooltip</h4>
    <hzq-row>
      <div role="tooltip" x-placement="top" class="hzq-tooltip__popper is-dark" style="position: relative; width: 40px;text-align: center;">Dark<div x-arrow="" class="popper__arrow"></div>
      </div>
      <div role="tooltip" x-placement="top" class="hzq-tooltip__popper is-light" style="margin-top: 10px;position: relative; width: 40px;text-align: center;">Light<div x-arrow="" class="popper__arrow"></div>
      </div>
    </hzq-row>
    <h4>Popover</h4>
    <hzq-row>
      <div role="tooltip" x-placement="top" id="hzq-popover-2936" aria-hidden="true" class="hzq-popover hzq-popper hzq-popover--plain" tabindex="0" style="width: 200px; position: relative; "><div class="hzq-popover__title">Title</div>this is content, this is content, this is content<div x-arrow="" class="popper__arrow"></div></div>
    </hzq-row>
    <h4>Card</h4>
    <hzq-row>
      <hzq-card class="box-card">
        <div slot="header" class="clearfix">
          <span>Card name</span>
        </div>
      </hzq-card>
    </hzq-row>
    <h4>Carousel</h4>
    <hzq-row>
      <hzq-carousel height="150px">
        <hzq-carousel-item v-for="item in 4" :key="item">
          <h3>{{ item }}</h3>
        </hzq-carousel-item>
      </hzq-carousel>
    </hzq-row>
    <h4>Collapse</h4>
    <hzq-row>
      <hzq-collapse v-model="collapse">
        <hzq-collapse-item title="Consistent" name="1">
          <div>Consistent with real life: in line with the process and logic of real life, and comply with languages and habits that the users are used to;</div>
        </hzq-collapse-item>
        <hzq-collapse-item title="Feedback" name="2">
          <div>Operation feedback: enable the users to clearly perceive their operations by style updates and interactive effects;</div>
        </hzq-collapse-item>
      </hzq-collapse>
    </hzq-row>
    <h4>Avatar</h4>
    <hzq-row class="demo-line avatar-demo">
      <hzq-avatar icon="hzq-icon-user-solid"/>
      <hzq-avatar> avatar </hzq-avatar>
      <hzq-avatar shape="square" fit="contain" :src="avatarData.url"></hzq-avatar>
      <hzq-avatar size="large"> large </hzq-avatar>
      <hzq-avatar size="medium"> medium </hzq-avatar>
      <hzq-avatar size="small"> small </hzq-avatar>
    </hzq-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      radio: '1',
      radio1: 'Washington',
      radio2: '1',
      checked: true,
      checked1: ['Shanghai'],
      checked2: true,
      input: 'Element',
      inputNumber: 1,
      selectOptions: [
        {
          value: 'Option1',
          label: 'Option1'
        },
        {
          value: 'Option2',
          label: 'Option2'
        },
        {
          value: 'Option3',
          label: 'Option3'
        },
        {
          value: 'Option4',
          label: 'Option4'
        },
        {
          value: 'Option5',
          label: 'Option5'
        }
      ],
      selectValue: '',
      cascadeOptions: [
        {
          value: 'guide',
          label: 'Guide',
          children: [
            {
              value: 'disciplines',
              label: 'Disciplines',
              children: [
                {
                  value: 'consistency',
                  label: 'Consistency'
                },
                {
                  value: 'feedback',
                  label: 'Feedback'
                }
              ]
            }
          ]
        },
        {
          value: 'resource',
          label: 'Resource',
          children: [
            {
              value: 'axure',
              label: 'Axure Components'
            },
            {
              value: 'sketch',
              label: 'Sketch Templates'
            },
            {
              value: 'docs',
              label: 'Design Documentation'
            }
          ]
        }
      ],
      cascaderValue: [],
      switchValue: true,
      slider: 28,
      datePicker: '',
      rate: null,
      transferData: (() => {
        const data = [];
        for (let i = 1; i <= 15; i++) {
          data.push({
            key: i,
            label: `Option ${i}`,
            disabled: i % 4 === 0
          });
        }
        return data;
      })(),
      transfer: [1, 4],
      tableData: [
        {
          date: '2016-05-03',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles'
        },
        {
          date: '2016-05-02',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles'
        },
        {
          date: '2016-05-04',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles'
        },
        {
          date: '2016-05-01',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles'
        }
      ],
      menu: '1',
      tab: 'first',
      collapse: ['1'],
      treeData: [{
        label: 'Level one 1',
        children: [{
          label: 'Level two 1-1',
          children: [{
            label: 'Level three 1-1-1'
          }]
        }]
      }, {
        label: 'Level one 2',
        children: [{
          label: 'Level two 2-1',
          children: [{
            label: 'Level three 2-1-1'
          }]
        }, {
          label: 'Level two 2-2',
          children: [{
            label: 'Level three 2-2-1'
          }]
        }]
      }, {
        label: 'Level one 3',
        children: [{
          label: 'Level two 3-1',
          children: [{
            label: 'Level three 3-1-1'
          }]
        }, {
          label: 'Level two 3-2',
          children: [{
            label: 'Level three 3-2-1'
          }]
        }]
      }],
      defaultTreeProps: {
        children: 'children',
        label: 'label'
      },
      avatarData: {
        url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
      }
    };
  }
};
</script>
