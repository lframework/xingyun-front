<template>
  <div v-permission="['stock:product:query']">
    <page-wrapper content-full-height fixed-height>
      <!-- 数据列表 -->
      <vxe-grid
        id="ProductStock"
        ref="grid"
        resizable
        show-overflow
        highlight-hover-row
        keep-source
        row-id="id"
        :proxy-config="proxyConfig"
        :columns="tableColumn"
        :toolbar-config="toolbarConfig"
        :custom-config="{}"
        :pager-config="{}"
        :loading="loading"
        height="auto"
      >
        <template #form>
          <j-border>
            <j-form label-width="80px" @collapse="$refs.grid.refreshColumn()">
              <j-form-item label="仓库">
                <store-center-selector v-model:value="searchFormData.scId" />
              </j-form-item>
              <j-form-item label="商品编号">
                <a-input v-model:value="searchFormData.productCode" allow-clear />
              </j-form-item>
              <j-form-item label="商品名称">
                <a-input v-model:value="searchFormData.productName" allow-clear />
              </j-form-item>
              <j-form-item label="商品类目">
                <product-category-selector
                  v-model:value="searchFormData.categoryId"
                  :only-final="false"
                />
              </j-form-item>
              <j-form-item label="商品品牌">
                <product-brand-selector v-model:value="searchFormData.brandId" />
              </j-form-item>
            </j-form>
          </j-border>
        </template>
        <!-- 工具栏 -->
        <template #toolbar_buttons>
          <a-space>
            <a-button type="primary" :icon="h(SearchOutlined)" @click="search">查询</a-button>
            <a-button
              v-permission="['stock:product:export']"
              type="primary"
              :icon="h(DownloadOutlined)"
              @click="exportList"
              >导出</a-button
            >
          </a-space>
        </template>
      </vxe-grid>
    </page-wrapper>
  </div>
</template>

<script>
  import { h, defineComponent } from 'vue';
  import { SearchOutlined, DownloadOutlined } from '@ant-design/icons-vue';
  import * as api from '@/api/sc/stock/product-stock';

  export default defineComponent({
    name: 'ProductStock',
    components: {},
    setup() {
      return {
        h,
        SearchOutlined,
        DownloadOutlined,
      };
    },
    data() {
      return {
        loading: false,
        // 当前行数据
        id: '',
        ids: [],
        // 查询列表的查询条件
        searchFormData: {
          scId: '',
          productCode: '',
          productName: '',
          categoryId: '',
          brandId: '',
        },
        // 工具栏配置
        toolbarConfig: {
          // 自定义左侧工具栏
          slots: {
            buttons: 'toolbar_buttons',
          },
        },
        // 列表数据配置
        tableColumn: [
          { type: 'seq', width: 50 },
          { field: 'scCode', title: '仓库编号', width: 100, sortable: true },
          { field: 'scName', title: '仓库名称', minWidth: 160 },
          { field: 'productCode', title: '商品编号', width: 120, sortable: true },
          { field: 'productName', title: '商品名称', minWidth: 180 },
          { field: 'categoryName', title: '商品类目', width: 120 },
          { field: 'brandName', title: '商品品牌', width: 120 },
          { field: 'stockNum', title: '库存数量', align: 'right', width: 100, sortable: true },
          { field: 'taxPrice', title: '含税价格', align: 'right', width: 100 },
          { field: 'taxAmount', title: '含税金额', align: 'right', width: 100 },
        ],
        // 请求接口配置
        proxyConfig: {
          props: {
            // 响应结果列表字段
            result: 'datas',
            // 响应结果总条数字段
            total: 'totalCount',
          },
          ajax: {
            // 查询接口
            query: ({ page, sorts }) => {
              return api.query(this.buildQueryParams(page, sorts));
            },
          },
        },
      };
    },
    created() {},
    methods: {
      // 列表发生查询时的事件
      search() {
        this.$refs.grid.commitProxy('reload');
      },
      // 查询前构建查询参数结构
      buildQueryParams(page, sorts) {
        return {
          ...this.$utils.buildSortPageVo(page, sorts),
          ...this.buildSearchFormData(),
        };
      },
      // 查询前构建具体的查询参数
      buildSearchFormData() {
        const params = Object.assign({}, this.searchFormData, {
          scId: this.searchFormData.scId,
          categoryId: this.searchFormData.categoryId,
          brandId: this.searchFormData.brandId,
        });

        return params;
      },
      exportList() {
        this.loading = true;
        api
          .exportList(this.buildQueryParams({}))
          .then(() => {
            this.$msg.createSuccessTip('导出成功！');
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
  });
</script>
<style scoped></style>
