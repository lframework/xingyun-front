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
        :loading="loading"
        height="auto"
      >
        <template #menuDisplay_default="{ row }">
          <menu-display-tag :menu-display="row.display" />
        </template>

        <template #available_default="{ row }">
          <available-tag :available="row.available" />
        </template>

        <template #action_default="{ row }">
          <table-action outside :actions="createActions(row)" />
        </template>

        <template #form>
          <j-border>
            <j-form label-width="80px" @collapse="$refs.grid.refreshColumn()">
              <j-form-item label="编号">
                <a-input v-model:value="searchFormData.code" allow-clear />
              </j-form-item>
              <j-form-item label="名称">
                <a-input v-model:value="searchFormData.name" allow-clear />
              </j-form-item>
              <j-form-item label="状态">
                <a-select v-model:value="searchFormData.available" placeholder="全部" allow-clear>
                  <a-select-option :value="$enums.AVAILABLE.ENABLE.code">{{
                    '仅显示' + $enums.AVAILABLE.ENABLE.desc
                  }}</a-select-option>
                </a-select>
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
            <a-dropdown v-permission="['base-data:product:category:modify']">
              <template #overlay>
                <a-menu @click="handleCommand">
                  <a-menu-item key="batchEnable" :icon="h(CheckOutlined)"> 批量启用 </a-menu-item>
                  <a-menu-item key="batchUnable" :icon="h(StopOutlined)"> 批量停用 </a-menu-item>
                </a-menu>
              </template>
              <a-button>更多<DownOutlined /></a-button>
            </a-dropdown>
          </a-space>
        </template>
      </vxe-grid>
    </page-wrapper>

    <!-- 新增窗口 -->
    <add ref="addDialog" @confirm="search" />

    <!-- 修改窗口 -->
    <modify :id="id" ref="updateDialog" @confirm="search" />

    <!-- 新建子类目窗口 -->
    <add-children :id="id" ref="addChildrenDialog" @confirm="search" />

    <product-category-importer ref="importer" @confirm="search" />
  </div>
</template>

<script>
  import { h, defineComponent } from 'vue';
  import Add from './add.vue';
  import Modify from './modify.vue';
  import AddChildren from './add-children.vue';
  import {
    CheckOutlined,
    CloudUploadOutlined,
    PlusOutlined,
    SearchOutlined,
    StopOutlined,
    DownOutlined,
  } from '@ant-design/icons-vue';
  import * as api from '@/api/base-data/product/category';

  export default defineComponent({
    name: 'ProductCategory',
    components: {
      Add,
      Modify,
      AddChildren,
      DownOutlined,
    },
    setup() {
      return {
        h,
        CheckOutlined,
        CloudUploadOutlined,
        PlusOutlined,
        SearchOutlined,
        StopOutlined,
      };
    },
    data() {
      return {
        loading: false,
        id: '',
        searchFormData: {
          code: '',
          name: '',
          available: this.$enums.AVAILABLE.ENABLE.code,
        },
        originData: [],
        tableProxy: {
          ajax: {
            query: () =>
              api.query().then((res) => {
                // 将带层级的列表转成树结构
                res = this.$utils.toArrayTree(res, {
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
          { field: 'available', title: '状态', width: 80, slots: { default: 'available_default' } },
          { field: 'description', title: '备注', minWidth: 160 },
          {
            field: 'action',
            title: '操作',
            width: 160,
            slots: { default: 'action_default' },
            fixed: 'right',
          },
        ],
      };
    },
    created() {},
    methods: {
      handleSearch() {
        const filterCode = this.$utils.toString(this.searchFormData.code).trim();
        const filterName = this.$utils.toString(this.searchFormData.name).trim();
        const filterAvailable = this.searchFormData.available;
        const isFilterCode = !this.$utils.isEmpty(filterCode);
        const isFilterName = !this.$utils.isEmpty(filterName);
        const isFilterAvailable = !this.$utils.isEmpty(filterAvailable);
        if (isFilterName || isFilterAvailable || isFilterCode) {
          const options = { key: 'id', parentKey: 'parentId', children: 'children', strict: true };
          let tableData = this.$utils.searchTree(
            this.originData,
            (item) => {
              let filterResult = true;
              if (isFilterCode) {
                filterResult &= this.$utils.isEqualWithStr(
                  this.$utils.toString(item['code']),
                  filterCode,
                );
              }

              if (isFilterName) {
                filterResult &= this.$utils.toString(item['name']).indexOf(filterName) > -1;
              }

              return filterResult;
            },
            options,
          );

          if (isFilterAvailable) {
            tableData = this.$utils.toTreeArray(tableData, options);
            tableData = tableData.filter((item) =>
              this.$utils.isEqualWithStr(item['available'], filterAvailable),
            );
            tableData = this.$utils.toArrayTree(tableData, options);
          }

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
        if (key === 'batchEnable') {
          this.batchEnable();
        } else if (key === 'batchUnable') {
          this.batchUnable();
        }
      },
      batchUnable() {
        const records = this.$refs.grid.getCheckboxRecords();

        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择要停用的类目！');
          return;
        }

        this.$msg.createConfirm('是否确定停用选择的类目？').then(() => {
          this.loading = true;
          const ids = records.map((t) => t.id);
          api
            .batchUnable(ids)
            .then((data) => {
              this.$msg.createSuccess('停用成功！');
              this.search();
            })
            .finally(() => {
              this.loading = false;
            });
        });
      },
      batchEnable() {
        const records = this.$utils.union(
          this.$refs.grid.getCheckboxRecords(),
          this.$refs.grid.getCheckboxIndeterminateRecords(true),
        );

        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择要启用的类目！');
          return;
        }

        this.$msg.createConfirm('是否确定启用选择的类目？').then(() => {
          this.loading = true;
          const ids = records.map((t) => t.id);
          api
            .batchEnable(ids)
            .then((data) => {
              this.$msg.createSuccess('启用成功！');
              this.search();
            })
            .finally(() => {
              this.loading = false;
            });
        });
      },
      createActions(row) {
        return [
          {
            permission: ['base-data:product:category:add'],
            label: '新增子类目',
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
        ];
      },
    },
  });
</script>

<style scoped></style>
