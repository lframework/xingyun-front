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
        allowLock: [
          { required: true, message: '请选择是否允许锁定用户' }
        ],
        allowCaptcha: [
          { required: true, message: '请选择是否允许验证码' }
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
        allowCaptcha: ''
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
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$api.system.config.modify(this.formData).then(() => {
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
