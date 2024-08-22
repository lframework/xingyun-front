<template>
  <div v-permission="['system:dic:query']">
    <a-row>
      <a-col :span="4">
        <page-wrapper content-full-height fixed-height content-class="!mr-0">
          <category-tree style="height: 100%" @change="(e) => doSearch(e)" />
        </page-wrapper>
      </a-col>
      <a-col :span="20">
        <page-wrapper content-full-height fixed-height>
          <!-- 数据列表 -->
          <vxe-grid
            id="SysDataDic"
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
                  v-permission="['system:dic:add']"
                  type="primary"
                  :icon="h(PlusOutlined)"
                  @click="$refs.addDialog.openDialog()"
                  >新增</a-button
                >
              </a-space>
            </template>

            <!-- 状态 列自定义内容 -->
            <template #available_default="{ row }">
              <available-tag :available="row.available" />
            </template>

            <!-- 操作 列自定义内容 -->
            <template #action_default="{ row }">
              <table-action outside :actions="createActions(row)" />
            </template>
          </vxe-grid>
        </page-wrapper>
      </a-col>
    </a-row>

    <!-- 新增窗口 -->
    <add ref="addDialog" @confirm="search" />

    <!-- 修改窗口 -->
    <modify :id="id" ref="updateDialog" @confirm="search" />

    <!-- 规格值窗口 -->
    <item ref="itemDialog" :dic-id="id" />
  </div>
</template>

<script>
  import { h, defineComponent } from 'vue';
  import Add from './add.vue';
  import Modify from './modify.vue';
  import Item from './item/index.vue';
  import CategoryTree from './category-tree.vue';
  import { SearchOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import * as api from '@/api/system/dic';

  export default defineComponent({
    name: 'SysDataDic',
    components: {
      Add,
      Modify,
      Item,
      CategoryTree,
    },
    setup() {
      return {
        h,
        SearchOutlined,
        PlusOutlined,
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
          { type: 'seq', width: 50 },
          { field: 'code', title: '编号', width: 120, sortable: true },
          { field: 'name', title: '名称', minWidth: 160, sortable: true },
          { field: 'categoryName', title: '分类', width: 140 },
          { title: '操作', width: 210, fixed: 'right', slots: { default: 'action_default' } },
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
      doSearch(categoryId) {
        if (!this.$utils.isEmpty(categoryId)) {
          if (this.$utils.isEqualWithStr(0, categoryId)) {
            this.searchFormData.categoryId = '';
          } else {
            this.searchFormData.categoryId = categoryId;
          }
        } else {
          this.searchFormData.categoryId = '';
        }

        this.search();
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
        return {
          ...this.searchFormData,
        };
      },
      createActions(row) {
        return [
          {
            label: '字典值管理',
            ifShow: !this.$enums.COLUMN_TYPE.CUSTOM.equalsCode(row.columnType),
            onClick: () => {
              this.id = row.id;
              this.$nextTick(() => this.$refs.itemDialog.openDialog());
            },
          },
          {
            permission: ['system:dic:modify'],
            label: '修改',
            onClick: () => {
              this.id = row.id;
              this.$nextTick(() => this.$refs.updateDialog.openDialog());
            },
          },
          {
            permission: ['system:dic:delete'],
            color: 'error',
            label: '删除',
            onClick: () => {
              this.deleteRow(row);
            },
          },
        ];
      },
      deleteRow(row) {
        this.$msg.createConfirm('是否确认删除此数据字典？').then(() => {
          api.deleteById(row.id).then(() => {
            this.$msg.createSuccess('删除成功！');
            this.search();
          });
        });
      },
    },
  });
</script>
<style scoped></style>
