<template>
  <a-modal v-model="visible" :mask-closable="false" width="40%" title="发送" :dialog-style="{ top: '20px' }" :footer="null">
    <div v-if="visible" v-loading="loading">
      <a-form-model ref="form" :label-col="{span: 4}" :wrapper-col="{span: 16}" :model="formData" :rules="rules">
        <a-form-model-item label="接收人" prop="user.id">
          <user-selector
            v-model="formData.user"
          />
        </a-form-model-item>
        <a-form-model-item label="是否留存副本" prop="selfSave">
          <a-select v-model="formData.selfSave" allow-clear>
            <a-select-option :value="true">留存</a-select-option>
            <a-select-option :value="false">不留存</a-select-option>
          </a-select>
        </a-form-model-item>
        <div class="form-modal-footer">
          <a-space>
            <a-button type="primary" :loading="loading" html-type="submit" @click="submit">确定</a-button>
            <a-button :loading="loading" @click="closeDialog">取消</a-button>
          </a-space>
        </div>
      </a-form-model>
    </div>
  </a-modal>
</template>
<script>
import UserSelector from '@/components/Selector/UserSelector'
export default {
  // 使用组件
  components: {
    UserSelector
  },
  props: {
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
        'user.id': [
          { required: true, message: '请选择接收人' }
        ],
        selfSave: [
          { required: true, message: '请选择是否留存副本' }
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
        user: {},
        selfSave: true
      }
    },
    // 提交表单事件
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('confirm', {
            userId: this.formData.user.id,
            selfSave: this.formData.selfSave
          })
          this.closeDialog()
        }
      })
    },
    // 页面显示时触发
    open() {
      // 初始化数据
      this.initFormData()
    }
  }
}
</script>
