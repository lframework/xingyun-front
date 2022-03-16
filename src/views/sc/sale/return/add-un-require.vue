<template>
  <div v-if="visible" class="app-container">
    <div v-permission="['sale:return:add']" v-loading="loading">
      <j-border>
        <j-form>
          <j-form-item label="仓库" required>
            <store-center-selector
              v-model="formData.sc"
            />
          </j-form-item>
          <j-form-item label="客户" required>
            <customer-selector
              v-model="formData.customer"
              @input="customerChange"
            />
          </j-form-item>
          <j-form-item label="销售员">
            <user-selector
              v-model="formData.saler"
            />
          </j-form-item>
          <j-form-item label="付款日期" required>
            <a-date-picker
              v-model="formData.paymentDate"
              placeholder=""
              value-format="YYYY-MM-DD"
              :disabled="!formData.allowModifyPaymentDate"
              :disabled-date="(current) => {
                return current && current < $utils.getCurrentDateTime().endOf('day');
              }"
            />
          </j-form-item>
          <j-form-item label="销售出库单">
            <sale-out-sheet-selector
              v-model="formData.outSheet"
              @input="outSheetChange"
            />
          </j-form-item>
        </j-form>
      </j-border>
      <!-- 数据列表 -->
      <vxe-grid
        ref="grid"
        resizable
        show-overflow
        highlight-hover-row
        keep-source
        row-id="id"
        height="500"
        :data="tableData"
        :columns="tableColumn"
        :toolbar-config="toolbarConfig"
      >
        <!-- 工具栏 -->
        <template v-slot:toolbar_buttons>
          <a-space>
            <a-button type="primary" icon="plus" @click="addProduct">新增</a-button>
            <a-button type="danger" icon="delete" @click="delProduct">删除</a-button>
            <a-button icon="plus" @click="openBatchAddProductDialog">批量添加商品</a-button>
            <a-button icon="number" @click="batchInputReturnNum">批量录入数量</a-button>
            <a-button icon="edit" @click="batchInputTaxPrice">批量调整价格</a-button>
            <a-button icon="alert" @click="setGift">设置赠品</a-button>
          </a-space>
        </template>

        <!-- 商品名称 列自定义内容 -->
        <template v-slot:productName_default="{ row, rowIndex }">
          <a-auto-complete
            v-model="row.productName"
            style="width: 100%;"
            placeholder=""
            value-key="productName"
            @search="e => queryProduct(e, row)"
            @select="e => handleSelectProduct(rowIndex, e, row)"
          >
            <template slot="dataSource">
              <a-select-option v-for="(item, index) in row.products" :key="index" :value="item.productId">
                {{ item.productCode }} {{ item.productName }}
              </a-select-option>
            </template>
          </a-auto-complete>
        </template>

        <!-- 折扣 列自定义内容 -->
        <template v-slot:discountRate_default="{ row }">
          <span v-if="row.salePrice === 0 || row.isGift">{{ row.discountRate }}</span>
          <a-input v-else v-model="row.discountRate" class="number-input" @change="e => changeDiscountRate(row, e.target.value)" />
        </template>

        <!-- 价格 列自定义内容 -->
        <template v-slot:taxPrice_default="{ row }">
          <span v-if="row.isGift">{{ row.taxPrice }}</span>
          <a-input v-else v-model="row.taxPrice" class="number-input" @input="e => taxPriceInput(row, e.target.value)" />
        </template>

        <!-- 退货数量 列自定义内容 -->
        <template v-slot:returnNum_default="{ row }">
          <a-input v-model="row.returnNum" class="number-input" @input="e => returnNumInput(e.target.value)" />
        </template>

        <!-- 供应商 列自定义内容 -->
        <template v-slot:supplier_default="{ row }">
          <supplier-selector v-model="row.supplier" />
        </template>

        <!-- 含税金额 列自定义内容 -->
        <template v-slot:taxAmount_default="{ row }">
          <span v-if="$utils.isFloatGeZero(row.taxPrice) && $utils.isIntegerGeZero(row.returnNum)">{{ $utils.mul(row.taxPrice, row.returnNum) }}</span>
        </template>

        <!-- 备注 列自定义内容 -->
        <template v-slot:description_default="{ row }">
          <a-input v-model="row.description" />
        </template>
      </vxe-grid>

      <j-border title="合计">
        <j-form label-width="140px">
          <j-form-item label="退货数量" :span="6">
            <a-input v-model="formData.totalNum" class="number-input" read-only />
          </j-form-item>
          <j-form-item label="赠品数量" :span="6">
            <a-input v-model="formData.giftNum" class="number-input" read-only />
          </j-form-item>
          <j-form-item label="含税总金额" :span="6">
            <a-input v-model="formData.totalAmount" class="number-input" read-only />
          </j-form-item>
        </j-form>
      </j-border>

      <j-border>
        <j-form label-width="140px">
          <j-form-item label="备注" :span="24" :content-nest="false">
            <a-textarea v-model.trim="formData.description" maxlength="200" />
          </j-form-item>
        </j-form>
      </j-border>

      <batch-add-product
        ref="batchAddProductDialog"
        :sc-id="formData.sc.id"
        @confirm="batchAddProduct"
      />
      <div style="text-align: center; background-color: #FFFFFF;padding: 8px 0;">
        <a-space>
          <a-button v-permission="['sale:return:add']" type="primary" :loading="loading" @click="createOrder">保存</a-button>
          <a-button v-permission="['sale:return:approve']" type="primary" :loading="loading" @click="directApprovePassOrder">审核通过</a-button>
          <a-button :loading="loading" @click="closeDialog">关闭</a-button>
        </a-space>
      </div>
    </div>
  </div>
</template>
<script>
import StoreCenterSelector from '@/components/Selector/StoreCenterSelector'
import CustomerSelector from '@/components/Selector/CustomerSelector'
import UserSelector from '@/components/Selector/UserSelector'
import SupplierSelector from '@/components/Selector/SupplierSelector'
import SaleOutSheetSelector from './SaleOutSheetSelector'
import BatchAddProduct from '@/views/sc/sale/batch-add-product'
import Moment from 'moment'
export default {
  name: 'AddSaleReturnUnRequire',
  components: {
    StoreCenterSelector, CustomerSelector, UserSelector, SupplierSelector, SaleOutSheetSelector, BatchAddProduct
  },
  data() {
    return {
      // 是否可见
      visible: false,
      // 是否显示加载框
      loading: false,
      // 表单数据
      formData: {},
      // 工具栏配置
      toolbarConfig: {
        // 缩放
        zoom: false,
        // 自定义表头
        custom: false,
        // 右侧是否显示刷新按钮
        refresh: false,
        // 自定义左侧工具栏
        slots: {
          buttons: 'toolbar_buttons'
        }
      },
      // 列表数据配置
      tableColumn: [
        { type: 'checkbox', width: 40 },
        { field: 'productCode', title: '商品编号', width: 120 },
        { field: 'productName', title: '商品名称', width: 260, slots: { default: 'productName_default' }},
        { field: 'skuCode', title: '商品SKU编号', width: 120 },
        { field: 'externalCode', title: '商品外部编号', width: 120 },
        { field: 'unit', title: '单位', width: 80 },
        { field: 'spec', title: '规格', width: 80 },
        { field: 'categoryName', title: '商品类目', width: 120 },
        { field: 'brandName', title: '商品品牌', width: 120 },
        { field: 'salePrice', title: '参考销售价（元）', align: 'right', width: 150 },
        { field: 'isGift', title: '是否赠品', width: 80, formatter: ({ cellValue }) => { return cellValue ? '是' : '否' } },
        { field: 'discountRate', title: '折扣（%）', align: 'right', width: 120, slots: { default: 'discountRate_default' }},
        { field: 'taxPrice', title: '价格（元）', align: 'right', width: 120, slots: { default: 'taxPrice_default' }},
        { field: 'returnNum', title: '退货数量', align: 'right', width: 100, slots: { default: 'returnNum_default' }},
        { field: 'supplierName', title: '所属供应商', width: 200, slots: { default: 'supplier_default' }},
        { field: 'taxAmount', title: '含税金额', align: 'right', width: 120, slots: { default: 'taxAmount_default' }},
        { field: 'taxRate', title: '税率（%）', align: 'right', width: 100 },
        { field: 'salePropItemName1', title: '销售属性1', width: 120 },
        { field: 'salePropItemName2', title: '销售属性2', width: 120 },
        { field: 'description', title: '备注', width: 200, slots: { default: 'description_default' }}
      ],
      tableData: []
    }
  },
  computed: {
  },
  created() {
    // 初始化表单数据
    this.initFormData()
  },
  methods: {
    // 打开对话框 由父页面触发
    openDialog() {
      // 初始化表单数据
      this.initFormData()
      this.visible = true
    },
    // 关闭对话框
    closeDialog() {
      this.visible = false
      this.$emit('close')
    },
    // 初始化表单数据
    async initFormData() {
      this.formData = {
        sc: {},
        customer: {},
        outSheet: {},
        saler: {},
        paymentDate: this.$utils.formatDate(Moment().add(1, 'M')),
        totalNum: 0,
        giftNum: 0,
        totalAmount: 0,
        description: '',
        // 是否允许修改付款日期
        allowModifyPaymentDate: true
      }

      this.tableData = []
    },
    emptyProduct() {
      return {
        id: this.$utils.uuid(),
        productId: '',
        productCode: '',
        productName: '',
        skuCode: '',
        externalCode: '',
        unit: '',
        spec: '',
        categoryName: '',
        brandName: '',
        salePrice: '',
        taxPrice: '',
        discountRate: 100,
        returnNum: '',
        taxRate: '',
        isGift: false,
        taxAmount: '',
        salePropItemName1: '',
        salePropItemName2: '',
        description: '',
        supplier: {},
        isFixed: false,
        products: []
      }
    },
    // 新增商品
    addProduct() {
      if (this.$utils.isEmpty(this.formData.sc)) {
        this.$msg.error('请先选择仓库！')
        return
      }
      this.tableData.push(this.emptyProduct())
    },
    // 搜索商品
    queryProduct(queryString, row) {
      if (this.$utils.isEmpty(queryString)) {
        row.products = []
      }

      this.$api.sc.sale.saleOrder.searchProduct(this.formData.sc.id, queryString).then(res => {
        row.products = res
      })
    },
    // 选择商品
    handleSelectProduct(index, value, row) {
      value = row ? row.products.filter(item => item.productId === value)[0] : value
      this.tableData[index] = Object.assign(this.tableData[index], value, {
        isGift: false,
        taxPrice: value.salePrice
      })

      this.taxPriceInput(this.tableData[index], this.tableData[index].taxPrice)
    },
    // 删除商品
    delProduct() {
      const records = this.$refs.grid.getCheckboxRecords()
      if (this.$utils.isEmpty(records)) {
        this.$msg.error('请选择要删除的商品数据！')
        return
      }

      for (let i = 0; i < records.length; i++) {
        if (records[i].isFixed) {
          this.$msg.error('第' + (i + 1) + '行商品是销售出库单中的商品，不允许删除！')
          return
        }
      }

      this.$msg.confirm('是否确定删除选中的商品？').then(() => {
        const tableData = this.tableData.filter(t => {
          const tmp = records.filter(item => item.id === t.id)
          return this.$utils.isEmpty(tmp)
        })

        this.tableData = tableData

        this.calcSum()
      })
    },
    openBatchAddProductDialog() {
      if (this.$utils.isEmpty(this.formData.sc)) {
        this.$msg.error('请先选择仓库！')
        return
      }
      this.$refs.batchAddProductDialog.openDialog()
    },
    changeDiscountRate(row, value) {
      if (this.$utils.isFloatGeZero(row.discountRate) && this.$utils.isFloatGtZero(row.salePrice)) {
        row.taxPrice = this.$utils.div(this.$utils.mul(row.salePrice, row.discountRate), 100).toFixed(2)
      }

      this.calcSum()
    },
    taxPriceInput(row, value) {
      if (row.salePrice !== 0) {
        if (this.$utils.isFloatGeZero(row.taxPrice)) {
          row.discountRate = this.$utils.mul(this.$utils.div(row.taxPrice, row.salePrice), 100).toFixed(2)
        }
      }
      this.calcSum()
    },
    returnNumInput(value) {
      this.calcSum()
    },
    // 计算汇总数据
    calcSum() {
      let totalNum = 0
      let giftNum = 0
      let totalAmount = 0

      this.tableData.filter(t => {
        return this.$utils.isFloatGeZero(t.taxPrice) && this.$utils.isIntegerGeZero(t.returnNum)
      }).forEach(t => {
        const num = parseInt(t.returnNum)
        if (t.isGift) {
          giftNum = this.$utils.add(giftNum, num)
        } else {
          totalNum = this.$utils.add(totalNum, num)
        }

        totalAmount = this.$utils.add(totalAmount, this.$utils.mul(num, t.taxPrice))
      })

      this.formData.totalNum = totalNum
      this.formData.giftNum = giftNum
      this.formData.totalAmount = totalAmount
    },
    // 批量录入数量
    batchInputReturnNum() {
      const records = this.$refs.grid.getCheckboxRecords()
      if (this.$utils.isEmpty(records)) {
        this.$msg.error('请选择商品数据！')
        return
      }

      this.$msg.prompt('请输入退货数量', {
        inputPattern: this.$utils.PATTERN_IS_INTEGER_GT_ZERO,
        inputErrorMessage: '退货数量必须为整数并且大于0',
        title: '批量录入数量'
      }).then(({ value }) => {
        records.forEach(t => {
          t.returnNum = value

          this.returnNumInput(value)
        })
      })
    },
    // 批量录入价格
    batchInputTaxPrice() {
      const records = this.$refs.grid.getCheckboxRecords()
      if (this.$utils.isEmpty(records)) {
        this.$msg.error('请选择商品数据！')
        return
      }

      for (let i = 0; i < records.length; i++) {
        if (records[i].isGift) {
          this.$msg.error('第' + (i + 1) + '行商品为赠品，不允许录入价格！')
          return
        }
      }

      this.$msg.prompt('请输入价格（元）', {
        inputPattern: this.$utils.PATTERN_IS_PRICE,
        inputErrorMessage: '价格（元）必须为数字并且不小于0',
        inputValue: '0.00',
        title: '批量调整价格'
      }).then(({ value }) => {
        records.forEach(t => {
          t.taxPrice = value

          this.taxPriceInput(t, value)
        })
      })
    },
    // 设置赠品
    setGift() {
      const records = this.$refs.grid.getCheckboxRecords()
      if (this.$utils.isEmpty(records)) {
        this.$msg.error('请选择要设置为赠品的商品数据！')
        return
      }

      records.forEach(item => {
        item.taxPrice = 0
        item.isGift = true
      })

      this.calcSum()
    },
    // 批量新增商品
    batchAddProduct(productList) {
      productList.forEach(item => {
        this.tableData.push(this.emptyProduct())
        this.handleSelectProduct(this.tableData.length - 1, item)
      })
    },
    // 校验数据
    validData() {
      if (this.$utils.isEmpty(this.formData.sc.id)) {
        this.$msg.error('仓库不允许为空！')
        return false
      }

      if (this.$utils.isEmpty(this.formData.customer.id)) {
        this.$msg.error('客户不允许为空！')
        return false
      }

      if (this.formData.allowModifyPaymentDate) {
        if (this.$utils.isEmpty(this.formData.paymentDate)) {
          this.$msg.error('付款日期不允许为空！')
          return false
        }
      }

      if (this.$utils.isEmpty(this.tableData)) {
        this.$msg.error('请录入商品！')
        return false
      }

      for (let i = 0; i < this.tableData.length; i++) {
        const product = this.tableData[i]

        if (this.$utils.isEmpty(product.productId)) {
          this.$msg.error('第' + (i + 1) + '行商品不允许为空！')
          return false
        }

        if (this.$utils.isEmpty(product.supplier.id)) {
          this.$msg.error('第' + (i + 1) + '行商品所属供应商不允许为空！')
          return false
        }

        if (this.$utils.isEmpty(product.taxPrice)) {
          this.$msg.error('第' + (i + 1) + '行商品价格不允许为空！')
          return false
        }

        if (!this.$utils.isFloat(product.taxPrice)) {
          this.$msg.error('第' + (i + 1) + '行商品价格必须为数字！')
          return false
        }

        if (product.isGift) {
          if (parseFloat(product.taxPrice) !== 0) {
            this.$msg.error('第' + (i + 1) + '行商品价格必须等于0！')
            return false
          }
        } else {
          if (!this.$utils.isFloatGtZero(product.taxPrice)) {
            this.$msg.error('第' + (i + 1) + '行商品价格必须大于0！')
            return false
          }
        }

        if (!this.$utils.isNumberPrecision(product.taxPrice, 2)) {
          this.$msg.error('第' + (i + 1) + '行商品价格最多允许2位小数！')
          return false
        }

        if (!this.$utils.isEmpty(product.returnNum)) {
          if (!this.$utils.isInteger(product.returnNum)) {
            this.$msg.error('第' + (i + 1) + '行商品退货数量必须为整数！')
            return false
          }

          if (product.isFixed) {
            if (!this.$utils.isIntegerGeZero(product.returnNum)) {
              this.$msg.error('第' + (i + 1) + '行商品退货数量不允许小于0！')
              return false
            }
          } else {
            if (!this.$utils.isIntegerGtZero(product.returnNum)) {
              this.$msg.error('第' + (i + 1) + '行商品退货数量必须大于0！')
              return false
            }
          }
        } else {
          if (!product.isFixed) {
            this.$msg.error('第' + (i + 1) + '行商品退货数量不允许为空！')
            return false
          }
        }
      }

      return true
    },
    // 创建订单
    createOrder() {
      if (!this.validData()) {
        return
      }

      const params = {
        scId: this.formData.sc.id,
        customerId: this.formData.customer.id,
        salerId: this.formData.saler.id || '',
        paymentDate: this.formData.paymentDate || '',
        description: this.formData.description,
        required: false,
        products: this.tableData.filter(t => this.$utils.isIntegerGtZero(t.returnNum)).map(t => {
          const product = {
            productId: t.productId,
            supplierId: t.supplier.id,
            oriPrice: t.salePrice,
            taxPrice: t.taxPrice,
            discountRate: t.discountRate,
            returnNum: t.returnNum,
            description: t.description
          }

          return product
        })
      }

      this.loading = true
      this.$api.sc.sale.saleReturn.createOrder(params).then(res => {
        this.$msg.success('保存成功！')

        this.$emit('confirm')
        this.closeDialog()
      }).finally(() => {
        this.loading = false
      })
    },
    // 直接审核通过订单
    directApprovePassOrder() {
      if (!this.validData()) {
        return
      }

      const params = {
        scId: this.formData.sc.id,
        customerId: this.formData.customer.id,
        salerId: this.formData.saler.id || '',
        paymentDate: this.formData.paymentDate || '',
        description: this.formData.description,
        products: this.tableData.filter(t => this.$utils.isIntegerGtZero(t.returnNum)).map(t => {
          const product = {
            productId: t.productId,
            supplierId: t.supplier.id,
            oriPrice: t.salePrice,
            taxPrice: t.taxPrice,
            discountRate: t.discountRate,
            returnNum: t.returnNum,
            description: t.description
          }

          return product
        })
      }

      this.$msg.confirm('对销售退货单执行审核通过操作？').then(() => {
        this.loading = true
        this.$api.sc.sale.saleReturn.directApprovePassOrder(params).then(res => {
          this.$msg.success('审核通过！')

          this.$emit('confirm')
          this.closeDialog()
        }).finally(() => {
          this.loading = false
        })
      })
    },
    // 选择销售出库单
    outSheetChange(e) {
      // 只要选择了销售出库单，清空所有商品，然后将销售出库单中所有的明细列出来
      if (!this.$utils.isEmpty(e)) {
        this.loading = true
        this.$api.sc.sale.outSheet.getWithReturn(e.id).then(res => {
          const tableData = this.tableData.filter(item => !item.isFixed)
          let outSheetDetails = res.details || []
          outSheetDetails = outSheetDetails.map(item => {
            item.isFixed = true
            item.supplier = {
              id: item.supplierId,
              name: item.supplierName
            }
            return Object.assign(this.emptyProduct(), item)
          })

          this.tableData = [...outSheetDetails, ...tableData]

          this.formData.sc = {
            id: res.scId,
            name: res.scName
          }

          this.formData.customer = {
            id: res.customerId,
            name: res.customerName
          }

          if (!this.$utils.isEmpty(res.salerId)) {
            this.formData.saler = {
              id: res.salerId,
              name: res.salerName
            }
          }

          this.customerChange(this.formData.customer)
        }).finally(() => {
          this.loading = false
        })
      }
    },
    // 客户改变时触发
    customerChange(customer) {
      if (!this.$utils.isEmpty(customer.id)) {
        this.$api.sc.sale.outSheet.getPaymentDate(customer.id).then(res => {
          if (res.allowModify) {
            // 如果允许修改付款日期
            if (this.$utils.isEmpty(this.formData.paymentDate)) {
              this.formData.paymentDate = res.paymentDate || ''
            }
          } else {
            // 不允许修改则按默认日期
            this.formData.paymentDate = res.paymentDate || ''
          }
          this.formData.allowModifyPaymentDate = res.allowModify
        })
      }
    }
  }
}
</script>
<style>
</style>
