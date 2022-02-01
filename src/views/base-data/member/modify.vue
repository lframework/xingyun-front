<template>
  <el-dialog :visible.sync="visible" :close-on-click-modal="false" width="40%" title="修改" top="5vh" @open="open">
    <div v-if="visible" v-permission="['base-data:member:modify']">
      <el-form ref="form" v-loading="loading" label-width="100px" title-align="right" :model="formData" :rules="rules">
        <el-form-item label="编号" prop="code">
          <el-input v-model.trim="formData.code" maxlength="20" show-word-limit clearable />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="formData.name" maxlength="20" show-word-limit clearable />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="formData.gender" clearable>
            <el-option v-for="item in $enums.GENDER.values()" :key="item.code" :label="item.desc" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="会员手机号" prop="telephone">
          <el-input v-model.trim="formData.telephone" maxlength="20" show-word-limit clearable />
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model.trim="formData.email" maxlength="100" show-word-limit clearable />
        </el-form-item>
        <el-form-item label="出生日期" prop="birthday">
          <el-date-picker
            v-model="formData.birthday"
            :picker-options="{
              disabledDate(time) {
                return time.getTime() > Date.now();
              }
            }"
            value-format="yyyy-MM-dd"
            type="date"
          />
        </el-form-item>
        <el-form-item label="入会日期" prop="joinDay">
          <el-date-picker
            v-model="formData.joinDay"
            :picker-options="{
              disabledDate(time) {
                return time.getTime() > Date.now();
              }
            }"
            value-format="yyyy-MM-dd"
            type="date"
          />
        </el-form-item>
        <el-form-item label="状态" prop="available">
          <el-select v-model="formData.available" clearable>
            <el-option v-for="item in $enums.AVAILABLE.values()" :key="item.code" :label="item.desc" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input v-model.trim="formData.description" maxlength="200" show-word-limit type="textarea" resize="none" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">保存</el-button>
          <el-button @click="closeDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>
<script>
import * as constants from './constants'

export default {
  // 使用组件
  components: {
  },

  props: {
    id: {
      type: String,
      required: true
    }
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
        code: [
          { required: true, message: '请输入编号' }
        ],
        name: [
          { required: true, message: '请输入名称' }
        ],
        gender: [
          { required: true, message: '请选择性别' }
        ],
        email: [
          { validator: constants.validEmail }
        ],
        joinDay: [
          { required: true, message: '请选择入会日期' }
        ],
        available: [
          { required: true, message: '请选择状态' }
        ]
      }
    }
  },
  created() {
    this.initFormData()
  },
  methods: {
    // 打开对话框 由父页面触发
    openDialog() {
      this.visible = true
    },
    // 关闭对话框
    closeDialog() {
      this.visible = false
      this.$emit('close')
    },
    // 初始化表单数据
    initFormData() {
      this.formData = {
        id: '',
        code: '',
        name: '',
        gender: '',
        telephone: '',
        email: '',
        birthday: '',
        joinDay: '',
        available: '',
        description: ''
      }
    },
    // 提交表单事件
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$api.baseData.member.modify(this.formData).then(() => {
            this.$msg.success('修改成功！')
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
      // 初始化数据
      this.initFormData()

      // 查询数据
      this.loadFormData()
    },
    // 查询数据
    async loadFormData() {
      this.loading = true
      await this.$api.baseData.member.get(this.id).then(data => {
        this.formData = data
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
