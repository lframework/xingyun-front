<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    title="查看"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-permission="['base-data:member:query']" v-loading="loading">
      <a-descriptions :column="4" bordered>
        <a-descriptions-item label="编号" :span="2">
          {{ formData.code }}
        </a-descriptions-item>
        <a-descriptions-item label="名称" :span="2">
          {{ formData.name }}
        </a-descriptions-item>
        <a-descriptions-item label="性别" :span="2">
          {{ $enums.GENDER.getDesc(formData.gender) }}
        </a-descriptions-item>
        <a-descriptions-item label="会员手机号" :span="2">
          {{ formData.telephone }}
        </a-descriptions-item>
        <a-descriptions-item label="电子邮箱" :span="2">
          {{ formData.email }}
        </a-descriptions-item>
        <a-descriptions-item label="出生日期" :span="2">
          {{ formData.birthday }}
        </a-descriptions-item>
        <a-descriptions-item label="所属门店" :span="2">
          {{ formData.shopName }}
        </a-descriptions-item>
        <a-descriptions-item label="所属导购" :span="2">
          {{ formData.guiderName }}
        </a-descriptions-item>
        <a-descriptions-item label="入会日期" :span="2">
          {{ formData.joinDay }}
        </a-descriptions-item>
        <a-descriptions-item label="状态" :span="2">
          <available-tag :available="formData.available" />
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
  import * as api from '@/api/base-data/member';

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
          code: '',
          name: '',
          gender: '',
          telephone: '',
          email: '',
          birthday: '',
          shopName: '',
          guiderName: '',
          joinDay: '',
          available: '',
          description: '',
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
    },
  });
</script>
