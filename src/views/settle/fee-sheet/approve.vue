<template>
  <div class="simple-app-container">
    <div v-permission="['settle:fee-sheet:approve']" v-loading="loading">
      <j-border>
        <j-form>
          <j-form-item label="供应商">
            {{ formData.supplierName }}
          </j-form-item>
          <j-form-item label="收支方式">
            {{ formData.sheetType }}
          </j-form-item>
          <j-form-item />
          <j-form-item label="状态">
            <span
              v-if="$enums.SETTLE_FEE_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status)"
              style="color: #52c41a"
              >{{ $enums.SETTLE_FEE_SHEET_STATUS.getDesc(formData.status) }}</span
            >
            <span
              v-else-if="$enums.SETTLE_FEE_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)"
              style="color: #f5222d"
              >{{ $enums.SETTLE_FEE_SHEET_STATUS.getDesc(formData.status) }}</span
            >
            <span v-else style="color: #303133">{{
              $enums.SETTLE_FEE_SHEET_STATUS.getDesc(formData.status)
            }}</span>
          </j-form-item>
          <j-form-item label="拒绝理由" :content-nest="false" :span="16">
            <a-input
              v-if="$enums.SETTLE_FEE_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)"
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
              $enums.SETTLE_FEE_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status) ||
              $enums.SETTLE_FEE_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
            "
            label="审核人"
          >
            <span>{{ formData.approveBy }}</span>
          </j-form-item>
          <j-form-item
            v-if="
              $enums.SETTLE_FEE_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status) ||
              $enums.SETTLE_FEE_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
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
      />

      <order-time-line :id="id" />

      <j-border title="合计">
        <j-form label-width="140px">
          <j-form-item label="总金额" :span="6">
            <a-input v-model:value="formData.totalAmount" class="number-input" readonly />
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
          $enums.SETTLE_FEE_SHEET_STATUS.CREATED.equalsCode(formData.status) ||
          $enums.SETTLE_FEE_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
        "
        style="text-align: center; background-color: #ffffff; padding: 8px 0"
      >
        <a-space>
          <a-button
            v-permission="['settle:fee-sheet:approve']"
            type="primary"
            :loading="loading"
            @click="approvePassOrder"
            >审核通过</a-button
          >
          <a-button
            v-if="$enums.SETTLE_FEE_SHEET_STATUS.CREATED.equalsCode(formData.status)"
            v-permission="['settle:fee-sheet:approve']"
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
  </div>
</template>
<script>
  import { defineComponent } from 'vue';
  import ApproveRefuse from '@/components/ApproveRefuse';
  import * as api from '@/api/settle/fee';

  export default defineComponent({
    components: {
      ApproveRefuse,
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
          {
            field: 'item',
            title: '项目',
            width: 200,
            formatter: ({ cellValue, row }) => {
              return row.item.name;
            },
          },
          { field: 'amount', title: '金额', align: 'right', width: 120 },
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
          sheetType: '',
          totalNum: 0,
          giftNum: 0,
          totalAmount: 0,
          description: '',
        };
      },
      // 加载数据
      loadData() {
        this.loading = true;
        api
          .get(this.id)
          .then((res) => {
            if (
              !this.$enums.SETTLE_FEE_SHEET_STATUS.CREATED.equalsCode(res.status) &&
              !this.$enums.SETTLE_FEE_SHEET_STATUS.APPROVE_REFUSE.equalsCode(res.status)
            ) {
              this.$msg.createError('单据已审核通过，无需重复审核！');
              this.closeDialog();
              return;
            }
            this.formData = {
              supplierName: res.supplierName,
              sheetType: this.$enums.SETTLE_FEE_SHEET_TYPE.getDesc(res.sheetType),
              description: res.description,
              status: res.status,
              createBy: res.createBy,
              createTime: res.createTime,
              approveBy: res.approveBy,
              approveTime: res.approveTime,
              refuseReason: res.refuseReason,
              totalAmount: 0,
            };
            const details = res.details.map((item) => {
              return {
                id: item.id,
                item: {
                  id: item.itemId,
                  name: item.itemName,
                },
                amount: item.amount,
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

        this.tableData
          .filter((t) => {
            return this.$utils.isFloatGeZero(t.amount) && !this.$utils.isEmpty(t.item);
          })
          .forEach((t) => {
            totalAmount = this.$utils.add(totalAmount, t.amount);
          });

        this.formData.totalAmount = totalAmount;
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
