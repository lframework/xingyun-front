<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="75%"
    title="商品管理"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-permission="['base-data:stock-cell-product:query']" v-loading="loading">
      <page-wrapper content-full-height fixed-height>
        <!-- 数据列表 -->
        <vxe-grid
          id="StockCellProductManage"
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
              <j-form bordered label-width="80px" @collapse="$refs.grid.refreshColumn()">
                <j-form-item label="SKU编号">
                  <a-input v-model:value="searchFormData.skuCode" allow-clear />
                </j-form-item>
                <j-form-item label="商品名称">
                  <a-input v-model:value="searchFormData.productName" allow-clear />
                </j-form-item>
                <j-form-item label="商品分类">
                  <product-category-selector v-model:value="searchFormData.categoryId" />
                </j-form-item>
                <j-form-item label="商品品牌">
                  <product-brand-selector v-model:value="searchFormData.brandId" />
                </j-form-item>
              </j-form>
            </j-border>
          </template>
          <!-- 操作 列自定义内容 -->
          <template #action_default="{ row }">
            <table-action outside :actions="createActions(row)" />
          </template>
          <!-- 工具栏 -->
          <template #toolbar_buttons>
            <a-space>
              <a-button type="primary" :icon="h(SearchOutlined)" @click="search">查询</a-button>
              <a-button
                v-permission="['base-data:stock-cell-product:add']"
                type="primary"
                :icon="h(PlusOutlined)"
                @click="$refs.addDialog.openDialog()"
                >新增</a-button
              >
              <a-button
                v-permission="['base-data:stock-cell-product:import']"
                type="primary"
                :icon="h(CloudUploadOutlined)"
                @click="$refs.importDialog.openDialog()"
                >导入Excel</a-button
              >
              <a-dropdown>
                <template #overlay>
                  <a-menu @click="handleCommand">
                    <a-menu-item key="batchDelete" :icon="h(DeleteOutlined)">
                      批量删除
                    </a-menu-item>
                  </a-menu>
                </template>
                <a-button v-permission="['base-data:stock-cell-product:delete']"
                  >更多<DownOutlined
                /></a-button>
              </a-dropdown>
            </a-space>
          </template>
        </vxe-grid>
      </page-wrapper>

      <!-- 新增窗口 -->
      <add :stock-cell-id="stockCellId" ref="addDialog" @confirm="search" />

      <!-- 导入 -->
      <stock-cell-product-by-cell-importer
        ref="importDialog"
        :stock-cell-id="stockCellId"
        @confirm="search"
      />

      <!-- 批量操作 -->
      <batch-handler
        ref="batchDeleteHandlerDialog"
        :table-column="[
          { field: 'scCode', title: '仓库编号', width: 100, sortable: true },
          { field: 'scName', title: '仓库名称', width: 180, sortable: true },
          { field: 'stockCellCode', title: '仓位编号', width: 100, sortable: true },
          { field: 'stockCellName', title: '仓位名称', width: 180, sortable: true },
          { field: 'productCode', title: '商品编号', width: 100, sortable: true },
          { field: 'skuCode', title: 'SKU编号', width: 100, sortable: true },
          { field: 'productName', title: '商品名称', minWidth: 180, sortable: true },
          { field: 'salePropertyText', title: '销售属性', minWidth: 180 },
          { field: 'categoryName', title: '商品分类', width: 120 },
          { field: 'brandName', title: '商品品牌', width: 120 },
        ]"
        title="批量删除"
        :tableData="batchHandleDatas"
        :handle-fn="doBatchDelete"
        @confirm="search"
      />
    </div>
  </a-modal>
</template>
<script>
  import { defineComponent, h } from 'vue';
  import * as api from '@/api/base-data/stock-cell-product';
  import { isEmpty, buildSortPageVo } from '@/utils/utils';
  import { createConfirm, createError, createSuccess } from '@/hooks/web/msg';
  import { STOCK_CELL_TYPE } from '@/enums/biz/stockCellType';
  import {
    SearchOutlined,
    PlusOutlined,
    ThunderboltOutlined,
    SettingOutlined,
    CheckOutlined,
    DownOutlined,
    DeleteOutlined,
    CloudUploadOutlined,
  } from '@ant-design/icons-vue';
  import Add from './add.vue';
  import BatchHandler from '@/components/BatchHandler';
  import TableAction from '@/components/Table/src/components/TableAction.vue';
  import ProductCategorySelector from '@/components/Selector/ProductCategorySelector.vue';
  import ProductBrandSelector from '@/components/Selector/ProductBrandSelector.vue';
  import StockCellProductByCellImporter from '@/components/Importor/StockCellProductByCellImporter.vue';

  export default defineComponent({
    components: {
      ProductBrandSelector,
      ProductCategorySelector,
      BatchHandler,
      TableAction,
      DownOutlined,
      Add,
      StockCellProductByCellImporter,
    },
    props: {
      stockCellId: {
        type: String,
        required: true,
      },
    },
    setup() {
      return {
        h,
        SearchOutlined,
        PlusOutlined,
        ThunderboltOutlined,
        SettingOutlined,
        CheckOutlined,
        DeleteOutlined,
        CloudUploadOutlined,
        STOCK_CELL_TYPE,
      };
    },
    data() {
      return {
        // 是否可见
        visible: false,
        loading: false,
        // 当前行数据
        id: '',
        ids: [],
        // 查询列表的查询条件
        searchFormData: {},
        // 工具栏配置
        toolbarConfig: {
          // 自定义左侧工具栏
          slots: {
            buttons: 'toolbar_buttons',
          },
        },
        // 列表数据配置
        tableColumn: [
          { type: 'checkbox', width: 45 },
          { field: 'scCode', title: '仓库编号', width: 100, sortable: true },
          { field: 'scName', title: '仓库名称', width: 180, sortable: true },
          { field: 'stockCellCode', title: '仓位编号', width: 100, sortable: true },
          { field: 'stockCellName', title: '仓位名称', width: 180, sortable: true },
          { field: 'productCode', title: '商品编号', width: 100, sortable: true },
          { field: 'skuCode', title: 'SKU编号', width: 100, sortable: true },
          { field: 'productName', title: '商品名称', minWidth: 180, sortable: true },
          { field: 'salePropertyText', title: '销售属性', minWidth: 180 },
          { field: 'categoryName', title: '商品分类', width: 120 },
          { field: 'brandName', title: '商品品牌', width: 120 },
          { title: '操作', width: 80, fixed: 'right', slots: { default: 'action_default' } },
        ],
        // 请求接口配置
        proxyConfig: {
          response: {
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
        batchHandleDatas: [],
      };
    },
    computed: {},
    created() {
      // 初始化表单数据
      this.initFormData();
    },
    methods: {
      openDialog() {
        this.visible = true;

        this.$nextTick(() => this.open());
      },
      // 关闭对话框
      closeDialog() {
        this.visible = false;
        this.$emit('close');
      },
      // 页面显示时触发
      open() {
        // 初始化表单数据
        this.initFormData();
      },
      initFormData() {
        this.searchFormData = {
          skuCode: '',
          productName: '',
          categoryId: '',
          brandId: '',
        };
      },
      // 列表发生查询时的事件
      search() {
        this.$refs.grid.commitProxy('reload');
      },
      // 查询前构建查询参数结构
      buildQueryParams(page, sorts) {
        return {
          ...buildSortPageVo(page, sorts),
          ...this.buildSearchFormData(),
        };
      },
      // 查询前构建具体的查询参数
      buildSearchFormData() {
        return {
          ...this.searchFormData,
          stockCellId: this.stockCellId,
        };
      },
      createActions(row) {
        return [
          {
            permission: ['base-data:stock-cell-product:delete'],
            label: '删除',
            danger: true,
            onClick: () => {
              createConfirm('是否确认删除？').then(() => {
                api.deleteById(row.id, true).then(() => {
                  createSuccess('删除成功！');
                  this.search();
                });
              });
            },
          },
        ];
      },
      handleCommand({ key }) {
        if (key === 'batchDelete') {
          this.batchDelete();
        }
      },
      doBatchDelete(row) {
        return api.deleteById(row.id);
      },
      // 批量停用
      batchDelete() {
        const records = this.$refs.grid.getCheckboxRecords();

        if (isEmpty(records)) {
          createError('请选择要删除的商品！');
          return;
        }

        this.batchHandleDatas = records;

        this.$refs.batchDeleteHandlerDialog.openDialog();
      },
    },
  });
</script>
