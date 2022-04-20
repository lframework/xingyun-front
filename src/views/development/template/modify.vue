<template>
  <a-form-model ref="form" :label-col="{span: 6}" :wrapper-col="{span: 14}" :model="formData" :rules="rules">
    <a-form-model-item label="编号" prop="code">
      <a-input v-model="formData.code" allow-clear />
    </a-form-model-item>
    <a-form-model-item label="名称" prop="name">
      <a-input v-model="formData.name" allow-clear />
    </a-form-model-item>
    <a-form-model-item label="类型" prop="type">
      <a-select v-model="formData.type" allow-clear>
        <a-select-option v-for="item in $enums.DATAOBJECT_TYPE.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
      </a-select>
    </a-form-model-item>
    <a-form-model-item label="状态" prop="available">
      <a-select v-model="formData.available" allow-clear>
        <a-select-option v-for="item in $enums.AVAILABLE.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
      </a-select>
    </a-form-model-item>
    <a-form-model-item label="备注" prop="description">
      <a-textarea v-model="formData.description" />
    </a-form-model-item>
    <a-form-model-item>
      <a-button type="primary" @click="submitEvent">保存</a-button>
      <a-button @click="$emit('close')">取消</a-button>
    </a-form-model-item>
  </a-form-model>
</template>
<script>

import { validCode } from '@/utils/validate'

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
        type: [
          { required: true, message: '请选择类型' }
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
    // 初始化表单数据
    initFormData() {
      this.formData = {
        id: '',
        code: '',
        name: '',
        available: '',
        description: ''
      }
    },
    // 提交表单事件
    submitEvent() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$api.development.data.modify(this.formData).then(() => {
            this.$msg.success('修改成功！')
            this.$emit('confirm')
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    // 页面显示时由父页面触发
    open() {
      // 初始化数据
      this.initFormData()

      // 查询数据
      this.loadFormData()
    },
    // 查询数据
    loadFormData() {
      this.loading = true
      this.$api.development.data.get(this.id).then(data => {
        this.formData = data
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
