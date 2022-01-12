<template>
  <el-form ref="form" v-loading="loading" label-width="100px" title-align="right" :model="formData" :rules="rules">
    <el-form-item label="编号" prop="code">
      <el-input v-model="formData.code" clearable />
    </el-form-item>
    <el-form-item label="名称" prop="name">
      <el-input v-model="formData.name" clearable />
    </el-form-item>
    <el-form-item label="类型" prop="type">
      <el-select v-model="formData.type" clearable>
        <el-option v-for="item in $enums.DATAOBJECT_TYPE.values()" :key="item.code" :label="item.desc" :value="item.code" />
      </el-select>
    </el-form-item>
    <el-form-item label="状态" prop="available">
      <el-select v-model="formData.available" clearable>
        <el-option v-for="item in $enums.AVAILABLE.values()" :key="item.code" :label="item.desc" :value="item.code" />
      </el-select>
    </el-form-item>
    <el-form-item label="备注" prop="description">
      <el-input v-model="formData.description" type="textarea" resize="none" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitEvent">保存</el-button>
      <el-button @click="$emit('close')">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>

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
          { required: true, message: '请输入编号' }
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
