<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="75%"
    title="查看"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-permission="['customer-settle:check-sheet:query']" v-loading="loading">
      <j-border>
        <j-form>
          <j-form-item label="客户">
            {{ formData.customerName }}
          </j-form-item>
          <j-form-item label="审核日期" :content-nest="false" required>
            <div class="date-range-container">
              <a-date-picker
                v-model:value="formData.startTime"
                placeholder=""
                value-format="YYYY-MM-DD 00:00:00"
                disabled
              />
              <span class="date-split">至</span>
              <a-date-picker
                v-model:value="formData.endTime"
                placeholder=""
                value-format="YYYY-MM-DD 23:59:59"
                disabled
              />
            </div>
          </j-form-item>
          <j-form-item />
          <j-form-item label="状态">
            <span
              v-if="
                $enums.CUSTOMER_SETTLE_CHECK_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status)
              "
              style="color: #52c41a"
              >{{ $enums.CUSTOMER_SETTLE_CHECK_SHEET_STATUS.getDesc(formData.status) }}</span
            >
            <span
              v-else-if="
                $enums.CUSTOMER_SETTLE_CHECK_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
              "
              style="color: #f5222d"
              >{{ $enums.CUSTOMER_SETTLE_CHECK_SHEET_STATUS.getDesc(formData.status) }}</span
            >
            <span v-else style="color: #303133">{{
              $enums.CUSTOMER_SETTLE_CHECK_SHEET_STATUS.getDesc(formData.status)
            }}</span>
          </j-form-item>
          <j-form-item label="拒绝理由" :content-nest="false" :span="16">
            <a-input
              v-if="
                $enums.CUSTOMER_SETTLE_CHECK_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
              "
              v-model:value="formData.refuseReason"
              readonly
            />
          </j-form-item>
          <j-form-item label="操作人">
            <span>{{ formData.createBy }}</span>
          </j-form-item>
          <j-form-item label="操作时间" :span="16">
            <span>{{ formData.createTime }}</span>
          </j-form-item>
          <j-form-item
            v-if="
              $enums.CUSTOMER_SETTLE_CHECK_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status) ||
              $enums.CUSTOMER_SETTLE_CHECK_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
            "
            label="审核人"
          >
            <span>{{ formData.approveBy }}</span>
          </j-form-item>
          <j-form-item
            v-if="
              $enums.CUSTOMER_SETTLE_CHECK_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status) ||
              $enums.CUSTOMER_SETTLE_CHECK_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
            "
            label="审核时间"
            :span="16"
          >
            <span>{{ formData.approveTime }}</span>
          </j-form-item>
        </j-form>
      </j-border>
      <!-- 数据列表 -->
      <vxe-grid
        ref="grid"
        resizable
        show-overflow
        highlight-hover-row
        keep-source
        row-id="id"
        height="500"
        :data="tableData"
        :columns="tableColumn"
      >
        <!-- 单据号 列自定义内容 -->
        <template #bizCode_default="{ row }">
          <span
            v-show="$enums.CUSTOMER_SETTLE_CHECK_SHEET_BIZ_TYPE.OUT_SHEET.equalsCode(row.bizType)"
            v-no-permission="['purchase:receive:query']"
            >{{ row.bizCode }}</span
          >
          <a
            v-show="$enums.CUSTOMER_SETTLE_CHECK_SHEET_BIZ_TYPE.OUT_SHEET.equalsCode(row.bizType)"
            v-permission="['purchase:receive:query']"
            type="link"
            @click="
              (e) => {
                $refs.viewSaleOutSheetDetailDialog.id = row.bizId;
                $nextTick(() => $refs.viewSaleOutSheetDetailDialog.openDialog());
              }
            "
          >
            {{ row.bizCode }}
          </a>

          <span
            v-show="$enums.CUSTOMER_SETTLE_CHECK_SHEET_BIZ_TYPE.SALE_RETURN.equalsCode(row.bizType)"
            v-no-permission="['purchase:return:query']"
            >{{ row.bizCode }}</span
          >
          <a
            v-show="$enums.CUSTOMER_SETTLE_CHECK_SHEET_BIZ_TYPE.SALE_RETURN.equalsCode(row.bizType)"
            v-permission="['purchase:return:query']"
            type="link"
            @click="
              (e) => {
                $refs.viewSaleReturnDetailDialog.id = row.bizId;
                $nextTick(() => $refs.viewSaleReturnDetailDialog.openDialog());
              }
            "
          >
            {{ row.bizCode }}
          </a>

          <span
            v-show="
              $enums.CUSTOMER_SETTLE_CHECK_SHEET_BIZ_TYPE.SETTLE_FEE_SHEET.equalsCode(row.bizType)
            "
            v-no-permission="['customer-settle:fee-sheet:query']"
            >{{ row.bizCode }}</span
          >
          <a
            v-show="
              $enums.CUSTOMER_SETTLE_CHECK_SHEET_BIZ_TYPE.SETTLE_FEE_SHEET.equalsCode(row.bizType)
            "
            v-permission="['customer-settle:fee-sheet:query']"
            type="link"
            @click="
              (e) => {
                $refs.viewSettleFeeSheetDetailDialog.id = row.bizId;
                $nextTick(() => $refs.viewSettleFeeSheetDetailDialog.openDialog());
              }
            "
          >
            {{ row.bizCode }}
          </a>

          <span
            v-show="
              $enums.CUSTOMER_SETTLE_CHECK_SHEET_BIZ_TYPE.SETTLE_PRE_SHEET.equalsCode(row.bizType)
            "
            v-no-permission="['customer-settle:pre-sheet:query']"
            >{{ row.bizCode }}</span
          >
          <a
            v-show="
              $enums.CUSTOMER_SETTLE_CHECK_SHEET_BIZ_TYPE.SETTLE_PRE_SHEET.equalsCode(row.bizType)
            "
            v-permission="['customer-settle:pre-sheet:query']"
            type="link"
            @click="
              (e) => {
                $refs.viewSettlePreSheetDetailDialog.id = row.bizId;
                $nextTick(() => $refs.viewSettlePreSheetDetailDialog.openDialog());
              }
            "
          >
            {{ row.bizCode }}
          </a>
        </template>
      </vxe-grid>

      <order-time-line :id="id" />

      <j-border title="合计">
        <j-form label-width="140px">
          <j-form-item label="单据总金额" :span="6">
            <a-input v-model:value="formData.totalAmount" class="number-input" readonly />
          </j-form-item>
          <j-form-item label="应收总金额" :span="6">
            <a-input v-model:value="formData.totalPayAmount" class="number-input" readonly />
          </j-form-item>
        </j-form>
      </j-border>

      <j-border>
        <j-form label-width="140px">
          <j-form-item label="备注" :span="24" :content-nest="false">
            <a-textarea v-model:value.trim="formData.description" readonly />
          </j-form-item>
        </j-form>
      </j-border>
    </div>
    <!-- 销售出库单详情 -->
    <sale-out-sheet-detail :id="''" ref="viewSaleOutSheetDetailDialog" />
    <!-- 销售退货单详情 -->
    <sale-return-detail :id="''" ref="viewSaleReturnDetailDialog" />
    <!-- 客户费用单详情 -->
    <settle-fee-sheet-detail :id="''" ref="viewSettleFeeSheetDetailDialog" />
    <!-- 客户预付款单详情 -->
    <settle-pre-sheet-detail :id="''" ref="viewSettlePreSheetDetailDialog" />
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';
  import SaleOutSheetDetail from '@/views/sc/sale/out/detail.vue';
  import SaleReturnDetail from '@/views/sc/sale/return/detail.vue';
  import SettleFeeSheetDetail from '@/views/customer-settle/fee-sheet/detail.vue';
  import SettlePreSheetDetail from '@/views/customer-settle/pre-sheet/detail.vue';
  import * as api from '@/api/customer-settle/check';

  export default defineComponent({
    components: {
      SaleOutSheetDetail,
      SaleReturnDetail,
      SettleFeeSheetDetail,
      SettlePreSheetDetail,
    },
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        // 是否可见
        visible: false,
        // 是否显示加载框
        loading: false,
        // 表单数据
        formData: {},
        // 列表数据配置
        tableColumn: [
          { type: 'seq', width: 50 },
          { field: 'bizCode', title: '单据号', width: 200, slots: { default: 'bizCode_default' } },
          {
            field: 'bizType',
            title: '单据类型',
            width: 120,
            formatter: ({ cellValue }) => {
              return this.$enums.CUSTOMER_SETTLE_CHECK_SHEET_BIZ_TYPE.getDesc(cellValue);
            },
          },
          { field: 'approveTime', title: '审核时间', width: 170 },
          { field: 'totalAmount', title: '单据金额', align: 'right', width: 100 },
          { field: 'payAmount', title: '应收金额', align: 'right', width: 100 },
          { field: 'description', title: '备注', width: 260 },
        ],
        tableData: [],
      };
    },
    computed: {},
    created() {
      // 初始化表单数据
      this.initFormData();
    },
    methods: {
      // 打开对话框 由父页面触发
      openDialog() {
        this.visible = true;

        this.$nextTick(() => this.open());
      },
      // 关闭对话框
      closeDialog() {
        this.visible = false;
        this.$emit('close');
      },
      // 初始化表单数据
      initFormData() {
        this.formData = {
          customerName: '',
          description: '',
          startTime: '',
          endTime: '',
          totalAmount: 0,
          totalPayAmount: 0,
        };
      },
      // 加载数据
      loadData() {
        this.loading = true;
        api
          .get(this.id)
          .then((res) => {
            this.formData = {
              customerName: res.customerName,
              description: res.description,
              startTime: res.startTime,
              endTime: res.endTime,
              status: res.status,
              createBy: res.createBy,
              createTime: res.createTime,
              approveBy: res.approveBy,
              approveTime: res.approveTime,
              refuseReason: res.refuseReason,
              totalAmount: 0,
              totalPayAmount: 0,
            };
            const details = res.details.map((item) => {
              return {
                id: item.id,
                bizId: item.bizId,
                bizCode: item.bizCode,
                bizType: item.bizType,
                totalAmount: item.totalAmount,
                payAmount: item.payAmount,
                approveTime: item.approveTime,
                description: item.description,
              };
            });

            this.tableData = details;

            this.calcSum();
          })
          .finally(() => {
            this.loading = false;
          });
      },
      // 页面显示时触发
      open() {
        // 初始化表单数据
        this.initFormData();

        this.loadData();
      },
      // 计算汇总数据
      calcSum() {
        let totalAmount = 0;
        let totalPayAmount = 0;
        this.tableData.forEach((item) => {
          if (this.$utils.isFloat(item.totalAmount)) {
            totalAmount = this.$utils.add(totalAmount, item.totalAmount);
          }

          if (this.$utils.isFloat(item.payAmount)) {
            totalPayAmount = this.$utils.add(totalPayAmount, item.payAmount);
          }
        });

        this.formData.totalAmount = totalAmount;
        this.formData.totalPayAmount = totalPayAmount;
      },
    },
  });
</script>
<style></style>
