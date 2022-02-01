<template>
  <el-dialog :visible.sync="visible" :close-on-click-modal="false" width="40%" title="修改" top="5vh" @open="open">
    <div v-if="visible" v-permission="['base-data:product:saleprop-group:modify']">
      <el-form ref="form" v-loading="loading" label-width="100px" title-align="right" :model="formData" :rules="rules">
        <el-form-item label="编号" prop="code">
          <el-input v-model.trim="formData.code" maxlength="20" show-word-limit clearable />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="formData.name" maxlength="20" show-word-limit clearable />
        </el-form-item>
        <el-form-item label="是否必填" prop="isRequired">
          <el-select v-model="formData.isRequired" clearable>
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item label="字段类型" prop="columnType">
          <el-select v-model="formData.columnType" clearable :disabled="columnTypeDisabled">
            <el-option v-for="item in $enums.COLUMN_TYPE.values()" :key="item.code" :label="item.desc" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="$enums.COLUMN_TYPE.CUSTOM.equalsCode(formData.columnType)" label="数据类型" prop="columnDataType">
          <el-select v-model="formData.columnDataType" clearable :disabled="columnTypeDisabled">
            <el-option v-for="item in $enums.COLUMN_DATA_TYPE.values()" :key="item.code" :label="item.desc" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="类别" prop="propertyType">
          <el-select v-model="formData.propertyType" clearable>
            <el-option v-for="item in $enums.PROPERTY_TYPE.values()" :key="item.code" :label="item.desc" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="$enums.PROPERTY_TYPE.APPOINT.equalsCode(formData.propertyType)" label="商品类目" :required="true">
          <product-category-selector v-model="formData.categories" :multiple="true" :only-final="false" :disabled="columnTypeDisabled" />
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
import ProductCategorySelector from '@/components/Selector/ProductCategorySelector'
export default {
  // 使用组件
  components: {
    ProductCategorySelector
  },

  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // 是否可见
      visible: false,
      // 字段类型是否禁用
      columnTypeDisabled: false,
      // 是否显示加载框
      loading: false,
      // 表单数据
      formData: {},
      // 类目
      category: {},
      // 表单校验规则
      rules: {
        code: [
          { required: true, message: '请输入编号' }
        ],
        name: [
          { required: true, message: '请输入名称' }
        ],
        isRequired: [
          { required: true, message: '请选择是否必填' }
        ],
        columnType: [
          { required: true, message: '请选择字段类型' }
        ],
        columnDataType: [
          { required: true, message: '请选择数据类型' }
        ],
        propertyType: [
          { required: true, message: '请选择类别' }
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
        isRequired: '',
        columnType: '',
        columnDataType: '',
        propertyType: '',
        available: '',
        description: '',
        categories: []
      }
    },
    // 提交表单事件
    submit() {
      if (this.$enums.PROPERTY_TYPE.APPOINT.equalsCode(this.formData.propertyType)) {
        if (this.$utils.isEmpty(this.formData.categories)) {
          this.$msg.error('请选择商品类目')
          return
        }
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          const params = {
            id: this.formData.id,
            code: this.formData.code,
            name: this.formData.name,
            isRequired: this.formData.isRequired,
            columnType: this.formData.columnType,
            columnDataType: this.formData.columnDataType,
            propertyType: this.formData.propertyType,
            available: this.formData.available,
            description: this.formData.description
          }
          if (!this.$utils.isEmpty(this.formData.categories)) {
            params.categoryIds = this.formData.categories.map(item => item.id)
          }
          this.$api.baseData.product.property.modify(params).then(() => {
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
      this.columnTypeDisabled = false

      this.loading = true
      await this.$api.baseData.product.property.get(this.id).then(data => {
        data.categories = data.categories || []

        this.formData = data
        this.columnTypeDisabled = this.$enums.COLUMN_TYPE.CUSTOM.equalsCode(this.formData.columnType)
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
