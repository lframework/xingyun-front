<template>
  <div v-permission="['stock:lot:query']" class="app-container">

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
          <j-form label-width="80px" @collapse="$refs.grid.refreshColumn()">
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
            <j-form-item label="生成日期" :content-nest="false">
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
          </j-form>
        </j-border>
      </template>
      <!-- 工具栏 -->
      <template v-slot:toolbar_buttons>
        <a-space>
          <a-button type="primary" icon="search" @click="search">查询</a-button>
          <a-button v-permission="['stock:lot:export']" type="primary" icon="download" @click="exportList">导出</a-button>
        </a-space>
      </template>
    </vxe-grid>
  </div>
</template>

<script>
import StoreCenterSelector from '@/components/Selector/StoreCenterSelector'
import ProductCategorySelector from '@/components/Selector/ProductCategorySelector'
import ProductBrandSelector from '@/components/Selector/ProductBrandSelector'
import SupplierSelector from '@/components/Selector/SupplierSelector'
import Moment from 'moment'

export default {
  name: 'ProductLot',
  components: {
    StoreCenterSelector, ProductCategorySelector, ProductBrandSelector, SupplierSelector
  },
  data() {
    return {
      loading: false,
      // 当前行数据
      id: '',
      ids: [],
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
        createEndTime: this.$utils.formatDateTime(this.$utils.getDateTimeWithMaxTime(Moment()))
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
        { field: 'stockNum', title: '库存数量', align: 'right', width: 100 },
        { field: 'taxRate', title: '税率（%）', align: 'right', width: 100 },
        { field: 'createTime', title: '生成时间', width: 170 }
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
            return this.$api.sc.stock.productLot.query(this.buildQueryParams(page))
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
      this.$api.sc.stock.productLot.exportList(this.buildQueryParams({})).then(() => {
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
