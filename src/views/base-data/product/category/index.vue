<template>
  <div v-permission="['base-data:product:category:query']">
    <page-wrapper content-full-height fixed-height>
      <vxe-grid
        id="ProductCategory"
        ref="grid"
        resizable
        show-overflow
        highlight-hover-row
        keep-source
        row-id="id"
        :export-config="{}"
        :proxy-config="tableProxy"
        :columns="tableColumn"
        :toolbar-config="toolBarConfig"
        :custom-config="{}"
        :tree-config="{ expandAll: true }"
        :checkbox-config="{ checkStrictly: true }"
        :loading="loading"
        height="auto"
      >
        <template #menuDisplay_default="{ row }">
          <menu-display-tag :menu-display="row.display" />
        </template>

        <template #action_default="{ row }">
          <table-action outside :actions="createActions(row)" />
        </template>

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

        <template #toolbar_buttons>
          <a-space>
            <a-button type="primary" :icon="h(SearchOutlined)" @click="search">查询</a-button>
            <a-button
              v-permission="['base-data:product:category:add']"
              type="primary"
              :icon="h(PlusOutlined)"
              @click="$refs.addDialog.openDialog()"
              >新增</a-button
            >
            <a-button
              v-permission="['base-data:product:category:import']"
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
              <a-button v-permission="['base-data:product:category:delete']"
                >更多<DownOutlined
              /></a-button>
            </a-dropdown>
          </a-space>
        </template>
      </vxe-grid>
    </page-wrapper>

    <!-- 新增窗口 -->
    <add ref="addDialog" @confirm="search" />

    <!-- 修改窗口 -->
    <modify :id="id" ref="updateDialog" @confirm="search" />

    <!-- 新建子分类窗口 -->
    <add-children :id="id" ref="addChildrenDialog" @confirm="search" />

    <category-property ref="propertyDialog" @confirm="search" />

    <category-sale-property ref="salePropertyDialog" @confirm="search" />

    <product-category-importer ref="importer" @confirm="search" />

    <!-- 批量操作 -->
    <batch-handler
      ref="batchDeleteHandlerDialog"
      :table-column="[
        { field: 'code', title: '编号', width: 120 },
        { field: 'name', title: '名称', minWidth: 160 },
      ]"
      title="批量删除"
      tip="删除商品分类时，会将该分类及其子分类同时删除。"
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
  import AddChildren from './add-children.vue';
  import CategoryProperty from './property/index.vue';
  import CategorySaleProperty from './sale-property/index.vue';
  import {
    CheckOutlined,
    CloudUploadOutlined,
    PlusOutlined,
    SearchOutlined,
    DeleteOutlined,
    DownOutlined,
  } from '@ant-design/icons-vue';
  import * as api from '@/api/base-data/product/category';
  import { toArrayTree, toString, isEmpty, searchTree, isEqualWithStr } from '@/utils/utils';
  import { createError } from '@/hooks/web/msg';
  import ProductCategoryImporter from '@/components/Importor/ProductCategoryImporter.vue';
  import BatchHandler from '@/components/BatchHandler';
  import MenuDisplayTag from '@/components/Tag/MenuDisplayTag.vue';

  export default defineComponent({
    name: 'ProductCategory',
    components: {
      Add,
      Modify,
      AddChildren,
      CategoryProperty,
      CategorySaleProperty,
      DownOutlined,
      ProductCategoryImporter,
      BatchHandler,
      MenuDisplayTag,
    },
    setup() {
      return {
        h,
        CheckOutlined,
        CloudUploadOutlined,
        PlusOutlined,
        SearchOutlined,
        DeleteOutlined,
      };
    },
    data() {
      return {
        loading: false,
        id: '',
        searchFormData: {
          code: '',
          name: '',
        },
        originData: [],
        tableProxy: {
          ajax: {
            query: () =>
              api.query().then((res) => {
                // 将带层级的列表转成树结构
                res = toArrayTree(res, {
                  key: 'id',
                  parentKey: 'parentId',
                  children: 'children',
                  strict: true,
                });

                this.originData = res;

                return this.handleSearch();
              }),
          },
        },
        toolBarConfig: {
          slots: {
            buttons: 'toolbar_buttons',
          },
        },
        tableColumn: [
          { type: 'checkbox', width: 45 },
          { field: 'code', title: '编号', width: 120 },
          { field: 'name', title: '名称', minWidth: 160, treeNode: true },
          { field: 'description', title: '备注', minWidth: 160 },
          {
            field: 'action',
            title: '操作',
            width: 240,
            slots: { default: 'action_default' },
            fixed: 'right',
          },
        ],
        batchHandleDatas: [],
      };
    },
    created() {},
    methods: {
      handleSearch() {
        const filterCode = toString(this.searchFormData.code).trim();
        const filterName = toString(this.searchFormData.name).trim();
        const isFilterCode = !isEmpty(filterCode);
        const isFilterName = !isEmpty(filterName);
        if (isFilterName || isFilterCode) {
          const options = { key: 'id', parentKey: 'parentId', children: 'children', strict: true };
          let tableData = searchTree(
            this.originData,
            (item) => {
              let filterResult = true;
              if (isFilterCode) {
                filterResult &= isEqualWithStr(toString(item['code']), filterCode);
              }

              if (isFilterName) {
                filterResult &= toString(item['name']).indexOf(filterName) > -1;
              }

              return filterResult;
            },
            options,
          );

          // 搜索之后默认展开所有子节点
          this.$nextTick(() => {
            this.$refs.grid.setAllTreeExpand(true);
          });
          return tableData;
        } else {
          return this.originData;
        }
      },
      search() {
        this.$refs.grid.commitProxy('reload');
      },
      handleCommand({ key }) {
        if (key === 'batchDelete') {
          this.batchDelete();
        }
      },
      doBatchDelete(row) {
        return api.deleteById(row.id);
      },
      batchDelete() {
        const records = this.$refs.grid.getCheckboxRecords();

        if (isEmpty(records)) {
          createError('请选择要删除的分类！');
          return;
        }

        this.batchHandleDatas = records;

        this.$refs.batchDeleteHandlerDialog.openDialog();
      },
      createActions(row) {
        return [
          {
            permission: ['base-data:product:category:add'],
            label: '新增子分类',
            ifShow: () => {
              return !row.hasProperty && !row.hasSaleProperty;
            },
            onClick: () => {
              this.id = row.id;
              this.$nextTick(() => this.$refs.addChildrenDialog.openDialog());
            },
          },
          {
            permission: ['base-data:product:category:modify'],
            label: '修改',
            onClick: () => {
              this.id = row.id;
              this.$nextTick(() => this.$refs.updateDialog.openDialog());
            },
          },
          {
            permission: ['base-data:product:property:*'],
            label: '分类属性配置',
            ifShow: () => {
              return isEmpty(row.children);
            },
            onClick: () => {
              this.$nextTick(() => this.$refs.propertyDialog.openDialog(row));
            },
          },
          {
            permission: ['base-data:product:sale-property:*'],
            label: '销售属性配置',
            ifShow: () => {
              return isEmpty(row.children);
            },
            onClick: () => {
              this.$nextTick(() => this.$refs.salePropertyDialog.openDialog(row));
            },
          },
        ];
      },
    },
  });
</script>

<style scoped></style>
