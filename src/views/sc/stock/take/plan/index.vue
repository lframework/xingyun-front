<template>
  <div>
    <div v-permission="['stock:take:plan:query']">
      <page-wrapper content-full-height fixed-height>
        <!-- 数据列表 -->
        <vxe-grid
          id="TakeStockPlan"
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
                <j-form-item label="单据号">
                  <a-input v-model:value="searchFormData.code" allow-clear />
                </j-form-item>
                <j-form-item label="仓库">
                  <store-center-selector v-model:value="searchFormData.scId" />
                </j-form-item>
                <j-form-item label="盘点状态">
                  <a-select
                    v-model:value="searchFormData.takeStatus"
                    placeholder="全部"
                    allow-clear
                  >
                    <a-select-option
                      v-for="item in $enums.TAKE_STOCK_PLAN_STATUS.values()"
                      :key="item.code"
                      :value="item.code"
                      >{{ item.desc }}</a-select-option
                    >
                  </a-select>
                </j-form-item>

                <j-form-item label="创建日期" :content-nest="false">
                  <div class="date-range-container">
                    <a-date-picker
                      v-model:value="searchFormData.createTimeStart"
                      placeholder=""
                      value-format="YYYY-MM-DD 00:00:00"
                    />
                    <span class="date-split">至</span>
                    <a-date-picker
                      v-model:value="searchFormData.createTimeEnd"
                      placeholder=""
                      value-format="YYYY-MM-DD 23:59:59"
                    />
                  </div>
                </j-form-item>

                <j-form-item label="创建人">
                  <user-selector v-model:value="searchFormData.createBy" />
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
                v-permission="['stock:take:plan:add']"
                type="primary"
                :icon="h(PlusOutlined)"
                @click="$refs.addDialog.openDialog()"
                >新增</a-button
              >
              <a-button
                v-permission="['stock:take:plan:export']"
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
    <!-- 新增窗口 -->
    <add ref="addDialog" @confirm="search" />

    <!-- 差异生成窗口 -->
    <diff :id="id" ref="diffDialog" @confirm="search" />

    <!-- 差异处理窗口 -->
    <handle :id="id" ref="handleDialog" @confirm="search" />

    <!-- 查看窗口 -->
    <detail :id="id" ref="viewDialog" />
  </div>
</template>

<script>
  import { h, defineComponent } from 'vue';
  import Add from './add.vue';
  import Diff from './diff.vue';
  import Handle from './handle.vue';
  import Detail from './detail.vue';
  import moment from 'moment';
  import { SearchOutlined, PlusOutlined, DownloadOutlined } from '@ant-design/icons-vue';
  import * as api from '@/api/sc/stock/take/plan';

  export default defineComponent({
    name: 'TakeStockPlan',
    components: {
      Add,
      Diff,
      Handle,
      Detail,
    },
    setup() {
      return {
        h,
        SearchOutlined,
        PlusOutlined,
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
          createBy: '',
          createTimeStart: this.$utils.formatDateTime(
            this.$utils.getDateTimeWithMinTime(moment().subtract(1, 'M')),
          ),
          createTimeEnd: this.$utils.formatDateTime(this.$utils.getDateTimeWithMaxTime(moment())),
          updateBy: '',
          updateTimeStart: '',
          updateTimeEnd: '',
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
          { type: 'seq', width: '45' },
          { field: 'code', title: '单据号', width: 180, sortable: true },
          { field: 'scCode', title: '仓库编号', width: 100 },
          { field: 'scName', title: '仓库名称', width: 120 },
          {
            field: 'takeType',
            title: '盘点类别',
            width: 100,
            formatter: ({ cellValue }) => {
              return this.$enums.TAKE_STOCK_PLAN_TYPE.getDesc(cellValue);
            },
          },
          { field: 'bizName', title: '盘点内容', width: 120 },
          {
            field: 'takeStatus',
            title: '盘点状态',
            width: 120,
            formatter: ({ cellValue }) => {
              return this.$enums.TAKE_STOCK_PLAN_STATUS.getDesc(cellValue);
            },
          },
          { field: 'createTime', title: '创建时间', width: 170, sortable: true },
          { field: 'createBy', title: '创建人', width: 100 },
          { field: 'updateTime', title: '操作时间', width: 170, sortable: true },
          { field: 'updateBy', title: '操作人', width: 100 },
          { field: 'description', title: '备注', minWidth: 200 },
          { title: '操作', width: 180, fixed: 'right', slots: { default: 'action_default' } },
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
      cancelRow(row) {
        this.$msg.createConfirm('对选中的盘点任务执行作废操作？').then(() => {
          this.loading = true;
          api
            .cancel(row.id)
            .then((res) => {
              this.$msg.createSuccess('作废成功！');
              this.search();
            })
            .finally(() => {
              this.loading = false;
            });
        });
      },
      deleteRow(row) {
        this.$msg
          .createConfirm('对选中的预先盘点单执行删除操作？注：关联此盘点任务的库存盘点单均会删除。')
          .then(() => {
            this.loading = true;
            api
              .deleteById(row.id)
              .then((res) => {
                this.$msg.createSuccess('删除成功！');
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
            permission: ['stock:take:plan:create-diff'],
            label: '差异生成',
            ifShow: () => {
              return this.$enums.TAKE_STOCK_PLAN_STATUS.CREATED.equalsCode(row.takeStatus);
            },
            onClick: () => {
              this.id = row.id;
              this.$nextTick(() => this.$refs.diffDialog.openDialog());
            },
          },
          {
            permission: ['stock:take:plan:handle-diff'],
            label: '差异处理',
            ifShow: () => {
              return this.$enums.TAKE_STOCK_PLAN_STATUS.DIFF_CREATED.equalsCode(row.takeStatus);
            },
            onClick: () => {
              this.id = row.id;
              this.$nextTick(() => this.$refs.handleDialog.openDialog());
            },
          },
          {
            permission: ['stock:take:plan:cancel'],
            label: '作废',
            color: 'error',
            ifShow: () => {
              return (
                this.$enums.TAKE_STOCK_PLAN_STATUS.CREATED.equalsCode(row.takeStatus) ||
                this.$enums.TAKE_STOCK_PLAN_STATUS.DIFF_CREATED.equalsCode(row.takeStatus)
              );
            },
            onClick: () => {
              this.cancelRow(row);
            },
          },
          {
            permission: ['stock:take:plan:delete'],
            label: '作废',
            color: 'error',
            ifShow: () => {
              return this.$enums.TAKE_STOCK_PLAN_STATUS.CANCELED.equalsCode(row.takeStatus);
            },
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
