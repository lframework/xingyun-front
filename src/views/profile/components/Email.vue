<template>
  <el-form ref="form" v-loading="loading" label-width="120px" title-align="right" :model="formData" :rules="rules">
    <el-form-item label="新邮箱地址" prop="newEmail">
      <el-input v-model.trim="formData.newEmail" style="width: 50%;" />
    </el-form-item>
    <el-form-item label="确认邮箱地址" prop="confirmEmail">
      <el-input v-model.trim="formData.confirmEmail" style="width: 50%;" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { isEmail } from '@/utils/validate'
export default {
  props: {
  },
  data() {
    return {
      loading: false,
      formData: {
        newEmail: '',
        confirmEmail: ''
      },
      rules: {
        newEmail: [
          { required: true, message: '请输入新邮箱地址' },
          { validator: this.validEmail }
        ],
        confirmEmail: [
          { required: true, message: '请输入确认邮箱地址' },
          { validator: this.validConfirmEmail }
        ]
      }
    }
  },
  methods: {
    validEmail(rule, value, callback) {
      if (this.$utils.isEmpty(value)) {
        return callback()
      }

      if (isEmail(value)) {
        if (value !== this.formData.confirmEmail) {
          return callback(new Error('两次邮箱地址输入不一致'))
        }
      } else {
        return callback(new Error('邮箱地址格式不正确'))
      }

      callback()
    },
    validConfirmEmail(rule, value, callback) {
      if (this.$utils.isEmpty(value)) {
        return callback()
      }

      if (isEmail(value)) {
        if (value !== this.formData.newEmail) {
          return callback(new Error('两次邮箱地址输入不一致'))
        }
      } else {
        return callback(new Error('邮箱地址格式不正确'))
      }

      callback()
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$api.userCenter.updateEmail(this.formData).then(res => {
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
