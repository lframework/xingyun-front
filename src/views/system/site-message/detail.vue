<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="80%"
    :title="formData.title"
    :style="{ top: '20px' }"
    :body-style="{ minHeight: '500px' }"
    :footer="null"
  >
    <div v-if="visible" v-loading="loading" class="whitespace-pre-line">
      {{ formData.content }}
    </div>
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';
  import * as api from '@/api/system/site-message';

  export default defineComponent({
    // 使用组件
    components: {},
    props: {
      id: {
        type: String,
        required: true,
      },
      req: {
        type: Function,
        default: api.getContent,
      },
    },
    data() {
      return {
        // 是否可见
        visible: false,
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
        this.formData = {
          id: '',
          title: '',
          content: '',
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
      loadFormData() {
        this.loading = true;
        this.req(this.id)
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
