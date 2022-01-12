<template>
  <el-dialog :visible.sync="visible" :close-on-click-modal="false" :append-to-body="true" width="40%" title="修改" top="5vh" @open="open">
    <div v-if="visible" v-permission="['base-data:product:saleprop-item:modify']">
      <el-form ref="form" v-loading="loading" label-width="120px" title-align="right" :model="formData" :rules="rules">
        <el-form-item label="销售属性编号" prop="code">
          <el-input v-model.trim="formData.code" maxlength="20" show-word-limit clearable />
        </el-form-item>
        <el-form-item label="销售属性名称" prop="name">
          <el-input v-model.trim="formData.name" maxlength="20" show-word-limit clearable />
        </el-form-item>
        <el-form-item label="状态" prop="available">
          <el-select v-model="formData.available" clearable>
            <el-option v-for="item in $enums.AVAILABLE.values()" :key="item.code" :label="item.desc" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input v-model.trim="formData.description" maxlength="200" show-word-limit type="textarea" resize="none" />
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
  // 使用组件
  components: {
  },

  props: {
    groupId: {
      type: String,
      required: true
    },
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
          { required: true, message: '请输入销售属性编号' }
        ],
        name: [
          { required: true, message: '请输入销售属性名称' }
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
        id: '',
        code: '',
        name: '',
        available: '',
        description: ''
      }
    },
    // 提交表单事件
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$api.baseData.product.salePropItem.modify(Object.assign({ groupId: this.groupId }, this.formData)).then(() => {
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
      await this.$api.baseData.product.salePropItem.get(this.itemId).then(data => {
        this.formData = data
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
