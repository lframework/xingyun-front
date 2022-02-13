<template>
  <el-dialog :visible.sync="visible" :close-on-click-modal="false" append-to-body width="500px" title="审核拒绝" top="5vh" @open="open">
    <div v-if="visible" v-permission="['purchase:order:approve']" v-loading="loading">
      <el-form ref="form" v-loading="loading" label-width="100px" title-align="right" :model="formData" :rules="rules">
        <el-form-item label="拒绝理由" prop="refuseReason">
          <el-input v-model.trim="formData.refuseReason" type="textarea" maxlength="200" show-word-limit clearable />
        </el-form-item>
      </el-form>
    </div>
    <template v-slot:footer>
      <div style="text-align: center;">
        <el-button v-permission="['purchase:order:approve']" type="primary" :loading="loading" @click="submit">确定</el-button>
        <el-button :loading="loading" @click="closeDialog">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script>
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
        refuseReason: [
          { required: true, message: '请输入拒绝理由' }
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
    },
    // 关闭对话框
    closeDialog() {
      this.visible = false
      this.$emit('close')
    },
    // 初始化表单数据
    initFormData() {
      this.formData = {
        refuseReason: ''
      }
    },
    // 页面显示时触发
    open() {
      // 初始化表单数据
      this.initFormData()
    },
    // 提交
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('confirm', this.formData.refuseReason)
          this.closeDialog()
        }
      })
    }
  }
}
</script>
<style>
</style>
