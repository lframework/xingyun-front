<template>
  <a-modal v-model="visible" :mask-closable="false" width="40%" title="新增" :dialog-style="{ top: '20px' }" :footer="null">
    <div v-if="visible" v-permission="['development:qrtz:manage']" v-loading="loading">
      <a-form-model ref="form" :label-col="{span: 6}" :wrapper-col="{span: 14}" :model="formData" :rules="rules">
        <a-form-model-item label="名称" prop="name">
          <a-input v-model.trim="formData.name" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="组" prop="group">
          <a-input v-model.trim="formData.group" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="Cron表达式" prop="cron">
          <cron-picker v-model="formData.cron" />
        </a-form-model-item>
        <a-form-model-item label="任务类型" prop="jobType">
          <a-select v-model="formData.jobType" allow-clear>
            <a-select-option v-for="item in $enums.QRTZ_JOB_TYPE.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item v-if="$enums.QRTZ_JOB_TYPE.EXCUTE_CLASS.equalsCode(formData.jobType)" label="类名" prop="targetClassName">
          <a-row>
            <a-col :span="20">
              <a-input v-model="formData.targetClassName" allow-clear />
            </a-col>
            <a-col :span="3" :offset="1">
              <a-tooltip title="输入需要执行的类的全名称，如：java.lang.String，此类需要确保可以无参构造。"><a-icon type="question-circle" /></a-tooltip>
            </a-col>
          </a-row>
        </a-form-model-item>
        <a-form-model-item v-if="$enums.QRTZ_JOB_TYPE.EXCUTE_CLASS.equalsCode(formData.jobType)" label="方法名" prop="targetMethodName">
          <a-row>
            <a-col :span="20">
              <a-input v-model="formData.targetMethodName" allow-clear />
            </a-col>
            <a-col :span="3" :offset="1">
              <a-tooltip title="输入需要执行的方法的名称。"><a-icon type="question-circle" /></a-tooltip>
            </a-col>
          </a-row>
        </a-form-model-item>
        <a-form-model-item v-if="$enums.QRTZ_JOB_TYPE.EXCUTE_CLASS.equalsCode(formData.jobType)" label="参数类型" prop="targetParamTypes">
          <a-row>
            <a-col :span="20">
              <a-select v-model="formData.targetParams" mode="tags" style="width: 100%">
                <a-select-option key="java.lang.String">
                  String
                </a-select-option>
                <a-select-option key="java.lang.Integer">
                  Integer
                </a-select-option>
                <a-select-option key="java.lang.Long">
                  Long
                </a-select-option>
                <a-select-option key="java.lang.Double">
                  Double
                </a-select-option>
                <a-select-option key="java.math.BigDecimal">
                  BigDecimal
                </a-select-option>
                <a-select-option key="java.lang.Character">
                  Char
                </a-select-option>
                <a-select-option key="java.lang.Short">
                  Short
                </a-select-option>
                <a-select-option key="java.lang.Byte">
                  Byte
                </a-select-option>
                <a-select-option key="java.lang.Boolean">
                  Boolean
                </a-select-option>
                <a-select-option key="java.lang.Float">
                  Float
                </a-select-option>
              </a-select>
            </a-col>
            <a-col :span="3" :offset="1">
              <a-tooltip title="按顺序依次填写方法的参数类型，如果没有参数忽略此项，选择框支持人工录入，按回车键进行确认。需要输入类型的全名称，如：java.lang.String。"><a-icon type="question-circle" /></a-tooltip>
            </a-col>
          </a-row>
        </a-form-model-item>
        <a-form-model-item v-if="$enums.QRTZ_JOB_TYPE.EXCUTE_CLASS.equalsCode(formData.jobType)" label="参数值" prop="targetParams">
          <a-row>
            <a-col :span="20">
              <a-select v-model="formData.targetParams" mode="tags" style="width: 100%" />
            </a-col>
            <a-col :span="3" :offset="1">
              <a-tooltip title="按顺序依次填写方法的参数值，如果没有参数忽略此项，按回车键进行确认。String类型的值不要使用引号。"><a-icon type="question-circle" /></a-tooltip>
            </a-col>
          </a-row>
        </a-form-model-item>
        <a-form-model-item v-if="$enums.QRTZ_JOB_TYPE.GROOVY.equalsCode(formData.jobType)" label="脚本" prop="script">
          <a-textarea v-model.trim="formData.script" />
        </a-form-model-item>
        <a-form-model-item label="备注" prop="description">
          <a-textarea v-model.trim="formData.description" />
        </a-form-model-item>
        <div class="form-modal-footer">
          <a-space>
            <a-button type="primary" :loading="loading" html-type="submit" @click="submit">保存</a-button>
            <a-button :loading="loading" @click="closeDialog">取消</a-button>
          </a-space>
        </div>
      </a-form-model>
    </div>
  </a-modal>
</template>
<script>
import CronPicker from '@/components/CronPicker'
export default {
  components: {
    CronPicker
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
        name: [
          { required: true, message: '请输入名称' }
        ],
        group: [
          { required: true, message: '请输入组' }
        ],
        cron: [
          { required: true, message: '请选择Cron表达式' }
        ],
        jobType: [
          { required: true, message: '请选择任务类型' }
        ],
        script: [
          { required: true, message: '请输入脚本' }
        ],
        targetClassName: [
          { required: true, message: '请输入类名' }
        ],
        targetMethodName: [
          { required: true, message: '请输入方法名' }
        ]
      }
    }
  },
  computed: {
  },
  created() {
    // 初始化表单数据
    this.initFormData()
  },
  methods: {
    // 打开对话框 由父页面触发
    openDialog() {
      this.visible = true

      this.open()
    },
    // 关闭对话框
    closeDialog() {
      this.visible = false
      this.$emit('close')
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
        script: ''
      }
    },
    // 提交表单事件
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          const params = Object.assign({}, this.formData)
          this.$api.development.qrtz.create(params).then(() => {
            this.$msg.success('新增成功！')
            this.$emit('confirm')
            this.visible = false
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    // 页面显示时触发
    open() {
      // 初始化表单数据
      this.initFormData()
    }
  }
}
</script>
