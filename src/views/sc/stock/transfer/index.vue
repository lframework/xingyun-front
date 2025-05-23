<template>
  <div>
    <div v-permission="['stock:sc-transfer:query']">
      <page-wrapper content-full-height fixed-height>
        <!-- 数据列表 -->
        <vxe-grid
          id="ScTransferOrder"
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
                <j-form-item label="单据号">
                  <a-input v-model:value="searchFormData.code" allow-clear />
                </j-form-item>
                <j-form-item label="转出仓库">
                  <store-center-selector v-model:value="searchFormData.sourceScId" />
                </j-form-item>
                <j-form-item label="转入仓库">
                  <store-center-selector v-model:value="searchFormData.targetScId" />
                </j-form-item>
                <j-form-item label="状态">
                  <a-select v-model:value="searchFormData.status" placeholder="全部" allow-clear>
                    <a-select-option
                      v-for="item in $enums.SC_TRANSFER_ORDER_STATUS.values()"
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
                <j-form-item label="审核日期" :content-nest="false">
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
                v-permission="['stock:sc-transfer:add']"
                type="primary"
                :icon="h(PlusOutlined)"
                @click="openChildPage('/stock/stock-transfer/add')"
                >新增</a-button
              >
              <a-button
                v-permission="['stock:sc-transfer:approve']"
                :icon="h(CheckOutlined)"
                @click="batchApprovePass"
                >审核通过</a-button
              >
              <a-button
                v-permission="['stock:sc-transfer:approve']"
                :icon="h(CloseOutlined)"
                @click="batchApproveRefuse"
                >审核拒绝</a-button
              >
              <a-button
                v-permission="['stock:sc-transfer:delete']"
                danger
                :icon="h(DeleteOutlined)"
                @click="batchDelete"
                >批量删除</a-button
              >
              <a-button
                v-permission="['stock:sc-transfer:export']"
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
        { field: 'sourceScCode', title: '转出仓库编号', width: 120 },
        { field: 'sourceScName', title: '转出仓库名称', width: 120 },
        { field: 'targetScCode', title: '转入仓库编号', width: 120 },
        { field: 'targetScName', title: '转入仓库名称', width: 120 },
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
        { field: 'sourceScCode', title: '转出仓库编号', width: 120 },
        { field: 'sourceScName', title: '转出仓库名称', width: 120 },
        { field: 'targetScCode', title: '转入仓库编号', width: 120 },
        { field: 'targetScName', title: '转入仓库名称', width: 120 },
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
        { field: 'sourceScCode', title: '转出仓库编号', width: 120 },
        { field: 'sourceScName', title: '转出仓库名称', width: 120 },
        { field: 'targetScCode', title: '转入仓库编号', width: 120 },
        { field: 'targetScName', title: '转入仓库名称', width: 120 },
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
  import ApproveRefuse from '@/components/ApproveRefuse';
  import moment from 'moment';
  import {
    SearchOutlined,
    PlusOutlined,
    CheckOutlined,
    CloseOutlined,
    DeleteOutlined,
    DownloadOutlined,
  } from '@ant-design/icons-vue';
  import * as api from '@/api/sc/stock/transfer-sc';
  import { multiplePageMix } from '@/mixins/multiplePageMix';

  export default defineComponent({
    name: 'ScTransferOrder',
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
          sourceScId: '',
          targetScId: '',
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
          { field: 'sourceScCode', title: '转出仓库编号', width: 120 },
          { field: 'sourceScName', title: '转出仓库名称', width: 120 },
          { field: 'targetScCode', title: '转入仓库编号', width: 120 },
          { field: 'targetScName', title: '转入仓库名称', width: 120 },
          { field: 'totalNum', title: '调拨数量', width: 100, align: 'right' },
          {
            field: 'totalAmount',
            title: '调拨成本金额',
            width: 120,
            align: 'right',
            formatter: ({ row }) => {
              return this.$enums.SC_TRANSFER_ORDER_STATUS.CREATED.equalsCode(row.status) ||
                this.$enums.SC_TRANSFER_ORDER_STATUS.APPROVE_REFUSE.equalsCode(row.status)
                ? '-'
                : row.totalAmount;
            },
          },
          { field: 'updateTime', title: '操作时间', width: 170, sortable: true },
          { field: 'updateBy', title: '操作人', width: 100 },
          {
            field: 'status',
            title: '状态',
            width: 100,
            formatter: ({ cellValue }) => {
              return this.$enums.SC_TRANSFER_ORDER_STATUS.getDesc(cellValue);
            },
          },
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
      deleteRow(id) {
        this.$msg.createConfirm('对选中的仓库调拨单执行删除操作？').then(() => {
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
      doBatchApprovePass(row) {
        return api.batchApprovePass({
          id: row.id,
        });
      },
      // 批量审核通过
      batchApprovePass() {
        const records = this.$refs.grid.getCheckboxRecords();
        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择要执行操作的仓库调拨单！');
          return;
        }

        for (let i = 0; i < records.length; i++) {
          if (
            this.$enums.SC_TRANSFER_ORDER_STATUS.APPROVE_PASS.equalsCode(records[i].status) ||
            this.$enums.SC_TRANSFER_ORDER_STATUS.PART_RECEIVED.equalsCode(records[i].status) ||
            this.$enums.SC_TRANSFER_ORDER_STATUS.RECEIVED.equalsCode(records[i].status)
          ) {
            this.$msg.createError('第' + (i + 1) + '个仓库调拨单已审核通过，不允许继续执行审核！');
            return;
          }
        }

        this.batchHandleDatas = records;

        this.$refs.batchApprovePassHandlerDialog.openDialog();
      },
      // 批量审核拒绝
      batchApproveRefuse() {
        const records = this.$refs.grid.getCheckboxRecords();
        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择要执行操作的仓库调拨单！');
          return;
        }

        for (let i = 0; i < records.length; i++) {
          if (
            this.$enums.SC_TRANSFER_ORDER_STATUS.APPROVE_PASS.equalsCode(records[i].status) ||
            this.$enums.SC_TRANSFER_ORDER_STATUS.PART_RECEIVED.equalsCode(records[i].status) ||
            this.$enums.SC_TRANSFER_ORDER_STATUS.RECEIVED.equalsCode(records[i].status)
          ) {
            this.$msg.createError('第' + (i + 1) + '个仓库调拨单已审核通过，不允许继续执行审核！');
            return;
          }

          if (this.$enums.SC_TRANSFER_ORDER_STATUS.APPROVE_REFUSE.equalsCode(records[i].status)) {
            this.$msg.createError('第' + (i + 1) + '个仓库调拨单已审核拒绝，不允许继续执行审核！');
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
      doBatchDelete(row) {
        return api.batchDelete(row.id);
      },
      // 批量删除
      batchDelete() {
        const records = this.$refs.grid.getCheckboxRecords();
        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择要执行操作的仓库调拨单！');
          return;
        }

        for (let i = 0; i < records.length; i++) {
          if (this.$enums.SC_TRANSFER_ORDER_STATUS.APPROVE_PASS.equalsCode(records[i].status)) {
            this.$msg.createError('第' + (i + 1) + '个仓库调拨单已审核通过，不允许执行删除操作！');
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
            permission: ['stock:sc-transfer:approve'],
            label: '审核',
            ifShow: () => {
              return (
                this.$enums.SC_TRANSFER_ORDER_STATUS.CREATED.equalsCode(row.status) ||
                this.$enums.SC_TRANSFER_ORDER_STATUS.APPROVE_REFUSE.equalsCode(row.status)
              );
            },
            onClick: () => {
              this.openChildPage('/stock/stock-transfer/approve/' + row.id);
            },
          },
          {
            permission: ['stock:sc-transfer:modify'],
            label: '修改',
            ifShow: () => {
              return (
                this.$enums.SC_TRANSFER_ORDER_STATUS.CREATED.equalsCode(row.status) ||
                this.$enums.SC_TRANSFER_ORDER_STATUS.APPROVE_REFUSE.equalsCode(row.status)
              );
            },
            onClick: () => {
              this.openChildPage('/stock/stock-transfer/modify/' + row.id);
            },
          },
          {
            permission: ['stock:sc-transfer:delete'],
            label: '删除',
            danger: true,
            ifShow: () => {
              return (
                this.$enums.SC_TRANSFER_ORDER_STATUS.CREATED.equalsCode(row.status) ||
                this.$enums.SC_TRANSFER_ORDER_STATUS.APPROVE_REFUSE.equalsCode(row.status)
              );
            },
            onClick: () => {
              this.deleteOrder(row);
            },
          },
          {
            permission: ['stock:sc-transfer:receive'],
            label: '收货',
            ifShow: () => {
              return (
                this.$enums.SC_TRANSFER_ORDER_STATUS.APPROVE_PASS.equalsCode(row.status) ||
                this.$enums.SC_TRANSFER_ORDER_STATUS.PART_RECEIVED.equalsCode(row.status)
              );
            },
            onClick: () => {
              this.openChildPage('/stock/stock-transfer/receive/' + row.id);
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
