<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    title="查看"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-permission="['system:user:query']" v-loading="loading">
      <a-descriptions bordered :xs="4" :sm="2" :md="2">
        <a-descriptions-item label="编号" :span="2">
          {{ formData.code }}
        </a-descriptions-item>
        <a-descriptions-item label="用户名" :span="2">
          {{ formData.username }}
        </a-descriptions-item>
        <a-descriptions-item label="姓名" :span="2">
          {{ formData.name }}
        </a-descriptions-item>
        <a-descriptions-item label="性别" :span="2">
          {{ $enums.GENDER.getDesc(formData.gender) }}
        </a-descriptions-item>
        <a-descriptions-item label="部门" :span="4">
          {{ formData.deptName }}
        </a-descriptions-item>
        <a-descriptions-item label="角色" :span="4">
          {{ formData.roleName }}
        </a-descriptions-item>
        <a-descriptions-item label="岗位" :span="4">
          {{ formData.positionName }}
        </a-descriptions-item>
        <a-descriptions-item label="邮箱" :span="2">
          {{ formData.email }}
        </a-descriptions-item>
        <a-descriptions-item label="联系电话" :span="2">
          {{ formData.telephone }}
        </a-descriptions-item>
        <a-descriptions-item label="状态" :span="2">
          <available-tag :available="formData.available" />
        </a-descriptions-item>
        <a-descriptions-item label="是否锁定" :span="2">
          {{ formData.lockStatus ? '是' : '否' }}
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
  import * as api from '@/api/system/user';

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
          permission: '',
          available: '',
          lockStatus: '',
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
