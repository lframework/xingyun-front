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
      <vxe-form
        border
        title-background
        title-width="120"
        ref="form"
        :data="formData"
        :rules="rules"
      >
        <vxe-form-item title="编号" field="code" span="12">
          <a-input v-model:value.trim="formData.code" allow-clear />
        </vxe-form-item>
        <vxe-form-item title="用户名" field="username" span="12">
          <a-input v-model:value.trim="formData.username" allow-clear />
        </vxe-form-item>
        <vxe-form-item title="姓名" field="name" span="12">
          <a-input v-model:value.trim="formData.name" allow-clear />
        </vxe-form-item>
        <vxe-form-item title="部门" field="depts" span="24">
          <sys-dept-selector v-model:value="formData.depts" :only-final="false" :multiple="true" />
        </vxe-form-item>
        <vxe-form-item title="角色" field="roles" span="24">
          <sys-role-selector v-model:value="formData.roles" :multiple="true" />
        </vxe-form-item>
        <vxe-form-item :visible="!formData.modifyPassword" title="更新密码" span="12">
          <a-checkbox v-model:checked="formData.modifyPassword" />
        </vxe-form-item>
        <vxe-form-item :visible="formData.modifyPassword" title="密码" field="password" span="12">
          <a-input-password v-model:value="formData.password" allow-clear />
        </vxe-form-item>
        <vxe-form-item title="性别" field="gender" span="12">
          <a-select v-model:value="formData.gender">
            <a-select-option v-for="item in GENDER.values()" :key="item.code" :value="item.code">{{
              item.desc
            }}</a-select-option>
          </a-select>
        </vxe-form-item>
        <vxe-form-item title="邮箱" field="email" span="12">
          <a-input v-model:value.trim="formData.email" allow-clear />
        </vxe-form-item>
        <vxe-form-item title="联系电话" field="telephone" span="12">
          <a-input v-model:value.trim="formData.telephone" allow-clear />
        </vxe-form-item>
        <vxe-form-item title="备注" field="description" span="24">
          <a-textarea v-model:value.trim="formData.description" />
        </vxe-form-item>
        <vxe-form-item span="24">
          <div class="form-modal-footer">
            <a-space>
              <a-button type="primary" :loading="loading" html-type="submit" @click="submit"
                >保存</a-button
              >
              <a-button :loading="loading" @click="closeDialog">取消</a-button>
            </a-space>
          </div>
        </vxe-form-item>
      </vxe-form>
    </div>
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';
  import * as constants from './constants';
  import { validCode } from '@/utils/validate';
  import * as api from '@/api/system/user';
  import { createSuccess } from '@/hooks/web/msg';
  import SysDeptSelector from '@/components/Selector/SysDeptSelector.vue';
  import SysRoleSelector from '@/components/Selector/SysRoleSelector.vue';
  import { GENDER } from '@/enums/biz/gender';

  export default defineComponent({
    // 使用组件
    components: {
      SysDeptSelector,
      SysRoleSelector,
    },
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    setup() {
      return {
        GENDER,
      };
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
          roles: [],
          depts: [],
          modifyPassword: false,
          password: '',
          gender: GENDER.UNKNOWN.code,
          email: '',
          telephone: '',
          description: '',
        };
      },
      // 提交表单事件
      submit() {
        this.$refs.form.validate().then((errMaps) => {
          if (!errMaps) {
            this.loading = true;
            const params = Object.assign(
              {
                deptIds: this.formData.depts,
                roleIds: this.formData.roles,
              },
              this.formData,
            );

            delete params.depts;
            delete params.roles;

            api
              .update(params)
              .then(() => {
                createSuccess('修改成功！');
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
