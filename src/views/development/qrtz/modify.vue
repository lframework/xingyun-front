<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="40%"
    title="修改"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-permission="['development:qrtz:manage']" v-loading="loading">
      <a-form
        ref="form"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 14 }"
        :model="formData"
        :rules="rules"
      >
        <a-form-item label="名称" name="name">
          <a-input v-model:value.trim="formData.name" allow-clear />
        </a-form-item>
        <a-form-item label="组" name="group">
          <a-input v-model:value.trim="formData.group" allow-clear />
        </a-form-item>
        <a-form-item label="指定租户" name="tenantId">
          <sys-tenant-selector v-model:value="formData.tenantId" />
        </a-form-item>
        <a-form-item label="Cron表达式" name="cron">
          <cron-picker v-model:value="formData.cron" />
        </a-form-item>
        <a-form-item label="任务类型" name="jobType">
          <a-select v-model:value="formData.jobType" allow-clear>
            <a-select-option
              v-for="item in $enums.QRTZ_JOB_TYPE.values()"
              :key="item.code"
              :value="item.code"
              >{{ item.desc }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item
          v-if="$enums.QRTZ_JOB_TYPE.EXCUTE_CLASS.equalsCode(formData.jobType)"
          label="类名"
          name="targetClassName"
        >
          <a-row>
            <a-col :span="20">
              <a-input v-model:value="formData.targetClassName" allow-clear />
            </a-col>
            <a-col :span="3" :offset="1">
              <a-tooltip
                title="输入需要执行的类的全名称，如：java.lang.String，此类需要确保可以无参构造。"
                ><a-icon type="question-circle"
              /></a-tooltip>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item
          v-if="$enums.QRTZ_JOB_TYPE.EXCUTE_CLASS.equalsCode(formData.jobType)"
          label="方法名"
          name="targetMethodName"
        >
          <a-row>
            <a-col :span="20">
              <a-input v-model:value="formData.targetMethodName" allow-clear />
            </a-col>
            <a-col :span="3" :offset="1">
              <a-tooltip title="输入需要执行的方法的名称。"
                ><a-icon type="question-circle"
              /></a-tooltip>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item
          v-if="$enums.QRTZ_JOB_TYPE.EXCUTE_CLASS.equalsCode(formData.jobType)"
          label="参数类型"
          name="targetParamTypes"
        >
          <a-row>
            <a-col :span="20">
              <a-select v-model:value="formData.targetParamTypes" mode="tags" style="width: 100%">
                <a-select-option key="java.lang.String"> String </a-select-option>
                <a-select-option key="java.lang.Integer"> Integer </a-select-option>
                <a-select-option key="java.lang.Long"> Long </a-select-option>
                <a-select-option key="java.lang.Double"> Double </a-select-option>
                <a-select-option key="java.math.BigDecimal"> BigDecimal </a-select-option>
                <a-select-option key="java.lang.Character"> Char </a-select-option>
                <a-select-option key="java.lang.Short"> Short </a-select-option>
                <a-select-option key="java.lang.Byte"> Byte </a-select-option>
                <a-select-option key="java.lang.Boolean"> Boolean </a-select-option>
                <a-select-option key="java.lang.Float"> Float </a-select-option>
              </a-select>
            </a-col>
            <a-col :span="3" :offset="1">
              <a-tooltip
                title="按顺序依次填写方法的参数类型，如果没有参数忽略此项，选择框支持人工录入，按回车键进行确认。需要输入类型的全名称，如：java.lang.String。"
                ><a-icon type="question-circle"
              /></a-tooltip>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item
          v-if="$enums.QRTZ_JOB_TYPE.EXCUTE_CLASS.equalsCode(formData.jobType)"
          label="参数值"
          name="targetParams"
        >
          <a-row>
            <a-col :span="20">
              <a-select v-model:value="formData.targetParams" mode="tags" style="width: 100%" />
            </a-col>
            <a-col :span="3" :offset="1">
              <a-tooltip
                title="按顺序依次填写方法的参数值，如果没有参数忽略此项，按回车键进行确认。String类型的值不要使用引号。"
                ><a-icon type="question-circle"
              /></a-tooltip>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item
          v-if="$enums.QRTZ_JOB_TYPE.GROOVY.equalsCode(formData.jobType)"
          label="脚本"
          name="script"
        >
          <a-textarea v-model:value.trim="formData.script" />
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
  import * as api from '@/api/development/qrtz';

  export default defineComponent({
    components: {},
    props: {
      oriName: {
        type: String,
        required: true,
      },
      oriGroup: {
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
          name: [{ required: true, message: '请输入名称' }],
          group: [{ required: true, message: '请输入组' }],
          cron: [{ required: true, message: '请选择Cron表达式' }],
          jobType: [{ required: true, message: '请选择任务类型' }],
          script: [{ required: true, message: '请输入脚本' }],
          targetClassName: [{ required: true, message: '请输入类名' }],
          targetMethodName: [{ required: true, message: '请输入方法名' }],
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
      // 提交表单事件
      submit() {
        this.$refs.form.validate().then((valid) => {
          if (valid) {
            this.loading = true;
            const params = Object.assign(
              {
                oriName: this.oriName,
                oriGroup: this.oriGroup,
              },
              this.formData,
            );
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
        // 初始化表单数据
        this.initFormData();

        this.loadFormData();
      },
      // 查询数据
      loadFormData() {
        this.loading = true;
        api
          .get({
            name: this.oriName,
            group: this.oriGroup,
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
