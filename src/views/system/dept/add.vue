<template>
  <el-dialog :visible.sync="visible" :close-on-click-modal="false" width="40%" title="新增" top="5vh" @open="open">
    <div v-if="visible" v-permission="['system:dept:add']">
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
        <el-form-item label="备注" prop="description">
          <el-input v-model.trim="formData.description" type="textarea" resize="none" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">保存</el-button>
          <el-button @click="closeDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
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
        code: [
          { required: true, message: '请输入编号' }
        ],
        name: [
          { required: true, message: '请输入名称' }
        ],
        shortName: [
          { required: true, message: '请输入简称' }
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
  computed: {
  },
  created() {
    // 初始化表单数据
    this.initFormData()
    // 重新加载选择器数据
    this.reloadDepts()
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
        code: '',
        parentId: '',
        description: '',
        name: '',
        shortName: ''
      }
    },
    // 提交表单事件
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$api.system.dept.create(this.formData).then(() => {
            this.$msg.success('新增成功！')
            // 初始化表单数据
            this.initFormData()
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
      // 初始化表单数据
      this.initFormData()
      // 重新加载选择器数据
      this.reloadDepts()
    },
    reloadDepts() {
      this.$api.system.dept.trees().then(data => {
        this.parentOptions = this.$utils.toArrayTree(data, {
          strict: true
        })
      })
    }
  }
}
</script>
