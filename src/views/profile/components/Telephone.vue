<template>
  <el-form ref="form" v-loading="loading" label-width="120px" title-align="right" :model="formData" :rules="rules">
    <el-form-item label="联系电话" prop="newTelephone">
      <el-input v-model.trim="formData.newTelephone" style="width: 50%;" />
    </el-form-item>
    <el-form-item label="确认联系电话" prop="confirmTelephone">
      <el-input v-model.trim="formData.confirmTelephone" style="width: 50%;" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { isTelephone } from '@/utils/validate'
export default {
  props: {
  },
  data() {
    return {
      loading: false,
      formData: {
        newTelephone: '',
        confirmTelephone: ''
      },
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
  methods: {
    validTelephone(rule, value, callback) {
      if (this.$utils.isEmpty(value)) {
        return callback()
      }

      if (isTelephone(value)) {
        if (value !== this.formData.confirmTelephone) {
          return callback(new Error('两次联系电话输入不一致'))
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
        if (value !== this.formData.newTelephone) {
          return callback(new Error('两次联系电话输入不一致'))
        }
      } else {
        return callback(new Error('联系电话格式不正确'))
      }

      callback()
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$api.userCenter.updateTelephone(this.formData).then(res => {
            this.$msg.success('修改成功！')
            this.$emit('confirm')
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    cancel() {
      this.$emit('close')
    }
  }
}
</script>
