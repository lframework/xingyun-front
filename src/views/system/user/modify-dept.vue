<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    title="修改部门"
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
      >
        <a-form-item label="部门" name="deptIds">
          <sys-dept-selector
            v-model:value="formData.deptIds"
            :only-final="false"
            :multiple="true"
          />
        </a-form-item>
        <a-form-item label="操作类型" name="handleType">
          <a-radio-group v-model:value="formData.handleType" name="handleTypeGroup">
            <a-radio value="1">新增</a-radio>
            <a-radio value="2">替换</a-radio>
            <a-radio value="3">删除</a-radio>
          </a-radio-group>
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
  import * as api from '@/api/system/user-dept';
  import { createError, createSuccess } from '@/hooks/web/msg';
  import SysDeptSelector from '@/components/Selector/SysDeptSelector.vue';
  import { isEmpty } from '@/utils/utils';

  export default defineComponent({
    components: {
      SysDeptSelector,
    },
    props: {
      ids: {
        type: Array,
        default: () => [],
      },
    },
    setup() {
      return {};
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
          deptIds: [],
          handleType: '1',
        };
      },
      // 提交表单事件
      submit() {
        if (this.formData.handleType === '1' || this.formData.handleType === '3') {
          // 新增
          if (isEmpty(this.formData.deptIds)) {
            createError('请选择部门！');
            return;
          }
        }
        this.$refs.form.validate().then((valid) => {
          if (valid) {
            this.loading = true;
            const params = {
              deptIds: this.formData.deptIds,
              userIds: this.ids,
              handleType: this.formData.handleType,
            };
            api
              .setting(params)
              .then(() => {
                createSuccess('修改成功！');
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
