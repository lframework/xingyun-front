<template>
  <div class="simple-app-container">
    <div v-permission="['settle:check-sheet:approve']" v-loading="loading">
      <j-border>
        <j-form>
          <j-form-item label="供应商">
            {{ formData.supplierName }}
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
              v-if="$enums.SETTLE_CHECK_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status)"
              style="color: #52c41a"
              >{{ $enums.SETTLE_CHECK_SHEET_STATUS.getDesc(formData.status) }}</span
            >
            <span
              v-else-if="
                $enums.SETTLE_CHECK_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
              "
              style="color: #f5222d"
              >{{ $enums.SETTLE_CHECK_SHEET_STATUS.getDesc(formData.status) }}</span
            >
            <span v-else style="color: #303133">{{
              $enums.SETTLE_CHECK_SHEET_STATUS.getDesc(formData.status)
            }}</span>
          </j-form-item>
          <j-form-item label="拒绝理由" :content-nest="false" :span="16">
            <a-input
              v-if="$enums.SETTLE_CHECK_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)"
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
              $enums.SETTLE_CHECK_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status) ||
              $enums.SETTLE_CHECK_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
            "
            label="审核人"
          >
            <span>{{ formData.approveBy }}</span>
          </j-form-item>
          <j-form-item
            v-if="
              $enums.SETTLE_CHECK_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status) ||
              $enums.SETTLE_CHECK_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
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
            v-if="$enums.SETTLE_CHECK_SHEET_BIZ_TYPE.RECEIVE_SHEET.equalsCode(row.bizType)"
            v-no-permission="['purchase:receive:query']"
            >{{ row.bizCode }}</span
          >
          <a
            v-if="$enums.SETTLE_CHECK_SHEET_BIZ_TYPE.RECEIVE_SHEET.equalsCode(row.bizType)"
            v-permission="['purchase:receive:query']"
            type="link"
            @click="
              (e) => {
                $refs.viewPurchaseReceiveSheetDetailDialog.id = row.bizId;
                $nextTick(() => $refs.viewPurchaseReceiveSheetDetailDialog.openDialog());
              }
            "
          >
            {{ row.bizCode }}
          </a>

          <span
            v-if="$enums.SETTLE_CHECK_SHEET_BIZ_TYPE.PURCHASE_RETURN.equalsCode(row.bizType)"
            v-no-permission="['purchase:return:query']"
            >{{ row.bizCode }}</span
          >
          <a
            v-if="$enums.SETTLE_CHECK_SHEET_BIZ_TYPE.PURCHASE_RETURN.equalsCode(row.bizType)"
            v-permission="['purchase:return:query']"
            type="link"
            @click="
              (e) => {
                $refs.viewPurchaseReturnDetailDialog.id = row.bizId;
                $nextTick(() => $refs.viewPurchaseReturnDetailDialog.openDialog());
              }
            "
          >
            {{ row.bizCode }}
          </a>

          <span
            v-if="$enums.SETTLE_CHECK_SHEET_BIZ_TYPE.SETTLE_FEE_SHEET.equalsCode(row.bizType)"
            v-no-permission="['settle:fee-sheet:query']"
            >{{ row.bizCode }}</span
          >
          <a
            v-if="$enums.SETTLE_CHECK_SHEET_BIZ_TYPE.SETTLE_FEE_SHEET.equalsCode(row.bizType)"
            v-permission="['settle:fee-sheet:query']"
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
            v-if="$enums.SETTLE_CHECK_SHEET_BIZ_TYPE.SETTLE_PRE_SHEET.equalsCode(row.bizType)"
            v-no-permission="['settle:pre-sheet:query']"
            >{{ row.bizCode }}</span
          >
          <a
            v-if="$enums.SETTLE_CHECK_SHEET_BIZ_TYPE.SETTLE_PRE_SHEET.equalsCode(row.bizType)"
            v-permission="['settle:pre-sheet:query']"
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

        <!-- 项目 列自定义内容 -->
        <template #item_default="{ row }">
          <span>{{ row.item.name }}</span>
        </template>

        <!-- 金额 列自定义内容 -->
        <template #amount_default="{ row }">
          <span>{{ row.amount }}</span>
        </template>
      </vxe-grid>

      <order-time-line :id="id" />

      <j-border title="合计">
        <j-form label-width="140px">
          <j-form-item label="单据总金额" :span="6">
            <a-input v-model:value="formData.totalAmount" class="number-input" readonly />
          </j-form-item>
          <j-form-item label="应付总金额" :span="6">
            <a-input v-model:value="formData.totalPayAmount" class="number-input" readonly />
          </j-form-item>
        </j-form>
      </j-border>

      <j-border>
        <j-form label-width="140px">
          <j-form-item label="备注" :span="24" :content-nest="false">
            <a-textarea v-model:value.trim="formData.description" maxlength="200" />
          </j-form-item>
        </j-form>
      </j-border>

      <div
        v-if="
          $enums.SETTLE_CHECK_SHEET_STATUS.CREATED.equalsCode(formData.status) ||
          $enums.SETTLE_CHECK_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
        "
        style="text-align: center; background-color: #ffffff; padding: 8px 0"
      >
        <a-space>
          <a-button
            v-permission="['settle:check-sheet:approve']"
            type="primary"
            :loading="loading"
            @click="approvePassOrder"
            >审核通过</a-button
          >
          <a-button
            v-if="$enums.SETTLE_CHECK_SHEET_STATUS.CREATED.equalsCode(formData.status)"
            v-permission="['settle:check-sheet:approve']"
            danger
            :loading="loading"
            @click="approveRefuseOrder"
            >审核拒绝</a-button
          >
          <a-button :loading="loading" @click="closeDialog">关闭</a-button>
        </a-space>
      </div>
    </div>
    <approve-refuse ref="approveRefuseDialog" @confirm="doApproveRefuse" />
    <!-- 采购收货单详情 -->
    <purchase-receive-sheet-detail :id="''" ref="viewPurchaseReceiveSheetDetailDialog" />
    <!-- 采购退货单详情 -->
    <purchase-return-detail :id="''" ref="viewPurchaseReturnDetailDialog" />
    <!-- 供应商费用单详情 -->
    <settle-fee-sheet-detail :id="''" ref="viewSettleFeeSheetDetailDialog" />
    <!-- 供应商预付款单详情 -->
    <settle-pre-sheet-detail :id="''" ref="viewSettlePreSheetDetailDialog" />
  </div>
</template>
<script>
  import { defineComponent } from 'vue';
  import ApproveRefuse from '@/components/ApproveRefuse';
  import PurchaseReceiveSheetDetail from '@/views/sc/purchase/receive/detail.vue';
  import PurchaseReturnDetail from '@/views/sc/purchase/return/detail.vue';
  import SettleFeeSheetDetail from '@/views/settle/fee-sheet/detail.vue';
  import SettlePreSheetDetail from '@/views/settle/pre-sheet/detail.vue';
  import * as api from '@/api/settle/check';

  export default defineComponent({
    components: {
      ApproveRefuse,
      PurchaseReceiveSheetDetail,
      PurchaseReturnDetail,
      SettleFeeSheetDetail,
      SettlePreSheetDetail,
    },
    data() {
      return {
        id: this.$route.params.id,
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
              return this.$enums.SETTLE_CHECK_SHEET_BIZ_TYPE.getDesc(cellValue);
            },
          },
          { field: 'approveTime', title: '审核时间', width: 170 },
          { field: 'totalAmount', title: '单据金额', align: 'right', width: 100 },
          { field: 'payAmount', title: '应付金额', align: 'right', width: 100 },
          { field: 'description', title: '备注', width: 260 },
        ],
        tableData: [],
      };
    },
    computed: {},
    created() {
      this.openDialog();
    },
    methods: {
      // 打开对话框 由父页面触发
      openDialog() {
        // 初始化表单数据
        this.initFormData();
        this.loadData();
      },
      // 关闭对话框
      closeDialog() {
        this.$utils.closeCurrentPage();
      },
      // 初始化表单数据
      initFormData() {
        this.formData = {
          supplierName: '',
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
            if (
              !this.$enums.SETTLE_CHECK_SHEET_STATUS.CREATED.equalsCode(res.status) &&
              !this.$enums.SETTLE_CHECK_SHEET_STATUS.APPROVE_REFUSE.equalsCode(res.status)
            ) {
              this.$msg.createError('单据已审核通过，无需重复审核！');
              this.closeDialog();
              return;
            }
            this.formData = {
              supplierName: res.supplierName,
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
      // 审核通过
      approvePassOrder() {
        this.$msg.createConfirm('确定执行审核通过操作？').then(() => {
          this.loading = true;
          api
            .approvePass({
              id: this.id,
              description: this.formData.description,
            })
            .then((res) => {
              this.$msg.createSuccess('审核通过！');

              this.$emit('confirm');
              this.closeDialog();
            })
            .finally(() => {
              this.loading = false;
            });
        });
      },
      // 审核拒绝
      approveRefuseOrder() {
        this.$refs.approveRefuseDialog.openDialog();
      },
      // 开始审核拒绝
      doApproveRefuse(reason) {
        this.loading = true;
        api
          .approveRefuse({
            id: this.id,
            refuseReason: reason,
          })
          .then(() => {
            this.$msg.createSuccess('审核拒绝！');

            this.$emit('confirm');
            this.closeDialog();
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
  });
</script>
<style></style>
