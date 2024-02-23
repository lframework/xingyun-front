<template>
  <div v-if="visible">
    <div v-loading="loading">
      <a-card>
        <a-tabs v-model:active-key="activeName" tab-position="left">
          <a-tab-pane v-for="(obj, index) in formData" :key="index" :tab="index">
            <div>
              <div class="gen-toolbar">
                <a-button type="link" :icon="h(CopyOutlined)" @click="handleClipboard(obj, $event)"
                  >复制</a-button
                >
              </div>
              <span style="white-space: pre-wrap; line-height: 1.5">{{ obj }}</span>
            </div>
          </a-tab-pane>
        </a-tabs>
        <div class="form-modal-footer">
          <a-space>
            <a-button :loading="loading" type="primary" @click="download">下载</a-button>
            <a-button :loading="loading" @click="closeDialog">关闭</a-button>
          </a-space>
        </div>
      </a-card>
    </div>
  </div>
</template>
<script>
  import { h, defineComponent } from 'vue';
  import clipboard from '@/utils/clipboard';
  import * as api from '@/api/development/data/entity';
  import { CopyOutlined } from '@ant-design/icons-vue';

  export default defineComponent({
    // 使用组件
    components: {},

    props: {
      id: {
        type: String,
        required: true,
      },
    },
    setup() {
      return {
        h,
        CopyOutlined,
      };
    },
    data() {
      return {
        // 是否显示加载框
        loading: false,
        visible: false,
        // 表单数据
        formData: {},
        activeName: '',
      };
    },
    created() {
      this.initFormData();
    },
    methods: {
      CopyOutlined,
      // 打开对话框 由父页面触发
      openDialog() {
        // 初始化表单数据
        this.initFormData();
        this.visible = true;
        this.loadData();
      },
      // 关闭对话框
      closeDialog() {
        this.visible = false;
        this.$emit('close');
      },
      // 初始化表单数据
      initFormData() {
        this.formData = [];
      },
      // 查询数据
      loadData() {
        this.loading = true;
        api
          .preview(this.id)
          .then((data) => {
            this.formData = data;
            this.activeName = this.$utils.keys(this.formData)[0];
          })
          .finally(() => {
            this.loading = false;
          });
      },
      download() {
        this.loading = true;
        api
          .download(this.id)
          .then(() => {
            this.$msg.createSuccess('下载成功！');
          })
          .finally(() => {
            this.loading = false;
          });
      },
      handleClipboard(text, event) {
        clipboard(text, event);
      },
    },
  });
</script>
<style scoped>
  .gen-toolbar {
    margin-bottom: 5px;
  }
</style>
