<template>
  <div v-permission="['system:menu:query']">
    <page-wrapper
      title="菜单管理"
      content="修改内置菜单可能会导致系统异常，请谨慎修改。"
      content-full-height
      fixed-height
    >
      <vxe-grid
        id="Menu"
        ref="grid"
        resizable
        show-overflow
        highlight-hover-row
        keep-source
        row-id="id"
        :tree-config="{}"
        :export-config="{}"
        :custom-config="{}"
        :proxy-config="tableProxy"
        :columns="tableColumn"
        :toolbar-config="toolBarConfig"
        :loading="loading"
        height="auto"
        @cell-dblclick="({ row }) => doDetail(row)"
      >
        <template #icon_default="{ row }">
          <icon
            v-if="
              !$utils.isEmpty(row.icon) &&
              ($enums.MENU_DISPLAY.CATALOG.equalsCode(row.display) ||
                $enums.MENU_DISPLAY.FUNCTION.equalsCode(row.display))
            "
            :icon="row.icon"
          />
        </template>

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
            <j-form label-width="60px" @collapse="$refs.grid.refreshColumn()">
              <j-form-item label="标题" :span="6">
                <a-input v-model:value="searchFormData.searchMenuName" allow-clear />
              </j-form-item>
              <j-form-item label="状态" :span="6">
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
            <a-button type="primary" :icon="h(PlusOutlined)" @click="$refs.addDialog.openDialog()"
              >新增</a-button
            >
            <a-dropdown>
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

    <!-- 详情窗口 -->
    <detail :id="id" ref="viewDialog" />
  </div>
</template>

<script>
  import { defineComponent, h } from 'vue';
  import Add from './add.vue';
  import Modify from './modify.vue';
  import Detail from './detail.vue';
  import * as api from '@/api/system/menu';
  import {
    CheckOutlined,
    DownOutlined,
    PlusOutlined,
    SearchOutlined,
    StopOutlined,
  } from '@ant-design/icons-vue';

  export default defineComponent({
    name: 'Menu',
    components: {
      Add,
      Modify,
      Detail,
      DownOutlined,
    },
    setup() {
      return {
        CheckOutlined,
        StopOutlined,
        SearchOutlined,
        PlusOutlined,
        h,
      };
    },
    data() {
      return {
        loading: false,
        id: '',
        searchFormData: {
          searchMenuName: '',
          available: true,
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

                res = this.handleSearch();

                return res;
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
          { field: 'title', title: '标题', minWidth: 160, treeNode: true },
          { field: 'icon', title: '图标', width: 50, slots: { default: 'icon_default' } },
          { field: 'display', title: '类型', width: 80, slots: { default: 'menuDisplay_default' } },
          { field: 'permission', title: '权限', width: 220 },
          {
            field: 'isSpecial',
            title: '是否内置',
            width: 80,
            formatter: ({ cellValue }) => {
              return cellValue ? '是' : '否';
            },
          },
          { field: 'available', title: '状态', width: 80, slots: { default: 'available_default' } },
          { field: 'description', minWidth: 100, title: '备注' },
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
        const filterName = this.$utils.toString(this.searchFormData.searchMenuName).trim();
        const filterAvailable = this.searchFormData.available;
        const isFilterName = !this.$utils.isEmpty(filterName);
        const isFilterAvailable = !this.$utils.isEmpty(filterAvailable);
        if (isFilterName || isFilterAvailable) {
          const options = { key: 'id', parentKey: 'parentId', children: 'children', strict: true };
          let tableData = this.$utils.searchTree(
            this.originData,
            (item) => {
              let filterResult = true;
              if (isFilterName) {
                filterResult &= this.$utils.toString(item['title']).indexOf(filterName) > -1;
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
          this.$msg.createError('请选择要停用的菜单！');
          return;
        }

        this.$msg
          .createConfirm(
            records.filter((item) => item.isSpecial).length > 0
              ? '选择的菜单包含内置菜单，是否确定停用？注：停用内置菜单可能会导致系统功能异常，请谨慎操作'
              : '是否确定停用选择的菜单？',
          )
          .then(() => {
            this.loading = true;
            const ids = records.map((t) => t.id);
            api
              .batchUnable(ids)
              .then(() => {
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
          this.$msg.createError('请选择要启用的菜单！');
          return;
        }

        this.$msg.createConfirm('是否确定启用选择的菜单？').then(() => {
          this.loading = true;
          const ids = records.map((t) => t.id);
          api
            .batchEnable(ids)
            .then(() => {
              this.$msg.createSuccess('启用成功！');
              this.search();
            })
            .finally(() => {
              this.loading = false;
            });
        });
      },
      // 删除
      deleteRow(row) {
        this.$msg
          .createConfirm(
            row.isSpecial
              ? '当前菜单为内置菜单，是否确定删除？注：删除内置菜单可能会导致系统功能异常，请谨慎操作'
              : '是否确定删除该菜单？',
          )
          .then(() => {
            this.loading = true;
            api
              .deleteById(row.id)
              .then(() => {
                this.$msg.createSuccess('删除成功！');
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
            label: '查看',
            onClick: () => {
              this.doDetail(row);
            },
          },
          {
            label: '修改',
            onClick: () => {
              this.id = row.id;
              this.$refs.updateDialog.openDialog();
            },
          },
          {
            label: '删除',
            color: 'error',
            onClick: () => {
              this.deleteRow(row);
            },
          },
        ];
      },
      doDetail(row) {
        this.id = row.id;
        this.$refs.viewDialog.openDialog();
      },
    },
  });
</script>

<style scoped></style>
