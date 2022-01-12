<template>
  <div v-if="visible" class="app-container">
    <div v-permission="['base-data:product:info:add']">
      <el-steps :active="active" simple>
        <el-step title="基础信息" icon="el-icon-s-home" />
        <el-step title="商品信息" icon="el-icon-s-flag" />
      </el-steps>
      <div v-loading="loading" class="form-container">
        <el-row>
          <el-col v-if="active === 1" :span="12">
            <el-form ref="form" label-width="120px" title-align="right" :model="formData" :rules="rules">
              <el-form-item label="商品货号" prop="code">
                <el-input v-model.trim="formData.code" maxlength="20" show-word-limit clearable />
              </el-form-item>
              <el-form-item label="商品名称" prop="name">
                <el-input v-model="formData.name" maxlength="100" show-word-limit clearable />
              </el-form-item>
              <el-form-item label="商品简称" prop="shortName">
                <el-input v-model.trim="formData.shortName" maxlength="100" show-word-limit clearable />
              </el-form-item>
              <el-form-item label="商品类目" prop="category.id">
                <product-category-selector v-model="formData.category" @input="selectCategory" />
              </el-form-item>
              <el-form-item label="商品品牌" prop="brand.id">
                <product-brand-selector v-model="formData.brand" :request-params="{ available: true }" />
              </el-form-item>
              <el-form-item label="进项税率（%）" prop="taxRate">
                <el-input v-model="formData.taxRate" clearable />
              </el-form-item>
              <el-form-item label="销项税率（%）" prop="saleTaxRate">
                <el-input v-model="formData.saleTaxRate" clearable />
              </el-form-item>
              <el-form-item label="是否多销售属性" prop="multiple">
                <el-select v-model="formData.multiple" clearable @change="changeMultiple">
                  <el-option label="否" :value="false" />
                  <el-option label="是" :value="true" />
                </el-select>
              </el-form-item>
              <el-form-item v-if="formData.multiple" label="销售属性1" prop="salePropGroup1.id">
                <product-sale-prop-group-selector v-model="formData.salePropGroup1" :request-params="{ available: true, filterEmpty: true }" @input="selectSalePropGroup1" />
              </el-form-item>
              <el-form-item v-if="!$utils.isEmpty(formData.salePropGroup1) && !$utils.isEmpty(formData.salePropItems1)" prop="selectSalePropItems1">
                <el-checkbox-group v-model="formData.selectSalePropItems1">
                  <el-checkbox v-for="salePropItem in formData.salePropItems1" :key="salePropItem.id" :label="salePropItem.id" name="selectSalePropItems1">{{ salePropItem.name }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item v-if="formData.multiple" label="销售属性2" prop="salePropGroup2.id">
                <product-sale-prop-group-selector v-model="formData.salePropGroup2" :request-params="{ available: true, filterEmpty: true }" @input="selectSalePropGroup2" />
              </el-form-item>
              <el-form-item v-if="!$utils.isEmpty(formData.salePropGroup2) && !$utils.isEmpty(formData.salePropItems2)" prop="selectSalePropItems2">
                <el-checkbox-group v-model="formData.selectSalePropItems2">
                  <el-checkbox v-for="salePropItem in formData.salePropItems2" :key="salePropItem.id" :label="salePropItem.id" name="selectSalePropItems2">{{ salePropItem.name }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="next">下一步</el-button>
                <el-button @click="closeDialog">关闭</el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <div v-else-if="active === 2" :span="22">
            <el-row>
              <el-col :span="24" class="row">
                <j-border title="注意事项">
                  <div style="color: #909399; padding: 10px; font-size: 12px;">
                    <el-row><span>使用“Tab”键更方便切换输入框。</span></el-row>
                  </div>
                </j-border>
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
                      <el-input v-model.trim="row.code" tabindex="1" maxlength="20" show-word-limit />
                    </template>
                  </vxe-table-column>
                  <vxe-table-column field="name" title="商品名称" width="300">
                    <template #header>
                      <span class="required">商品名称</span>
                      <el-dropdown @command="batchSet">
                        <span class="el-dropdown-link">
                          操作<i class="el-icon-arrow-down el-icon--right" />
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item command="salePropToName">拼接销售属性</el-dropdown-item>
                          <el-dropdown-item command="specToName">拼接规格</el-dropdown-item>
                          <el-dropdown-item command="unitToName">拼接单位</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </template>
                    <template #default="{ row }">
                      <el-input v-model="row.name" tabindex="2" maxlength="100" show-word-limit />
                    </template>
                  </vxe-table-column>
                  <vxe-table-column field="skuCode" title="商品SKU编号" width="220">
                    <template #header>
                      <span class="required">商品SKU编号</span>
                      <el-dropdown @command="batchSet">
                        <span class="el-dropdown-link">
                          操作<i class="el-icon-arrow-down el-icon--right" />
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item command="codeToSkuCode">设置为商品编号</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </template>
                    <template #default="{ row }">
                      <el-input v-model.trim="row.skuCode" tabindex="3" maxlength="20" show-word-limit />
                    </template>
                  </vxe-table-column>
                  <vxe-table-column field="externalCode" title="外部编号" width="220">
                    <template #header>
                      <span>外部编号</span>
                      <el-dropdown @command="batchSet">
                        <span class="el-dropdown-link">
                          操作<i class="el-icon-arrow-down el-icon--right" />
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item command="skuCodeToExternalCode">设置为商品SKU编号</el-dropdown-item>
                          <el-dropdown-item command="codeToExternalCode">设置为商品编号</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </template>
                    <template #default="{ row }">
                      <el-input v-model.trim="row.externalCode" tabindex="4" maxlength="20" show-word-limit />
                    </template>
                  </vxe-table-column>
                  <vxe-table-column field="spec" title="规格" width="100">
                    <template #header>
                      <span>规格</span>
                      <el-input v-model="batchChangeData.spec" size="mini" @input="e => batchChange('spec', e)" />
                    </template>
                    <template #default="{ row }">
                      <el-input v-model.trim="row.spec" tabindex="5" maxlength="20" show-word-limit />
                    </template>
                  </vxe-table-column>
                  <vxe-table-column field="unit" title="单位" width="100">
                    <template #header>
                      <span>单位</span>
                      <el-input v-model="batchChangeData.unit" size="mini" @input="e => batchChange('unit', e)" />
                    </template>
                    <template #default="{ row }">
                      <el-input v-model.trim="row.unit" tabindex="6" maxlength="20" show-word-limit />
                    </template>
                  </vxe-table-column>
                  <vxe-table-column field="purchasePrice" title="采购价（元）" width="120">
                    <template #header>
                      <span class="required">采购价（元）</span>
                      <el-input v-model="batchChangeData.purchasePrice" size="mini" @input="e => batchChange('purchasePrice', e)" />
                    </template>
                    <template #default="{ row }">
                      <el-input v-model="row.purchasePrice" tabindex="7" />
                    </template>
                  </vxe-table-column>
                  <vxe-table-column field="salePrice" title="销售价（元）" width="120">
                    <template #header>
                      <span class="required">销售价（元）</span>
                      <el-input v-model="batchChangeData.salePrice" size="mini" @input="e => batchChange('salePrice', e)" />
                    </template>
                    <template #default="{ row }">
                      <el-input v-model="row.salePrice" tabindex="8" />
                    </template>
                  </vxe-table-column>
                  <vxe-table-column field="retailPrice" title="零售价（元）" width="120">
                    <template #header>
                      <span class="required">零售价（元）</span>
                      <el-input v-model="batchChangeData.retailPrice" size="mini" @input="e => batchChange('retailPrice', e)" />
                    </template>
                    <template #default="{ row }">
                      <el-input v-model="row.retailPrice" tabindex="9" />
                    </template>
                  </vxe-table-column>
                </vxe-table>
              </el-col>
              <el-col v-if="!$utils.isEmpty(modelorList)" :span="24" class="row">
                <el-form inline>
                  <el-form-item v-for="modelor in modelorList" :key="modelor.id" :label="modelor.name" :class="modelor.isRequired ? 'is-required' : ''">
                    <el-select v-if="$enums.COLUMN_TYPE.MULTIPLE.equalsCode(modelor.columnType)" v-model="modelor.text" multiple placeholder="请选择">
                      <el-option
                        v-for="item in modelor.items"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                    <el-select v-if="$enums.COLUMN_TYPE.SINGLE.equalsCode(modelor.columnType)" v-model="modelor.text" placeholder="请选择">
                      <el-option
                        v-for="item in modelor.items"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                    <div v-else-if="$enums.COLUMN_TYPE.CUSTOM.equalsCode(modelor.columnType)">
                      <el-input-number v-if="$enums.COLUMN_DATA_TYPE.INT.equalsCode(modelor.columnDataType)" v-model="modelor.text" />
                      <el-input-number v-else-if="$enums.COLUMN_DATA_TYPE.FLOAT.equalsCode(modelor.columnDataType)" v-model="modelor.text" :precision="2" />
                      <el-input v-else-if="$enums.COLUMN_DATA_TYPE.STRING.equalsCode(modelor.columnDataType)" v-model="modelor.text" />
                      <el-date-picker
                        v-else-if="$enums.COLUMN_DATA_TYPE.DATE.equalsCode(modelor.columnDataType)"
                        v-model="modelor.text"
                        value-format="yyyy-MM-dd"
                        type="date"
                      />
                      <el-time-picker
                        v-else-if="$enums.COLUMN_DATA_TYPE.TIME.equalsCode(modelor.columnDataType)"
                        v-model="modelor.text"
                        value-format="HH:mm:ss"
                      />
                      <el-date-picker
                        v-else-if="$enums.COLUMN_DATA_TYPE.DATE_TIME.equalsCode(modelor.columnDataType)"
                        v-model="modelor.text"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                      />
                    </div>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="24" class="row">
                <div style="text-align: center;">
                  <el-button @click="pre">上一步</el-button>
                  <el-button type="primary" @click="submit">保存</el-button>
                  <el-button @click="closeDialog">关闭</el-button>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import ProductBrandSelector from '@/components/Selector/ProductBrandSelector'
import ProductCategorySelector from '@/components/Selector/ProductCategorySelector'
import ProductSalePropGroupSelector from '@/components/Selector/ProductSalePropGroupSelector'
import { validTaxRate } from './constants'
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
          { required: true, message: '请输入商品编号' }
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
          console.log(this.modelorList)
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
    batchSet(command) {
      if (command === 'codeToSkuCode') {
        this.tableData.filter(item => !this.$utils.isEmpty(item.id) || !this.$utils.isEmpty(item.name)).forEach(item => {
          item.skuCode = item.code
        })
      } else if (command === 'skuCodeToExternalCode') {
        this.tableData.filter(item => !this.$utils.isEmpty(item.id) || !this.$utils.isEmpty(item.name)).forEach(item => {
          item.externalCode = item.skuCode
        })
      } else if (command === 'codeToExternalCode') {
        this.tableData.filter(item => !this.$utils.isEmpty(item.id) || !this.$utils.isEmpty(item.name)).forEach(item => {
          item.externalCode = item.code
        })
      } else if (command === 'salePropToName') {
        this.tableData.filter(item => !this.$utils.isEmpty(item.id) || !this.$utils.isEmpty(item.name)).forEach(item => {
          if (!this.$utils.isEmpty(item.salePropItemName1)) {
            item.name += ' ' + item.salePropItemName1
          }

          if (!this.$utils.isEmpty(item.salePropItemName2)) {
            item.name += ' ' + item.salePropItemName2
          }
        })
      } else if (command === 'specToName') {
        this.tableData.filter(item => !this.$utils.isEmpty(item.id) || !this.$utils.isEmpty(item.name)).forEach(item => {
          if (!this.$utils.isEmpty(item.spec)) {
            item.name += ' ' + item.spec
          }
        })
      } else if (command === 'unitToName') {
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
