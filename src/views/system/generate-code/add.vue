<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    title="新增"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-loading="loading" v-permission="['system:generate-code:manage']">
      <vxe-form border title-background ref="form" title-width="80" :data="formData" :rules="rules">
        <vxe-form-item title="规则ID" field="id" span="24">
          <a-input v-model:value="formData.id" allow-clear />
        </vxe-form-item>
        <vxe-form-item title="名称" field="name" span="24">
          <a-input v-model:value="formData.name" allow-clear />
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
  import * as api from '@/api/system/generate-code';
  import { isEmpty, isIntegerGtZero } from '@/utils/utils';
  import { createSuccess } from '@/hooks/web/msg';

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
          id: [
            { required: true, message: '请输入规则ID' },
            {
              validator({ itemValue }) {
                if (!isEmpty(itemValue) && !isIntegerGtZero(itemValue)) {
                  return new Error('规则ID必须为整数');
                }
              },
            },
          ],
          name: [{ required: true, message: '请输入名称' }],
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
          id: '',
          name: '',
        };
      },
      // 提交表单事件
      submit() {
        this.$refs.form.validate().then((errMaps) => {
          if (!errMaps) {
            this.loading = true;
            api
              .create(this.formData)
              .then(() => {
                createSuccess('新增成功！');
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
