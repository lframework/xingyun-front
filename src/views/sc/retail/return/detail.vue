<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="75%"
    title="查看"
    :style="{ top: '20px' }"
  >
    <div v-if="visible" v-permission="['retail:return:query']" v-loading="loading">
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
            <a-textarea v-model:value.trim="formData.description" maxlength="200" readonly />
          </j-form-item>
        </j-form>
      </j-border>
    </div>
    <template #footer>
      <div class="form-modal-footer">
        <a-space>
          <a-button type="primary" :loading="loading" @click="print">打印</a-button>
          <a-button :loading="loading" @click="closeDialog">关闭</a-button>
        </a-space>
      </div>
    </template>
    <!-- 零售出库单查看窗口 -->
    <out-sheet-detail :id="formData.outSheetId" ref="viewOutSheetDetailDialog" />
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';
  import OutSheetDetail from '@/views/sc/retail/out/detail.vue';
  import PayType from '@/views/sc/pay-type/index.vue';
  import * as api from '@/api/sc/retail/return';
  import { printMix } from '@/mixins/print';
  import { isEmpty, isFloatGeZero, getNumber, mul, add } from '@/utils/utils';
  import { RETAIL_RETURN_STATUS } from '@/enums/biz/retailReturnStatus';
  import { PRINT_TYPE } from '@/enums/biz/printType';
  import OrderTimeLine from '@/components/OrderTimeLine';

  export default defineComponent({
    components: {
      OutSheetDetail,
      PayType,
      OrderTimeLine,
    },
    mixins: [printMix],
    props: {
      id: {
        type: String,
        required: true,
      },
    },
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
        // 是否可见
        visible: false,
        // 是否显示加载框
        loading: false,
        // 表单数据
        formData: {},
        // 列表数据配置
        tableColumn: [
          { type: 'seq', width: 50 },
          { field: 'productCode', title: '商品编号', width: 120 },
          { field: 'skuCode', title: 'SKU编号', width: 120 },
          { field: 'productName', title: '商品名称', width: 260 },
          { field: 'salePropertyText', title: '销售属性', minWidth: 180 },
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
      // 页面显示时触发
      open() {
        // 初始化表单数据
        this.initFormData();

        this.loadData();
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
      print() {
        this.loading = true;
        api
          .print(this.id)
          .then((res) => {
            this.lodopPreview(PRINT_TYPE.RETAIL_RETURN.code, res);
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
  });
</script>
<style></style>
