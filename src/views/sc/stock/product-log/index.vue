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
      :pager-config="pagerConfig"
      :loading="loading"
      :height="$defaultTableHeight"
    >
      <template v-slot:form>
        <j-border>
          <j-form label-width="80px">
            <j-form-item label="仓库">
              <store-center-selector v-model="searchFormData.sc" />
            </j-form-item>
            <j-form-item label="供应商">
              <supplier-selector v-model="searchFormData.supplier" />
            </j-form-item>
            <j-form-item label="批次号">
              <el-input v-model="searchFormData.lotCode" clearable />
            </j-form-item>
            <j-form-item label="商品编号">
              <el-input v-model="searchFormData.productCode" clearable />
            </j-form-item>
            <j-form-item label="商品名称">
              <el-input v-model="searchFormData.productName" clearable />
            </j-form-item>
            <j-form-item label="商品类目">
              <product-category-selector v-model="searchFormData.category" :only-final="false" />
            </j-form-item>
            <j-form-item label="商品品牌">
              <product-brand-selector v-model="searchFormData.brand" />
            </j-form-item>
            <j-form-item label="操作日期" :content-nest="false">
              <el-date-picker
                v-model="searchFormData.createStartTime"
                type="date"
                value-format="yyyy-MM-dd 00:00:00"
              />
              <span class="date-split">至</span>
              <el-date-picker
                v-model="searchFormData.createEndTime"
                type="date"
                value-format="yyyy-MM-dd 23:59:59"
              />
            </j-form-item>
            <j-form-item label="业务类型">
              <el-select v-model="searchFormData.bizType" placeholder="全部" clearable>
                <el-option v-for="item in $enums.PRODUCT_STOCK_BIZ_TYPE.values()" :key="item.code" :label="item.desc" :value="item.code" />
              </el-select>
            </j-form-item>
          </j-form>
        </j-border>
      </template>

      <!-- 业务单据号 列自定义内容 -->
      <template v-slot:bizCode_default="{ row }">
        <div v-if="$enums.PRODUCT_STOCK_BIZ_TYPE.PURCHASE.equalsCode(row.bizType)">
          <el-button v-permission="['purchase:receive:query']" type="text" @click="e => {currentRow = row;$refs.viewPurchaseRecevieSheetDetailDialog.openDialog()}">{{ row.bizCode }}</el-button>
          <span v-no-permission="['purchase:receive:query']">{{ row.bizCode }}</span>
        </div>
        <div v-else-if="$enums.PRODUCT_STOCK_BIZ_TYPE.PURCHASE_RETURN.equalsCode(row.bizType)">
          <el-button v-permission="['purchase:return:query']" type="text" @click="e => {currentRow = row;$refs.viewPurchaseReturnDetailDialog.openDialog()}">{{ row.bizCode }}</el-button>
          <span v-no-permission="['purchase:return:query']">{{ row.bizCode }}</span>
        </div>
        <div v-else-if="$enums.PRODUCT_STOCK_BIZ_TYPE.SALE.equalsCode(row.bizType)">
          <el-button v-permission="['sale:out:query']" type="text" @click="e => {currentRow = row;$refs.viewSaleOutSheetDetailDialog.openDialog()}">{{ row.bizCode }}</el-button>
          <span v-no-permission="['sale:out:query']">{{ row.bizCode }}</span>
        </div>
        <div v-else-if="$enums.PRODUCT_STOCK_BIZ_TYPE.SALE_RETURN.equalsCode(row.bizType)">
          <el-button v-permission="['sale:return:query']" type="text" @click="e => {currentRow = row;$refs.viewSaleReturnDetailDialog.openDialog()}">{{ row.bizCode }}</el-button>
          <span v-no-permission="['sale:return:query']">{{ row.bizCode }}</span>
        </div>
        <div v-else-if="$enums.PRODUCT_STOCK_BIZ_TYPE.RETAIL.equalsCode(row.bizType)">
          <el-button v-permission="['retail:out:query']" type="text" @click="e => {currentRow = row;$refs.viewRetailOutSheetDetailDialog.openDialog()}">{{ row.bizCode }}</el-button>
          <span v-no-permission="['retail:out:query']">{{ row.bizCode }}</span>
        </div>
        <div v-else-if="$enums.PRODUCT_STOCK_BIZ_TYPE.RETAIL_RETURN.equalsCode(row.bizType)">
          <el-button v-permission="['retail:return:query']" type="text" @click="e => {currentRow = row;$refs.viewRetailReturnDetailDialog.openDialog()}">{{ row.bizCode }}</el-button>
          <span v-no-permission="['retail:return:query']">{{ row.bizCode }}</span>
        </div>
        <span v-else>{{ row.bizCode }}</span>
      </template>

      <!-- 工具栏 -->
      <template v-slot:toolbar_buttons>
        <el-form :inline="true">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
          </el-form-item>
          <el-form-item v-permission="['stock:product-log:export']">
            <el-button type="primary" icon="el-icon-download" @click="exportList">导出</el-button>
          </el-form-item>
        </el-form>
      </template>
    </vxe-grid>
    <purchase-receive-sheet-detail :id="currentRow.bizId" ref="viewPurchaseRecevieSheetDetailDialog" />
    <purchase-return-detail :id="currentRow.bizId" ref="viewPurchaseReturnDetailDialog" />
    <sale-out-sheet-detail :id="currentRow.bizId" ref="viewSaleOutSheetDetailDialog" />
    <sale-return-detail :id="currentRow.bizId" ref="viewSaleReturnDetailDialog" />
    <retail-out-sheet-detail :id="currentRow.bizId" ref="viewRetailOutSheetDetailDialog" />
    <retail-return-detail :id="currentRow.bizId" ref="viewRetailReturnDetailDialog" />
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

export default {
  name: 'ProductStock',
  components: {
    StoreCenterSelector, ProductCategorySelector, ProductBrandSelector, SupplierSelector, PurchaseReceiveSheetDetail, PurchaseReturnDetail, SaleOutSheetDetail, SaleReturnDetail, RetailOutSheetDetail, RetailReturnDetail
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
        bizType: ''
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
        custom: true,
        // 右侧是否显示刷新按钮
        refresh: true,
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
        { field: 'createTime', title: '操作时间', minWidth: 150 },
        { field: 'createBy', title: '操作人', minWidth: 100 },
        { field: 'bizCode', title: '业务单据号', width: 180, slots: { default: 'bizCode_default' }},
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
        this.$msg.success('导出成功！')
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style scoped>
</style>
