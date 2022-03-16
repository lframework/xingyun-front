<template>
  <a-modal v-model="visible" :mask-closable="false" width="70%" title="批量添加商品" :dialog-style="{ top: '20px' }">
    <div v-if="visible" v-permission="['stock:take:pre:add', 'stock:take:pre:modify']">
      <!-- 数据列表 -->
      <vxe-grid
        v-if="visible"
        ref="grid"
        resizable
        show-overflow
        highlight-hover-row
        keep-source
        row-id="productId"
        height="500"
        :proxy-config="proxyConfig"
        :columns="tableColumn"
        :toolbar-config="toolbarConfig"
        :pager-config="{}"
        :loading="loading"
      >
        <template v-slot:form>
          <j-border>
            <j-form>
              <j-form-item label="商品">
                <a-input v-model="searchFormData.condition" allow-clear />
              </j-form-item>
              <j-form-item label="商品类目">
                <product-category-selector v-model="searchFormData.category" :only-final="false" />
              </j-form-item>
              <j-form-item label="商品品牌">
                <product-brand-selector v-model="searchFormData.brand" :request-params="{ available: true }" />
              </j-form-item>
            </j-form>
          </j-border>
        </template>
        <!-- 工具栏 -->
        <template v-slot:toolbar_buttons>
          <a-space>
            <a-button type="primary" icon="search" @click="search">查询</a-button>
          </a-space>
        </template>
      </vxe-grid>
    </div>
    <template slot="footer">
      <a-space>
        <a-button @click="closeDialog">取 消</a-button>
        <a-button v-permission="['stock:take:pre:add', 'stock:take:pre:modify']" type="primary" :loading="loading" @click="doSelect">确 定</a-button>
      </a-space>
    </template>
  </a-modal>
</template>
<script>
import ProductCategorySelector from '@/components/Selector/ProductCategorySelector'
import ProductBrandSelector from '@/components/Selector/ProductBrandSelector'

export default {
  // 使用组件
  components: {
    ProductCategorySelector, ProductBrandSelector
  },
  props: {
  },
  data() {
    return {
      // 是否可见
      visible: false,
      // 是否显示加载框
      loading: false,
      // 查询列表的查询条件
      searchFormData: {
        condition: '',
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
        { type: 'checkbox', width: 40 },
        { field: 'productCode', title: '商品编号', width: 120 },
        { field: 'productName', title: '商品名称', width: 260 },
        { field: 'skuCode', title: '商品SKU编号', width: 120 },
        { field: 'externalCode', title: '商品外部编号', width: 120 },
        { field: 'unit', title: '单位', width: 80 },
        { field: 'spec', title: '规格', width: 80 },
        { field: 'categoryName', title: '商品类目', width: 120 },
        { field: 'brandName', title: '商品品牌', width: 120 }
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
            return this.$api.sc.stock.take.preTakeStockSheet.queryProduct(this.buildQueryParams(page))
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
      return {
        condition: this.searchFormData.condition,
        categoryId: this.searchFormData.category.id || '',
        brandId: this.searchFormData.brand.id || ''
      }
    },
    // 打开对话框 由父页面触发
    openDialog() {
      this.visible = true

      this.open()
    },
    // 关闭对话框
    closeDialog() {
      this.visible = false
      this.$emit('close')
    },
    // 页面显示时触发
    open() {
    },
    // 选择商品
    doSelect() {
      const records = this.$refs.grid.getCheckboxRecords()
      if (this.$utils.isEmpty(records)) {
        this.$msg.error('请选择商品数据！')
        return
      }

      this.$emit('confirm', records)

      this.closeDialog()
    }
  }
}
</script>
