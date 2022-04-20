<template>
  <div v-permission="['system:dept:modify']" v-loading="loading">
    <a-form-model ref="form" :label-col="{span: 4}" :wrapper-col="{span: 16}" :model="formData" :rules="rules">
      <a-form-model-item label="编号" prop="code">
        <a-input v-model.trim="formData.code" allow-clear />
      </a-form-model-item>
      <a-form-model-item label="名称" prop="name">
        <a-input v-model.trim="formData.name" allow-clear />
      </a-form-model-item>
      <a-form-model-item label="简称" prop="shortName">
        <a-input v-model.trim="formData.shortName" allow-clear />
      </a-form-model-item>
      <a-form-model-item label="上级部门" prop="parentId">
        <sys-dept-selector v-model="formData.parentId" :only-final="false" />
      </a-form-model-item>
      <a-form-model-item label="状态" prop="available">
        <a-select v-model="formData.available" allow-clear>
          <a-select-option v-for="item in $enums.AVAILABLE.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="备注" prop="description">
        <a-textarea v-model.trim="formData.description" />
      </a-form-model-item>
    </a-form-model>
    <div class="form-modal-footer">
      <a-space>
        <a-button type="primary" @click="submitEvent">保存</a-button>
        <a-button @click="resetForm">重置</a-button>
      </a-space>
    </div>
  </div>
</template>
<script>
import SysDeptSelector from '@/components/Selector/SysDeptSelector'
import { validCode } from '@/utils/validate'
export default {
  components: {
    SysDeptSelector
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
        shortName: [
          { required: true, message: '请输入简称' }
        ],
        available: [
          { required: true, message: '请选择状态' }
        ]
      }
    }
  },
  created() {
    // 初始化表单数据
    this.initFormData()
    // 查询数据
    this.loadData()
  },
  methods: {
    // 初始化表单数据
    initFormData() {
      this.formData = {
        id: '',
        code: '',
        parentId: '',
        description: '',
        name: '',
        shortName: '',
        available: ''
      }
    },
    // 提交表单事件
    submitEvent() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$api.system.dept.modify(this.formData).then(() => {
            this.$msg.success('修改成功！')
            // 初始化表单数据
            this.initFormData()
            this.$emit('confirm')
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    // 重置表单
    resetForm() {
      this.$refs.form.resetFields()
    },
    // 页面显示时触发
    open() {
      // 初始化表单数据
      this.initFormData()
      // 查询数据
      this.loadData()
    },
    loadData() {
      this.loading = true
      this.$api.system.dept.get(this.id).then(data => {
        this.formData = data
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
