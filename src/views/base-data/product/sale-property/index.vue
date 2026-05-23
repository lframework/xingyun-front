<template>
  <div v-permission="['base-data:product:sale-property:query']">
    <page-wrapper content-full-height fixed-height>
      <!-- 数据列表 -->
      <vxe-grid
        id="ProductSaleProperty"
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
              <j-form-item label="编号">
                <a-input v-model:value="searchFormData.code" allow-clear />
              </j-form-item>
              <j-form-item label="名称">
                <a-input v-model:value="searchFormData.name" allow-clear />
              </j-form-item>
            </j-form>
          </j-border>
        </template>
        <!-- 工具栏 -->
        <template #toolbar_buttons>
          <a-space>
            <a-button type="primary" :icon="h(SearchOutlined)" @click="search">查询</a-button>
            <a-button
              v-permission="['base-data:product:sale-property:add']"
              type="primary"
              :icon="h(PlusOutlined)"
              @click="$refs.addDialog.openDialog()"
              >新增</a-button
            >
            <a-button
              v-permission="['base-data:product:sale-property:import']"
              :icon="h(CloudUploadOutlined)"
              @click="$refs.importer.openDialog()"
              >导入Excel</a-button
            >
            <a-dropdown>
              <template #overlay>
                <a-menu @click="handleCommand">
                  <a-menu-item key="batchDelete" :icon="h(DeleteOutlined)"> 批量删除 </a-menu-item>
                </a-menu>
              </template>
              <a-button v-permission="['base-data:product:sale-property:delete']"
                >更多<DownOutlined
              /></a-button>
            </a-dropdown>
          </a-space>
        </template>

        <!-- 操作 列自定义内容 -->
        <template #categoryCount_default="{ row }">
          <a-button
            v-if="canShowRelatedCategories(row)"
            type="link"
            size="small"
            @click="$refs.relatedCategoryDialog.openDialog(row)"
            >{{ row.categoryCount || 0 }}</a-button
          >
          <span v-else>{{ row.categoryCount || 0 }}</span>
        </template>

        <template #action_default="{ row }">
          <table-action outside :actions="createActions(row)" />
        </template>
      </vxe-grid>
    </page-wrapper>

    <!-- 新增窗口 -->
    <add ref="addDialog" @confirm="search" />

    <!-- 修改窗口 -->
    <modify :id="id" ref="updateDialog" @confirm="search" />

    <!-- 销售属性值窗口 -->
    <item ref="itemDialog" :property-id="id" />

    <!-- 已关联商品分类窗口 -->
    <related-category-dialog ref="relatedCategoryDialog" :query-fn="api.queryCategories" />

    <product-sale-property-importer ref="importer" @confirm="search" />

    <!-- 批量操作 -->
    <batch-handler
      ref="batchDeleteHandlerDialog"
      :table-column="[
        { field: 'code', title: '编号', width: 100 },
        { field: 'name', title: '名称', minWidth: 180 },
      ]"
      title="批量删除"
      :tableData="batchHandleDatas"
      :handle-fn="doBatchDelete"
      @confirm="search"
    />
  </div>
</template>

<script>
  import { h, defineComponent } from 'vue';
  import Add from './add.vue';
  import Modify from './modify.vue';
  import Item from './item/index.vue';
  import RelatedCategoryDialog from '../components/RelatedCategoryDialog.vue';
  import * as api from '@/api/base-data/product/sale-property';
  import {
    CloudUploadOutlined,
    PlusOutlined,
    SearchOutlined,
    DeleteOutlined,
    DownOutlined,
  } from '@ant-design/icons-vue';
  import { isEmpty, buildSortPageVo } from '@/utils/utils';
  import { createError } from '@/hooks/web/msg';
  import BatchHandler from '@/components/BatchHandler';
  import { usePermission } from '@/hooks/web/usePermission';
  import ProductSalePropertyImporter from '@/components/Importor/ProductSalePropertyImporter.vue';

  export default defineComponent({
    name: 'ProductSaleProperty',
    components: {
      Add,
      Modify,
      Item,
      RelatedCategoryDialog,
      DownOutlined,
      BatchHandler,
      ProductSalePropertyImporter,
    },
    setup() {
      const { hasPermission } = usePermission();

      return {
        api,
        h,
        CloudUploadOutlined,
        PlusOutlined,
        SearchOutlined,
        DeleteOutlined,
        hasPermission,
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
          code: '',
          name: '',
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
          { type: 'checkbox', width: 45 },
          { field: 'code', title: '编号', width: 120, sortable: true },
          { field: 'name', title: '名称', minWidth: 160, sortable: true },
          {
            field: 'categoryCount',
            title: '已关联商品分类',
            width: 130,
            align: 'right',
            slots: { default: 'categoryCount_default' },
          },
          { field: 'description', title: '备注', minWidth: 160 },
          {
            title: '操作',
            field: 'action',
            width: 140,
            fixed: 'right',
            slots: { default: 'action_default' },
          },
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
    methods: {
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
        };
      },
      handleCommand({ key }) {
        if (key === 'batchDelete') {
          this.batchDelete();
        }
      },
      doBatchDelete(row) {
        return api.deleteById(row.id);
      },
      // 批量删除
      batchDelete() {
        const records = this.$refs.grid.getCheckboxRecords();

        if (isEmpty(records)) {
          createError('请选择要删除的商品销售属性！');
          return;
        }

        this.batchHandleDatas = records;

        this.$refs.batchDeleteHandlerDialog.openDialog();
      },
      canShowRelatedCategories(row) {
        return (
          (row.categoryCount || 0) > 0 && this.hasPermission('base-data:product:category:query')
        );
      },
      createActions(row) {
        return [
          {
            permission: ['base-data:product:sale-property-item:query'],
            label: '属性值管理',
            onClick: () => {
              this.id = row.id;
              this.$nextTick(() => this.$refs.itemDialog.openDialog());
            },
          },
          {
            permission: ['base-data:product:sale-property:modify'],
            label: '修改',
            onClick: () => {
              this.id = row.id;
              this.$nextTick(() => this.$refs.updateDialog.openDialog());
            },
          },
        ];
      },
    },
  });
</script>
<style scoped></style>
