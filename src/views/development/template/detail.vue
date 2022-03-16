<template>
  <a-form-model ref="form" v-loading="loading" label-width="100px" title-align="right" :model="formData">
    <a-form-model-item label="编号" prop="code">
      <a-input v-model="formData.code" read-only />
    </a-form-model-item>
    <a-form-model-item label="名称" prop="name">
      <a-input v-model="formData.name" read-only />
    </a-form-model-item>
    <a-form-model-item label="类型" prop="type">
      <a-select v-model="formData.type" disabled>
        <a-select-option v-for="item in $enums.DATAOBJECT_TYPE.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
      </a-select>
    </a-form-model-item>
    <a-form-model-item label="状态" prop="available">
      <a-select v-model="formData.available" disabled>
        <a-select-option v-for="item in $enums.AVAILABLE.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
      </a-select>
    </a-form-model-item>
    <a-form-model-item label="备注" prop="description">
      <a-textarea v-model="formData.description" read-only />
    </a-form-model-item>
  </a-form-model>
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
