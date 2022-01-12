<template>
  <el-form ref="form" v-loading="loading" label-width="120px" title-align="right" :model="formData" :rules="rules">
    <el-form-item label="旧密码" prop="oldPsw">
      <el-input v-model="formData.oldPsw" type="password" show-password style="width: 50%;" />
    </el-form-item>
    <el-form-item label="新密码" prop="newPsw">
      <el-input v-model="formData.newPsw" type="password" show-password style="width: 50%;" />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPsw">
      <el-input v-model="formData.confirmPsw" type="password" show-password style="width: 50%;" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { isPassword } from '@/utils/validate'
export default {
  props: {
  },
  data() {
    return {
      loading: false,
      formData: {
        oldPsw: '',
        newPsw: '',
        confirmPsw: ''
      },
      rules: {
        oldPsw: [
          { required: true, message: '请输入旧密码' },
          { validator: this.validOldPsw }
        ],
        newPsw: [
          { required: true, message: '请输入新密码' },
          { validator: this.validNewPsw }
        ],
        confirmPsw: [
          { required: true, message: '请输入确认密码' },
          { validator: this.validConfirmPsw }
        ]
      }
    }
  },
  methods: {
    validOldPsw(rule, value, callback) {
      if (this.$utils.isEmpty(value)) {
        return callback()
      }

      if (!isPassword(value)) {
        return callback(new Error('密码长度必须为5-16位，只允许包含大写字母、小写字母、数字、下划线'))
      }

      callback()
    },
    validNewPsw(rule, value, callback) {
      if (this.$utils.isEmpty(value)) {
        return callback()
      }

      if (isPassword(value)) {
        if (value !== this.formData.confirmPsw) {
          return callback(new Error('两次密码输入不一致'))
        }
      } else {
        return callback(new Error('密码长度必须为5-16位，只允许包含大写字母、小写字母、数字、下划线'))
      }

      callback()
    },
    validConfirmPsw(rule, value, callback) {
      if (this.$utils.isEmpty(value)) {
        return callback()
      }

      if (isPassword(value)) {
        if (value !== this.formData.newPsw) {
          return callback(new Error('两次密码输入不一致'))
        }
      } else {
        return callback(new Error('密码长度必须为5-16位，只允许包含大写字母、小写字母、数字、下划线'))
      }

      callback()
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$msg.confirm('是否确认修改密码？注：修改密码后需要重新登录').then(() => {
            this.loading = true
            this.$api.userCenter.updatePsw(this.formData).then(res => {
              this.$msg.success('修改成功！')
              this.$emit('confirm')
            }).finally(() => {
              this.loading = false
            })
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
