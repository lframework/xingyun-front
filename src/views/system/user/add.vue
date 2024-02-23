<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    title="新增"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-permission="['system:user:add']" v-loading="loading">
      <a-form
        ref="form"
        v-loading="loading"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 16 }"
        :model="formData"
        :rules="rules"
      >
        <a-form-item label="编号" name="code">
          <a-input v-model:value.trim="formData.code" allow-clear />
        </a-form-item>
        <a-form-item label="用户名" name="username">
          <a-input v-model:value.trim="formData.username" allow-clear />
        </a-form-item>
        <a-form-item label="姓名" name="name">
          <a-input v-model:value.trim="formData.name" allow-clear />
        </a-form-item>
        <a-form-item label="部门" name="dept">
          <sys-dept-selector v-model:value="formData.depts" :only-final="false" :multiple="true" />
        </a-form-item>
        <a-form-item label="角色" name="role">
          <sys-role-selector v-model:value="formData.roles" :multiple="true" />
        </a-form-item>
        <a-form-item label="岗位" name="position">
          <sys-position-selector v-model:value="formData.positions" :multiple="true" />
        </a-form-item>
        <a-form-item label="密码" name="password">
          <a-input-password v-model:value="formData.password" allow-clear />
        </a-form-item>
        <a-form-item label="性别" name="gender">
          <a-select v-model:value="formData.gender">
            <a-select-option
              v-for="item in $enums.GENDER.values()"
              :key="item.code"
              :value="item.code"
              >{{ item.desc }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item label="邮箱" name="email">
          <a-input v-model:value.trim="formData.email" allow-clear />
        </a-form-item>
        <a-form-item label="联系电话" name="telephone">
          <a-input v-model:value.trim="formData.telephone" allow-clear />
        </a-form-item>
        <a-form-item label="备注" name="description">
          <a-textarea v-model:value.trim="formData.description" />
        </a-form-item>
        <div class="form-modal-footer">
          <a-space>
            <a-button type="primary" :loading="loading" html-type="submit" @click="submit"
              >保存</a-button
            >
            <a-button :loading="loading" @click="closeDialog">取消</a-button>
          </a-space>
        </div>
      </a-form>
    </div>
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';
  import * as constants from './constants';
  import { validCode } from '@/utils/validate';
  import * as api from '@/api/system/user';

  export default defineComponent({
    components: {},
    data() {
      return {
        // 是否可见
        visible: false,
        // 是否显示加载框
        loading: false,
        // 表单数据
        formData: {},
        // 表单校验规则
        rules: {
          code: [{ required: true, message: '请输入编号' }, { validator: validCode }],
          username: [{ required: true, message: '请输入用户名' }],
          name: [{ required: true, message: '请输入姓名' }],
          password: [
            { required: true, message: '请输入密码' },
            { required: true, validator: constants.validPassword },
          ],
          gender: [{ required: true, message: '请选择性别' }],
          email: [{ validator: constants.validEmail }],
          telephone: [{ validator: constants.validTelephone }],
        },
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
        this.formData = {
          code: '',
          username: '',
          name: '',
          positions: [],
          depts: [],
          roles: [],
          password: '',
          gender: this.$enums.GENDER.UNKNOWN.code,
          email: '',
          telephone: '',
          description: '',
        };
      },
      // 提交表单事件
      submit() {
        this.$refs.form.validate().then((valid) => {
          if (valid) {
            this.loading = true;
            const params = Object.assign(
              {
                positionIds: this.formData.positions,
                deptIds: this.formData.depts,
                roleIds: this.formData.roles,
              },
              this.formData,
            );
            delete params.positions;
            delete params.depts;
            delete params.roles;
            api
              .create(params)
              .then(() => {
                this.$msg.createSuccess('新增成功！');
                // 初始化表单数据
                this.initFormData();
                this.$emit('confirm');
                this.visible = false;
              })
              .finally(() => {
                this.loading = false;
              });
          }
        });
      },
      // 页面显示时触发
      open() {
        // 初始化表单数据
        this.initFormData();
      },
    },
  });
</script>
