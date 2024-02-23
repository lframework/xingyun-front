<template>
  <div v-permission="['settle:out-item:query']">
    <page-wrapper content-full-height fixed-height>
      <!-- 数据列表 -->
      <vxe-grid
        id="SettleOutItem"
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
              <j-form-item label="编号" :span="6">
                <a-input v-model:value="searchFormData.code" allow-clear />
              </j-form-item>
              <j-form-item label="名称" :span="6">
                <a-input v-model:value="searchFormData.name" allow-clear />
              </j-form-item>
              <j-form-item label="状态" :span="6">
                <a-select v-model:value="searchFormData.available" placeholder="全部" allow-clear>
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
              v-permission="['settle:out-item:add']"
              type="primary"
              :icon="h(PlusOutlined)"
              @click="$refs.addDialog.openDialog()"
              >新增</a-button
            >
            <a-button
              v-permission="['settle:out-item:export']"
              :icon="h(DownloadOutlined)"
              @click="exportList"
              >导出</a-button
            >
            <a-dropdown v-permission="['settle:out-item:modify']">
              <a-menu #overlay @click="handleCommand">
                <a-menu-item key="batchEnable" :icon="h(CheckOutlined)"> 批量启用 </a-menu-item>
                <a-menu-item key="batchUnable" :icon="h(StopOutlined)"> 批量停用 </a-menu-item>
              </a-menu>
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

    <!-- 新增窗口 -->
    <add ref="addDialog" @confirm="search" />

    <!-- 修改窗口 -->
    <modify :id="id" ref="updateDialog" @confirm="search" />

    <!-- 查看窗口 -->
    <detail :id="id" ref="viewDialog" />
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
    StopOutlined,
    DownOutlined,
  } from '@ant-design/icons-vue';
  import * as api from '@/api/settle/out-item';

  export default defineComponent({
    name: 'SettleOutItem',
    components: {
      Add,
      Modify,
      Detail,
      DownOutlined,
    },
    setup() {
      return {
        h,
        SearchOutlined,
        PlusOutlined,
        DownloadOutlined,
        CheckOutlined,
        StopOutlined,
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
          { field: 'code', title: '编号', width: 100 },
          { field: 'name', title: '名称', minWidth: 180 },
          { field: 'description', title: '备注', minWidth: 200 },
          { field: 'available', title: '状态', width: 80, slots: { default: 'available_default' } },
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
        if (key === 'batchEnable') {
          this.batchEnable();
        } else if (key === 'batchUnable') {
          this.batchUnable();
        }
      },
      // 批量停用
      batchUnable() {
        const records = this.$refs.grid.getCheckboxRecords();

        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择要停用的支出项目！');
          return;
        }

        this.$msg.createConfirm('是否确定停用选择的支出项目？').then(() => {
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
      // 批量启用
      batchEnable() {
        const records = this.$refs.grid.getCheckboxRecords();

        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择要启用的支出项目！');
          return;
        }

        this.$msg.createConfirm('是否确定启用选择的支出项目？').then(() => {
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
            permission: ['settle:out-item:modify'],
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
