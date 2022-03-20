<template>
  <div v-permission="['stock:product-log:query']" class="app-container">

    <!-- 数据列表 -->
    <vxe-grid
      ref="grid"
      resizable
      show-overflow
      highlight-hover-row
      keep-source
      row-id="id"
      :proxy-config="proxyConfig"
      :columns="tableColumn"
      :toolbar-config="toolbarConfig"
      :pager-config="{}"
      :loading="loading"
      :height="$defaultTableHeight"
    >
      <template v-slot:form>
        <j-border>
          <j-form label-width="100px" @collapse="$refs.grid.refreshColumn()">
            <j-form-item label="仓库">
              <store-center-selector v-model="searchFormData.sc" />
            </j-form-item>
            <j-form-item label="供应商">
              <supplier-selector v-model="searchFormData.supplier" />
            </j-form-item>
            <j-form-item label="批次号">
              <a-input v-model="searchFormData.lotCode" allow-clear />
            </j-form-item>
            <j-form-item label="商品编号">
              <a-input v-model="searchFormData.productCode" allow-clear />
            </j-form-item>
            <j-form-item label="商品名称">
              <a-input v-model="searchFormData.productName" allow-clear />
            </j-form-item>
            <j-form-item label="商品类目">
              <product-category-selector v-model="searchFormData.category" :only-final="false" />
            </j-form-item>
            <j-form-item label="商品品牌">
              <product-brand-selector v-model="searchFormData.brand" />
            </j-form-item>
            <j-form-item label="操作日期" :content-nest="false">
              <div class="date-range-container">
                <a-date-picker
                  v-model="searchFormData.createStartTime"
                  placeholder=""
                  value-format="YYYY-MM-DD 00:00:00"
                />
                <span class="date-split">至</span>
                <a-date-picker
                  v-model="searchFormData.createEndTime"
                  placeholder=""
                  value-format="YYYY-MM-DD 23:59:59"
                />
              </div>
            </j-form-item>
            <j-form-item label="业务类型">
              <a-select v-model="searchFormData.bizType" placeholder="全部" allow-clear>
                <a-select-option v-for="item in $enums.PRODUCT_STOCK_BIZ_TYPE.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
              </a-select>
            </j-form-item>
          </j-form>
        </j-border>
      </template>

      <!-- 单据号 列自定义内容 -->
      <template v-slot:bizCode_default="{ row }">
        <div v-if="$enums.PRODUCT_STOCK_BIZ_TYPE.PURCHASE.equalsCode(row.bizType)">
          <a v-permission="['purchase:receive:query']" @click="e => {currentRow = row;$nextTick(() => $refs.viewPurchaseRecevieSheetDetailDialog.openDialog())}">{{ row.bizCode }}</a>
          <span v-no-permission="['purchase:receive:query']">{{ row.bizCode }}</span>
        </div>
        <div v-else-if="$enums.PRODUCT_STOCK_BIZ_TYPE.PURCHASE_RETURN.equalsCode(row.bizType)">
          <a v-permission="['purchase:return:query']" @click="e => {currentRow = row;$nextTick(() => $refs.viewPurchaseReturnDetailDialog.openDialog())}">{{ row.bizCode }}</a>
          <span v-no-permission="['purchase:return:query']">{{ row.bizCode }}</span>
        </div>
        <div v-else-if="$enums.PRODUCT_STOCK_BIZ_TYPE.SALE.equalsCode(row.bizType)">
          <a v-permission="['sale:out:query']" @click="e => {currentRow = row;$nextTick(() => $refs.viewSaleOutSheetDetailDialog.openDialog())}">{{ row.bizCode }}</a>
          <span v-no-permission="['sale:out:query']">{{ row.bizCode }}</span>
        </div>
        <div v-else-if="$enums.PRODUCT_STOCK_BIZ_TYPE.SALE_RETURN.equalsCode(row.bizType)">
          <a v-permission="['sale:return:query']" @click="e => {currentRow = row;$nextTick(() => $refs.viewSaleReturnDetailDialog.openDialog())}">{{ row.bizCode }}</a>
          <span v-no-permission="['sale:return:query']">{{ row.bizCode }}</span>
        </div>
        <div v-else-if="$enums.PRODUCT_STOCK_BIZ_TYPE.RETAIL.equalsCode(row.bizType)">
          <a v-permission="['retail:out:query']" @click="e => {currentRow = row;$nextTick(() => $refs.viewRetailOutSheetDetailDialog.openDialog())}">{{ row.bizCode }}</a>
          <span v-no-permission="['retail:out:query']">{{ row.bizCode }}</span>
        </div>
        <div v-else-if="$enums.PRODUCT_STOCK_BIZ_TYPE.RETAIL_RETURN.equalsCode(row.bizType)">
          <a v-permission="['retail:return:query']" @click="e => {currentRow = row;$nextTick(() => $refs.viewRetailReturnDetailDialog.openDialog())}">{{ row.bizCode }}</a>
          <span v-no-permission="['retail:return:query']">{{ row.bizCode }}</span>
        </div>
        <div v-else-if="$enums.PRODUCT_STOCK_BIZ_TYPE.TAKE_STOCK_IN.equalsCode(row.bizType)">
          <a v-permission="['stock:take:plan:query']" @click="e => {currentRow = row;$nextTick(() => $refs.viewTakeStockPlanDetailDialog.openDialog())}">{{ row.bizCode }}</a>
          <span v-no-permission="['stock:take:plan:query']">{{ row.bizCode }}</span>
        </div>
        <div v-else-if="$enums.PRODUCT_STOCK_BIZ_TYPE.TAKE_STOCK_OUT.equalsCode(row.bizType)">
          <a v-permission="['stock:take:plan:query']" @click="e => {currentRow = row;$nextTick(() => $refs.viewTakeStockPlanDetailDialog.openDialog())}">{{ row.bizCode }}</a>
          <span v-no-permission="['stock:take:plan:query']">{{ row.bizCode }}</span>
        </div>
        <div v-else-if="$enums.PRODUCT_STOCK_BIZ_TYPE.STOCK_COST_ADJUST.equalsCode(row.bizType)">
          <a v-permission="['stock:adjust:cost:query']" @click="e => {currentRow = row;$nextTick(() => $refs.viewStockCostAdjustDetailDialog.openDialog())}">{{ row.bizCode }}</a>
          <span v-no-permission="['stock:adjust:cost:query']">{{ row.bizCode }}</span>
        </div>
        <span v-else>{{ row.bizCode }}</span>
      </template>

      <!-- 工具栏 -->
      <template v-slot:toolbar_buttons>
        <a-space>
          <a-button type="primary" icon="search" @click="search">查询</a-button>
          <a-button v-permission="['stock:product-log:export']" type="primary" icon="download" @click="exportList">导出</a-button>
        </a-space>
      </template>
    </vxe-grid>
    <purchase-receive-sheet-detail :id="currentRow.bizId" ref="viewPurchaseRecevieSheetDetailDialog" />
    <purchase-return-detail :id="currentRow.bizId" ref="viewPurchaseReturnDetailDialog" />
    <sale-out-sheet-detail :id="currentRow.bizId" ref="viewSaleOutSheetDetailDialog" />
    <sale-return-detail :id="currentRow.bizId" ref="viewSaleReturnDetailDialog" />
    <retail-out-sheet-detail :id="currentRow.bizId" ref="viewRetailOutSheetDetailDialog" />
    <retail-return-detail :id="currentRow.bizId" ref="viewRetailReturnDetailDialog" />
    <take-stock-plan-detail :id="currentRow.bizId" ref="viewTakeStockPlanDetailDialog" />
    <stock-cost-adjust-detail :id="currentRow.bizId" ref="viewStockCostAdjustDetailDialog" />
  </div>
</template>

<script>
import StoreCenterSelector from '@/components/Selector/StoreCenterSelector'
import ProductCategorySelector from '@/components/Selector/ProductCategorySelector'
import ProductBrandSelector from '@/components/Selector/ProductBrandSelector'
import SupplierSelector from '@/components/Selector/SupplierSelector'
import Moment from 'moment'
import PurchaseReceiveSheetDetail from '@/views/sc/purchase/receive/detail'
import PurchaseReturnDetail from '@/views/sc/purchase/return/detail'
import SaleOutSheetDetail from '@/views/sc/sale/out/detail'
import SaleReturnDetail from '@/views/sc/sale/return/detail'
import RetailOutSheetDetail from '@/views/sc/retail/out/detail'
import RetailReturnDetail from '@/views/sc/retail/return/detail'
import TakeStockPlanDetail from '@/views/sc/stock/take/plan/detail'
import StockCostAdjustDetail from '@/views/sc/stock/adjust/cost/detail'

export default {
  name: 'ProductStock',
  components: {
    StoreCenterSelector, ProductCategorySelector, ProductBrandSelector, SupplierSelector, PurchaseReceiveSheetDetail,
    PurchaseReturnDetail, SaleOutSheetDetail, SaleReturnDetail, RetailOutSheetDetail, RetailReturnDetail, TakeStockPlanDetail,
    StockCostAdjustDetail
  },
  data() {
    return {
      loading: false,
      // 当前行数据
      currentRow: '',
      // 查询列表的查询条件
      searchFormData: {
        sc: {},
        supplier: {},
        productCode: '',
        productName: '',
        category: {},
        brand: {},
        lotCode: '',
        createStartTime: this.$utils.formatDateTime(this.$utils.getDateTimeWithMinTime(Moment().subtract(1, 'M'))),
        createEndTime: this.$utils.formatDateTime(this.$utils.getDateTimeWithMaxTime(Moment())),
        bizType: undefined
      },
      // 分页配置
      pagerConfig: {
        // 默认每页条数
        pageSize: 20,
        // 可选每页条数
        pageSizes: [5, 15, 20, 50, 100, 200, 500, 1000]
      },
      // 工具栏配置
      toolbarConfig: {
        // 自定义左侧工具栏
        slots: {
          buttons: 'toolbar_buttons'
        }
      },
      // 列表数据配置
      tableColumn: [
        { field: 'scCode', title: '仓库编号', width: 100 },
        { field: 'scName', title: '仓库名称', minWidth: 160 },
        { field: 'supplierCode', title: '供应商编号', width: 100 },
        { field: 'supplierName', title: '供应商名称', minWidth: 160 },
        { field: 'lotCode', title: '批次号', width: 180 },
        { field: 'productCode', title: '商品编号', width: 120 },
        { field: 'productName', title: '商品名称', minWidth: 180 },
        { field: 'categoryName', title: '商品类目', width: 120 },
        { field: 'brandName', title: '商品品牌', width: 120 },
        { field: 'salePropItem1', title: '销售属性1', width: 120 },
        { field: 'salePropItem2', title: '销售属性2', width: 120 },
        { field: 'oriStockNum', title: '变动前库存数量', align: 'right', width: 140 },
        { field: 'curStockNum', title: '变动后库存数量', align: 'right', width: 140 },
        { field: 'stockNum', title: '变动库存数量', align: 'right', width: 140 },
        { field: 'oriTaxPrice', title: '变动前含税成本价', align: 'right', width: 140 },
        { field: 'curTaxPrice', title: '变动后含税成本价', align: 'right', width: 140 },
        { field: 'oriUnTaxPrice', title: '变动前无税成本价', align: 'right', width: 140 },
        { field: 'curUnTaxPrice', title: '变动后无税成本价', align: 'right', width: 140 },
        { field: 'taxAmount', title: '变动含税金额', align: 'right', width: 140 },
        { field: 'unTaxAmount', title: '变动无税金额', align: 'right', width: 140 },
        { field: 'createTime', title: '操作时间', minWidth: 170 },
        { field: 'createBy', title: '操作人', minWidth: 100 },
        { field: 'bizCode', title: '单据号', width: 180, slots: { default: 'bizCode_default' }},
        { field: 'bizType', title: '业务类型', width: 100, formatter: ({ cellValue }) => { return this.$enums.PRODUCT_STOCK_BIZ_TYPE.getDesc(cellValue) } }
      ],
      // 请求接口配置
      proxyConfig: {
        props: {
          // 响应结果列表字段
          result: 'datas',
          // 响应结果总条数字段
          total: 'totalCount'
        },
        ajax: {
          // 查询接口
          query: ({ page, sorts, filters }) => {
            return this.$api.sc.stock.productStockLog.query(this.buildQueryParams(page))
          }
        }
      }
    }
  },
  created() {
  },
  methods: {
    // 列表发生查询时的事件
    search() {
      this.$refs.grid.commitProxy('reload')
    },
    // 查询前构建查询参数结构
    buildQueryParams(page) {
      return Object.assign({
        pageIndex: page.currentPage,
        pageSize: page.pageSize
      }, this.buildSearchFormData())
    },
    // 查询前构建具体的查询参数
    buildSearchFormData() {
      const params = Object.assign({}, this.searchFormData, {
        scId: this.searchFormData.sc.id,
        categoryId: this.searchFormData.category.id,
        brandId: this.searchFormData.brand.id,
        supplierId: this.searchFormData.supplier.id
      })

      delete params.sc
      delete params.category
      delete params.brand
      delete params.supplier

      return params
    },
    exportList() {
      this.loading = true
      this.$api.sc.stock.productStockLog.exportList(this.buildQueryParams({})).then(() => {
        this.$msg.successTip('导出成功！')
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style scoped>
</style>
