<template>
  <div v-if="visible" class="app-container">
    <div v-permission="['sale:return:modify']" v-loading="loading">
      <j-border>
        <j-form>
          <j-form-item label="仓库" required>
            <store-center-selector
              v-model="formData.sc"
              :disabled="true"
            />
          </j-form-item>
          <j-form-item label="客户" required>
            <customer-selector
              v-model="formData.customer"
              :disabled="true"
            />
          </j-form-item>
          <j-form-item label="销售员">
            <user-selector
              v-model="formData.saler"
            />
          </j-form-item>
          <j-form-item label="付款日期" required>
            <el-date-picker
              v-model="formData.paymentDate"
              value-format="yyyy-MM-dd"
              type="date"
              :disabled="!formData.allowModifyPaymentDate"
              :picker-options="{
                disabledDate(time) {
                  return time.getTime() < $utils.getCurrentDate().valueOf();
                }
              }"
            />
          </j-form-item>
          <j-form-item label="销售出库单" required>
            <sale-out-sheet-selector
              v-model="formData.outSheet"
              :disabled="true"
            />
          </j-form-item>
          <j-form-item />
          <j-form-item label="审核状态">
            <span v-if="$enums.SALE_RETURN_STATUS.APPROVE_PASS.equalsCode(formData.status)" style="color: #67C23A;">{{ $enums.SALE_RETURN_STATUS.getDesc(formData.status) }}</span>
            <span v-else-if="$enums.SALE_RETURN_STATUS.APPROVE_REFUSE.equalsCode(formData.status)" style="color: #F56C6C;">{{ $enums.SALE_RETURN_STATUS.getDesc(formData.status) }}</span>
            <span v-else style="color: #303133;">{{ $enums.SALE_RETURN_STATUS.getDesc(formData.status) }}</span>
          </j-form-item>
          <j-form-item :span="16" :content-nest="false" label="拒绝理由">
            <el-input v-if="$enums.SALE_RETURN_STATUS.APPROVE_REFUSE.equalsCode(formData.status)" v-model="formData.refuseReason" readonly />
          </j-form-item>
          <j-form-item label="操作人">
            <span>{{ formData.createBy }}</span>
          </j-form-item>
          <j-form-item label="操作时间" :span="16">
            <span>{{ formData.createTime }}</span>
          </j-form-item>
          <j-form-item v-if="$enums.SALE_RETURN_STATUS.APPROVE_PASS.equalsCode(formData.status) || $enums.SALE_RETURN_STATUS.APPROVE_REFUSE.equalsCode(formData.status)" label="审核人">
            <span>{{ formData.approveBy }}</span>
          </j-form-item>
          <j-form-item v-if="$enums.SALE_RETURN_STATUS.APPROVE_PASS.equalsCode(formData.status) || $enums.SALE_RETURN_STATUS.APPROVE_REFUSE.equalsCode(formData.status)" label="审核时间" :span="16">
            <span>{{ formData.approveTime }}</span>
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
              <el-button @click="batchInputReturnNum">批量录入数量</el-button>
            </el-form-item>
          </el-form>
        </template>

        <!-- 商品名称 列自定义内容 -->
        <template v-slot:productName_default="{ row, rowIndex }">
          <el-autocomplete
            v-if="!row.isFixed"
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
          <span v-else>{{ row.productName }}</span>
        </template>

        <!-- 剩余退货数量 列自定义内容 -->
        <template v-slot:remainNum_default="{ row }">
          <span v-if="$utils.isEmpty(row.remainNum)">-</span>
          <span v-else-if="$utils.isIntegerGeZero(row.returnNum)">{{ Math.max(0, $utils.sub(row.remainNum, row.returnNum)) }}</span>
          <span v-else>{{ row.remainNum }}</span>
        </template>

        <!-- 退货数量 列自定义内容 -->
        <template v-slot:returnNum_default="{ row }">
          <el-input v-model="row.returnNum" class="number-input" @input="returnNumInput" />
        </template>

        <!-- 供应商 列自定义内容 -->
        <template v-slot:supplier_default="{ row }">
          <span v-if="row.isFixed">{{ row.supplier.name }}</span>
          <supplier-selector v-else v-model="row.supplier" />
        </template>

        <!-- 含税金额 列自定义内容 -->
        <template v-slot:taxAmount_default="{ row }">
          <span v-if="$utils.isFloatGeZero(row.taxPrice) && $utils.isIntegerGeZero(row.returnNum)">{{ $utils.mul(row.taxPrice, row.returnNum) }}</span>
        </template>

        <!-- 备注 列自定义内容 -->
        <template v-slot:description_default="{ row }">
          <el-input v-model="row.description" />
        </template>
      </vxe-grid>

      <j-border title="合计">
        <j-form label-width="140px">
          <j-form-item label="退货数量" :span="6">
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
        <el-button v-permission="['sale:return:modify']" type="primary" :loading="loading" @click="updateOrder">保存</el-button>
        <el-button :loading="loading" @click="closeDialog">关闭</el-button>
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
export default {
  name: 'ModifySaleReturnRequire',
  components: {
    StoreCenterSelector, CustomerSelector, UserSelector, SupplierSelector, SaleOutSheetSelector, BatchAddProduct
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
        { field: 'discountRate', title: '折扣（%）', align: 'right', width: 120 },
        { field: 'taxPrice', title: '价格（元）', align: 'right', width: 120 },
        { field: 'outNum', title: '出库数量', align: 'right', width: 100, formatter: ({ cellValue }) => { return this.$utils.isEmpty(cellValue) ? '-' : cellValue } },
        { field: 'remainNum', title: '剩余退货数量', align: 'right', width: 120, slots: { default: 'remainNum_default' }},
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
      this.loadData()
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
        outSheet: {},
        saler: {},
        paymentDate: '',
        totalNum: 0,
        giftNum: 0,
        totalAmount: 0,
        description: '',
        // 是否允许修改付款日期
        allowModifyPaymentDate: false
      }

      this.tableData = []
    },
    // 加载数据
    loadData() {
      this.loading = true
      this.$api.sc.sale.saleReturn.get(this.id).then(res => {
        if (!this.$enums.SALE_RETURN_STATUS.CREATED.equalsCode(res.status) && !this.$enums.SALE_RETURN_STATUS.APPROVE_REFUSE.equalsCode(res.status)) {
          this.$msg.error('销售退货单已审核通过，无法修改！')
          this.closeDialog()
          return
        }
        this.formData = {
          sc: {
            id: res.scId,
            name: res.scName
          },
          customer: {
            id: res.customerId,
            name: res.customerName
          },
          saler: {
            id: res.salerId || '',
            name: res.salerName || ''
          },
          paymentDate: res.paymentDate || '',
          outSheet: {
            id: res.outSheetId,
            code: res.outSheetCode
          },
          description: res.description,
          status: res.status,
          createBy: res.createBy,
          createTime: res.createTime,
          approveBy: res.approveBy,
          approveTime: res.approveTime,
          refuseReason: res.refuseReason,
          totalNum: 0,
          giftNum: 0,
          totalAmount: 0
        }

        const tableData = res.details || []
        tableData.forEach(item => {
          item.isFixed = !this.$utils.isEmpty(item.outSheetDetailId)
          item.supplier = {
            id: item.supplierId,
            name: item.supplierName
          }
          if (item.isFixed) {
            // 接口返回的剩余退货数量是最新的数据，应加上当前退货数量
            item.remainNum = this.$utils.add(item.remainNum, item.returnNum)
          }

          return item
        })
        this.tableData = tableData

        this.customerChange(this.formData.customer.id)

        this.calcSum()
      }).finally(() => {
        this.loading = false
      })
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
        salePrice: 0,
        taxPrice: '',
        discountRate: 100,
        outNum: '',
        remainNum: '',
        returnNum: '',
        taxRate: '',
        isGift: true,
        taxAmount: '',
        salePropItemName1: '',
        salePropItemName2: '',
        description: '',
        supplier: {},
        isFixed: false
      }
    },
    // 新增商品
    addProduct() {
      if (this.$utils.isEmpty(this.formData.outSheet)) {
        this.$msg.error('请先选择销售出库单！')
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
      this.tableData[index] = Object.assign(this.tableData[index], value, {
        isGift: true,
        taxPrice: 0
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
      if (this.$utils.isEmpty(this.formData.outSheet)) {
        this.$msg.error('请先选择销售出库单！')
        return
      }
      this.$refs.batchAddProductDialog.openDialog()
    },
    taxPriceInput(row, value) {
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
        inputPattern: this.$utils.PATTERN_IS_INTEGER_GE_ZERO,
        inputErrorMessage: '退货数量必须为整数并且不小于0',
        title: '批量录入数量'
      }).then(({ value }) => {
        records.forEach(t => {
          t.returnNum = value

          this.returnNumInput(value)
        })
      })
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

      if (this.$utils.isEmpty(this.formData.outSheet.id)) {
        this.$msg.error('销售出库单不允许为空！')
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

        if (this.$utils.isEmpty(product.supplier.id)) {
          this.$msg.error('第' + (i + 1) + '行商品所属供应商不允许为空！')
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

          if (product.isFixed) {
            if (product.returnNum > product.remainNum) {
              this.$msg.error('第' + (i + 1) + '行商品累计退货数量为' + (product.outNum - product.remainNum) + '，剩余退货数量为' + product.remainNum + '，本次退货数量不允许大于' + product.remainNum + '！')
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

      if (this.tableData.filter(item => item.isFixed && this.$utils.isIntegerGtZero(item.returnNum)).length === 0) {
        this.$msg.error('销售出库单中的商品必须全部或部分退货！')
        return false
      }

      return true
    },
    // 修改订单
    updateOrder() {
      if (!this.validData()) {
        return
      }

      const params = {
        id: this.id,
        scId: this.formData.sc.id,
        customerId: this.formData.customer.id,
        salerId: this.formData.saler.id || '',
        paymentDate: this.formData.paymentDate || '',
        outSheetId: this.formData.outSheet.id,
        description: this.formData.description,
        products: this.tableData.filter(t => this.$utils.isIntegerGtZero(t.returnNum)).map(t => {
          const product = {
            productId: t.productId,
            oriPrice: t.salePrice,
            returnNum: t.returnNum,
            description: t.description,
            supplierId: t.supplier.id
          }

          if (t.isFixed) {
            product.outSheetDetailId = t.outSheetDetailId
          }

          return product
        })
      }

      this.loading = true
      this.$api.sc.sale.saleReturn.updateOrder(params).then(res => {
        this.$msg.success('保存成功！')

        this.$emit('confirm')
        this.closeDialog()
      }).finally(() => {
        this.loading = false
      })
    },
    // 客户改变时触发
    customerChange(customerId) {
      this.$api.sc.sale.outSheet.getPaymentDate(customerId).then(res => {
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
</script>
<style>
</style>
