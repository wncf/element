## Upload 上传

通过点击或者拖拽上传文件。文件列表由 `file-list` 作用域插槽自行渲染，样式与布局完全由你决定。

### 点击上传

通过 slot 你可以传入自定义的上传按钮类型和文字提示。可通过设置 `limit` 和 `on-exceed` 来限制上传文件的个数和定义超出限制时的行为。可通过设置 `before-remove` 来阻止文件移除操作。

通过 file-list 插槽拿到文件列表，`list` 中每一项包含 `name`、`size`、`status`（`ready` / `uploading` / `success` / `fail`）、`percentage`、`uid`、`raw`、`url`、`response` 等字段。调用组件实例的 `remove(file)` 即可删除，组件会负责中断请求并触发 `on-remove`。

:::demo
```html
<hzq-upload
  ref="upload"
  class="upload-demo"
  action="https://jsonplaceholder.typicode.com/posts/"
  :on-remove="handleRemove"
  :before-remove="beforeRemove"
  multiple
  :limit="3"
  :on-exceed="handleExceed"
  :file-list="fileList">
  <hzq-button size="small" type="primary">点击上传</hzq-button>
  <div slot="tip" class="hzq-upload__tip">只能上传jpg/png文件，且不超过500kb</div>

  <template slot="file-list" slot-scope="{ list }">
    <ul class="demo-file-list">
      <li v-for="item in list" :key="item.uid" class="demo-file-list__item">
        <i class="hzq-icon-document"></i>
        <span class="demo-file-list__name">{{ item.name }}</span>
        <span v-if="item.status === 'uploading'" class="demo-file-list__percent">{{ item.percentage }}%</span>
        <span v-if="item.status === 'success'" class="demo-file-list__status">已上传</span>
        <span v-if="item.status === 'fail'" class="demo-file-list__status is-fail">失败</span>
        <i class="hzq-icon-close" @click="$refs.upload.remove(item)"></i>
      </li>
    </ul>
  </template>
</hzq-upload>
<script>
  export default {
    data() {
      return {
        fileList: [{
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }, {
          name: 'food2.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }]
      };
    },
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return new Promise((resolve, reject) => {
          this.$dialog({
            title: '提示',
            type: 'confirm',
            content: `确定移除 ${ file.name }？`,
            confirm: instance => {
              // 先关闭弹窗，再放行删除
              instance.close();
              resolve();
            },
            cancel: reject
          });
        });
      }
    }
  }
</script>
<style>
  .demo-file-list {
    margin: 8px 0 0;
    padding: 0;
    list-style: none;
    text-align: left;
  }
  .demo-file-list__item {
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 1.8;
    color: #606266;
  }
  .demo-file-list__name {
    flex: 1;
    margin-left: 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .demo-file-list__percent {
    margin-right: 8px;
    color: #409eff;
  }
  .demo-file-list__status {
    margin-right: 8px;
    font-size: 12px;
    color: #67c23a;
  }
  .demo-file-list__status.is-fail {
    color: #f56c6c;
  }
  .demo-file-list__item .hzq-icon-close {
    cursor: pointer;
    color: #909399;
  }
  .demo-file-list__item .hzq-icon-close:hover {
    color: #409eff;
  }
</style>
```
:::

### 用户头像上传

使用 `before-upload` 限制用户上传的图片格式和大小。不需要列表时，不写 file-list 插槽即可。

:::demo
```html
<hzq-upload
  class="avatar-uploader"
  action="https://jsonplaceholder.typicode.com/posts/"
  :on-success="handleAvatarSuccess"
  :before-upload="beforeAvatarUpload">
  <img v-if="imageUrl" :src="imageUrl" class="avatar">
  <i v-else class="hzq-icon-plus avatar-uploader-icon"></i>
</hzq-upload>

<script>
  export default {
    data() {
      return {
        imageUrl: ''
      };
    },
    methods: {
      handleAvatarSuccess(res, file) {
        this.imageUrl = file.url || URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
    }
  }
</script>
<style>
  .avatar-uploader .hzq-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .hzq-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
```
:::

### 照片墙

文件对象上的 `url` 由组件统一生成（`URL.createObjectURL`），可直接用作缩略图。用 file-list 插槽渲染卡片，并通过根节点上的 class 用 flex 让卡片与上传按钮平行排列。

:::demo
```html
<hzq-upload
  ref="upload"
  class="picture-wall"
  action="https://jsonplaceholder.typicode.com/posts/"
  multiple>
  <div class="picture-wall__trigger">
    <i class="hzq-icon-plus"></i>
  </div>

  <template slot="file-list" slot-scope="{ list }">
    <div
      v-for="item in list"
      :key="item.uid"
      class="picture-wall__card"
      @mouseenter="hovering = item.uid"
      @mouseleave="hovering = null">
      <img class="picture-wall__img" :src="item.url" alt="">
      <div class="picture-wall__mask" v-show="hovering === item.uid">
        <i class="hzq-icon-zoom-in" @click="handlePreview(item)"></i>
        <i class="hzq-icon-delete" @click="$refs.upload.remove(item)"></i>
      </div>
      <div class="picture-wall__progress" v-if="item.status === 'uploading'">{{ item.percentage }}%</div>
    </div>
  </template>
</hzq-upload>
<hzq-dialog :visible.sync="dialogVisible">
  <img width="100%" :src="dialogImageUrl" alt="">
</hzq-dialog>
<script>
  export default {
    data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        hovering: null
      };
    },
    methods: {
      handlePreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      }
    }
  }
</script>
<style>
  .picture-wall { display: inline-flex; flex-wrap: wrap; text-align: left; }
  .picture-wall__trigger {
    width: 148px;
    height: 148px;
    line-height: 146px;
    text-align: center;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    box-sizing: border-box;
    margin: 0 8px 8px 0;
  }
  .picture-wall__trigger:hover { border-color: #409eff; color: #409eff; }
  .picture-wall__trigger i { font-size: 28px; color: #8c939d; }
  .picture-wall__card {
    position: relative;
    width: 148px;
    height: 148px;
    margin: 0 8px 8px 0;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    overflow: hidden;
  }
  .picture-wall__img { width: 100%; height: 100%; object-fit: cover; }
  .picture-wall__mask {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    color: #fff;
    font-size: 20px;
    background-color: rgba(0, 0, 0, .5);
  }
  .picture-wall__mask i { cursor: pointer; }
  .picture-wall__progress {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #fff;
    background-color: rgba(0, 0, 0, .5);
  }
</style>
```
:::

### 自定义文件缩略图

在插槽里你可以自由拼装每张卡片的内容，例如增加下载入口。操作层通过纯 CSS 在悬停时显示。

:::demo
```html
<hzq-upload
  ref="upload"
  class="picture-wall picture-wall--hover"
  action="https://jsonplaceholder.typicode.com/posts/"
  multiple>
  <div class="picture-wall__trigger">
    <i class="hzq-icon-plus"></i>
  </div>

  <template slot="file-list" slot-scope="{ list }">
    <div v-for="item in list" :key="item.uid" class="picture-wall__card">
      <img class="picture-wall__img" :src="item.url" alt="">
      <div class="picture-wall__mask">
        <i class="hzq-icon-zoom-in" @click="handlePreview(item)"></i>
        <i class="hzq-icon-download" @click="handleDownload(item)"></i>
        <i class="hzq-icon-delete" @click="$refs.upload.remove(item)"></i>
      </div>
    </div>
  </template>
</hzq-upload>
<hzq-dialog :visible.sync="dialogVisible">
  <img width="100%" :src="dialogImageUrl" alt="">
</hzq-dialog>
<script>
  export default {
    data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false
      };
    },
    methods: {
      handlePreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleDownload(file) {
        console.log(file);
      }
    }
  }
</script>
<style>
  .picture-wall { display: inline-flex; flex-wrap: wrap; text-align: left; }
  .picture-wall__trigger {
    width: 148px;
    height: 148px;
    line-height: 146px;
    text-align: center;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    box-sizing: border-box;
    margin: 0 8px 8px 0;
  }
  .picture-wall__trigger:hover { border-color: #409eff; color: #409eff; }
  .picture-wall__trigger i { font-size: 28px; color: #8c939d; }
  .picture-wall__card {
    position: relative;
    width: 148px;
    height: 148px;
    margin: 0 8px 8px 0;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    overflow: hidden;
  }
  .picture-wall__img { width: 100%; height: 100%; object-fit: cover; }
  .picture-wall__mask {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    color: #fff;
    font-size: 20px;
    background-color: rgba(0, 0, 0, .5);
  }
  .picture-wall__mask i { cursor: pointer; }
  .picture-wall__progress {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #fff;
    background-color: rgba(0, 0, 0, .5);
  }
  .picture-wall--hover .picture-wall__mask {
    opacity: 0;
    pointer-events: none;
    transition: opacity .3s;
  }
  .picture-wall--hover .picture-wall__card:hover .picture-wall__mask {
    opacity: 1;
    pointer-events: auto;
  }
</style>
```
:::

### 图片列表缩略图

列表横向排列、每行一张图片时，同样是插槽 + 你自己的 CSS。

:::demo
```html
<hzq-upload
  ref="upload"
  class="upload-demo"
  action="https://jsonplaceholder.typicode.com/posts/"
  :file-list="fileList">
  <hzq-button size="small" type="primary">点击上传</hzq-button>
  <div slot="tip" class="hzq-upload__tip">只能上传jpg/png文件，且不超过500kb</div>

  <template slot="file-list" slot-scope="{ list }">
    <ul class="demo-picture-list">
      <li v-for="item in list" :key="item.uid" class="demo-picture-list__item">
        <img class="demo-picture-list__thumb" :src="item.url" alt="">
        <span class="demo-picture-list__name">{{ item.name }}</span>
        <i class="hzq-icon-close" @click="$refs.upload.remove(item)"></i>
      </li>
    </ul>
  </template>
</hzq-upload>
<script>
  export default {
    data() {
      return {
        fileList: [{
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }, {
          name: 'food2.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }]
      };
    }
  }
</script>
<style>
  .demo-picture-list {
    margin: 10px 0 0;
    padding: 0;
    list-style: none;
    text-align: left;
  }
  .demo-picture-list__item {
    display: flex;
    align-items: center;
    height: 92px;
    padding: 10px;
    margin-top: 10px;
    box-sizing: border-box;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
  }
  .demo-picture-list__thumb {
    width: 70px;
    height: 70px;
    margin-right: 10px;
    object-fit: cover;
  }
  .demo-picture-list__name {
    flex: 1;
    font-size: 14px;
    color: #606266;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .demo-picture-list__item .hzq-icon-close {
    cursor: pointer;
    color: #909399;
  }
  .demo-picture-list__item .hzq-icon-close:hover {
    color: #409eff;
  }
</style>
```
:::

### 上传文件列表控制

通过 `on-change` 钩子函数来对列表进行控制

:::demo
```html
<hzq-upload
  ref="upload"
  class="upload-demo"
  action="https://jsonplaceholder.typicode.com/posts/"
  :on-change="handleChange"
  :file-list="fileList">
  <hzq-button size="small" type="primary">点击上传</hzq-button>
  <div slot="tip" class="hzq-upload__tip">只能上传jpg/png文件，且不超过500kb</div>

  <template slot="file-list" slot-scope="{ list }">
    <ul class="demo-file-list">
      <li v-for="item in list" :key="item.uid" class="demo-file-list__item">
        <i class="hzq-icon-document"></i>
        <span class="demo-file-list__name">{{ item.name }}</span>
        <i class="hzq-icon-close" @click="$refs.upload.remove(item)"></i>
      </li>
    </ul>
  </template>
</hzq-upload>
<script>
  export default {
    data() {
      return {
        fileList: [{
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }, {
          name: 'food2.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }]
      };
    },
    methods: {
      handleChange(file, fileList) {
        this.fileList = fileList.slice(-3);
      }
    }
  }
</script>
<style>
  .demo-file-list {
    margin: 8px 0 0;
    padding: 0;
    list-style: none;
    text-align: left;
  }
  .demo-file-list__item {
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 1.8;
    color: #606266;
  }
  .demo-file-list__name {
    flex: 1;
    margin-left: 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .demo-file-list__percent {
    margin-right: 8px;
    color: #409eff;
  }
  .demo-file-list__status {
    margin-right: 8px;
    font-size: 12px;
    color: #67c23a;
  }
  .demo-file-list__status.is-fail {
    color: #f56c6c;
  }
  .demo-file-list__item .hzq-icon-close {
    cursor: pointer;
    color: #909399;
  }
  .demo-file-list__item .hzq-icon-close:hover {
    color: #409eff;
  }
</style>
```
:::

### 拖拽上传

:::demo
```html
<hzq-upload
  class="upload-demo"
  drag
  action="https://jsonplaceholder.typicode.com/posts/"
  multiple>
  <i class="hzq-icon-upload"></i>
  <div class="hzq-upload__text">将文件拖到此处，或<em>点击上传</em></div>
  <div class="hzq-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
</hzq-upload>
```
:::

### 手动上传

:::demo
```html
<hzq-upload
  class="upload-demo"
  ref="upload"
  action="https://jsonplaceholder.typicode.com/posts/"
  :auto-upload="false">
  <hzq-button slot="trigger" size="small" type="primary">选取文件</hzq-button>
  <hzq-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</hzq-button>
  <div class="hzq-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
</hzq-upload>
<script>
  export default {
    methods: {
      submitUpload() {
        this.$refs.upload.submit();
      }
    }
  }
</script>
```
:::

### Attribute
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| action | 必选参数，上传的地址 | string | — | — |
| headers | 设置上传的请求头部 | object | — | — |
| multiple | 是否支持多选文件 | boolean | — | — |
| data | 上传时附带的额外参数 | object | — | — |
| name | 上传的文件字段名 | string | — | file |
| with-credentials | 支持发送 cookie 凭证信息 | boolean | — | false |
| drag | 是否启用拖拽上传 | boolean | — | false |
| accept | 接受上传的[文件类型](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-accept) | string | — | — |
| on-remove | 文件列表移除文件时的钩子 | function(file, fileList) | — | — |
| on-success | 文件上传成功时的钩子 | function(response, file, fileList) | — | — |
| on-error | 文件上传失败时的钩子 | function(err, file, fileList) | — | — |
| on-progress | 文件上传时的钩子 | function(event, file, fileList) | — | — |
| on-change | 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用 | function(file, fileList) | — | — |
| before-upload | 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。 | function(file) | — | — |
| before-remove | 删除文件之前的钩子，参数为上传的文件和文件列表，若返回 false 或者返回 Promise 且被 reject，则停止删除。| function(file, fileList) | — | — |
| auto-upload | 是否在选取文件后立即进行上传 | boolean | — | true |
| file-list | 上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}] | array | — | [] |
| http-request | 覆盖默认的上传行为，可以自定义上传的实现 | function | — | — |
| disabled | 是否禁用 | boolean | — | false |
| limit | 最大允许上传个数 |  number | — | — |
| on-exceed | 文件超出个数限制时的钩子 | function(files, fileList) | — | - |

### Slot
| name | 说明 |
|------|--------|
| default | 触发文件选择框的内容 |
| trigger | 触发文件选择框的内容（与 default 同时存在时，default 会渲染在组件末尾） |
| tip | 提示说明文字 |
| file-list | 文件列表内容，作用域参数 `{ list }`，为文件对象数组。该区域不触发文件选择框 |

### 文件对象字段
| 字段 | 说明 |
|------|--------|
| uid | 文件唯一标识 |
| name | 文件名 |
| size | 文件大小（字节） |
| status | 状态：`ready` / `uploading` / `success` / `fail` |
| percentage | 上传进度，0-100 |
| raw | 原始 File / Blob 对象 |
| url | 预览地址，组件对所有文件统一通过 `URL.createObjectURL` 生成 |
| response | 上传接口返回的内容 |

### Methods
| 方法名      | 说明          | 参数 |
|----------- |-------------- | -- |
| clearFiles | 清空已上传的文件列表（该方法不支持在 before-upload 中调用） | — |
| abort      | 取消上传请求    | （ file: fileList 中的 file 对象 ） |
| submit     | 手动上传文件列表 |  —                                |
| remove     | 从列表中移除指定文件，会中断其上传请求并触发 on-remove | （ file: fileList 中的 file 对象 ） |
