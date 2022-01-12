<template>
  <el-form ref="form" v-loading="loading" label-width="100px" title-align="right" :model="formData">
    <el-form-item label="编号" prop="code">
      <el-input v-model="formData.code" readonly />
    </el-form-item>
    <el-form-item label="名称" prop="name">
      <el-input v-model="formData.name" readonly />
    </el-form-item>
    <el-form-item label="类型" prop="type">
      <el-select v-model="formData.type" disabled>
        <el-option v-for="item in $enums.DATAOBJECT_TYPE.values()" :key="item.code" :label="item.desc" :value="item.code" />
      </el-select>
    </el-form-item>
    <el-form-item label="状态" prop="available">
      <el-select v-model="formData.available" disabled>
        <el-option v-for="item in $enums.AVAILABLE.values()" :key="item.code" :label="item.desc" :value="item.code" />
      </el-select>
    </el-form-item>
    <el-form-item label="备注" prop="description">
      <el-input v-model="formData.description" type="textarea" resize="none" readonly />
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
      formData: {}
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
