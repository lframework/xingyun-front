<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    title="新增"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-loading="loading" v-permission="['system:user-group:add']">
      <a-form
        ref="form"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 16 }"
        :model="formData"
        :rules="rules"
      >
        <a-form-item label="编号" name="code">
          <a-input-group compact>
            <a-input
              v-model:value.trim="formData.code"
              style="width: calc(100% - 75px)"
              allow-clear
            />
            <a-button type="primary" @click="onGenerateCode">点此生成</a-button>
          </a-input-group>
        </a-form-item>
        <a-form-item label="名称" name="name">
          <a-input v-model:value="formData.name" allow-clear />
        </a-form-item>
        <a-form-item label="用户" name="userIds">
          <user-selector v-model:value="formData.userIds" :multiple="true" />
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
  import * as api from '@/api/system/user-group';
  import { generateCode } from '@/api/components';
  import { validCode } from '@/utils/validate';

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
          name: [{ required: true, message: '请输入名称' }],
          userIds: [{ required: true, message: '请选择用户' }],
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
          code: '',
          name: '',
          userIds: [],
          description: '',
        };
      },
      // 提交表单事件
      submit() {
        this.$refs.form.validate().then((valid) => {
          if (valid) {
            this.loading = true;
            const params = this.formData;

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

        this.onGenerateCode();
      },
      onGenerateCode() {
        generateCode(this.$enums.GENERATE_CODE_TYPE.USER_GROUP.code).then((res) => {
          this.formData.code = res;
        });
      },
    },
  });
</script>
