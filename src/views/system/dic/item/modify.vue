<template>
  <a-modal v-model="visible" :mask-closable="false" width="40%" :dialog-style="{ top: '20px' }" title="修改" :footer="null">
    <div v-if="visible" v-permission="['system.dic-item:modify']" v-loading="loading">
      <a-form-model ref="form" :label-col="{span: 4}" :wrapper-col="{span: 16}" :model="formData" :rules="rules">
        <a-form-model-item label="编号" prop="code">
          <a-col :span="20">
            <a-input v-model.trim="formData.code" allow-clear />
          </a-col>
          <a-col :span="3" :offset="1">
            <a-tooltip title="编号是字典的关联字段，请谨慎修改"><a-icon type="question-circle" /></a-tooltip>
          </a-col>
        </a-form-model-item>
        <a-form-model-item label="名称" prop="name">
          <a-input v-model.trim="formData.name" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="排序" prop="orderNo">
          <a-input v-model.trim="formData.orderNo" />
        </a-form-model-item>
        <div class="form-modal-footer">
          <a-space>
            <a-button type="primary" :loading="loading" html-type="submit" @click="submit">保存</a-button>
            <a-button :loading="loading" @click="closeDialog">取消</a-button>
          </a-space>
        </div>
      </a-form-model>
    </div>
  </a-modal>
</template>
<script>
import { validCode } from '@/utils/validate'

export default {
  // 使用组件
  components: {
  },

  props: {
    itemId: {
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
          { required: true, message: '请输入编号' },
          { validator: validCode }
        ],
        name: [
          { required: true, message: '请输入名称' }
        ],
        orderNo: [
          { required: true, message: '请输入排序' }
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
        id: '',
        code: '',
        name: '',
        orderNo: ''
      }
    },
    // 提交表单事件
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.$utils.isInteger(this.formData.orderNo)) {
            this.$msg.error('排序必须为数字类型')
            return
          }
          this.loading = true
          this.$api.system.dic.modifyItem(Object.assign({ }, this.formData)).then(() => {
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
      await this.$api.system.dic.getItem(this.itemId).then(data => {
        this.formData = data
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
