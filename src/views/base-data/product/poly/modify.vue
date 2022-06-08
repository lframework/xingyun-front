<template>
  <a-modal v-model="visible" :mask-closable="false" width="40%" title="修改" :dialog-style="{ top: '20px' }" :footer="null">
    <div v-if="visible" v-permission="['base-data:product:poly:modify']" v-loading="loading">
      <a-form-model ref="form" :label-col="{span: 4}" :wrapper-col="{span: 16}" :model="formData" :rules="rules">
        <a-form-model-item label="商品货号" prop="code">
          <a-input v-model="formData.code" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="SPU名称" prop="name">
          <a-input v-model="formData.name" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="简称" prop="shortName">
          <a-input v-model="formData.shortName" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="商品类目" prop="category.id">
          <product-category-selector v-model="formData.category" :only-final="false" @input="selectCategory" />
        </a-form-model-item>
        <a-form-model-item label="商品品牌" prop="brand.id">
          <product-brand-selector v-model="formData.brand" :request-params="{ available: true }" />
        </a-form-model-item>
        <a-form-model-item label="进项税率（%）" prop="taxRate">
          <a-input v-model="formData.taxRate" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="销项税率（%）" prop="saleTaxRate">
          <a-input v-model="formData.saleTaxRate" allow-clear />
        </a-form-model-item>
        <a-form-model-item v-for="modelor in formData.modelors" :key="modelor.id" :label="modelor.name" :required="modelor.isRequired">
          <a-select v-if="$enums.COLUMN_TYPE.MULTIPLE.equalsCode(modelor.columnType)" v-model="modelor.text" mode="multiple" placeholder="请选择">
            <a-select-option
              v-for="item in modelor.items"
              :key="item.id"
              :value="item.id"
            >{{ item.name }}</a-select-option>
          </a-select>
          <a-select v-if="$enums.COLUMN_TYPE.SINGLE.equalsCode(modelor.columnType)" v-model="modelor.text" placeholder="请选择">
            <a-select-option
              v-for="item in modelor.items"
              :key="item.id"
              :value="item.id"
            >{{ item.name }}</a-select-option>
          </a-select>
          <div v-else-if="$enums.COLUMN_TYPE.CUSTOM.equalsCode(modelor.columnType)">
            <a-input-number v-if="$enums.COLUMN_DATA_TYPE.INT.equalsCode(modelor.columnDataType)" v-model="modelor.text" />
            <a-input-number v-else-if="$enums.COLUMN_DATA_TYPE.FLOAT.equalsCode(modelor.columnDataType)" v-model="modelor.text" :precision="2" />
            <a-input v-else-if="$enums.COLUMN_DATA_TYPE.STRING.equalsCode(modelor.columnDataType)" v-model="modelor.text" />
            <a-date-picker v-else-if="$enums.COLUMN_DATA_TYPE.DATE.equalsCode(modelor.columnDataType)" v-model="modelor.text" placeholder="" value-format="YYYY-MM-DD" />
            <a-time-picker
              v-else-if="$enums.COLUMN_DATA_TYPE.TIME.equalsCode(modelor.columnDataType)"
              v-model="modelor.text"
              placeholder=""
              value-format="HH:mm:ss"
            />
            <a-date-picker v-else-if="$enums.COLUMN_DATA_TYPE.DATE_TIME.equalsCode(modelor.columnDataType)" v-model="modelor.text" placeholder="" show-time value-format="YYYY-MM-DD HH:mm:ss" />
          </div>
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
import ProductBrandSelector from '@/components/Selector/ProductBrandSelector'
import ProductCategorySelector from '@/components/Selector/ProductCategorySelector'
import { validCode } from '@/utils/validate'
import { validTaxRate } from './constants'
export default {
  // 使用组件
  components: {
    ProductBrandSelector, ProductCategorySelector
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
      // 是否显示加载框
      loading: false,
      // 表单数据
      formData: {},
      // 表单校验规则
      rules: {
        code: [
          { required: true, message: '请输入商品货号' },
          { validator: validCode, message: '商品货号必须由字母、数字、“-_.”组成，长度不能超过20位' }
        ],
        name: [
          { required: true, message: '请输入SPU名称' }
        ],
        'category.id': [
          { required: true, message: '请选择商品类目' }
        ],
        'brand.id': [
          { required: true, message: '请选择商品品牌' }
        ],
        taxRate: [
          { required: true, message: '请输入进项税率（%）' },
          { validator: validTaxRate }
        ],
        saleTaxRate: [
          { required: true, message: '请输入销项税率（%）' },
          { validator: validTaxRate }
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
        shortName: '',
        category: {},
        brand: {},
        taxRate: '',
        saleTaxRate: ''
      }
    },
    // 提交表单事件
    submit() {
      this.$refs.form.validate((valid) => {
        if (!this.$utils.isEmpty(this.formData.modelors)) {
          this.formData.modelors.filter(item => item.isRequired).every(item => {
            if (this.$utils.isEmpty(item.text)) {
              this.$msg.error(item.name + '不能为空！')
              valid = false
              return false
            }

            return true
          })
        }
        if (valid) {
          this.loading = true
          const params = Object.assign({}, this.formData)
          params.brandId = this.formData.brand.id
          params.categoryId = this.formData.category.id

          delete params.brand
          delete params.category

          params.properties = this.formData.modelors
          delete params.modelors

          this.$api.baseData.product.poly.modify(params).then(() => {
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
      await this.$api.baseData.product.poly.get(this.id).then(data => {
        data.brand = {
          id: data.brandId,
          name: data.brandName
        }

        data.category = {
          id: data.categoryId,
          name: data.categoryName
        }
        this.formData = data
      }).finally(() => {
        this.loading = false
      })
    },
    selectCategory(val) {
      if (!this.$utils.isEmpty(val)) {
        this.$api.baseData.product.property.getModelorByCategory(val.id).then(res => {
          this.formData.modelors = res
        })
      }
    }
  }
}
</script>
