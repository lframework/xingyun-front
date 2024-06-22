<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="75%"
    title="查看"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-permission="['settle:sheet:query']" v-loading="loading">
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
              v-if="$enums.SETTLE_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status)"
              style="color: #52c41a"
              >{{ $enums.SETTLE_SHEET_STATUS.getDesc(formData.status) }}</span
            >
            <span
              v-else-if="$enums.SETTLE_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)"
              style="color: #f5222d"
              >{{ $enums.SETTLE_SHEET_STATUS.getDesc(formData.status) }}</span
            >
            <span v-else style="color: #303133">{{
              $enums.SETTLE_SHEET_STATUS.getDesc(formData.status)
            }}</span>
          </j-form-item>
          <j-form-item label="拒绝理由" :content-nest="false" :span="16">
            <a-input
              v-if="$enums.SETTLE_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)"
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
              $enums.SETTLE_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status) ||
              $enums.SETTLE_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
            "
            label="审核人"
          >
            <span>{{ formData.approveBy }}</span>
          </j-form-item>
          <j-form-item
            v-if="
              $enums.SETTLE_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status) ||
              $enums.SETTLE_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
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
          <span v-no-permission="['settle:check-sheet:query']">{{ row.bizCode }}</span>
          <a
            v-permission="['settle:check-sheet:query']"
            type="link"
            @click="
              (e) => {
                $refs.viewSettleCheckSheetDetailDialog.id = row.bizId;
                $nextTick(() => $refs.viewSettleCheckSheetDetailDialog.openDialog());
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
          <j-form-item label="未付款总金额" :span="6">
            <a-input v-model:value="formData.totalUnPayAmount" class="number-input" readonly />
          </j-form-item>
          <j-form-item label="实付总金额" :span="6">
            <a-input v-model:value="formData.totalAmount" class="number-input" readonly />
          </j-form-item>
          <j-form-item label="优惠总金额" :span="6">
            <a-input v-model:value="formData.totalDiscountAmount" class="number-input" readonly />
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
    <!-- 供应商对账单详情 -->
    <settle-check-sheet-detail :id="''" ref="viewSettleCheckSheetDetailDialog" />
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';
  import SettleCheckSheetDetail from '@/views/settle/check-sheet/detail.vue';
  import * as api from '@/api/settle/sheet';

  export default defineComponent({
    components: {
      SettleCheckSheetDetail,
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
          { type: 'seq', width: 50 },
          { field: 'bizCode', title: '单据号', width: 200, slots: { default: 'bizCode_default' } },
          {
            field: 'bizType',
            title: '单据类型',
            width: 120,
            formatter: ({ cellValue }) => {
              return '供应商对账单';
            },
          },
          { field: 'approveTime', title: '审核时间', width: 170 },
          { field: 'totalPayAmount', title: '应付金额', align: 'right', width: 100 },
          { field: 'totalPayedAmount', title: '已付款金额', align: 'right', width: 100 },
          { field: 'totalDiscountAmount', title: '已优惠金额', align: 'right', width: 100 },
          { field: 'totalUnPayAmount', title: '未付款金额', align: 'right', width: 100 },
          { field: 'payAmount', title: '实付金额', align: 'right', width: 100 },
          { field: 'discountAmount', title: '优惠金额', align: 'right', width: 100 },
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
          supplierName: '',
          description: '',
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
              totalUnPayAmount: 0,
              totalDiscountAmount: 0,
            };
            const details = res.details.map((item) => {
              return {
                id: item.id,
                bizId: item.bizId,
                bizCode: item.bizCode,
                totalPayAmount: item.totalPayAmount,
                totalPayedAmount: item.totalPayedAmount,
                totalDiscountAmount: item.totalDiscountAmount,
                totalUnPayAmount: item.totalUnPayAmount,
                payAmount: item.payAmount,
                discountAmount: item.discountAmount,
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
        let totalUnPayAmount = 0;
        let totalDiscountAmount = 0;

        this.tableData.forEach((item) => {
          totalAmount = this.$utils.add(totalAmount, item.payAmount);
          totalDiscountAmount = this.$utils.add(totalDiscountAmount, item.totalDiscountAmount);
          totalUnPayAmount = this.$utils.add(totalUnPayAmount, item.totalUnPayAmount);
        });

        this.formData.totalAmount = totalAmount;
        this.formData.totalUnPayAmount = totalUnPayAmount;
        this.formData.totalDiscountAmount = totalDiscountAmount;
      },
    },
  });
</script>
<style></style>
