<template>
  <div>
    <div v-permission="['settle:sheet:query']">
      <page-wrapper content-full-height fixed-height>
        <!-- 数据列表 -->
        <vxe-grid
          id="SettleSheet"
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
              <j-form bordered @collapse="$refs.grid.refreshColumn()">
                <j-form-item label="单据号">
                  <a-input v-model:value="searchFormData.code" allow-clear />
                </j-form-item>
                <j-form-item label="供应商">
                  <supplier-selector v-model:value="searchFormData.supplierId" />
                </j-form-item>
                <j-form-item label="操作人">
                  <user-selector v-model:value="searchFormData.createBy" />
                </j-form-item>
                <j-form-item label="操作日期" :content-nest="false">
                  <div class="date-range-container">
                    <a-date-picker
                      v-model:value="searchFormData.createStartTime"
                      placeholder=""
                      value-format="YYYY-MM-DD 00:00:00"
                    />
                    <span class="date-split">至</span>
                    <a-date-picker
                      v-model:value="searchFormData.createEndTime"
                      placeholder=""
                      value-format="YYYY-MM-DD 23:59:59"
                    />
                  </div>
                </j-form-item>
                <j-form-item label="审核人">
                  <user-selector v-model:value="searchFormData.approveBy" />
                </j-form-item>
                <j-form-item label="审核日期" :content-nest="false">
                  <div class="date-range-container">
                    <a-date-picker
                      v-model:value="searchFormData.approveStartTime"
                      placeholder=""
                      value-format="YYYY-MM-DD 00:00:00"
                    />
                    <span class="date-split">至</span>
                    <a-date-picker
                      v-model:value="searchFormData.approveEndTime"
                      placeholder=""
                      value-format="YYYY-MM-DD 23:59:59"
                    />
                  </div>
                </j-form-item>
                <j-form-item label="状态">
                  <a-select v-model:value="searchFormData.status" placeholder="全部" allow-clear>
                    <a-select-option
                      v-for="item in $enums.SETTLE_SHEET_STATUS.values()"
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
                v-permission="['settle:sheet:add']"
                type="primary"
                :icon="h(PlusOutlined)"
                @click="openChildPage('/settle/supplier/sheet/add')"
                >新增</a-button
              >
              <a-button
                v-permission="['settle:sheet:approve']"
                :icon="h(CheckOutlined)"
                @click="batchApprovePass"
                >审核通过</a-button
              >
              <a-button
                v-permission="['settle:sheet:approve']"
                :icon="h(CloseOutlined)"
                @click="batchApproveRefuse"
                >审核拒绝</a-button
              >
              <a-button
                v-permission="['settle:sheet:delete']"
                danger
                :icon="h(DeleteOutlined)"
                @click="batchDelete"
                >批量删除</a-button
              >
              <a-button
                v-permission="['settle:sheet:export']"
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

      <!-- 查看窗口 -->
      <detail :id="id" ref="viewDialog" />

      <approve-refuse ref="approveRefuseDialog" @confirm="doApproveRefuse" />

      <!-- 批量操作 -->
      <batch-handler
        ref="batchApprovePassHandlerDialog"
        :table-column="[
          { field: 'code', title: '单据号', width: 180 },
          { field: 'supplierCode', title: '供应商编号', width: 100 },
          { field: 'supplierName', title: '供应商名称', width: 120 },
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
          { field: 'supplierCode', title: '供应商编号', width: 100 },
          { field: 'supplierName', title: '供应商名称', width: 120 },
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
          { field: 'supplierCode', title: '供应商编号', width: 100 },
          { field: 'supplierName', title: '供应商名称', width: 120 },
        ]"
        title="批量删除"
        :tableData="batchHandleDatas"
        :handle-fn="doBatchDelete"
        @confirm="search"
      />
    </div>
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
  import * as api from '@/api/settle/sheet';
  import { multiplePageMix } from '@/mixins/multiplePageMix';

  export default defineComponent({
    name: 'SettleSheet',
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
          supplierId: '',
          createBy: '',
          createStartTime: this.$utils.formatDateTime(
            this.$utils.getDateTimeWithMinTime(moment().subtract(1, 'M')),
          ),
          createEndTime: this.$utils.formatDateTime(this.$utils.getDateTimeWithMaxTime(moment())),
          approveBy: '',
          approveStartTime: '',
          approveEndTime: '',
          status: undefined,
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
          { field: 'supplierCode', title: '供应商编号', width: 100 },
          { field: 'supplierName', title: '供应商名称', width: 120 },
          { field: 'totalAmount', title: '实付总金额', align: 'right', width: 100 },
          { field: 'totalDiscountAmount', title: '优惠总金额', align: 'right', width: 100 },
          { field: 'createTime', title: '操作时间', width: 170, sortable: true },
          { field: 'createBy', title: '操作人', width: 100 },
          {
            field: 'status',
            title: '状态',
            width: 100,
            formatter: ({ cellValue }) => {
              return this.$enums.SETTLE_SHEET_STATUS.getDesc(cellValue);
            },
          },
          { field: 'approveTime', title: '审核时间', width: 170, sortable: true },
          { field: 'approveBy', title: '审核人', width: 100 },
          { field: 'description', title: '备注', width: 200 },
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
        return {
          code: this.searchFormData.code,
          supplierId: this.searchFormData.supplierId,
          createBy: this.searchFormData.createBy,
          createStartTime: this.searchFormData.createStartTime,
          createEndTime: this.searchFormData.createEndTime,
          approveBy: this.searchFormData.approveBy,
          approveStartTime: this.searchFormData.approveStartTime,
          approveEndTime: this.searchFormData.approveEndTime,
          status: this.searchFormData.status,
        };
      },
      // 删除订单
      deleteOrder(row) {
        this.$msg.createConfirm('对选中的结算单执行删除操作？').then(() => {
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
          this.$msg.createError('请选择要执行操作的结算单！');
          return;
        }

        for (let i = 0; i < records.length; i++) {
          if (this.$enums.SETTLE_SHEET_STATUS.APPROVE_PASS.equalsCode(records[i].status)) {
            this.$msg.createError('第' + (i + 1) + '个结算单已审核通过，不允许执行删除操作！');
            return;
          }
        }

        this.batchHandleDatas = records;

        this.$refs.batchDeleteHandlerDialog.openDialog();
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
          this.$msg.createError('请选择要执行操作的结算单！');
          return;
        }

        for (let i = 0; i < records.length; i++) {
          if (this.$enums.SETTLE_SHEET_STATUS.APPROVE_PASS.equalsCode(records[i].status)) {
            this.$msg.createError('第' + (i + 1) + '个结算单已审核通过，不允许继续执行审核！');
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
          this.$msg.createError('请选择要执行操作的结算单！');
          return;
        }

        for (let i = 0; i < records.length; i++) {
          if (this.$enums.SETTLE_SHEET_STATUS.APPROVE_PASS.equalsCode(records[i].status)) {
            this.$msg.createError('第' + (i + 1) + '个结算单已审核通过，不允许继续执行审核！');
            return;
          }

          if (this.$enums.SETTLE_SHEET_STATUS.APPROVE_REFUSE.equalsCode(records[i].status)) {
            this.$msg.createError('第' + (i + 1) + '个结算单已审核拒绝，不允许继续执行审核！');
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
            permission: ['settle:sheet:approve'],
            label: '审核',
            ifShow: () => {
              return (
                this.$enums.SETTLE_SHEET_STATUS.CREATED.equalsCode(row.status) ||
                this.$enums.SETTLE_SHEET_STATUS.APPROVE_REFUSE.equalsCode(row.status)
              );
            },
            onClick: () => {
              this.openChildPage('/settle/supplier/sheet/approve/' + row.id);
            },
          },
          {
            permission: ['settle:sheet:modify'],
            label: '修改',
            ifShow: () => {
              return (
                this.$enums.SETTLE_SHEET_STATUS.CREATED.equalsCode(row.status) ||
                this.$enums.SETTLE_SHEET_STATUS.APPROVE_REFUSE.equalsCode(row.status)
              );
            },
            onClick: () => {
              this.openChildPage('/settle/supplier/sheet/modify/' + row.id);
            },
          },
          {
            permission: ['settle:sheet:delete'],
            label: '删除',
            danger: true,
            ifShow: () => {
              return (
                this.$enums.SETTLE_SHEET_STATUS.CREATED.equalsCode(row.status) ||
                this.$enums.SETTLE_SHEET_STATUS.APPROVE_REFUSE.equalsCode(row.status)
              );
            },
            onClick: () => {
              this.deleteOrder(row);
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
