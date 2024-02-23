<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    title="上传文件"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-loading="loading">
      <a-upload-dragger
        v-model:fileList="fileList"
        name="file"
        :multiple="false"
        :custom-request="onRequest"
      >
        <p class="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p class="ant-upload-text">点击或将文件拖拽到此区域进行上传</p>
      </a-upload-dragger>
    </div>
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';
  import * as api from '@/api/smart-work/file-box';
  import { InboxOutlined } from '@ant-design/icons-vue';

  export default defineComponent({
    components: {
      InboxOutlined,
    },
    props: {
      parentPath: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        fileList: [],
        // 是否可见
        visible: false,
        // 是否显示加载框
        loading: false,
      };
    },
    computed: {},
    created() {
      // 初始化表单数据
      this.initFormData();
    },
    methods: {
      // 打开对话框 由父页面触发
      openDialog() {
        this.visible = true;

        this.$nextTick(() => this.open());
      },
      // 关闭对话框
      closeDialog() {
        this.visible = false;
        this.$emit('close');
      },
      // 初始化表单数据
      initFormData() {
        this.fileList = []
      },
      // 页面显示时触发
      open() {
        // 初始化表单数据
        this.initFormData();
      },
      onRequest(e) {
        this.loading = true;
        const params = {
          file: e.file,
          path: this.parentPath,
        };
        api
          .upload(params)
          .then(() => {
            e.onSuccess({ status: 'success' }, e.file);
            this.$msg.createSuccess('上传成功！');
            this.$emit('confirm');
            this.visible = false;
          })
          .catch(() => {
            e.onError({ status: 'error' }, e.file);
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
  });
</script>
