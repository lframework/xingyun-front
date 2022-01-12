<template>
  <div v-permission="['system:dept:modify']">
    <el-form ref="form" v-loading="loading" label-width="100px" title-align="right" :model="formData" :rules="rules">
      <el-form-item label="编号" prop="code">
        <el-input v-model.trim="formData.code" clearable />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model.trim="formData.name" clearable />
      </el-form-item>
      <el-form-item label="简称" prop="shortName">
        <el-input v-model.trim="formData.shortName" clearable />
      </el-form-item>
      <el-form-item label="上级部门" prop="parentId">
        <el-cascader v-model="formData.parentId" :options="parentOptions" :props="parentProps" filterable clearable />
      </el-form-item>
      <el-form-item label="状态" prop="available">
        <el-select v-model="formData.available" clearable>
          <el-option v-for="item in $enums.AVAILABLE.values()" :key="item.code" :label="item.desc" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="description">
        <el-input v-model.trim="formData.description" type="textarea" resize="none" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitEvent">保存</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
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
        shortName: [
          { required: true, message: '请输入简称' }
        ],
        available: [
          { required: true, message: '请选择状态' }
        ]
      },
      // 父级控件数据
      parentOptions: [],
      // 父级控件配置
      parentProps: {
        emitPath: false,
        // 子级展开方式
        expandTrigger: 'hover',
        // 允许选择任意一级
        checkStrictly: true,
        value: 'id',
        label: 'name'
      }
    }
  },
  created() {
    // 初始化表单数据
    this.initFormData()
    // 重新加载选择器数据
    this.reloadDepts()
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
      // 重新加载选择器数据
      this.reloadDepts()
      // 查询数据
      this.loadData()
    },
    async reloadDepts() {
      this.loading = true
      await this.$api.system.dept.trees().then(data => {
        this.parentOptions = this.$utils.toArrayTree(data, {
          strict: true
        })
      }).finally(() => {
        this.loading = false
      })
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
