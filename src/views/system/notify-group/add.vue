<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    title="新增"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-loading="loading" v-permission="['system:notify-group:add']">
      <a-form
        ref="form"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 16 }"
        :model="formData"
        :rules="rules"
      >
        <a-form-item label="名称" name="name">
          <a-input v-model:value="formData.name" allow-clear />
        </a-form-item>
        <a-form-item label="接收者类型" name="receiverType">
          <a-select v-model:value="formData.receiverType" allow-clear>
            <a-select-option
              v-for="item in $enums.SYS_NOTIFY_GROUP_RECEIVER_TYPE.values()"
              :key="item.code"
              :value="item.code"
              >{{ item.desc }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item
          v-if="$enums.SYS_NOTIFY_GROUP_RECEIVER_TYPE.DEPT.equalsCode(formData.receiverType)"
          label="部门"
          name="deptIds"
        >
          <sys-dept-selector
            v-model:value="formData.deptIds"
            :multiple="true"
            :only-final="false"
          />
        </a-form-item>
        <a-form-item
          v-if="$enums.SYS_NOTIFY_GROUP_RECEIVER_TYPE.ROLE.equalsCode(formData.receiverType)"
          label="角色"
          name="roleIds"
        >
          <sys-role-selector v-model:value="formData.roleIds" :multiple="true" />
        </a-form-item>
        <a-form-item
          v-if="$enums.SYS_NOTIFY_GROUP_RECEIVER_TYPE.USER.equalsCode(formData.receiverType)"
          label="用户"
          name="userIds"
        >
          <user-selector v-model:value="formData.userIds" :multiple="true" />
        </a-form-item>
        <a-form-item
          v-if="$enums.SYS_NOTIFY_GROUP_RECEIVER_TYPE.USER_GROUP.equalsCode(formData.receiverType)"
          label="用户组"
          name="userGroupIds"
        >
          <user-group-selector v-model:value="formData.userGroupIds" :multiple="true" />
        </a-form-item>
        <a-form-item label="消息类型" name="messageType">
          <a-checkbox-group v-model:value="formData.messageType" :options="messageTypeOptions" />
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
  import * as api from '@/api/system/notify-group';

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
          name: [{ required: true, message: '请输入名称' }],
          receiverType: [{ required: true, message: '请选择接收者类型' }],
          messageType: [{ required: true, message: '请选择消息类型' }],
          deptIds: [{ required: true, message: '请选择部门' }],
          roleIds: [{ required: true, message: '请选择角色' }],
          userIds: [{ required: true, message: '请选择用户' }],
          userGroupIds: [{ required: true, message: '请选择用户组' }],
        },
      };
    },
    computed: {
      messageTypeOptions() {
        return this.$enums.SYS_NOTIFY_GROUP_MESSAGE_TYPE.values().map((item) => {
          return {
            label: item.desc,
            value: item.code,
          };
        });
      },
    },
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
          name: '',
          receiverType: '',
          messageType: [],
          receiverIds: [],
          description: '',
          deptIds: [],
          roleIds: [],
          userIds: [],
          userGroupIds: [],
        };
      },
      // 提交表单事件
      submit() {
        this.$refs.form.validate().then((valid) => {
          if (valid) {
            this.loading = true;
            const params = {
              name: this.formData.name,
              receiverType: this.formData.receiverType,
              messageType: this.formData.messageType,
              description: this.formData.description,
            };

            if (
              this.$enums.SYS_NOTIFY_GROUP_RECEIVER_TYPE.USER.equalsCode(this.formData.receiverType)
            ) {
              params.receiverIds = this.formData.userIds;
            } else if (
              this.$enums.SYS_NOTIFY_GROUP_RECEIVER_TYPE.ROLE.equalsCode(this.formData.receiverType)
            ) {
              params.receiverIds = this.formData.roleIds;
            } else if (
              this.$enums.SYS_NOTIFY_GROUP_RECEIVER_TYPE.DEPT.equalsCode(this.formData.receiverType)
            ) {
              params.receiverIds = this.formData.deptIds;
            } else if (
              this.$enums.SYS_NOTIFY_GROUP_RECEIVER_TYPE.USER_GROUP.equalsCode(
                this.formData.receiverType,
              )
            ) {
              params.receiverIds = this.formData.userGroupIds;
            }
            api
              .create(params)
              .then(() => {
                this.$msg.createSuccess('新增成功！');
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
