<template>
  <div class="app-card-container">
    <div v-permission="['retail:return:approve']" v-loading="loading">
      <j-border>
        <j-form bordered>
          <j-form-item label="仓库">
            {{ formData.scName }}
          </j-form-item>
          <j-form-item label="会员">
            {{ formData.memberName }}
          </j-form-item>
          <j-form-item label="销售员">
            {{ formData.salerName }}
          </j-form-item>
          <j-form-item label="付款日期">
            {{ formData.paymentDate }}
          </j-form-item>
          <j-form-item label="零售出库单" :span="16">
            <div v-if="!isEmpty(formData.outSheetCode)">
              <a
                v-permission="['retail:out:query']"
                @click="(e) => $refs.viewOutSheetDetailDialog.openDialog()"
                >{{ formData.outSheetCode }}</a
              >
              <span v-no-permission="['retail:out:query']">{{ formData.outSheetCode }}</span>
            </div>
          </j-form-item>
          <j-form-item label="状态">
            <span
              v-if="RETAIL_RETURN_STATUS.APPROVE_PASS.equalsCode(formData.status)"
              style="color: #52c41a"
              >{{ RETAIL_RETURN_STATUS.getDesc(formData.status) }}</span
            >
            <span
              v-else-if="RETAIL_RETURN_STATUS.APPROVE_REFUSE.equalsCode(formData.status)"
              style="color: #f5222d"
              >{{ RETAIL_RETURN_STATUS.getDesc(formData.status) }}</span
            >
            <span v-else style="color: #303133">{{
              RETAIL_RETURN_STATUS.getDesc(formData.status)
            }}</span>
          </j-form-item>
          <j-form-item label="拒绝理由" :span="16" :content-nest="false">
            <a-input
              v-if="RETAIL_RETURN_STATUS.APPROVE_REFUSE.equalsCode(formData.status)"
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
              RETAIL_RETURN_STATUS.APPROVE_PASS.equalsCode(formData.status) ||
              RETAIL_RETURN_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
            "
            label="审核人"
          >
            <span>{{ formData.approveBy }}</span>
          </j-form-item>
          <j-form-item
            v-if="
              RETAIL_RETURN_STATUS.APPROVE_PASS.equalsCode(formData.status) ||
              RETAIL_RETURN_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
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
        <!-- 是否赠品 列自定义内容 -->
        <template #isGift_default="{ row }">
          <span>{{ row.isGift ? '是' : '否' }}</span>
        </template>

        <!-- 含税金额 列自定义内容 -->
        <template #taxAmount_default="{ row }">
          <span v-if="isFloatGeZero(row.taxPrice) && isFloatGeZero(row.returnNum)">{{
            getNumber(mul(row.taxPrice, row.returnNum), 2)
          }}</span>
        </template>
      </vxe-grid>

      <order-time-line :id="id" />

      <j-border title="合计">
        <j-form bordered label-width="140px">
          <j-form-item label="退货数量" :span="6">
            <a-input v-model:value="formData.totalNum" class="number-input" readonly />
          </j-form-item>
          <j-form-item label="赠品数量" :span="6">
            <a-input v-model:value="formData.giftNum" class="number-input" readonly />
          </j-form-item>
          <j-form-item label="含税总金额" :span="6">
            <a-input v-model:value="formData.totalAmount" class="number-input" readonly />
          </j-form-item>
        </j-form>
      </j-border>

      <j-border title="支付方式">
        <pay-type ref="payType" :disabled="true" />
      </j-border>

      <j-border>
        <j-form bordered label-width="140px">
          <j-form-item label="备注" :span="24" :content-nest="false">
            <a-textarea v-model:value.trim="formData.description" maxlength="200" />
          </j-form-item>
        </j-form>
      </j-border>

      <div
        v-if="
          RETAIL_RETURN_STATUS.CREATED.equalsCode(formData.status) ||
          RETAIL_RETURN_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
        "
        style="text-align: center; background-color: #ffffff; padding: 8px 0"
      >
        <a-space>
          <a-button
            v-permission="['retail:return:approve']"
            type="primary"
            :loading="loading"
            @click="approvePassOrder"
            >审核通过</a-button
          >
          <a-button
            v-if="RETAIL_RETURN_STATUS.CREATED.equalsCode(formData.status)"
            v-permission="['retail:return:approve']"
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

    <!-- 零售出库单查看窗口 -->
    <out-sheet-detail :id="formData.outSheetId" ref="viewOutSheetDetailDialog" />
  </div>
</template>
<script>
  import { defineComponent } from 'vue';
  import ApproveRefuse from '@/components/ApproveRefuse';
  import OutSheetDetail from '@/views/sc/retail/out/detail.vue';
  import PayType from '@/views/sc/pay-type/index.vue';
  import * as api from '@/api/sc/retail/return';
  import { multiplePageMix } from '@/mixins/multiplePageMix';
  import { isEmpty, isFloatGeZero, getNumber, mul, add } from '@/utils/utils';
  import { createSuccess, createError, createConfirm } from '@/hooks/web/msg';
  import { RETAIL_RETURN_STATUS } from '@/enums/biz/retailReturnStatus';
  import OrderTimeLine from '@/components/OrderTimeLine';

  export default defineComponent({
    name: 'ApproveRetailReturn',
    components: {
      ApproveRefuse,
      OutSheetDetail,
      PayType,
      OrderTimeLine,
    },
    mixins: [multiplePageMix],
    setup() {
      return {
        isEmpty,
        isFloatGeZero,
        getNumber,
        mul,
        RETAIL_RETURN_STATUS,
      };
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
          { field: 'productCode', title: '商品编号', width: 120 },
          { field: 'productName', title: '商品名称', width: 260 },
          { field: 'unit', title: '单位', width: 80 },
          { field: 'spec', title: '规格', width: 80 },
          { field: 'categoryName', title: '商品分类', width: 120 },
          { field: 'brandName', title: '商品品牌', width: 120 },
          { field: 'retailPrice', title: '参考零售价（元）', align: 'right', width: 150 },
          { field: 'isGift', title: '是否赠品', width: 80, slots: { default: 'isGift_default' } },
          { field: 'discountRate', title: '折扣（%）', align: 'right', width: 120 },
          { field: 'taxPrice', title: '价格（元）', align: 'right', width: 120 },
          {
            field: 'outNum',
            title: '出库数量',
            align: 'right',
            width: 100,
            formatter: ({ cellValue }) => {
              return isEmpty(cellValue) ? '-' : cellValue;
            },
          },
          {
            field: 'remainNum',
            title: '剩余退货数量',
            align: 'right',
            width: 120,
            formatter: ({ cellValue }) => {
              return isEmpty(cellValue) ? '-' : cellValue;
            },
          },
          { field: 'returnNum', title: '退货数量', align: 'right', width: 100 },
          {
            field: 'taxAmount',
            title: '含税金额',
            align: 'right',
            width: 120,
            slots: { default: 'taxAmount_default' },
          },
          { field: 'taxRate', title: '税率（%）', align: 'right', width: 100 },
          { field: 'description', title: '备注', width: 200 },
        ],
        tableData: [],
      };
    },
    computed: {},
    created() {
      // 初始化表单数据
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
        this.closeCurrentPage();
      },
      // 初始化表单数据
      initFormData() {
        this.formData = {
          scName: '',
          memberName: '',
          salerName: '',
          paymentDate: '',
          outSheetId: '',
          outSheetCode: '',
          totalNum: 0,
          giftNum: 0,
          totalAmount: 0,
          description: '',
        };

        this.tableData = [];
      },
      // 加载数据
      loadData() {
        this.loading = true;
        api
          .get(this.id)
          .then((res) => {
            if (
              !RETAIL_RETURN_STATUS.CREATED.equalsCode(res.status) &&
              !RETAIL_RETURN_STATUS.APPROVE_REFUSE.equalsCode(res.status)
            ) {
              createError('零售退货单已审核通过，无需重复审核！');
              this.closeDialog();
              return;
            }
            this.formData = {
              scName: res.scName,
              memberName: res.memberName,
              salerName: res.salerName || '',
              paymentDate: res.paymentDate || '',
              outSheetId: res.outSheetId || '',
              outSheetCode: res.outSheetCode || '',
              description: res.description,
              status: res.status,
              createBy: res.createBy,
              createTime: res.createTime,
              approveBy: res.approveBy,
              approveTime: res.approveTime,
              refuseReason: res.refuseReason,
              totalNum: 0,
              giftNum: 0,
              totalAmount: 0,
            };
            this.tableData = res.details || [];

            this.$refs.payType.setTableData(res.payTypes || []);
            this.calcSum();
          })
          .finally(() => {
            this.loading = false;
          });
      },
      // 计算汇总数据
      calcSum() {
        let totalNum = 0;
        let giftNum = 0;
        let totalAmount = 0;

        this.tableData
          .filter((t) => {
            return isFloatGeZero(t.taxPrice) && isFloatGeZero(t.returnNum);
          })
          .forEach((t) => {
            const num = parseFloat(t.returnNum);
            if (t.isGift) {
              giftNum = add(giftNum, num);
            } else {
              totalNum = add(totalNum, num);
            }

            totalAmount = add(totalAmount, getNumber(mul(num, t.taxPrice), 2));
          });

        this.formData.totalNum = totalNum;
        this.formData.giftNum = giftNum;
        this.formData.totalAmount = totalAmount;
      },
      // 审核通过
      approvePassOrder() {
        createConfirm('对零售退货单执行审核通过操作？').then(() => {
          this.loading = true;
          api
            .approvePass({
              id: this.id,
              description: this.formData.description,
            })
            .then((res) => {
              createSuccess('审核通过！');

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
            createSuccess('审核拒绝！');

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
