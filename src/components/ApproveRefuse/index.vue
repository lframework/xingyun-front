<template>
  <a-modal v-model="visible" :mask-closable="false" width="500px" title="审核拒绝" :dialog-style="{ top: '20px' }">
    <div v-if="visible">
      <a-form-model ref="form" :label-col="{span: 6}" :wrapper-col="{span: 18}" :model="formData" :rules="rules">
        <a-form-model-item label="拒绝理由" prop="refuseReason">
          <a-textarea v-model.trim="formData.refuseReason" max-length="200" allow-clear />
        </a-form-model-item>
      </a-form-model>
    </div>
    <template slot="footer">
      <div style="text-align: center;">
        <a-button type="primary" :loading="loading" @click="submit">确定</a-button>
        <a-button :loading="loading" @click="closeDialog">关闭</a-button>
      </div>
    </template>
  </a-modal>
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
