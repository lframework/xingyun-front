<template>
  <div v-if="visible" class="app-container">
    <div v-permission="['purchase:receive:add']" v-loading="loading">
      <j-border>
        <j-form>
          <j-form-item label="仓库" required>
            <store-center-selector
              v-model="formData.sc"
              :before-open="beforeSelectSc"
            />
          </j-form-item>
          <j-form-item label="供应商" required>
            <supplier-selector
              v-model="formData.supplier"
              :before-open="beforeSelectSupplier"
            />
          </j-form-item>
          <j-form-item label="采购员">
            <user-selector
              v-model="formData.purchaser"
              :before-open="beforeSelectPurchaser"
            />
          </j-form-item>
          <j-form-item label="付款日期" required>
            <a-date-picker
              v-model="formData.paymentDate"
              placeholder=""
              value-format="YYYY-MM-DD"
              :disabled="!formData.allowModifyPaymentDate"
              :disabled-date="(current) => {
                return current && current < moment().endOf('day');
              }"
            />
          </j-form-item>
          <j-form-item label="实际到货日期" required>
            <a-date-picker
              v-model="formData.receiveDate"
              placeholder=""
              value-format="YYYY-MM-DD"
            />
          </j-form-item>
          <j-form-item label="采购订单" required>
            <purchase-order-selector
              v-model="formData.purchaseOrder"
              @input="purchaseOrderChange"
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
            <a-button icon="number" @click="batchInputReceiveNum">批量录入数量</a-button>
            <a-tooltip title="将收货数量设置为剩余收货数量">
              <a-button icon="edit" @click="quickSettingReceiveNum">快捷设置数量</a-button>
            </a-tooltip>
          </a-space>
        </template>

        <!-- 商品名称 列自定义内容 -->
        <template v-slot:productName_default="{ row, rowIndex }">
          <a-auto-complete
            v-if="!row.isFixed"
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
          <span v-else>{{ row.productName }}</span>
        </template>

        <!-- 采购价 列自定义内容 -->
        <template v-slot:purchasePrice_default="{ row }">
          <span>{{ row.purchasePrice }}</span>
        </template>

        <!-- 剩余收货数量 列自定义内容 -->
        <template v-slot:remainNum_default="{ row }">
          <span v-if="$utils.isEmpty(row.remainNum)">-</span>
          <span v-else-if="$utils.isIntegerGeZero(row.receiveNum)">{{ Math.max(0, $utils.sub(row.remainNum, row.receiveNum)) }}</span>
          <span v-else>{{ row.remainNum }}</span>
        </template>

        <!-- 收货数量 列自定义内容 -->
        <template v-slot:receiveNum_default="{ row }">
          <a-input v-model="row.receiveNum" class="number-input" @input="e => receiveNumInput(e.target.value)" />
        </template>

        <!-- 含税金额 列自定义内容 -->
        <template v-slot:taxAmount_default="{ row }">
          <span v-if="$utils.isFloatGeZero(row.purchasePrice) && $utils.isIntegerGeZero(row.receiveNum)">{{ $utils.mul(row.purchasePrice, row.receiveNum) }}</span>
        </template>

        <!-- 备注 列自定义内容 -->
        <template v-slot:description_default="{ row }">
          <a-input v-model="row.description" />
        </template>
      </vxe-grid>

      <j-border title="合计">
        <j-form label-width="140px">
          <j-form-item label="收货数量" :span="6">
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
          <a-button v-permission="['purchase:receive:add']" type="primary" :loading="loading" @click="createOrder">保存</a-button>
          <a-button v-permission="['purchase:receive:approve']" type="primary" :loading="loading" @click="directApprovePassOrder">审核通过</a-button>
          <a-button :loading="loading" @click="closeDialog">关闭</a-button>
        </a-space>
      </div>
    </div>
  </div>
</template>
<script>
import StoreCenterSelector from '@/components/Selector/StoreCenterSelector'
import SupplierSelector from '@/components/Selector/SupplierSelector'
import UserSelector from '@/components/Selector/UserSelector'
import PurchaseOrderSelector from './PurchaseOrderSelector'
import BatchAddProduct from '@/views/sc/purchase/batch-add-product'
import Moment from 'moment'
export default {
  name: 'AddPurchaseReceiveRequire',
  components: {
    StoreCenterSelector, SupplierSelector, UserSelector, PurchaseOrderSelector, BatchAddProduct
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
        { field: 'isGift', title: '是否赠品', width: 80, formatter: ({ cellValue }) => { return cellValue ? '是' : '否' } },
        { field: 'taxCostPrice', title: '含税成本价（元）', align: 'right', width: 140 },
        { field: 'stockNum', title: '库存数量', align: 'right', width: 100 },
        { field: 'purchasePrice', title: '采购价（元）', align: 'right', width: 120, slots: { default: 'purchasePrice_default' }},
        { field: 'orderNum', title: '采购数量', align: 'right', width: 100, formatter: ({ cellValue }) => { return this.$utils.isEmpty(cellValue) ? '-' : cellValue } },
        { field: 'remainNum', title: '剩余收货数量', align: 'right', width: 120, slots: { default: 'remainNum_default' }},
        { field: 'receiveNum', title: '收货数量', align: 'right', width: 100, slots: { default: 'receiveNum_default' }},
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
    moment() {
      return Moment
    }
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
        supplier: {},
        purchaseOrder: {},
        purchaser: {},
        paymentDate: this.$utils.formatDate(Moment().add(1, 'M')),
        receiveDate: this.$utils.formatDate(Moment()),
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
        purchasePrice: 0,
        taxCostPrice: '',
        stockNum: '',
        orderNum: '',
        remainNum: '',
        receiveNum: '',
        taxRate: '',
        isGift: true,
        taxAmount: '',
        salePropItemName1: '',
        salePropItemName2: '',
        description: '',
        isFixed: false,
        products: []
      }
    },
    // 新增商品
    addProduct() {
      if (this.$utils.isEmpty(this.formData.purchaseOrder)) {
        this.$msg.error('请先选择采购订单！')
        return
      }
      this.tableData.push(this.emptyProduct())
    },
    // 搜索商品
    queryProduct(queryString, row) {
      if (this.$utils.isEmpty(queryString)) {
        row.products = []
        return
      }

      this.$api.sc.purchase.purchaseOrder.searchProduct(this.formData.sc.id, queryString).then(res => {
        row.products = res
      })
    },
    // 选择商品
    handleSelectProduct(index, value, row) {
      this.tableData[index] = Object.assign(this.tableData[index], row ? row.products.filter(item => item.productId === value)[0] : value, {
        isGift: true,
        purchasePrice: 0
      })

      this.purchasePriceInput(this.tableData[index], this.tableData[index].purchasePrice)
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
          this.$msg.error('第' + (i + 1) + '行商品是采购订单中的商品，不允许删除！')
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
      if (this.$utils.isEmpty(this.formData.purchaseOrder)) {
        this.$msg.error('请先选择采购订单！')
        return
      }
      this.$refs.batchAddProductDialog.openDialog()
    },
    purchasePriceInput(row, value) {
      this.calcSum()
    },
    receiveNumInput(value) {
      this.calcSum()
    },
    // 计算汇总数据
    calcSum() {
      let totalNum = 0
      let giftNum = 0
      let totalAmount = 0

      this.tableData.filter(t => {
        return this.$utils.isFloatGeZero(t.purchasePrice) && this.$utils.isIntegerGeZero(t.receiveNum)
      }).forEach(t => {
        const num = parseInt(t.receiveNum)
        if (t.isGift) {
          giftNum = this.$utils.add(giftNum, num)
        } else {
          totalNum = this.$utils.add(totalNum, num)
        }

        totalAmount = this.$utils.add(totalAmount, this.$utils.mul(num, t.purchasePrice))
      })

      this.formData.totalNum = totalNum
      this.formData.giftNum = giftNum
      this.formData.totalAmount = totalAmount
    },
    // 批量录入数量
    batchInputReceiveNum() {
      const records = this.$refs.grid.getCheckboxRecords()
      if (this.$utils.isEmpty(records)) {
        this.$msg.error('请选择商品数据！')
        return
      }

      this.$msg.prompt('请输入收货数量', {
        inputPattern: this.$utils.PATTERN_IS_INTEGER_GE_ZERO,
        inputErrorMessage: '收货数量必须为整数并且不小于0',
        title: '批量录入数量'
      }).then(({ value }) => {
        records.forEach(t => {
          t.receiveNum = value

          this.receiveNumInput(value)
        })
      })
    },
    // 快捷设置数量
    quickSettingReceiveNum() {
      const records = this.$refs.grid.getCheckboxRecords()
      if (this.$utils.isEmpty(records)) {
        this.$msg.error('请选择商品数据！')
        return
      }

      for (let i = 0; i < records.length; i++) {
        const record = records[i]
        if (record.isFixed) {
          record.receiveNum = record.remainNum
        }
      }

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

      if (this.$utils.isEmpty(this.formData.supplier.id)) {
        this.$msg.error('供应商不允许为空！')
        return false
      }

      if (this.formData.allowModifyPaymentDate) {
        if (this.$utils.isEmpty(this.formData.paymentDate)) {
          this.$msg.error('付款日期不允许为空！')
          return false
        }
      }

      if (this.$utils.isEmpty(this.formData.receiveDate)) {
        this.$msg.error('实际到货日期不允许为空！')
        return false
      }

      if (this.$utils.isEmpty(this.formData.purchaseOrder.id)) {
        this.$msg.error('采购订单不允许为空！')
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

        if (this.$utils.isEmpty(product.purchasePrice)) {
          this.$msg.error('第' + (i + 1) + '行商品采购价不允许为空！')
          return false
        }

        if (!this.$utils.isFloat(product.purchasePrice)) {
          this.$msg.error('第' + (i + 1) + '行商品采购价必须为数字！')
          return false
        }

        if (product.isGift) {
          if (parseFloat(product.purchasePrice) !== 0) {
            this.$msg.error('第' + (i + 1) + '行商品采购价必须等于0！')
            return false
          }
        } else {
          if (!this.$utils.isFloatGtZero(product.purchasePrice)) {
            this.$msg.error('第' + (i + 1) + '行商品采购价必须大于0！')
            return false
          }
        }

        if (!this.$utils.isNumberPrecision(product.purchasePrice, 2)) {
          this.$msg.error('第' + (i + 1) + '行商品采购价最多允许2位小数！')
          return false
        }

        if (!this.$utils.isEmpty(product.receiveNum)) {
          if (!this.$utils.isInteger(product.receiveNum)) {
            this.$msg.error('第' + (i + 1) + '行商品收货数量必须为整数！')
            return false
          }

          if (product.isFixed) {
            if (!this.$utils.isIntegerGeZero(product.receiveNum)) {
              this.$msg.error('第' + (i + 1) + '行商品收货数量不允许小于0！')
              return false
            }
          } else {
            if (!this.$utils.isIntegerGtZero(product.receiveNum)) {
              this.$msg.error('第' + (i + 1) + '行商品收货数量必须大于0！')
              return false
            }
          }

          if (product.isFixed) {
            if (product.receiveNum > product.remainNum) {
              this.$msg.error('第' + (i + 1) + '行商品累计收货数量为' + (product.orderNum - product.remainNum) + '，剩余收货数量为' + product.remainNum + '，本次收货数量不允许大于' + product.remainNum + '！')
              return false
            }
          }
        } else {
          if (!product.isFixed) {
            this.$msg.error('第' + (i + 1) + '行商品收货数量不允许为空！')
            return false
          }
        }
      }

      if (this.tableData.filter(item => item.isFixed && this.$utils.isIntegerGtZero(item.receiveNum)).length === 0) {
        this.$msg.error('采购订单中的商品必须全部或部分收货！')
        return false
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
        supplierId: this.formData.supplier.id,
        purchaserId: this.formData.purchaser.id || '',
        paymentDate: this.formData.paymentDate || '',
        receiveDate: this.formData.receiveDate,
        purchaseOrderId: this.formData.purchaseOrder.id,
        description: this.formData.description,
        required: true,
        products: this.tableData.filter(t => this.$utils.isIntegerGtZero(t.receiveNum)).map(t => {
          const product = {
            productId: t.productId,
            receiveNum: t.receiveNum,
            description: t.description
          }

          if (t.isFixed) {
            product.purchaseOrderDetailId = t.id
          }

          return product
        })
      }

      this.loading = true
      this.$api.sc.purchase.receiveSheet.createOrder(params).then(res => {
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
        supplierId: this.formData.supplier.id,
        purchaserId: this.formData.purchaser.id,
        paymentDate: this.formData.paymentDate || '',
        receiveDate: this.formData.receiveDate,
        purchaseOrderId: this.formData.purchaseOrder.id,
        description: this.formData.description,
        products: this.tableData.filter(t => this.$utils.isIntegerGtZero(t.receiveNum)).map(t => {
          const product = {
            productId: t.productId,
            receiveNum: t.receiveNum,
            description: t.description
          }

          if (t.isFixed) {
            product.purchaseOrderDetailId = t.id
          }

          return product
        })
      }

      this.$msg.confirm('对采购收货单执行审核通过操作？').then(() => {
        this.loading = true
        this.$api.sc.purchase.receiveSheet.directApprovePassOrder(params).then(res => {
          this.$msg.success('审核通过！')

          this.$emit('confirm')
          this.closeDialog()
        }).finally(() => {
          this.loading = false
        })
      })
    },
    // 选择采购订单
    purchaseOrderChange(e) {
      // 只要选择了采购订单，清空所有商品，然后将采购订单中所有的明细列出来
      if (!this.$utils.isEmpty(e)) {
        this.loading = true
        this.$api.sc.purchase.purchaseOrder.getWithReceive(e.id).then(res => {
          const tableData = this.tableData.filter(item => !item.isFixed)
          let purchaseDetails = res.details || []
          purchaseDetails = purchaseDetails.map(item => {
            item.isFixed = true

            return Object.assign(this.emptyProduct(), item)
          })

          this.tableData = [...purchaseDetails, ...tableData]

          this.formData.sc = {
            id: res.scId,
            name: res.scName
          }

          this.formData.supplier = {
            id: res.supplierId,
            name: res.supplierName
          }

          if (!this.$utils.isEmpty(res.purchaserId)) {
            this.formData.purchaser = {
              id: res.purchaserId,
              name: res.purchaserName
            }
          }

          this.supplierChange(this.formData.supplier.id)
        }).finally(() => {
          this.loading = false
        })
      }
    },
    beforeSelectSc() {
      if (!this.beforeSelectComponents()) {
        return false
      }

      this.$msg.error('由于“采购收货单关联采购订单”，不允许修改仓库！')
      return false
    },
    beforeSelectSupplier() {
      if (!this.beforeSelectComponents()) {
        return false
      }

      this.$msg.error('由于“采购收货单关联采购订单”，不允许修改供应商！')
      return false
    },
    beforeSelectPurchaser() {
      return this.beforeSelectComponents()
    },
    beforeSelectComponents() {
      if (this.$utils.isEmpty(this.formData.purchaseOrder.id)) {
        this.$msg.error('请先选择采购订单！')
        return false
      }

      return true
    },
    // 供应商改变时触发
    supplierChange(supplierId) {
      this.$api.sc.purchase.receiveSheet.getPaymentDate(supplierId).then(res => {
        this.formData.paymentDate = res.paymentDate || ''
        this.formData.allowModifyPaymentDate = res.allowModify
      })
    }
  }
}
</script>
<style>
</style>
