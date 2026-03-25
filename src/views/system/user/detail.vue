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
      <vxe-form border title-background title-width="120" :data="formData">
        <vxe-form-item title="编号" field="code" span="12" />
        <vxe-form-item title="用户名" field="username" span="12" />
        <vxe-form-item title="姓名" field="name" span="12" />
        <vxe-form-item title="性别" field="gender" span="12">
          {{ getEnumDesc('GENDER', formData.gender) }}
        </vxe-form-item>
        <vxe-form-item title="部门" field="deptName" span="24" />
        <vxe-form-item title="角色" field="roleName" span="24" />
        <vxe-form-item title="邮箱" field="email" span="12" />
        <vxe-form-item title="联系电话" field="telephone" span="12" />
        <vxe-form-item title="是否锁定" field="lockStatus" span="24">
          {{ formData.lockStatus ? '是' : '否' }}
        </vxe-form-item>
        <vxe-form-item title="备注" field="description" span="24" />
      </vxe-form>
    </div>
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';
  import * as api from '@/api/system/user';
  import { getEnumDesc } from '@/utils/enumUtil';
  import { GENDER } from '@/enums/biz/gender';

  export default defineComponent({
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    setup() {
      return {
        getEnumDesc,
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
          username: '',
          name: '',
          gender: '',
          deptName: '',
          roleName: '',
          email: '',
          telephone: '',
          lockStatus: false,
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
