<template>
  <div class="app-container simple-app-container">
    <div v-loading="loading" v-permission="['base-data:product:info:modify']">
      <a-form-model ref="form" :label-col="{span: 6}" :wrapper-col="{span: 14}" :model="formData" :rules="rules">
        <a-row>
          <a-col :md="8" :sm="24">
            <a-form-model-item label="编号" prop="code">
              <a-input v-model="formData.code" allow-clear />
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item label="名称" prop="name">
              <a-input v-model="formData.name" allow-clear />
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item label="简称" prop="shortName">
              <a-input v-model="formData.shortName" allow-clear />
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item label="SKU编号" prop="skuCode">
              <a-input v-model="formData.skuCode" allow-clear />
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item label="外部编号" prop="externalCode">
              <a-input v-model="formData.externalCode" allow-clear />
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item label="商品类目" prop="categoryId">
              <product-category-selector v-model="formData.categoryId" :only-final="false" @input="selectCategory" />
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item label="商品品牌" prop="brandId">
              <product-brand-selector v-model="formData.brandId" :request-params="{ available: true }" />
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item label="规格" prop="spec">
              <a-input v-model="formData.spec" allow-clear />
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item label="单位" prop="unit">
              <a-input v-model="formData.unit" allow-clear />
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item label="进项税率（%）" prop="taxRate">
              <a-input v-model="formData.taxRate" allow-clear />
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item label="销项税率（%）" prop="saleTaxRate">
              <a-input v-model="formData.saleTaxRate" allow-clear />
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item label="采购价（元）" prop="purchasePrice">
              <a-input v-model="formData.purchasePrice" allow-clear />
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item label="销售价（元）" prop="salePrice">
              <a-input v-model="formData.salePrice" allow-clear />
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item label="零售价（元）" prop="retailPrice">
              <a-input v-model="formData.retailPrice" allow-clear />
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item label="状态" prop="available">
              <a-select v-model="formData.available" allow-clear>
                <a-select-option v-for="item in $enums.AVAILABLE.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col v-for="modelor in modelorList" :key="modelor.id" :md="8" :sm="24">
            <a-form-model-item :label="modelor.name" :required="modelor.isRequired">
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
                <a-input-number v-if="$enums.COLUMN_DATA_TYPE.INT.equalsCode(modelor.columnDataType)" v-model="modelor.text" class="number-input" />
                <a-input-number v-else-if="$enums.COLUMN_DATA_TYPE.FLOAT.equalsCode(modelor.columnDataType)" v-model="modelor.text" :precision="2" class="number-input" />
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
          </a-col>
        </a-row>
      </a-form-model>
      <div class="form-modal-footer">
        <a-space>
          <a-button type="primary" @click="submit">保存</a-button>
          <a-button @click="closeDialog">关闭</a-button>
        </a-space>
      </div>
    </div>
  </div>
</template>
<script>
import { validCode } from '@/utils/validate'
import ProductBrandSelector from '@/components/Selector/ProductBrandSelector'
import ProductCategorySelector from '@/components/Selector/ProductCategorySelector'

export default {
  // 使用组件
  components: {
    ProductBrandSelector, ProductCategorySelector
  },

  props: {
  },
  data() {
    return {
      id: this.$route.params.id,
      // 是否显示加载框
      loading: false,
      // 表单数据
      formData: {},
      modelorList: [],
      // 表单校验规则
      rules: {
        code: [
          { required: true, message: '请输入编号' },
          { validator: validCode, message: '编号必须由字母、数字、“-_.”组成，长度不能超过20位' }
        ],
        name: [
          { required: true, message: '请输入名称' }
        ],
        categoryId: [
          { required: true, message: '请选择类目' }
        ],
        brandId: [
          { required: true, message: '请选择品牌' }
        ],
        taxRate: [
          { required: true, message: '请输入进项税率（%）' },
          {
            validator: (rule, value, callback) => {
              if (!this.$utils.isEmpty(value)) {
                if (!this.$utils.isInteger(value)) {
                  return callback(new Error('销项税率（%）必须为整数'))
                }
                if (!this.$utils.isIntegerGeZero(value)) {
                  return callback(new Error('销项税率（%）不允许小于0'))
                }
              }

              callback()
            }
          }
        ],
        saleTaxRate: [
          { required: true, message: '请输入销项税率（%）' },
          {
            validator: (rule, value, callback) => {
              if (!this.$utils.isEmpty(value)) {
                if (!this.$utils.isInteger(value)) {
                  return callback(new Error('销项税率（%）必须为整数'))
                }
                if (!this.$utils.isIntegerGeZero(value)) {
                  return callback(new Error('销项税率（%）不允许小于0'))
                }
              }

              callback()
            }
          }
        ],
        purchasePrice: [
          { required: true, message: '请输入采购价（元）' },
          {
            validator: (rule, value, callback) => {
              if (!this.$utils.isEmpty(value)) {
                if (!this.$utils.isFloat(value)) {
                  return callback(new Error('采购价（元）必须为数字'))
                }
                if (!this.$utils.isFloatGeZero(value)) {
                  return callback(new Error('采购价（元）不允许小于0'))
                }
                if (!this.$utils.isNumberPrecision(value, 2)) {
                  return callback(new Error('采购价（元）最多允许2位小数'))
                }
              }

              callback()
            }
          }
        ],
        salePrice: [
          { required: true, message: '请输入销售价（元）' },
          {
            validator: (rule, value, callback) => {
              if (!this.$utils.isEmpty(value)) {
                if (!this.$utils.isFloat(value)) {
                  return callback(new Error('销售价（元）必须为数字'))
                }
                if (!this.$utils.isFloatGeZero(value)) {
                  return callback(new Error('销售价（元）不允许小于0'))
                }
                if (!this.$utils.isNumberPrecision(value, 2)) {
                  return callback(new Error('销售价（元）最多允许2位小数'))
                }
              }

              callback()
            }
          }
        ],
        retailPrice: [
          { required: true, message: '请输入零售价（元）' },
          {
            validator: (rule, value, callback) => {
              if (!this.$utils.isEmpty(value)) {
                if (!this.$utils.isFloat(value)) {
                  return callback(new Error('零售价（元）必须为数字'))
                }
                if (!this.$utils.isFloatGeZero(value)) {
                  return callback(new Error('零售价（元）不允许小于0'))
                }
                if (!this.$utils.isNumberPrecision(value, 2)) {
                  return callback(new Error('零售价（元）最多允许2位小数'))
                }
              }

              callback()
            }
          }
        ],
        available: [
          { required: true, message: '请选择状态' }
        ]
      }
    }
  },
  created() {
    // 初始化数据
    this.initFormData()
    // 查询数据
    this.loadFormData()
  },
  methods: {
    // 关闭对话框
    closeDialog() {
      this.$utils.closeCurrentPage(this.$parent)
    },
    // 初始化表单数据
    initFormData() {
      this.formData = {}
    },
    // 提交表单事件
    async submit() {
      const that = this
      let valid = true

      await this.$refs.form.validate((res) => {
        valid = res
      })

      if (!valid) {
        return
      }
      if (!this.$utils.isEmpty(this.modelorList)) {
        this.modelorList.filter(item => item.isRequired).every(item => {
          if (that.$utils.isEmpty(item.text)) {
            that.$msg.error(item.name + '不能为空！')
            valid = false
            return false
          }

          return true
        })
      }

      if (!valid) {
        return
      }

      const properties = this.modelorList.filter(item => !this.$utils.isEmpty(item.text)).map(item => {
        return {
          id: item.id,
          text: this.$utils.isArray(item.text) ? JSON.stringify(item.text) : item.text
        }
      })

      const params = Object.assign({}, this.formData, {
        properties: properties
      })
      this.loading = true
      this.$api.baseData.product.info.modify(params).then(() => {
        this.$msg.success('修改成功！')
        this.closeDialog()
      }).finally(() => {
        this.loading = false
      })
    },
    // 查询数据
    loadFormData() {
      this.loading = true
      this.$api.baseData.product.info.get(this.id).then(data => {
        this.formData = Object.assign({}, data)
        this.selectCategory(this.formData.categoryId, this.formData)
      }).finally(() => {
        this.loading = false
      })
    },
    selectCategory(val, formData) {
      this.modelorList = []
      if (!this.$utils.isEmpty(val)) {
        this.$api.baseData.product.property.getModelorByCategory(val).then(res => {
          const modelorList = res
          if (formData) {
            const properties = formData.properties || []
            modelorList.forEach(item => {
              item.text = (properties.filter(p => p.id === item.id)[0] || {}).text
              if (this.$enums.COLUMN_TYPE.MULTIPLE.equalsCode(item.columnType)) {
                item.text = this.$utils.isEmpty(item.text) ? [] : item.text.split(',')
              }
            })
          }

          modelorList.filter(item => this.$utils.isEmpty(item.text)).forEach(item => {
            if (this.$enums.COLUMN_TYPE.MULTIPLE.equalsCode(item.columnType)) {
              item.text = []
            } else {
              item.text = ''
            }
          })

          this.modelorList = modelorList

          console.log(this.modelorList)
        })
      }
    }
  }
}
</script>
