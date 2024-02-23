<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="60%"
    title="查看"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-loading="loading">
      <a-descriptions :column="4" bordered>
        <a-descriptions-item label="文件名" :span="4">
          {{ formData.name }}
        </a-descriptions-item>
        <a-descriptions-item v-if="!$utils.isEmpty(formData.url) && showPreview" label="预览" :span="4">
          <a-image :width="80" :src="formData.url" @error="() => (showPreview = false)" />
        </a-descriptions-item>
        <a-descriptions-item v-if="!$utils.isEmpty(formData.url)" label="下载链接" :span="4">
          <a :href="formData.url" target="_blank">点此下载</a>
        </a-descriptions-item>
        <a-descriptions-item label="文件大小" :span="2">
          {{ $utils.isEmpty(formData.fileSize) ? '-' : formData.fileSize }}
        </a-descriptions-item>
        <a-descriptions-item label="上传类型" :span="2">
          {{ $utils.isEmpty(formData.contentType) ? '-' : formData.contentType }}
        </a-descriptions-item>
        <a-descriptions-item label="上传时间" :span="2">
          {{ formData.createTime }}
        </a-descriptions-item>
        <a-descriptions-item label="上传人" :span="2">
          {{ formData.createBy }}
        </a-descriptions-item>
        <a-descriptions-item label="备注" :span="4">
          {{ formData.description }}
        </a-descriptions-item>
      </a-descriptions>
    </div>
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';
  import * as api from '@/api/smart-work/file-box';

  export default defineComponent({
    // 使用组件
    components: {},

    props: {
      id: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        // 是否可见
        visible: false,
        // 是否显示预览
        showPreview: true,
        // 是否显示加载框
        loading: false,
        // 表单数据
        formData: {},
      };
    },
    created() {
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
        this.showPreview = true;
        this.formData = {
          id: '',
          name: '',
          url: '',
          fileSize: '',
          contentType: '',
          description: '',
          createTime: '',
          createBy: '',
        };
      },
      // 页面显示时触发
      open() {
        // 初始化数据
        this.initFormData();

        // 查询数据
        this.loadFormData();
      },
      // 查询数据
      async loadFormData() {
        this.loading = true;
        api
          .get(this.id)
          .then((data) => {
            this.formData = data;
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
  });
</script>
