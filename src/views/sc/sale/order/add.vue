<template>
  <div v-if="visible" class="app-container">
    <div v-permission="['sale:order:add']" v-loading="loading">
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
            />
          </j-form-item>
          <j-form-item label="销售员">
            <user-selector
              v-model="formData.saler"
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
        style="margin-top: 10px;"
      >
        <!-- 工具栏 -->
        <template v-slot:toolbar_buttons>
          <el-form :inline="true">
            <el-form-item>
              <el-button type="primary" @click="addProduct">新增</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="danger" @click="delProduct">删除</el-button>
            </el-form-item>
            <el-form-item>
              <el-button @click="openBatchAddProductDialog">批量添加商品</el-button>
            </el-form-item>
            <el-form-item>
              <el-button @click="batchInputOrderNum">批量录入数量</el-button>
            </el-form-item>
            <el-form-item>
              <el-button @click="batchInputTaxPrice">批量调整价格</el-button>
            </el-form-item>
            <el-form-item>
              <el-button @click="setGift">设置赠品</el-button>
            </el-form-item>
          </el-form>
        </template>

        <!-- 商品名称 列自定义内容 -->
        <template v-slot:productName_default="{ row, rowIndex }">
          <el-autocomplete
            v-model="row.productName"
            style="width: 100%;"
            :fetch-suggestions="queryProduct"
            placeholder=""
            value-key="productName"
            @select="e => handleSelectProduct(rowIndex, e)"
          >
            <template slot-scope="{ item }">
              <span>{{ item.productCode }} {{ item.productName }}</span>
            </template>
          </el-autocomplete>
        </template>

        <!-- 折扣 列自定义内容 -->
        <template v-slot:discountRate_default="{ row }">
          <span v-if="row.oriPrice === 0 || row.isGift">{{ row.discountRate }}</span>
          <el-input v-else v-model="row.discountRate" class="number-input" @change="e => changeDiscountRate(row, e)" />
        </template>

        <!-- 价格 列自定义内容 -->
        <template v-slot:taxPrice_default="{ row }">
          <span v-if="row.isGift">{{ row.taxPrice }}</span>
          <el-input v-else v-model="row.taxPrice" class="number-input" @input="value => taxPriceInput(row, value)" />
        </template>

        <!-- 销售数量 列自定义内容 -->
        <template v-slot:orderNum_default="{ row }">
          <el-input v-model="row.orderNum" class="number-input" @input="orderNumInput" />
        </template>

        <!-- 含税金额 列自定义内容 -->
        <template v-slot:orderAmount_default="{ row }">
          <span v-if="$utils.isFloatGeZero(row.taxPrice) && $utils.isFloatGeZero(row.orderNum)">{{ $utils.mul(row.taxPrice, row.orderNum) }}</span>
        </template>

        <!-- 备注 列自定义内容 -->
        <template v-slot:description_default="{ row }">
          <el-input v-model="row.description" />
        </template>
      </vxe-grid>

      <j-border title="合计">
        <j-form label-width="140px">
          <j-form-item label="销售数量" :span="6">
            <el-input v-model="formData.totalNum" class="number-input" readonly />
          </j-form-item>
          <j-form-item label="赠品数量" :span="6">
            <el-input v-model="formData.giftNum" class="number-input" readonly />
          </j-form-item>
          <j-form-item label="含税总金额" :span="6">
            <el-input v-model="formData.totalAmount" class="number-input" readonly />
          </j-form-item>
        </j-form>
      </j-border>

      <j-border>
        <j-form label-width="140px">
          <j-form-item label="备注" :span="24" :content-nest="false">
            <el-input v-model.trim="formData.description" maxlength="200" show-word-limit type="textarea" resize="none" />
          </j-form-item>
        </j-form>
      </j-border>
      <batch-add-product
        ref="batchAddProductDialog"
        :sc-id="formData.sc.id"
        @confirm="batchAddProduct"
      />
      <div style="text-align: center;">
        <el-button v-permission="['sale:order:add']" type="primary" :loading="loading" @click="createOrder">保存</el-button>
        <el-button v-permission="['sale:order:approve']" type="primary" :loading="loading" @click="directApprovePassOrder">审核通过</el-button>
        <el-button :loading="loading" @click="closeDialog">关闭</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import StoreCenterSelector from '@/components/Selector/StoreCenterSelector'
import CustomerSelector from '@/components/Selector/CustomerSelector'
import UserSelector from '@/components/Selector/UserSelector'
import BatchAddProduct from '@/views/sc/sale/batch-add-product'

export default {
  name: 'AddSaleOrder',
  components: {
    StoreCenterSelector, CustomerSelector, UserSelector, BatchAddProduct
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
        { field: 'oriPrice', title: '参考销售价（元）', align: 'right', width: 150 },
        { field: 'isGift', title: '是否赠品', width: 80, formatter: ({ cellValue }) => { return cellValue ? '是' : '否' } },
        { field: 'stockNum', title: '库存数量', align: 'right', width: 100 },
        { field: 'discountRate', title: '折扣（%）', align: 'right', width: 120, slots: { default: 'discountRate_default' }},
        { field: 'taxPrice', title: '价格（元）', align: 'right', width: 120, slots: { default: 'taxPrice_default' }},
        { field: 'orderNum', title: '销售数量', align: 'right', width: 100, slots: { default: 'orderNum_default' }},
        { field: 'orderAmount', title: '含税金额', align: 'right', width: 120, slots: { default: 'orderAmount_default' }},
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
    initFormData() {
      this.formData = {
        sc: {},
        customer: {},
        saler: {},
        totalNum: 0,
        giftNum: 0,
        totalAmount: 0,
        description: ''
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
        oriPrice: '',
        taxPrice: '',
        discountRate: 100,
        stockNum: '',
        taxRate: '',
        isGift: false,
        orderNum: '',
        orderAmount: '',
        saleProp1: '',
        saleProp2: '',
        description: ''
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
    queryProduct(queryString, cb) {
      if (this.$utils.isEmpty(queryString)) {
        return cb([])
      }

      this.$api.sc.sale.saleOrder.searchProduct(this.formData.sc.id, queryString).then(res => {
        cb(res)
      })
    },
    // 选择商品
    handleSelectProduct(index, value) {
      value.oriPrice = value.salePrice
      value.taxPrice = value.oriPrice
      if (value.oriPrice === 0) {
        value.discountRate = 100
      }
      this.tableData[index] = Object.assign(this.tableData[index], value)

      this.taxPriceInput(this.tableData[index], this.tableData[index].taxPrice)
    },
    // 删除商品
    delProduct() {
      const records = this.$refs.grid.getCheckboxRecords()
      if (this.$utils.isEmpty(records)) {
        this.$msg.error('请选择要删除的商品数据！')
        return
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
    // 批量添加商品
    openBatchAddProductDialog() {
      if (this.$utils.isEmpty(this.formData.sc.id)) {
        this.$msg.error('请先选择仓库！')
        return
      }
      this.$refs.batchAddProductDialog.openDialog()
    },
    taxPriceInput(row, value) {
      if (row.oriPrice !== 0) {
        if (this.$utils.isFloatGeZero(row.taxPrice)) {
          row.discountRate = this.$utils.mul(this.$utils.div(row.taxPrice, row.oriPrice), 100).toFixed(2)
        }
      }

      this.calcSum()
    },
    changeDiscountRate(row, value) {
      if (this.$utils.isFloatGeZero(row.discountRate) && this.$utils.isFloatGtZero(row.oriPrice)) {
        row.taxPrice = this.$utils.div(this.$utils.mul(row.oriPrice, row.discountRate), 100).toFixed(2)
      }

      this.calcSum()
    },
    orderNumInput(value) {
      this.calcSum()
    },
    // 计算汇总数据
    calcSum() {
      let totalNum = 0
      let giftNum = 0
      let totalAmount = 0

      this.tableData.filter(t => {
        return this.$utils.isFloatGeZero(t.taxPrice) && this.$utils.isIntegerGeZero(t.orderNum)
      }).forEach(t => {
        const num = parseInt(t.orderNum)
        if (t.isGift) {
          giftNum = this.$utils.add(num, giftNum)
        } else {
          totalNum = this.$utils.add(num, totalNum)
        }

        totalAmount = this.$utils.add(totalAmount, this.$utils.mul(num, t.taxPrice))
      })

      this.formData.totalNum = totalNum
      this.formData.giftNum = giftNum
      this.formData.totalAmount = totalAmount
    },
    // 批量录入数量
    batchInputOrderNum() {
      const records = this.$refs.grid.getCheckboxRecords()
      if (this.$utils.isEmpty(records)) {
        this.$msg.error('请选择商品数据！')
        return
      }

      this.$msg.prompt('请输入销售数量', {
        inputPattern: this.$utils.PATTERN_IS_INTEGER_GT_ZERO,
        inputErrorMessage: '销售数量必须为整数并且大于0',
        title: '批量录入数量'
      }).then(({ value }) => {
        records.forEach(t => {
          t.orderNum = value

          this.orderNumInput(value)
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
          this.$msg.error('第' + (i + 1) + '行商品为赠品，不允许录入采购价！')
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
        item.discountRate = 0
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

        if (this.$utils.isEmpty(product.orderNum)) {
          this.$msg.error('第' + (i + 1) + '行商品销售数量不允许为空！')
          return false
        }

        if (!this.$utils.isInteger(product.orderNum)) {
          this.$msg.error('第' + (i + 1) + '行商品销售数量必须为整数！')
          return false
        }

        if (!this.$utils.isIntegerGtZero(product.orderNum)) {
          this.$msg.error('第' + (i + 1) + '行商品销售数量必须大于0！')
          return false
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
        description: this.formData.description,
        products: this.tableData.map(t => {
          return {
            productId: t.productId,
            oriPrice: t.oriPrice,
            taxPrice: t.taxPrice,
            discountRate: t.discountRate,
            orderNum: t.orderNum,
            description: t.description
          }
        })
      }

      this.loading = true
      this.$api.sc.sale.saleOrder.createOrder(params).then(res => {
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
        description: this.formData.description,
        products: this.tableData.map(t => {
          return {
            productId: t.productId,
            oriPrice: t.oriPrice,
            taxPrice: t.taxPrice,
            discountRate: t.discountRate,
            orderNum: t.orderNum,
            description: t.description
          }
        })
      }

      this.$msg.confirm('对销售单据执行审核通过操作？').then(() => {
        this.loading = true
        this.$api.sc.sale.saleOrder.directApprovePassOrder(params).then(res => {
          this.$msg.success('审核通过！')

          this.$emit('confirm')
          this.closeDialog()
        }).finally(() => {
          this.loading = false
        })
      })
    }
  }
}
</script>
<style>
</style>
