<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    title="修改"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-permission="['system:user:modify']" v-loading="loading">
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
        <a-form-item v-if="!formData.modifyPassword" label="更新密码">
          <a-checkbox v-model:checked="formData.modifyPassword" />
        </a-form-item>
        <a-form-item v-show="formData.modifyPassword" label="密码" name="password">
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
        <a-form-item label="状态" name="available">
          <a-select v-model:value="formData.available">
            <a-select-option
              v-for="item in $enums.AVAILABLE.values()"
              :key="item.code"
              :value="item.code"
              >{{ item.desc }}</a-select-option
            >
          </a-select>
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
        // 表单校验规则
        rules: {
          code: [{ required: true, message: '请输入编号' }, { validator: validCode }],
          username: [{ required: true, message: '请输入用户名' }],
          name: [{ required: true, message: '请输入姓名' }],
          password: [{ validator: constants.validPassword }],
          gender: [{ required: true, message: '请选择性别' }],
          email: [{ validator: constants.validEmail }],
          telephone: [{ validator: constants.validTelephone }],
          available: [{ required: true, message: '请选择状态' }],
        },
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
          code: '',
          username: '',
          name: '',
          positions: [],
          roles: [],
          depts: [],
          modifyPassword: false,
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
              .update(params)
              .then(() => {
                this.$msg.createSuccess('修改成功！');
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
            this.formData = Object.assign({}, this.formData, data);
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
  });
</script>
