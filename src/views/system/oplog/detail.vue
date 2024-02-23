<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="50%"
    title="查看"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-permission="['system:oplog:query']" v-loading="loading">
      <a-descriptions bordered :xs="4" :sm="2" :md="2">
        <a-descriptions-item label="日志名称" :span="4">{{ formData.name }}</a-descriptions-item>
        <a-descriptions-item label="日志类型" :span="2">{{
          $enums.OP_LOG_TYPE.getDesc(formData.logType)
        }}</a-descriptions-item>
        <a-descriptions-item label="IP地址" :span="2">{{ formData.ip }}</a-descriptions-item>
        <a-descriptions-item label="创建人" :span="2">{{ formData.createBy }}</a-descriptions-item>
        <a-descriptions-item label="创建时间" :span="2">{{
          formData.createTime
        }}</a-descriptions-item>
        <a-descriptions-item label="补充信息" :span="4"
          ><a-textarea
            v-if="!$utils.isEmpty(formData.extra)"
            v-model:value="formData.extra"
            readonly
            @click="handleClipboard(formData.extra, $event)"
        /></a-descriptions-item>
      </a-descriptions>
    </div>
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';
  import clipboard from '@/utils/clipboard';
  import * as api from '@/api/system/op-log';

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
          name: '',
          logType: '',
          ip: '',
          createBy: '',
          createTime: '',
          extra: '',
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
        api
          .get(this.id)
          .then((data) => {
            this.formData = data;
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
