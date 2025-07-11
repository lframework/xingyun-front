<template>
  <div>
    <div v-show="visible">
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
              id="CustomList"
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
                  <j-form bordered label-width="60px" @collapse="$refs.grid.refreshColumn()">
                    <j-form-item label="名称">
                      <a-input v-model:value="searchFormData.name" allow-clear />
                    </j-form-item>
                    <j-form-item label="状态">
                      <a-select
                        v-model:value="searchFormData.available"
                        placeholder="全部"
                        allow-clear
                      >
                        <a-select-option
                          v-for="item in $enums.AVAILABLE.values()"
                          :key="item.code"
                          :value="item.code"
                          >{{ item.desc }}</a-select-option
                        >
                      </a-select>
                    </j-form-item>
                  </j-form>
                </j-border>
              </template>
              <!-- 工具栏 -->
              <template #toolbar_buttons>
                <a-space>
                  <a-button type="primary" :icon="h(SearchOutlined)" @click="search">查询</a-button>
                  <a-button
                    type="primary"
                    :icon="h(PlusOutlined)"
                    @click="$refs.addDialog.openDialog()"
                    >新增</a-button
                  >
                  <a-button danger :icon="h(DeleteOutlined)" @click="batchDelete"
                    >批量删除</a-button
                  >
                  <a-dropdown>
                    <template #overlay>
                      <a-menu @click="handleCommand">
                        <a-menu-item key="batchEnable">
                          <template #icon><CheckOutlined /></template>批量启用
                        </a-menu-item>
                        <a-menu-item key="batchUnable">
                          <template #icon><StopOutlined /></template>批量停用
                        </a-menu-item>
                      </a-menu>
                    </template>
                    <a-button>更多<DownOutlined /></a-button>
                  </a-dropdown>
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

      <!-- 查看窗口 -->
      <detail :id="id" ref="viewDialog" />

      <!-- 批量操作 -->
      <batch-handler
        ref="batchUnableHandlerDialog"
        :table-column="[{ field: 'name', title: '名称', minWidth: 180 }]"
        title="批量停用"
        :tableData="batchHandleDatas"
        :handle-fn="doBatchUnable"
        @confirm="search"
      />
      <batch-handler
        ref="batchEnableHandlerDialog"
        :table-column="[{ field: 'name', title: '名称', minWidth: 180 }]"
        title="批量启用"
        :tableData="batchHandleDatas"
        :handle-fn="doBatchEnable"
        @confirm="search"
      />
      <batch-handler
        ref="batchDeleteHandlerDialog"
        :table-column="[{ field: 'name', title: '名称', minWidth: 180 }]"
        title="批量删除"
        :tableData="batchHandleDatas"
        :handle-fn="doBatchDelete"
        @confirm="search"
      />
    </div>
  </div>
</template>

<script>
  import { defineComponent, h } from 'vue';
  import Add from './add.vue';
  import Modify from './modify.vue';
  import Detail from './detail.vue';
  import CategoryTree from './category-tree.vue';
  import {
    SearchOutlined,
    PlusOutlined,
    CheckOutlined,
    StopOutlined,
    DeleteOutlined,
    DownOutlined,
  } from '@ant-design/icons-vue';
  import * as api from '@/api/development/custom/list';

  export default defineComponent({
    name: 'CustomList',
    // 使用组件
    components: {
      Add,
      Modify,
      Detail,
      CategoryTree,
      CheckOutlined,
      StopOutlined,
      DownOutlined,
    },
    setup() {
      return {
        h,
        SearchOutlined,
        PlusOutlined,
        DeleteOutlined,
      };
    },
    data() {
      return {
        // 当前行数据
        id: '',
        // 是否显示加载框
        loading: false,
        visible: true,
        // 查询列表的查询条件
        searchFormData: {
          available: this.$enums.AVAILABLE.ENABLE.code,
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
          { field: 'name', title: '名称', minWidth: 180 },
          { field: 'categoryName', title: '分类', width: 120 },
          { field: 'available', title: '状态', width: 80, slots: { default: 'available_default' } },
          { field: 'description', title: '备注', minWidth: 200 },
          { field: 'createBy', title: '创建人', width: 100 },
          { field: 'createTime', title: '创建时间', width: 170 },
          { title: '操作', width: 160, fixed: 'right', slots: { default: 'action_default' } },
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
            query: ({ page }) => {
              return api.query(this.buildQueryParams(page));
            },
          },
        },
        batchHandleDatas: [],
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
      buildQueryParams(page) {
        return Object.assign(
          {
            pageIndex: page.currentPage,
            pageSize: page.pageSize,
          },
          this.buildSearchFormData(),
        );
      },
      // 查询前构建具体的查询参数
      buildSearchFormData() {
        return Object.assign({}, this.searchFormData);
      },
      handleCommand({ key }) {
        if (key === 'batchEnable') {
          this.batchEnable();
        } else if (key === 'batchUnable') {
          this.batchUnable();
        }
      },
      doBatchUnable(row) {
        return api.unable(row.id);
      },
      // 批量停用
      batchUnable() {
        const records = this.$refs.grid.getCheckboxRecords();

        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择要停用的自定义列表！');
          return;
        }

        this.batchHandleDatas = records;

        this.$refs.batchUnableHandlerDialog.openDialog();
      },
      doBatchEnable(row) {
        return api.enable(row.id);
      },
      // 批量启用
      batchEnable() {
        const records = this.$refs.grid.getCheckboxRecords();

        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择要启用的自定义列表！');
          return;
        }

        this.batchHandleDatas = records;

        this.$refs.batchEnableHandlerDialog.openDialog();
      },
      // 删除
      deleteRow(row) {
        this.$msg.createConfirm('是否确定删除该自定义列表？').then(() => {
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
      doBatchDelete(row) {
        return api.batchDelete(row.id);
      },
      // 批量删除
      batchDelete() {
        const records = this.$refs.grid.getCheckboxRecords();

        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择要删除的自定义列表！');
          return;
        }

        this.batchHandleDatas = records;

        this.$refs.batchDeleteHandlerDialog.openDialog();
      },
      createActions(row) {
        return [
          {
            label: '查看',
            onClick: () => {
              this.id = row.id;
              this.$nextTick(() => {
                this.$refs.viewDialog.openDialog();
              });
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
            danger: true,
            onClick: () => {
              this.deleteRow(row);
            },
          },
        ];
      },
    },
  });
</script>
