<template>
  <div v-permission="['stock:product:query']" class="app-container">

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
          </j-form>
        </j-border>
      </template>
      <!-- 工具栏 -->
      <template v-slot:toolbar_buttons>
        <a-space>
          <a-button type="primary" icon="search" @click="search">查询</a-button>
          <a-button v-permission="['stock:product:export']" type="primary" icon="download" @click="exportList">导出</a-button>
        </a-space>
      </template>
    </vxe-grid>
  </div>
</template>

<script>
import StoreCenterSelector from '@/components/Selector/StoreCenterSelector'
import ProductCategorySelector from '@/components/Selector/ProductCategorySelector'
import ProductBrandSelector from '@/components/Selector/ProductBrandSelector'

export default {
  name: 'ProductStock',
  components: {
    StoreCenterSelector, ProductCategorySelector, ProductBrandSelector
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
        productCode: '',
        productName: '',
        category: {},
        brand: {}
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
        { field: 'productCode', title: '商品编号', width: 120 },
        { field: 'productName', title: '商品名称', minWidth: 180 },
        { field: 'categoryName', title: '商品类目', width: 120 },
        { field: 'brandName', title: '商品品牌', width: 120 },
        { field: 'salePropItem1', title: '销售属性1', width: 120 },
        { field: 'salePropItem2', title: '销售属性2', width: 120 },
        { field: 'stockNum', title: '库存数量', align: 'right', width: 100 },
        { field: 'taxPrice', title: '含税价格', align: 'right', width: 100 },
        { field: 'taxAmount', title: '含税金额', align: 'right', width: 100 },
        { field: 'unTaxPrice', title: '无税价格', align: 'right', width: 100 },
        { field: 'unTaxAmount', title: '无税金额', align: 'right', width: 100 }
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
            return this.$api.sc.stock.productStock.query(this.buildQueryParams(page))
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
        brandId: this.searchFormData.brand.id
      })

      delete params.sc
      delete params.category
      delete params.brand

      return params
    },
    exportList() {
      this.loading = true
      this.$api.sc.stock.productStock.exportList(this.buildQueryParams({})).then(() => {
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
