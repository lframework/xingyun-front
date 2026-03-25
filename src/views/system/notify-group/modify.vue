<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    title="修改"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-permission="['system:notify-group:modify']" v-loading="loading">
      <vxe-form
        border
        title-background
        title-width="100"
        ref="form"
        :data="formData"
        :rules="rules"
      >
        <vxe-form-item title="名称" field="name" span="12">
          <a-input v-model:value="formData.name" allow-clear />
        </vxe-form-item>
        <vxe-form-item title="接收者类型" field="receiverType" span="12">
          <a-select v-model:value="formData.receiverType" allow-clear>
            <a-select-option
              v-for="item in SYS_NOTIFY_GROUP_RECEIVER_TYPE.values()"
              :key="item.code"
              :value="item.code"
              >{{ item.desc }}</a-select-option
            >
          </a-select>
        </vxe-form-item>
        <vxe-form-item
          :visible="SYS_NOTIFY_GROUP_RECEIVER_TYPE.DEPT.equalsCode(formData.receiverType)"
          title="部门"
          field="deptIds"
          span="24"
        >
          <sys-dept-selector
            v-model:value="formData.deptIds"
            :multiple="true"
            :only-final="false"
          />
        </vxe-form-item>
        <vxe-form-item
          :visible="SYS_NOTIFY_GROUP_RECEIVER_TYPE.ROLE.equalsCode(formData.receiverType)"
          title="角色"
          field="roleIds"
          span="24"
        >
          <sys-role-selector v-model:value="formData.roleIds" :multiple="true" />
        </vxe-form-item>
        <vxe-form-item
          :visible="SYS_NOTIFY_GROUP_RECEIVER_TYPE.USER.equalsCode(formData.receiverType)"
          title="用户"
          field="userIds"
          span="24"
        >
          <user-selector v-model:value="formData.userIds" :multiple="true" />
        </vxe-form-item>
        <vxe-form-item
          :visible="SYS_NOTIFY_GROUP_RECEIVER_TYPE.USER_GROUP.equalsCode(formData.receiverType)"
          title="用户组"
          field="userGroupIds"
          span="24"
        >
          <user-group-selector v-model:value="formData.userGroupIds" :multiple="true" />
        </vxe-form-item>
        <vxe-form-item title="消息类型" field="messageType" span="24">
          <a-checkbox-group v-model:value="formData.messageType" :options="messageTypeOptions" />
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
  import * as api from '@/api/system/notify-group';
  import { createSuccess } from '@/hooks/web/msg';
  import SysDeptSelector from '@/components/Selector/SysDeptSelector.vue';
  import SysRoleSelector from '@/components/Selector/SysRoleSelector.vue';
  import UserGroupSelector from '@/components/Selector/UserGroupSelector.vue';
  import UserSelector from '@/components/Selector/UserSelector.vue';
  import { SYS_NOTIFY_GROUP_RECEIVER_TYPE } from '@/enums/biz/sysNotifyReceiverType';
  import { SYS_NOTIFY_GROUP_MESSAGE_TYPE } from '@/enums/biz/sysNotifyMessageType';

  export default defineComponent({
    // 使用组件
    components: {
      SysDeptSelector,
      SysRoleSelector,
      UserGroupSelector,
      UserSelector,
    },
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    setup() {
      return {
        SYS_NOTIFY_GROUP_RECEIVER_TYPE,
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
        return SYS_NOTIFY_GROUP_MESSAGE_TYPE.values().map((item) => {
          return {
            label: item.desc,
            value: item.code,
          };
        });
      },
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
        this.$refs.form.validate().then((errMaps) => {
          if (!errMaps) {
            this.loading = true;
            const params = Object.assign({}, this.formData);

            if (SYS_NOTIFY_GROUP_RECEIVER_TYPE.USER.equalsCode(this.formData.receiverType)) {
              params.receiverIds = this.formData.userIds;
            } else if (SYS_NOTIFY_GROUP_RECEIVER_TYPE.ROLE.equalsCode(this.formData.receiverType)) {
              params.receiverIds = this.formData.roleIds;
            } else if (SYS_NOTIFY_GROUP_RECEIVER_TYPE.DEPT.equalsCode(this.formData.receiverType)) {
              params.receiverIds = this.formData.deptIds;
            } else if (
              SYS_NOTIFY_GROUP_RECEIVER_TYPE.USER_GROUP.equalsCode(this.formData.receiverType)
            ) {
              params.receiverIds = this.formData.userGroupIds;
            }
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
      async loadFormData() {
        this.loading = true;
        api
          .get(this.id)
          .then((data) => {
            if (SYS_NOTIFY_GROUP_RECEIVER_TYPE.USER.equalsCode(data.receiverType)) {
              data.userIds = data.receiverIds;
            } else if (SYS_NOTIFY_GROUP_RECEIVER_TYPE.ROLE.equalsCode(data.receiverType)) {
              data.roleIds = data.receiverIds;
            } else if (SYS_NOTIFY_GROUP_RECEIVER_TYPE.DEPT.equalsCode(data.receiverType)) {
              data.deptIds = data.receiverIds;
            } else if (SYS_NOTIFY_GROUP_RECEIVER_TYPE.USER_GROUP.equalsCode(data.receiverType)) {
              data.userGroupIds = data.receiverIds;
            }
            this.formData = data;
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
  });
</script>
