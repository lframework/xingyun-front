<template>
  <div>
    <div v-permission="['stock:take:sheet:query']">
      <page-wrapper content-full-height fixed-height>
        <!-- 数据列表 -->
        <vxe-grid
          id="TakeStockSheet"
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
              <j-form label-width="110px" @collapse="$refs.grid.refreshColumn()">
                <j-form-item label="单据号">
                  <a-input v-model:value="searchFormData.code" allow-clear />
                </j-form-item>
                <j-form-item label="关联盘点任务号">
                  <a-input v-model:value="searchFormData.planCode" allow-clear />
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
                <j-form-item label="状态">
                  <a-select v-model:value="searchFormData.status" placeholder="全部" allow-clear>
                    <a-select-option
                      v-for="item in $enums.TAKE_STOCK_SHEET_STATUS.values()"
                      :key="item.code"
                      :value="item.code"
                      >{{ item.desc }}</a-select-option
                    >
                  </a-select>
                </j-form-item>
                <j-form-item label="操作时间" :content-nest="false">
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
                <j-form-item label="审核时间" :content-nest="false">
                  <div class="date-range-container">
                    <a-date-picker
                      v-model:value="searchFormData.approveTimeStart"
                      placeholder=""
                      value-format="YYYY-MM-DD 00:00:00"
                    />
                    <span class="date-split">至</span>
                    <a-date-picker
                      v-model:value="searchFormData.approveTimeEnd"
                      placeholder=""
                      value-format="YYYY-MM-DD 23:59:59"
                    />
                  </div>
                </j-form-item>
                <j-form-item label="审核人">
                  <user-selector v-model:value="searchFormData.approveBy" />
                </j-form-item>
              </j-form>
            </j-border>
          </template>
          <!-- 工具栏 -->
          <template #toolbar_buttons>
            <a-space>
              <a-button type="primary" :icon="h(SearchOutlined)" @click="search">查询</a-button>
              <a-button
                v-permission="['stock:take:sheet:add']"
                type="primary"
                :icon="h(PlusOutlined)"
                @click="openChildPage('/stock/take/sheet/add')"
                >新增</a-button
              >
              <a-button
                v-permission="['stock:take:sheet:approve']"
                :icon="h(CheckOutlined)"
                @click="batchApprovePass"
                >审核通过</a-button
              >
              <a-button
                v-permission="['stock:take:sheet:approve']"
                :icon="h(CloseOutlined)"
                @click="batchApproveRefuse"
                >审核拒绝</a-button
              >
              <a-button
                v-permission="['stock:take:sheet:delete']"
                danger
                :icon="h(DeleteOutlined)"
                @click="batchDelete"
                >批量删除</a-button
              >
              <a-button
                v-permission="['stock:take:sheet:export']"
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

    <approve-refuse ref="approveRefuseDialog" @confirm="doApproveRefuse" />

    <!-- 批量操作 -->
    <batch-handler
      ref="batchApprovePassHandlerDialog"
      :table-column="[
        { field: 'code', title: '单据号', width: 180 },
        { field: 'planCode', title: '关联盘点任务', width: 180 },
        { field: 'scCode', title: '仓库编号', width: 100 },
        { field: 'scName', title: '仓库名称', width: 120 },
      ]"
      title="审核通过"
      :tableData="batchHandleDatas"
      :handle-fn="doBatchApprovePass"
      @confirm="search"
    />
    <batch-handler
      ref="batchApproveRefuseHandlerDialog"
      :table-column="[
        { field: 'code', title: '单据号', width: 180 },
        { field: 'planCode', title: '关联盘点任务', width: 180 },
        { field: 'scCode', title: '仓库编号', width: 100 },
        { field: 'scName', title: '仓库名称', width: 120 },
      ]"
      title="审核拒绝"
      :tableData="batchHandleDatas"
      :handle-fn="doBatchApproveRefuse"
      @confirm="search"
    />
    <batch-handler
      ref="batchDeleteHandlerDialog"
      :table-column="[
        { field: 'code', title: '单据号', width: 180 },
        { field: 'planCode', title: '关联盘点任务', width: 180 },
        { field: 'scCode', title: '仓库编号', width: 100 },
        { field: 'scName', title: '仓库名称', width: 120 },
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
  import Detail from './detail.vue';
  import moment from 'moment';
  import ApproveRefuse from '@/components/ApproveRefuse';
  import {
    SearchOutlined,
    PlusOutlined,
    CheckOutlined,
    CloseOutlined,
    DeleteOutlined,
    DownloadOutlined,
  } from '@ant-design/icons-vue';
  import * as api from '@/api/sc/stock/take/sheet';
  import { multiplePageMix } from '@/mixins/multiplePageMix';

  export default defineComponent({
    name: 'TakeStockSheet',
    components: {
      Detail,
      ApproveRefuse,
    },
    mixins: [multiplePageMix],
    setup() {
      return {
        h,
        SearchOutlined,
        PlusOutlined,
        CheckOutlined,
        CloseOutlined,
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
          planCode: '',
          scId: '',
          takeStatus: undefined,
          status: undefined,
          updateBy: '',
          updateTimeStart: this.$utils.formatDateTime(
            this.$utils.getDateTimeWithMinTime(moment().subtract(1, 'M')),
          ),
          updateTimeEnd: this.$utils.formatDateTime(this.$utils.getDateTimeWithMaxTime(moment())),
          approveBy: '',
          approveTimeStart: '',
          approveTimeEnd: '',
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
          { field: 'planCode', title: '关联盘点任务', width: 180 },
          {
            field: 'takeStatus',
            title: '盘点状态',
            width: 110,
            formatter: ({ cellValue }) => {
              return this.$enums.TAKE_STOCK_PLAN_STATUS.getDesc(cellValue);
            },
          },
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
          {
            field: 'status',
            title: '状态',
            width: 100,
            formatter: ({ cellValue }) => {
              return this.$enums.TAKE_STOCK_SHEET_STATUS.getDesc(cellValue);
            },
          },
          { field: 'updateTime', title: '操作时间', width: 170, sortable: true },
          { field: 'updateBy', title: '操作人', width: 100 },
          { field: 'approveTime', title: '审核时间', width: 170, sortable: true },
          { field: 'approveBy', title: '审核人', width: 100 },
          { field: 'description', title: '备注', minWidth: 200 },
          { title: '操作', width: 200, fixed: 'right', slots: { default: 'action_default' } },
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
        batchHandleDatas: [],
        batchRefuseReason: '',
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
      // 取消审核
      cancelApprove(id) {
        this.$msg.createConfirm('确认对此库存盘点单进行取消审核操作？').then(() => {
          this.loading = true;
          api
            .cancelApprovePass(id)
            .then((res) => {
              this.$msg.createSuccess('取消审核成功！');
              this.search();
            })
            .finally(() => {
              this.loading = false;
            });
        });
      },
      doBatchApprovePass(row) {
        return api.batchApprovePass({
          id: row.id,
        });
      },
      batchApprovePass() {
        const records = this.$refs.grid.getCheckboxRecords();
        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择要执行操作的库存盘点单！');
          return;
        }

        for (let i = 0; i < records.length; i++) {
          const record = records[i];
          if (this.$enums.TAKE_STOCK_SHEET_STATUS.APPROVE_PASS.equalsCode(record.status)) {
            this.$msg.createError('第' + (i + 1) + '个库存盘点单已审核通过，不允许继续执行审核！');
            return;
          }

          const takeStatus = this.$enums.TAKE_STOCK_PLAN_STATUS.getByCode(record.takeStatus);
          if (takeStatus !== this.$enums.TAKE_STOCK_PLAN_STATUS.CREATED) {
            this.$msg.createError(
              '第' +
                (i + 1) +
                '个库存盘点单的盘点状态为【' +
                takeStatus.desc +
                '】，不允许继续执行审核！',
            );
            return;
          }
        }

        this.batchHandleDatas = records;

        this.$refs.batchApprovePassHandlerDialog.openDialog();
      },
      batchApproveRefuse() {
        const records = this.$refs.grid.getCheckboxRecords();
        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择要执行操作的库存盘点单！');
          return;
        }

        for (let i = 0; i < records.length; i++) {
          const record = records[i];
          if (this.$enums.TAKE_STOCK_SHEET_STATUS.APPROVE_PASS.equalsCode(record.status)) {
            this.$msg.createError('第' + (i + 1) + '个库存盘点单已审核通过，不允许继续执行审核！');
            return;
          }

          if (this.$enums.TAKE_STOCK_SHEET_STATUS.APPROVE_REFUSE.equalsCode(record.status)) {
            this.$msg.createError('第' + (i + 1) + '个库存盘点单已审核拒绝，不允许继续执行审核！');
            return;
          }

          const takeStatus = this.$enums.TAKE_STOCK_PLAN_STATUS.getByCode(record.takeStatus);
          if (takeStatus !== this.$enums.TAKE_STOCK_PLAN_STATUS.CREATED) {
            this.$msg.createError(
              '第' +
                (i + 1) +
                '个库存盘点单的盘点状态为【' +
                takeStatus.desc +
                '】，不允许继续执行审核！',
            );
            return;
          }
        }

        this.$refs.approveRefuseDialog.openDialog();
      },
      doBatchApproveRefuse(row) {
        return api.batchApproveRefuse({
          id: row.id,
          refuseReason: this.batchRefuseReason,
        });
      },
      doApproveRefuse(reason) {
        this.batchHandleDatas = this.$refs.grid.getCheckboxRecords();
        this.batchRefuseReason = reason;

        this.$refs.batchApproveRefuseHandlerDialog.openDialog();
      },
      // 删除
      deleteRow(id) {
        this.$msg.createConfirm('对选中的库存盘点单执行删除操作？').then(() => {
          this.loading = true;
          api
            .deleteById(id)
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
      batchDelete() {
        const records = this.$refs.grid.getCheckboxRecords();
        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择要执行操作的库存盘点单！');
          return;
        }

        for (let i = 0; i < records.length; i++) {
          const record = records[i];
          if (this.$enums.TAKE_STOCK_SHEET_STATUS.APPROVE_PASS.equalsCode(record.status)) {
            this.$msg.createError('第' + (i + 1) + '个库存盘点单已审核通过，不允许执行删除操作！');
            return;
          }
        }

        this.batchHandleDatas = records;

        this.$refs.batchDeleteHandlerDialog.openDialog();
      },
      exportList() {
        this.loading = true;
        api
          .exportList(this.buildQueryParams({}))
          .then(() => {
            this.$msg.createSuccess('创建导出任务成功，请前往“导出中心”进行下载。');
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
            permission: ['stock:take:sheet:modify'],
            label: '修改',
            ifShow: () => {
              return (
                (this.$enums.TAKE_STOCK_SHEET_STATUS.CREATED.equalsCode(row.status) ||
                  this.$enums.TAKE_STOCK_SHEET_STATUS.APPROVE_REFUSE.equalsCode(row.status)) &&
                this.$enums.TAKE_STOCK_PLAN_STATUS.CREATED.equalsCode(row.takeStatus)
              );
            },
            onClick: () => {
              this.openChildPage('/stock/take/sheet/modify/' + row.id);
            },
          },
          {
            permission: ['stock:take:sheet:approve'],
            label: '审核',
            ifShow: () => {
              return (
                (this.$enums.TAKE_STOCK_SHEET_STATUS.CREATED.equalsCode(row.status) ||
                  this.$enums.TAKE_STOCK_SHEET_STATUS.APPROVE_REFUSE.equalsCode(row.status)) &&
                this.$enums.TAKE_STOCK_PLAN_STATUS.CREATED.equalsCode(row.takeStatus)
              );
            },
            onClick: () => {
              this.openChildPage('/stock/take/sheet/approve/' + row.id);
            },
          },
          {
            permission: ['stock:take:sheet:cancel-approve'],
            label: '取消审核',
            ifShow: () => {
              return (
                this.$enums.TAKE_STOCK_SHEET_STATUS.APPROVE_PASS.equalsCode(row.status) &&
                this.$enums.TAKE_STOCK_PLAN_STATUS.CREATED.equalsCode(row.takeStatus)
              );
            },
            onClick: () => {
              this.cancelApprove(row.id);
            },
          },
          {
            permission: ['stock:take:sheet:delete'],
            label: '删除',
            danger: true,
            ifShow: () => {
              return (
                this.$enums.TAKE_STOCK_SHEET_STATUS.CREATED.equalsCode(row.status) ||
                this.$enums.TAKE_STOCK_SHEET_STATUS.APPROVE_REFUSE.equalsCode(row.status)
              );
            },
            onClick: () => {
              this.deleteRow(row.id);
            },
          },
        ];
      },
      onRefreshPage() {
        this.search();
      },
    },
  });
</script>
<style scoped></style>
