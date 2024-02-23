<template>
  <div>
    <div v-permission="['stock:take:pre:query']">
      <page-wrapper content-full-height fixed-height>
        <!-- 数据列表 -->
        <vxe-grid
          id="PreTakeStockSheet"
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
              <j-form label-width="90px" @collapse="$refs.grid.refreshColumn()">
                <j-form-item label="单据号">
                  <a-input v-model:value="searchFormData.code" allow-clear />
                </j-form-item>
                <j-form-item label="仓库">
                  <store-center-selector v-model:value="searchFormData.scId" />
                </j-form-item>
                <j-form-item label="预先盘点状态">
                  <a-select
                    v-model:value="searchFormData.takeStatus"
                    placeholder="全部"
                    allow-clear
                  >
                    <a-select-option
                      v-for="item in $enums.PRE_TAKE_STOCK_SHEET_STATUS.values()"
                      :key="item.code"
                      :value="item.code"
                      >{{ item.desc }}</a-select-option
                    >
                  </a-select>
                </j-form-item>
                <j-form-item label="操作日期" :content-nest="false">
                  <div class="date-range-container">
                    <a-date-picker
                      v-model:value="searchFormData.updateTimeStart"
                      placeholder=""
                      value-format="YYYY-MM-DD 00:00:00"
                    />
                    <span class="date-split">至</span>
                    <a-date-picker
                      v-model:value="searchFormData.updateTimeEnd"
                      placeholder=""
                      value-format="YYYY-MM-DD 23:59:59"
                    />
                  </div>
                </j-form-item>
                <j-form-item label="操作人">
                  <user-selector v-model:value="searchFormData.updateBy" />
                </j-form-item>
              </j-form>
            </j-border>
          </template>
          <!-- 工具栏 -->
          <template #toolbar_buttons>
            <a-space>
              <a-button type="primary" :icon="h(SearchOutlined)" @click="search">查询</a-button>
              <a-button
                v-permission="['stock:take:pre:add']"
                type="primary"
                :icon="h(PlusOutlined)"
                @click="$router.push('/stock/take/pre/add')"
                >新增</a-button
              >
              <a-button
                v-permission="['stock:take:pre:delete']"
                danger
                :icon="h(DeleteOutlined)"
                @click="batchDelete"
                >批量删除</a-button
              >
              <a-button
                v-permission="['stock:take:pre:export']"
                :icon="h(DownloadOutlined)"
                @click="exportList"
                >导出</a-button
              >
            </a-space>
          </template>

          <!-- 操作 列自定义内容 -->
          <template #action_default="{ row }">
            <table-action outside :actions="createActions(row)" />
          </template>
        </vxe-grid>
      </page-wrapper>
    </div>

    <!-- 查看窗口 -->
    <detail :id="id" ref="viewDialog" />
  </div>
</template>

<script>
  import { h, defineComponent } from 'vue';
  import Detail from './detail.vue';
  import moment from 'moment';
  import {
    SearchOutlined,
    PlusOutlined,
    DeleteOutlined,
    DownloadOutlined,
  } from '@ant-design/icons-vue';
  import * as api from '@/api/sc/stock/take/pre';

  export default defineComponent({
    name: 'PreTakeStockSheet',
    components: {
      Detail,
    },
    setup() {
      return {
        h,
        SearchOutlined,
        PlusOutlined,
        DeleteOutlined,
        DownloadOutlined,
      };
    },
    data() {
      return {
        loading: false,
        // 当前行数据
        id: '',
        // 查询列表的查询条件
        searchFormData: {
          code: '',
          scId: '',
          takeStatus: undefined,
          updateBy: '',
          updateTimeStart: this.$utils.formatDateTime(
            this.$utils.getDateTimeWithMinTime(moment().subtract(1, 'M')),
          ),
          updateTimeEnd: this.$utils.formatDateTime(this.$utils.getDateTimeWithMaxTime(moment())),
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
          { field: 'code', title: '单据号', width: 180, sortable: true },
          { field: 'scCode', title: '仓库编号', width: 100 },
          { field: 'scName', title: '仓库名称', width: 120 },
          {
            field: 'takeStatus',
            title: '预先盘点状态',
            width: 120,
            formatter: ({ cellValue }) => {
              return this.$enums.PRE_TAKE_STOCK_SHEET_STATUS.getDesc(cellValue);
            },
          },
          { field: 'updateTime', title: '操作时间', width: 170, sortable: true },
          { field: 'updateBy', title: '操作人', width: 100 },
          { field: 'description', title: '备注', minWidth: 200 },
          { title: '操作', width: 150, fixed: 'right', slots: { default: 'action_default' } },
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
        return Object.assign({}, this.searchFormData);
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
      deleteRow(row) {
        this.$msg.createConfirm('对选中的预先盘点单执行删除操作？').then(() => {
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
      // 批量删除
      batchDelete() {
        const records = this.$refs.grid.getCheckboxRecords();
        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择要执行操作的预先盘点单！');
          return;
        }

        this.$msg.createConfirm('对选中的预先盘点单执行批量删除操作？').then(() => {
          this.loading = true;
          api
            .deleteByIds(records.map((item) => item.id))
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
              this.id = row.id;
              this.$nextTick(() => this.$refs.viewDialog.openDialog());
            },
          },
          {
            permission: ['stock:take:pre:modify'],
            label: '修改',
            onClick: () => {
              this.$router.push('/stock/take/pre/modify/' + row.id);
            },
          },
          {
            permission: ['stock:take:pre:delete'],
            label: '删除',
            color: 'error',
            onClick: () => {
              this.deleteRow(row);
            },
          },
        ];
      },
    },
  });
</script>
<style scoped></style>
