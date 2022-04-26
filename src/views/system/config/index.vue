<template>
  <div class="app-container">
    <div v-permission="['system:config:modify']">
      <a-row>
        <a-col :md="16" :sm="24">
          <a-card v-loading="loading">
            <a-form-model ref="form" :label-col="{span: 10}" :wrapper-col="{span: 8}" :model="formData" :rules="rules">
              <a-form-model-item label="是否允许注册" prop="allowRegist">
                <a-select v-model="formData.allowRegist" placeholder="">
                  <a-select-option :value="true">是</a-select-option>
                  <a-select-option :value="false">否</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item label="是否允许手机号登录" prop="allowTelephoneLogin">
                <a-select v-model="formData.allowTelephoneLogin" placeholder="">
                  <a-select-option :value="true">是</a-select-option>
                  <a-select-option :value="false">否</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item v-if="formData.allowTelephoneLogin" label="signName" prop="telephoneLoginSignName">
                <a-space>
                  <a-input v-model.trim="formData.telephoneLoginSignName" />
                  <a-tooltip title="详见“阿里云短信服务文档”。"><a-icon type="question-circle" /></a-tooltip>
                </a-space>
              </a-form-model-item>
              <a-form-model-item v-if="formData.allowTelephoneLogin" label="templateCode" prop="telephoneLoginTemplateCode">
                <a-space>
                  <a-input v-model.trim="formData.telephoneLoginTemplateCode" />
                  <a-tooltip title="详见“阿里云短信服务文档”。"><a-icon type="question-circle" /></a-tooltip>
                </a-space>
              </a-form-model-item>
              <a-form-model-item label="是否允许锁定用户" prop="allowLock">
                <a-select v-model="formData.allowLock" placeholder="">
                  <a-select-option :value="true">是</a-select-option>
                  <a-select-option :value="false">否</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item v-if="formData.allowLock" label="允许登录失败次数" prop="failNum">
                <a-space>
                  <a-input-number v-model="formData.failNum" placeholder="" />
                  <a-tooltip title="24小时内允许连续登录失败次数，例如：设置为7次，表示24小时内连续登录失败7次时锁定。7次以内登录成功，清零失败次数。连续失败不超过7次并且距离最后一次失败24小时后，清零失败次数。"><a-icon type="question-circle" /></a-tooltip>
                </a-space>
              </a-form-model-item>
              <a-form-model-item label="是否允许验证码" prop="allowCaptcha">
                <a-select v-model="formData.allowCaptcha" placeholder="">
                  <a-select-option :value="true">是</a-select-option>
                  <a-select-option :value="false">否</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item label="是否开启忘记密码" prop="allowForgetPsw">
                <a-select v-model="formData.allowForgetPsw" placeholder="">
                  <a-select-option :value="true">是</a-select-option>
                  <a-select-option :value="false">否</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item v-if="formData.allowForgetPsw" label="忘记密码是否使用邮箱" prop="forgetPswRequireMail">
                <a-space>
                  <a-select v-model="formData.forgetPswRequireMail" placeholder="" style="min-width: 80px;">
                    <a-select-option :value="true">是</a-select-option>
                    <a-select-option :value="false">否</a-select-option>
                  </a-select>
                  <a-tooltip title="开启后允许使用邮箱找回密码。注：系统邮箱参数请确保配置正确。"><a-icon type="question-circle" /></a-tooltip>
                </a-space>
              </a-form-model-item>
              <a-form-model-item v-if="formData.allowForgetPsw" label="忘记密码是否使用短信" prop="forgetPswRequireSms">
                <a-space>
                  <a-select v-model="formData.forgetPswRequireSms" placeholder="" style="min-width: 80px;">
                    <a-select-option :value="true">是</a-select-option>
                    <a-select-option :value="false">否</a-select-option>
                  </a-select>
                  <a-tooltip title="开启后允许使用短信找回密码。注：系统短信参数请确保配置正确，短信模板中的验证码变量的Key需要固定为“code”。"><a-icon type="question-circle" /></a-tooltip>
                </a-space>
              </a-form-model-item>
              <a-form-model-item v-if="formData.allowForgetPsw && formData.forgetPswRequireSms" label="signName" prop="signName">
                <a-space>
                  <a-input v-model.trim="formData.signName" />
                  <a-tooltip title="详见“阿里云短信服务文档”。"><a-icon type="question-circle" /></a-tooltip>
                </a-space>
              </a-form-model-item>
              <a-form-model-item v-if="formData.allowForgetPsw && formData.forgetPswRequireSms" label="templateCode" prop="templateCode">
                <a-space>
                  <a-input v-model.trim="formData.templateCode" />
                  <a-tooltip title="详见“阿里云短信服务文档”。"><a-icon type="question-circle" /></a-tooltip>
                </a-space>
              </a-form-model-item>
            </a-form-model>
            <div class="form-modal-footer">
              <a-space>
                <a-button type="primary" :loading="loading" @click="submit">保存</a-button>
                <a-button :loading="loading" @click="close">取消</a-button>
              </a-space>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script>

export default {
  name: 'PurchaseConfig',
  // 使用组件
  components: {
  },

  props: {
  },
  data() {
    return {
      // 是否显示加载框
      loading: false,
      // 表单数据
      formData: {},
      // 表单校验规则
      rules: {
        allowRegist: [
          { required: true, message: '请选择是否允许注册' }
        ],
        allowTelephoneLogin: [
          { required: true, message: '请选择是否允许手机号登录' }
        ],
        allowLock: [
          { required: true, message: '请选择是否允许锁定用户' }
        ],
        allowCaptcha: [
          { required: true, message: '请选择是否允许验证码' }
        ],
        allowForgetPsw: [
          { required: true, message: '请选择是否开启忘记密码' }
        ],
        forgetPswRequireMail: [
          { required: true, message: '请选择忘记密码是否使用邮箱' }
        ],
        forgetPswRequireSms: [
          { required: true, message: '请选择忘记密码是否使用短信' }
        ],
        signName: [
          { required: true, message: '请输入signName' }
        ],
        templateCode: [
          { required: true, message: '请输入templateCode' }
        ],
        telephoneLoginSignName: [
          { required: true, message: '请输入signName' }
        ],
        telephoneLoginTemplateCode: [
          { required: true, message: '请输入templateCode' }
        ]
      }
    }
  },
  created() {
    this.initFormData()

    // 查询数据
    this.loadFormData()
  },
  methods: {
    // 初始化表单数据
    initFormData() {
      this.formData = {
        allowRegist: '',
        allowLock: '',
        failNum: '',
        allowCaptcha: '',
        allowForgetPsw: '',
        forgetPswRequireMail: '',
        forgetPswRequireSms: '',
        signName: '',
        templateCode: ''
      }
    },
    // 查询数据
    async loadFormData() {
      this.loading = true
      await this.$api.system.config.get().then(data => {
        this.formData = data
      }).finally(() => {
        this.loading = false
      })
    },
    // 提交表单事件
    submit() {
      if (this.formData.allowLock) {
        if (this.$utils.isEmpty(this.formData.failNum)) {
          this.$msg.error('请输入允许登录失败次数')
          return
        }

        if (!this.$utils.isInteger(this.formData.failNum)) {
          this.$msg.error('允许登录失败次数必须是整数')
          return
        }

        if (!this.$utils.isIntegerGtZero(this.formData.failNum)) {
          this.$msg.error('允许登录失败次数必须大于0')
          return
        }
      }

      if (this.formData.allowForgetPsw) {
        if (!this.formData.forgetPswRequireMail && !this.formData.forgetPswRequireSms) {
          this.$msg.error('开启忘记密码时，忘记密码使用邮箱、忘记密码使用短信至少开启一个')
          return
        }
      }

      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          const params = Object.assign({}, this.formData)
          if (!params.allowForgetPsw) {
            params.forgetPswRequireMail = false
            params.forgetPswRequireSms = false
            params.signName = ''
            params.templateCode = ''
          } else {
            if (!params.forgetPswRequireSms) {
              params.signName = ''
              params.templateCode = ''
            }
          }
          if (!params.allowTelephoneLogin) {
            params.telephoneLoginSignName = ''
            params.telephoneLoginTemplateCode = ''
          }
          this.$api.system.config.modify(params).then(() => {
            this.$msg.success('修改成功！')
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    close() {
      this.$utils.closeCurrentPage(this.$parent)
    }
  }
}
</script>
