<template>
  <div v-if="visible" class="app-container simple-app-container">
    <div v-permission="['base-data:product:info:add']">
      <a-steps :current="active" simple>
        <a-step title="基础信息">
          <a-icon type="home" />
        </a-step>
        <a-step title="商品信息">
          <a-icon type="flag" />
        </a-step>
      </a-steps>
      <div v-loading="loading">
        <a-row>
          <a-col v-if="active === 1" :span="12">
            <a-form-model ref="form" :label-col="{span: 6}" :wrapper-col="{span: 14}" :model="formData" :rules="rules">
              <a-form-model-item label="商品货号" prop="code">
                <a-input v-model.trim="formData.code" allow-clear />
              </a-form-model-item>
              <a-form-model-item label="商品名称" prop="name">
                <a-input v-model="formData.name" allow-clear />
              </a-form-model-item>
              <a-form-model-item label="商品简称" prop="shortName">
                <a-input v-model.trim="formData.shortName" allow-clear />
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
              <a-form-model-item label="是否多销售属性" prop="multiple">
                <a-select v-model="formData.multiple" allow-clear @change="changeMultiple">
                  <a-select-option :value="false">否</a-select-option>
                  <a-select-option :value="true">是</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item v-if="formData.multiple" label="销售属性1" prop="salePropGroup1.id">
                <product-sale-prop-group-selector v-model="formData.salePropGroup1" :request-params="{ available: true, filterEmpty: true }" @input="selectSalePropGroup1" />
              </a-form-model-item>
              <a-form-model-item v-if="!$utils.isEmpty(formData.salePropGroup1) && !$utils.isEmpty(formData.salePropItems1)" label=" " :colon="false" prop="selectSalePropItems1">
                <a-checkbox-group v-model="formData.selectSalePropItems1">
                  <a-checkbox v-for="salePropItem in formData.salePropItems1" :key="salePropItem.id" :value="salePropItem.id" name="selectSalePropItems1">{{ salePropItem.name }}</a-checkbox>
                </a-checkbox-group>
              </a-form-model-item>
              <a-form-model-item v-if="formData.multiple" label="销售属性2" prop="salePropGroup2.id">
                <product-sale-prop-group-selector v-model="formData.salePropGroup2" :request-params="{ available: true, filterEmpty: true }" @input="selectSalePropGroup2" />
              </a-form-model-item>
              <a-form-model-item v-if="!$utils.isEmpty(formData.salePropGroup2) && !$utils.isEmpty(formData.salePropItems2)" label=" " :colon="false" prop="selectSalePropItems2">
                <a-checkbox-group v-model="formData.selectSalePropItems2">
                  <a-checkbox v-for="salePropItem in formData.salePropItems2" :key="salePropItem.id" :value="salePropItem.id" name="selectSalePropItems2">{{ salePropItem.name }}</a-checkbox>
                </a-checkbox-group>
              </a-form-model-item>
            </a-form-model>
            <div class="form-modal-footer">
              <a-space>
                <a-button type="primary" @click="next">下一步</a-button>
                <a-button @click="closeDialog">关闭</a-button>
              </a-space>
            </div>
          </a-col>
          <div v-else-if="active === 2" :span="22">
            <a-row>
              <a-col :span="24" class="row">
                <div style="color: #909399; padding: 10px; font-size: 12px;">
                  <a-row><span>使用“Tab”键更方便切换输入框。</span></a-row>
                </div>
                <vxe-table
                  ref="xTable"
                  border
                  resizable
                  show-footer
                  :data="tableData"
                >
                  <vxe-table-column v-if="formData.multiple && !$utils.isEmpty(formData.salePropGroup1)" field="salePropItemName1" width="100">
                    <template #header>
                      <span>{{ formData.salePropGroup1.name }}</span>
                    </template>
                  </vxe-table-column>
                  <vxe-table-column v-if="formData.multiple && !$utils.isEmpty(formData.salePropGroup2)" field="salePropItemName2" width="100">
                    <template #header>
                      <span>{{ formData.salePropGroup2.name }}</span>
                    </template>
                  </vxe-table-column>
                  <vxe-table-column field="code" title="商品编号" width="220">
                    <template #header>
                      <span class="required">商品编号</span>
                    </template>
                    <template #default="{ row }">
                      <a-input v-model.trim="row.code" tabindex="1" />
                    </template>
                  </vxe-table-column>
                  <vxe-table-column field="name" title="商品名称" width="300">
                    <template #header>
                      <span class="required">商品名称</span>
                      <a-dropdown>
                        <a-menu slot="overlay" @click="batchSet">
                          <a-menu-item key="salePropToName">
                            拼接销售属性
                          </a-menu-item>
                          <a-menu-item key="specToName">
                            拼接规格
                          </a-menu-item>
                          <a-menu-item key="unitToName">
                            拼接单位
                          </a-menu-item>
                        </a-menu>
                        <a class="ant-dropdown-link" style="margin-left: 5px;">操作<a-icon type="down" /></a>
                      </a-dropdown>
                    </template>
                    <template #default="{ row }">
                      <a-input v-model="row.name" tabindex="2" />
                    </template>
                  </vxe-table-column>
                  <vxe-table-column field="skuCode" title="商品SKU编号" width="220">
                    <template #header>
                      <span class="required">商品SKU编号</span>
                      <a-dropdown>
                        <a-menu slot="overlay" @click="batchSet">
                          <a-menu-item key="codeToSkuCode">
                            设置为商品编号
                          </a-menu-item>
                        </a-menu>
                        <a class="ant-dropdown-link" style="margin-left: 5px;">操作<a-icon type="down" /></a>
                      </a-dropdown>
                    </template>
                    <template #default="{ row }">
                      <a-input v-model.trim="row.skuCode" tabindex="3" />
                    </template>
                  </vxe-table-column>
                  <vxe-table-column field="externalCode" title="外部编号" width="220">
                    <template #header>
                      <span>外部编号</span>
                      <a-dropdown>
                        <a-menu slot="overlay" @click="batchSet">
                          <a-menu-item key="skuCodeToExternalCode">
                            设置为商品SKU编号
                          </a-menu-item>
                          <a-menu-item key="codeToExternalCode">
                            设置为商品编号
                          </a-menu-item>
                        </a-menu>
                        <a class="ant-dropdown-link" style="margin-left: 5px;">操作<a-icon type="down" /></a>
                      </a-dropdown>
                    </template>
                    <template #default="{ row }">
                      <a-input v-model.trim="row.externalCode" tabindex="4" />
                    </template>
                  </vxe-table-column>
                  <vxe-table-column field="spec" title="规格" width="100">
                    <template #header>
                      <span>规格</span>
                      <a-input v-model="batchChangeData.spec" size="mini" @input="e => batchChange('spec', e.target.value)" />
                    </template>
                    <template #default="{ row }">
                      <a-input v-model.trim="row.spec" tabindex="5" />
                    </template>
                  </vxe-table-column>
                  <vxe-table-column field="unit" title="单位" width="100">
                    <template #header>
                      <span>单位</span>
                      <a-input v-model="batchChangeData.unit" size="mini" @input="e => batchChange('unit', e.target.value)" />
                    </template>
                    <template #default="{ row }">
                      <a-input v-model.trim="row.unit" tabindex="6" />
                    </template>
                  </vxe-table-column>
                  <vxe-table-column field="purchasePrice" title="采购价（元）" width="120">
                    <template #header>
                      <span class="required">采购价（元）</span>
                      <a-input v-model="batchChangeData.purchasePrice" size="mini" @input="e => batchChange('purchasePrice', e.target.value)" />
                    </template>
                    <template #default="{ row }">
                      <a-input v-model="row.purchasePrice" tabindex="7" />
                    </template>
                  </vxe-table-column>
                  <vxe-table-column field="salePrice" title="销售价（元）" width="120">
                    <template #header>
                      <span class="required">销售价（元）</span>
                      <a-input v-model="batchChangeData.salePrice" size="mini" @input="e => batchChange('salePrice', e.target.value)" />
                    </template>
                    <template #default="{ row }">
                      <a-input v-model="row.salePrice" tabindex="8" />
                    </template>
                  </vxe-table-column>
                  <vxe-table-column field="retailPrice" title="零售价（元）" width="120">
                    <template #header>
                      <span class="required">零售价（元）</span>
                      <a-input v-model="batchChangeData.retailPrice" size="mini" @input="e => batchChange('retailPrice', e.target.value)" />
                    </template>
                    <template #default="{ row }">
                      <a-input v-model="row.retailPrice" tabindex="9" />
                    </template>
                  </vxe-table-column>
                </vxe-table>
              </a-col>
              <a-col v-if="!$utils.isEmpty(modelorList)" :span="24" class="row">
                <a-form-model :label-col="{span: 6}" :wrapper-col="{span: 14}">
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
                    </a-col>
                  </a-row>
                </a-form-model>
              </a-col>
              <a-col :span="24" class="row">
                <div class="form-modal-footer">
                  <a-space>
                    <a-button @click="pre">上一步</a-button>
                    <a-button type="primary" @click="submit">保存</a-button>
                    <a-button @click="closeDialog">关闭</a-button>
                  </a-space>
                </div>
              </a-col>
            </a-row>
          </div>
        </a-row>
      </div>
    </div>
  </div>
</template>
<script>
import ProductBrandSelector from '@/components/Selector/ProductBrandSelector'
import ProductCategorySelector from '@/components/Selector/ProductCategorySelector'
import ProductSalePropGroupSelector from '@/components/Selector/ProductSalePropGroupSelector'
import { validTaxRate } from './constants'
import { validCode } from '@/utils/validate'
export default {
  name: 'AddProduct',
  components: {
    ProductBrandSelector, ProductCategorySelector, ProductSalePropGroupSelector
  },
  data() {
    return {
      // 是否显示加载框
      loading: false,
      visible: false,
      // 表单数据
      formData: {},
      batchChangeData: {},
      // 当前页签
      active: 1,
      // 属性列表
      modelorList: [],
      // 表单校验规则
      rules: {
        code: [
          { required: true, message: '请输入商品货号' },
          { validator: validCode, message: '商品货号必须由字母、数字、“-_.”组成，长度不能超过20位' }
        ],
        name: [
          { required: true, message: '请输入商品名称' }
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
        ],
        multiple: [
          { required: true, message: '请选择是否多销售属性' }
        ],
        'salePropGroup1.id': [
          { validator: this.validSalePropGroup1 }
        ],
        'salePropGroup2.id': [
          { validator: this.validSalePropGroup2 }
        ],
        selectSalePropItems1: [
          { validator: this.validSalePropItem }
        ],
        selectSalePropItems2: [
          { validator: this.validSalePropItem }
        ]
      },
      tableData: []
    }
  },
  computed: {},
  created() {
    // 初始化表单数据
    this.initFormData()
    this.initBatchChangeData()
    this.initDatas()
  },
  methods: {
    // 打开对话框 由父页面触发
    openDialog() {
      // 初始化表单数据
      this.initFormData()
      this.initBatchChangeData()
      this.initDatas()
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
        name: '',
        shortName: '',
        brand: {},
        category: {},
        taxRate: '',
        saleTaxRate: '',
        multiple: '',
        salePropGroup1: {},
        salePropGroup2: {},
        salePropItems1: [],
        salePropItems2: [],
        selectSalePropItems1: [],
        selectSalePropItems2: []
      }
    },
    initDatas() {
      this.active = 1
      this.modelorList = []
      this.tableData = []
    },
    initBatchChangeData() {
      this.batchChangeData = {
        spec: '',
        unit: '',
        salePrice: '',
        purchasePrice: '',
        retailPrice: ''
      }
    },
    // 提交表单事件
    submit() {
      if (this.$utils.isEmpty(this.tableData)) {
        this.$msg.error('商品信息不能为空！')
        return
      }

      for (let i = 0; i < this.tableData.length; i++) {
        const product = this.tableData[i]

        if (this.$utils.isEmpty(product.id) && this.$utils.isEmpty(product.name)) {
          continue
        }

        if (this.$utils.isEmpty(product.code)) {
          this.$msg.error('第' + (i + 1) + '行商品编号不能为空！')
          return
        }

        if (this.$utils.isEmpty(product.name)) {
          this.$msg.error('第' + (i + 1) + '行商品名称不能为空！')
          return
        }

        if (this.$utils.isEmpty(product.skuCode)) {
          this.$msg.error('第' + (i + 1) + '行商品SKU编号不能为空！')
          return
        }

        if (this.$utils.isEmpty(product.purchasePrice)) {
          this.$msg.error('第' + (i + 1) + '行商品采购价不能为空！')
          return
        }

        if (!this.$utils.isFloat(product.purchasePrice)) {
          this.$msg.error('第' + (i + 1) + '行商品采购价必须为数字！')
          return
        }

        if (this.$utils.isFloatLtZero(product.purchasePrice)) {
          this.$msg.error('第' + (i + 1) + '行商品采购价不允许小于0！')
          return
        }

        if (!this.$utils.isNumberPrecision(product.purchasePrice, 2)) {
          this.$msg.error('第' + (i + 1) + '行商品采购价最多允许2位小数！')
          return
        }

        if (this.$utils.isEmpty(product.salePrice)) {
          this.$msg.error('第' + (i + 1) + '行商品销售价不能为空！')
          return
        }

        if (!this.$utils.isFloat(product.salePrice)) {
          this.$msg.error('第' + (i + 1) + '行商品销售价必须为数字！')
          return
        }

        if (this.$utils.isFloatLtZero(product.salePrice)) {
          this.$msg.error('第' + (i + 1) + '行商品销售价不允许小于0！')
          return
        }

        if (!this.$utils.isNumberPrecision(product.salePrice, 2)) {
          this.$msg.error('第' + (i + 1) + '行商品销售价最多允许2位小数！')
          return
        }

        if (this.$utils.isEmpty(product.retailPrice)) {
          this.$msg.error('第' + (i + 1) + '行商品零售价不能为空！')
          return
        }

        if (!this.$utils.isFloat(product.retailPrice)) {
          this.$msg.error('第' + (i + 1) + '行商品零售价必须为数字！')
          return
        }

        if (this.$utils.isFloatLtZero(product.retailPrice)) {
          this.$msg.error('第' + (i + 1) + '行商品零售价不允许小于0！')
          return
        }

        if (!this.$utils.isNumberPrecision(product.retailPrice, 2)) {
          this.$msg.error('第' + (i + 1) + '行商品零售价最多允许2位小数！')
          return
        }
      }

      const that = this
      let valid = true
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

      const products = this.tableData.filter(item => !this.$utils.isEmpty(item.code) || !this.$utils.isEmpty(item.name)).map(item => {
        return {
          code: item.code,
          name: item.name,
          skuCode: item.skuCode,
          externalCode: item.externalCode,
          purchasePrice: item.purchasePrice,
          spec: item.spec,
          unit: item.unit,
          salePrice: item.salePrice,
          retailPrice: item.retailPrice,
          salePropItemId1: item.salePropItemId1,
          salePropItemId2: item.salePropItemId2
        }
      })

      if (this.$utils.isEmpty(products)) {
        this.$msg.error('商品信息不能为空！')
        return
      }

      const properties = this.modelorList.filter(item => !this.$utils.isEmpty(item.text)).map(item => {
        return {
          id: item.id,
          text: this.$utils.isArray(item.text) ? JSON.stringify(item.text) : item.text
        }
      })

      const params = {
        code: this.formData.code,
        name: this.formData.name,
        shortName: this.formData.shortName,
        categoryId: this.formData.category.id,
        brandId: this.formData.brand.id,
        taxRate: this.formData.taxRate,
        saleTaxRate: this.formData.saleTaxRate,
        multipleSaleProp: this.formData.multiple,
        properties: properties,
        products: products
      }

      this.loading = true
      this.$api.baseData.product.poly.create(params).then(res => {
        this.$msg.success('新增成功！')
        this.$emit('confirm')
        this.closeDialog()
      }).finally(() => {
        this.loading = false
      })
    },
    // 页面显示时触发
    open() {
      // 初始化表单数据
      this.initFormData()
      this.initBatchChangeData()
      this.modelorList = []
      this.tableData = []
    },
    next() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.$utils.isEmpty(this.formData.salePropGroup1)) {
            if (this.$utils.isEmpty(this.formData.selectSalePropItems1)) {
              this.$msg.error('请选择销售属性！')
              return
            }
          }

          if (!this.$utils.isEmpty(this.formData.salePropGroup2)) {
            if (this.$utils.isEmpty(this.formData.selectSalePropItems2)) {
              this.$msg.error('请选择销售属性！')
              return
            }
          }

          this.setTableData()
          this.active++
        }
      })
    },
    selectCategory(val) {
      this.modelorList = []
      if (!this.$utils.isEmpty(val)) {
        this.$api.baseData.product.property.getModelorByCategory(val.id).then(res => {
          this.modelorList = res
        })
      }
    },
    selectSalePropGroup1(val) {
      this.formData.selectSalePropItems1 = []
      if (!this.$utils.isEmpty(val)) {
        this.$api.baseData.product.salePropItem.getEnables(val.id).then(res => {
          this.formData.salePropItems1 = res
        })
      }
    },
    selectSalePropGroup2(val) {
      this.formData.selectSalePropItems2 = []
      if (!this.$utils.isEmpty(val)) {
        this.$api.baseData.product.salePropItem.getEnables(val.id).then(res => {
          this.formData.salePropItems2 = res
        })
      }
    },
    validSalePropGroup1(rule, value, callback) {
      if (!this.$utils.isEmpty(value)) {
        if (!this.$utils.isEmpty(this.formData.salePropGroup2.id)) {
          if (value === this.formData.salePropGroup2.id) {
            return callback(new Error('销售属性1不能和销售属性2相同'))
          }
        }
      } else {
        if (!this.$utils.isEmpty(this.formData.salePropGroup2.id)) {
          return callback(new Error('销售属性2已选择，销售属性1不能为空'))
        }

        if (this.formData.multiple) {
          return callback(new Error('销售属性1不能为空'))
        }
      }

      callback()
    },
    validSalePropGroup2(rule, value, callback) {
      if (!this.$utils.isEmpty(value)) {
        if (!this.$utils.isEmpty(this.formData.salePropGroup1.id)) {
          if (value === this.formData.salePropGroup1.id) {
            return callback(new Error('销售属性1不能和销售属性2相同'))
          }
        }
      }

      callback()
    },
    validSalePropItem(rule, value, callback) {
      if (this.$utils.isEmpty(value)) {
        return callback(new Error('请选择销售属性'))
      }

      callback()
    },
    setTableData() {
      this.tableData = []
      if (this.formData.multiple) {
        // 如果是多销售属性
        const item2Length = this.$utils.isEmpty(this.formData.selectSalePropItems2) ? 0 : this.formData.selectSalePropItems2.length

        let tableData = []

        for (let i = 0; i < this.formData.selectSalePropItems1.length; i++) {
          const salePropItem = this.formData.salePropItems1.filter(item => item.id === this.formData.selectSalePropItems1[i])[0]
          const tableDataObj = {
            code: this.formData.code,
            name: this.formData.name,
            salePropItemId1: salePropItem.id,
            salePropItemId2: '',
            salePropItemName1: salePropItem.name,
            salePropItemName2: '',
            skuCode: '',
            externalCode: '',
            purchasePrice: '',
            spec: '',
            unit: '',
            salePrice: '',
            retailPrice: ''
          }

          tableData.push(tableDataObj)
        }

        if (item2Length > 0) {
          const tmpTableData = []
          for (let j = 0; j < tableData.length; j++) {
            for (let i = 0; i < this.formData.selectSalePropItems2.length; i++) {
              const salePropItem = this.formData.salePropItems2.filter(item => item.id === this.formData.selectSalePropItems2[i])[0]
              tmpTableData.push(Object.assign({}, tableData[j], {
                salePropItemId2: salePropItem.id,
                salePropItemName2: salePropItem.name
              }))
            }
          }

          tableData = tmpTableData
        }

        for (let i = 0; i < tableData.length; i++) {
          tableData[i].code = tableData[i].code + String(i + 1)
        }

        this.tableData = tableData
      } else {
        this.tableData.push({
          code: this.formData.code,
          name: this.formData.name,
          salePropItemId1: '',
          salePropItemId2: '',
          salePropItemName1: '',
          salePropItemName2: '',
          skuCode: '',
          externalCode: '',
          purchasePrice: '',
          spec: '',
          unit: '',
          salePrice: '',
          retailPrice: ''
        })
      }
    },
    pre() {
      this.active--

      this.initBatchChangeData()
    },
    changeMultiple() {
      this.formData.salePropGroup1 = []
      this.formData.salePropGroup2 = []
      this.formData.selectSalePropItems1 = []
      this.formData.selectSalePropItems2 = []
    },
    // 批量修改属性
    batchChange(key, value) {
      this.tableData.filter(item => !this.$utils.isEmpty(item.id) || !this.$utils.isEmpty(item.name)).forEach(item => {
        item[key] = value
      })
    },
    // 批量设置属性
    batchSet({ key }) {
      if (key === 'codeToSkuCode') {
        this.tableData.filter(item => !this.$utils.isEmpty(item.id) || !this.$utils.isEmpty(item.name)).forEach(item => {
          item.skuCode = item.code
        })
      } else if (key === 'skuCodeToExternalCode') {
        this.tableData.filter(item => !this.$utils.isEmpty(item.id) || !this.$utils.isEmpty(item.name)).forEach(item => {
          item.externalCode = item.skuCode
        })
      } else if (key === 'codeToExternalCode') {
        this.tableData.filter(item => !this.$utils.isEmpty(item.id) || !this.$utils.isEmpty(item.name)).forEach(item => {
          item.externalCode = item.code
        })
      } else if (key === 'salePropToName') {
        this.tableData.filter(item => !this.$utils.isEmpty(item.id) || !this.$utils.isEmpty(item.name)).forEach(item => {
          if (!this.$utils.isEmpty(item.salePropItemName1)) {
            item.name += ' ' + item.salePropItemName1
          }

          if (!this.$utils.isEmpty(item.salePropItemName2)) {
            item.name += ' ' + item.salePropItemName2
          }
        })
      } else if (key === 'specToName') {
        this.tableData.filter(item => !this.$utils.isEmpty(item.id) || !this.$utils.isEmpty(item.name)).forEach(item => {
          if (!this.$utils.isEmpty(item.spec)) {
            item.name += ' ' + item.spec
          }
        })
      } else if (key === 'unitToName') {
        this.tableData.filter(item => !this.$utils.isEmpty(item.id) || !this.$utils.isEmpty(item.name)).forEach(item => {
          if (!this.$utils.isEmpty(item.unit)) {
            item.name += ' ' + item.unit
          }
        })
      }
    }
  }
}
</script>
<style scoped>
.form-container {
  padding: 10px;
}

.row {
  margin-bottom: 20px;
}
</style>
