<template>
  <a-modal v-model="visible" :mask-closable="false" width="40%" title="修改联系电话" :dialog-style="{ top: '20px' }">
    <div v-if="visible">
      <a-form-model ref="form" :label-col="{span: 6}" :wrapper-col="{span: 14}" :model="formData" :rules="rules">
        <a-form-model-item label="联系电话" prop="newTelephone">
          <a-input v-model="formData.newTelephone" />
        </a-form-model-item>
        <a-form-model-item label="确认联系电话" prop="confirmTelephone">
          <a-input v-model="formData.confirmTelephone" />
        </a-form-model-item>
      </a-form-model>
    </div>
    <template slot="footer">
      <div class="form-modal-footer">
        <a-space>
          <a-button type="primary" :loading="loading" @click="submitEvent">保存</a-button>
          <a-button :loading="loading" @click="closeDialog">取消</a-button>
        </a-space>
      </div>
    </template>
  </a-modal>
</template>
<script>
import { isTelephone } from '@/utils/validate'
export default {
  components: {
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
        newTelephone: [
          { required: true, message: '请输入联系电话' },
          { validator: this.validTelephone }
        ],
        confirmTelephone: [
          { required: true, message: '请输入确认联系电话' },
          { validator: this.validConfirmTelephone }
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
    validTelephone(rule, value, callback) {
      if (this.$utils.isEmpty(value)) {
        return callback()
      }

      if (isTelephone(value)) {
        if (!this.$utils.isEmpty(this.formData.confirmTelephone)) {
          if (value !== this.formData.confirmTelephone) {
            return callback(new Error('两次联系电话输入不一致'))
          }
        }
      } else {
        return callback(new Error('联系电话格式不正确'))
      }

      callback()
    },
    validConfirmTelephone(rule, value, callback) {
      if (this.$utils.isEmpty(value)) {
        return callback()
      }

      if (isTelephone(value)) {
        if (!this.$utils.isEmpty(this.formData.newTelephone)) {
          if (value !== this.formData.newTelephone) {
            return callback(new Error('两次联系电话输入不一致'))
          }
        }
      } else {
        return callback(new Error('联系电话格式不正确'))
      }

      callback()
    },
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
        newTelephone: '',
        confirmTelephone: ''
      }
    },
    // 提交表单事件
    submitEvent() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$api.userCenter.updateTelephone(this.formData).then(res => {
            this.$msg.success('修改成功！')
            this.$emit('confirm')
            this.closeDialog()
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    // 页面显示时由父页面触发
    open() {
      // 初始化表单数据
      this.initFormData()
    }
  }
}
</script>
