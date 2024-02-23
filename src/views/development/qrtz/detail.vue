<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    title="查看"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-permission="['development:qrtz:manage']" v-loading="loading">
      <a-descriptions :column="4" bordered>
        <a-descriptions-item label="名称" :span="2">
          {{ formData.name }}
        </a-descriptions-item>
        <a-descriptions-item label="组" :span="2">
          {{ formData.group }}
        </a-descriptions-item>
        <a-descriptions-item label="Cron表达式" :span="2">
          {{ formData.cron }}
        </a-descriptions-item>
        <a-descriptions-item label="任务类型" :span="2">
          {{ $enums.QRTZ_JOB_TYPE.getDesc(formData.jobType) }}
        </a-descriptions-item>
        <a-descriptions-item
          v-if="$enums.QRTZ_JOB_TYPE.EXCUTE_CLASS.equalsCode(formData.jobType)"
          label="类名"
          :span="4"
        >
          {{ formData.targetClassName }}
        </a-descriptions-item>
        <a-descriptions-item
          v-if="$enums.QRTZ_JOB_TYPE.EXCUTE_CLASS.equalsCode(formData.jobType)"
          label="方法名"
          :span="4"
        >
          {{ formData.targetMethodName }}
        </a-descriptions-item>
        <a-descriptions-item
          v-if="$enums.QRTZ_JOB_TYPE.EXCUTE_CLASS.equalsCode(formData.jobType)"
          label="参数类型"
          :span="4"
        >
          <span style="white-space: pre-wrap">
            {{
              $utils.isEmpty(formData.targetParamTypes) ? '' : formData.targetParamTypes.join('\n')
            }}
          </span>
        </a-descriptions-item>
        <a-descriptions-item
          v-if="$enums.QRTZ_JOB_TYPE.EXCUTE_CLASS.equalsCode(formData.jobType)"
          label="参数值"
          :span="4"
        >
          <span style="white-space: pre-wrap">
            {{ $utils.isEmpty(formData.targetParams) ? '' : formData.targetParams.join('\n') }}
          </span>
        </a-descriptions-item>
        <a-descriptions-item
          v-if="$enums.QRTZ_JOB_TYPE.GROOVY.equalsCode(formData.jobType)"
          label="脚本"
          :span="4"
        >
          {{ formData.script }}
        </a-descriptions-item>
        <a-descriptions-item label="备注" :span="4">
          {{ formData.description }}
        </a-descriptions-item>
      </a-descriptions>
    </div>
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';
  import * as api from '@/api/development/qrtz';

  export default defineComponent({
    // 使用组件
    components: {},

    props: {
      name: {
        type: String,
        required: true,
      },
      group: {
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
          name: '',
          group: '',
          description: '',
          cron: '',
          jobType: undefined,
          targetClassName: '',
          targetMethodName: '',
          targetParamTypes: [],
          targetParams: [],
          script: '',
        };
      },
      // 页面显示时触发
      open() {
        // 初始化数据
        this.initFormData();

        this.loadFormData();
      },
      // 查询数据
      loadFormData() {
        this.loading = true;
        api
          .get({
            name: this.name,
            group: this.group,
          })
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
