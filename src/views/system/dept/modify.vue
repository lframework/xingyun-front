<template>
  <div v-permission="['system:dept:modify']" v-loading="loading">
    <a-form
      ref="form"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 16 }"
      :model="formData"
      :rules="rules"
    >
      <a-form-item label="编号" name="code">
        <a-input v-model:value.trim="formData.code" allow-clear />
      </a-form-item>
      <a-form-item label="名称" name="name">
        <a-input v-model:value.trim="formData.name" allow-clear />
      </a-form-item>
      <a-form-item label="简称" name="shortName">
        <a-input v-model:value.trim="formData.shortName" allow-clear />
      </a-form-item>
      <a-form-item label="上级部门" name="parentId">
        <sys-dept-selector v-model:value="formData.parentId" :only-final="false" />
      </a-form-item>
      <a-form-item label="状态" name="available">
        <a-select v-model:value="formData.available" allow-clear>
          <a-select-option
            v-for="item in $enums.AVAILABLE.getValues()"
            :key="item.code"
            :value="item.code"
            >{{ item.desc }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item label="备注" name="description">
        <a-textarea v-model:value.trim="formData.description" />
      </a-form-item>
    </a-form>
    <div class="form-modal-footer">
      <a-space>
        <a-button type="primary" @click="submitEvent">保存</a-button>
        <a-button
          v-permission="['system:dept:permission']"
          @click="$nextTick(() => $refs.dataPermissionDialog.openDialog())"
          >数据权限</a-button
        >
        <a-button @click="resetForm">重置</a-button>
      </a-space>
    </div>
    <!-- 数据权限窗口 -->
    <data-permission
      ref="dataPermissionDialog"
      :biz-id="id"
      :biz-type="$enums.SYS_DATA_PERMISSION_DATA_BIZ_TYPE.DEPT.code"
    />
  </div>
</template>
<script>
  import { defineComponent } from 'vue';
  import { validCode } from '@/utils/validate';
  import DataPermission from '@/components/DataPermission/index.vue';
  import * as api from '@/api/system/dept';

  export default defineComponent({
    components: {
      DataPermission,
    },
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        // 是否显示加载框
        loading: false,
        // 表单数据
        formData: {},
        // 表单校验规则
        rules: {
          code: [{ required: true, message: '请输入编号' }, { validator: validCode }],
          name: [{ required: true, message: '请输入名称' }],
          shortName: [{ required: true, message: '请输入简称' }],
          available: [{ required: true, message: '请选择状态' }],
        },
      };
    },
    created() {
      // 初始化表单数据
      this.initFormData();
      // 查询数据
      this.loadData();
    },
    methods: {
      // 初始化表单数据
      initFormData() {
        this.formData = {
          id: '',
          code: '',
          parentId: '',
          description: '',
          name: '',
          shortName: '',
          available: '',
        };
      },
      // 提交表单事件
      submitEvent() {
        this.$refs.form.validate().then().then((valid) => {
          if (valid) {
            this.loading = true;
            api
              .update(this.formData)
              .then(() => {
                this.$msg.createSuccess('修改成功！');
                // 初始化表单数据
                this.initFormData();
                this.$emit('confirm');
              })
              .finally(() => {
                this.loading = false;
              });
          }
        });
      },
      // 重置表单
      resetForm() {
        this.$refs.form.resetFields();
      },
      // 页面显示时触发
      open() {
        // 初始化表单数据
        this.initFormData();
        // 查询数据
        this.loadData();
      },
      loadData() {
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
