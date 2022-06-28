<template>
  <div>
    <div v-permission="['base-data:product:poly:query']" class="app-container">
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
              <j-form-item label="商品货号">
                <a-input v-model="searchFormData.code" allow-clear />
              </j-form-item>
              <j-form-item label="SPU名称">
                <a-input v-model="searchFormData.name" allow-clear />
              </j-form-item>
              <j-form-item label="商品类目">
                <product-category-selector v-model="searchFormData.category" :request-params="{available: ''}" :only-final="false" />
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
            <a-button v-permission="['base-data:product:poly:import']" icon="cloud-upload" @click="$refs.importer.openDialog()">导入Excel</a-button>
          </a-space>
        </template>

        <!-- 操作 列自定义内容 -->
        <template v-slot:action_default="{ row }">
          <a-button v-permission="['base-data:product:poly:query']" type="link" @click="e => { id = row.id;$nextTick(() => $refs.viewDialog.openDialog()) }">查看</a-button>
          <a-button v-permission="['base-data:product:poly:modify']" type="link" @click="e => { id = row.id;$nextTick(() => $refs.updateDialog.openDialog()) }">修改</a-button>
        </template>
      </vxe-grid>
    </div>
    <!-- 修改窗口 -->
    <modify :id="id" ref="updateDialog" @confirm="search" />

    <!-- 查看窗口 -->
    <detail :id="id" ref="viewDialog" />

    <product-poly-importer ref="importer" @confirm="search" />
  </div>
</template>

<script>
import Modify from './modify'
import Detail from './detail'
import ProductBrandSelector from '@/components/Selector/ProductBrandSelector'
import ProductCategorySelector from '@/components/Selector/ProductCategorySelector'
import ProductPolyImporter from '@/components/Importer/ProductPolyImporter'

export default {
  name: 'ProductPoly',
  components: {
    Modify, Detail, ProductBrandSelector, ProductCategorySelector, ProductPolyImporter
  },
  data() {
    return {
      loading: false,
      // 当前行数据
      id: '',
      // 查询列表的查询条件
      searchFormData: {
        code: '',
        name: '',
        category: {},
        brand: {}
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
        { type: 'seq', width: 40 },
        { field: 'code', title: '商品货号', width: 120 },
        { field: 'name', title: 'SPU名称', minWidth: 160 },
        { field: 'shortName', title: '简称', width: 160 },
        { field: 'categoryName', title: '商品类目', width: 120 },
        { field: 'brandName', title: '商品品牌', width: 120 },
        { field: 'multiSaleProp', title: '是否多规格', width: 100, formatter: ({ cellValue }) => { return cellValue ? '是' : '否' } },
        { field: 'taxRate', title: '进项税率（%）', width: 120, align: 'right' },
        { field: 'saleTaxRate', title: '销项税率（%）', width: 120, align: 'right' },
        { title: '操作', width: 120, fixed: 'right', slots: { default: 'action_default' }}
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
            return this.$api.baseData.product.poly.query(this.buildQueryParams(page))
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
      const params = Object.assign({ }, this.searchFormData)
      params.brandId = params.brand.id
      params.categoryId = params.category.id

      delete params.brand
      delete params.category

      return params
    }
  }
}
</script>
<style scoped>
</style>
