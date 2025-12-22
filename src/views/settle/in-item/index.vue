<template>
  <div v-permission="['settle:in-item:query']">
    <page-wrapper content-full-height fixed-height>
      <!-- 数据列表 -->
      <vxe-grid
        id="SettleInItem"
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
              v-permission="['settle:in-item:add']"
              type="primary"
              :icon="h(PlusOutlined)"
              @click="$refs.addDialog.openDialog()"
              >新增</a-button
            >
            <a-button
              v-permission="['settle:in-item:export']"
              :icon="h(DownloadOutlined)"
              @click="exportList"
              >导出</a-button
            >
            <a-dropdown>
              <template #overlay>
                <a-menu @click="handleCommand">
                  <a-menu-item key="batchDelete" :icon="h(DeleteOutlined)"> 批量删除 </a-menu-item>
                </a-menu>
              </template>
              <a-button v-permission="['settle:in-item:delete']">更多<DownOutlined /></a-button>
            </a-dropdown>
          </a-space>
        </template>

        <!-- 操作 列自定义内容 -->
        <template #action_default="{ row }">
          <table-action outside :actions="createActions(row)" />
        </template>
      </vxe-grid>
    </page-wrapper>

    <!-- 新增窗口 -->
    <add ref="addDialog" @confirm="search" />

    <!-- 修改窗口 -->
    <modify :id="id" ref="updateDialog" @confirm="search" />

    <!-- 查看窗口 -->
    <detail :id="id" ref="viewDialog" />

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
  import Detail from './detail.vue';
  import {
    SearchOutlined,
    PlusOutlined,
    DownloadOutlined,
    CheckOutlined,
    DeleteOutlined,
    DownOutlined,
  } from '@ant-design/icons-vue';
  import * as api from '@/api/settle/in-item';
  import { isEmpty } from '@/utils/utils';
  import { createSuccess, createError } from '@/hooks/web/msg';
  import BatchHandler from '@/components/BatchHandler';

  export default defineComponent({
    name: 'SettleInItem',
    components: {
      Add,
      Modify,
      Detail,
      DownOutlined,
      BatchHandler,
    },
    setup() {
      return {
        h,
        SearchOutlined,
        PlusOutlined,
        DownloadOutlined,
        CheckOutlined,
        DeleteOutlined,
        isEmpty,
      };
    },
    data() {
      return {
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
          { field: 'code', title: '编号', width: 100 },
          { field: 'name', title: '名称', minWidth: 180 },
          { field: 'description', title: '备注', minWidth: 200 },
          { field: 'createBy', title: '创建人', width: 100 },
          { field: 'createTime', title: '创建时间', width: 170 },
          { field: 'updateBy', title: '修改人', width: 100 },
          { field: 'updateTime', title: '修改时间', width: 170 },
          { title: '操作', width: 120, fixed: 'right', slots: { default: 'action_default' } },
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
          createError('请选择要删除的收入项目！');
          return;
        }

        this.batchHandleDatas = records;

        this.$refs.batchDeleteHandlerDialog.openDialog();
      },
      exportList() {
        this.loading = true;
        api
          .exportList(this.buildQueryParams({}))
          .then(() => {
            createSuccess('创建导出任务成功，请前往“导出中心”进行下载。');
          })
          .finally(() => {
            this.loading = false;
          });
      },
      createActions(row) {
        return [
          {
            label: '查看',
            onClick: () => {
              this.id = row.id;
              this.$nextTick(() => this.$refs.viewDialog.openDialog());
            },
          },
          {
            permission: ['settle:in-item:modify'],
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
