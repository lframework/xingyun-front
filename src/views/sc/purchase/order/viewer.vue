<template>
  <div v-permission="['purchase:order:query']" v-loading="loading">
    <j-border>
      <j-form bordered>
        <j-form-item label="仓库">
          {{ formData.scName }}
        </j-form-item>
        <j-form-item label="供应商">
          {{ formData.supplierName }}
        </j-form-item>
        <j-form-item label="采购员">
          {{ formData.purchaserName }}
        </j-form-item>
        <j-form-item label="预计到货日期">
          {{ formData.expectArriveDate }}
        </j-form-item>
        <j-form-item label="状态">
          <span
            v-if="$enums.PURCHASE_ORDER_STATUS.APPROVE_PASS.equalsCode(formData.status)"
            style="color: #52c41a"
            >{{ $enums.PURCHASE_ORDER_STATUS.getDesc(formData.status) }}</span
          >
          <span
            v-else-if="$enums.PURCHASE_ORDER_STATUS.APPROVE_REFUSE.equalsCode(formData.status)"
            style="color: #f5222d"
            >{{ $enums.PURCHASE_ORDER_STATUS.getDesc(formData.status) }}</span
          >
          <span v-else style="color: #303133">{{
            $enums.PURCHASE_ORDER_STATUS.getDesc(formData.status)
          }}</span>
        </j-form-item>
        <j-form-item label="拒绝理由" :content-nest="false">
          <a-input
            v-if="$enums.PURCHASE_ORDER_STATUS.APPROVE_REFUSE.equalsCode(formData.status)"
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
            $enums.PURCHASE_ORDER_STATUS.APPROVE_PASS.equalsCode(formData.status) ||
            $enums.PURCHASE_ORDER_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
          "
          label="审核人"
        >
          <span>{{ formData.approveBy }}</span>
        </j-form-item>
        <j-form-item
          v-if="
            $enums.PURCHASE_ORDER_STATUS.APPROVE_PASS.equalsCode(formData.status) ||
            $enums.PURCHASE_ORDER_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
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
      <!-- 采购含税金额 列自定义内容 -->
      <template #purchaseAmount_default="{ row }">
        <span
          v-if="$utils.isFloatGeZero(row.purchasePrice) && $utils.isFloatGeZero(row.purchaseNum)"
          >{{ $utils.mul(row.purchasePrice, row.purchaseNum) }}</span
        >
      </template>
    </vxe-grid>

    <j-border title="合计">
      <j-form bordered label-width="140px">
        <j-form-item label="采购数量" :span="6">
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

    <j-border title="约定支付">
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
</template>
<script>
  import { defineComponent } from 'vue';
  import PayType from '@/views/sc/pay-type/index.vue';
  import * as api from '@/api/sc/purchase/order';

  export default defineComponent({
    components: {
      PayType,
    },
    props: {
      id: {
        type: String,
        required: true,
      },
      isForm: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        // 是否显示加载框
        loading: false,
        // 表单数据
        formData: {},
        // 列表数据配置
        tableColumn: [
          { type: 'seq', width: 50 },
          { field: 'productCode', title: '商品编号', width: 120 },
          { field: 'productName', title: '商品名称', width: 260 },
          { field: 'skuCode', title: '商品SKU编号', width: 120 },
          { field: 'externalCode', title: '商品简码', width: 120 },
          { field: 'unit', title: '单位', width: 80 },
          { field: 'spec', title: '规格', width: 80 },
          { field: 'categoryName', title: '商品分类', width: 120 },
          { field: 'brandName', title: '商品品牌', width: 120 },
          { field: 'purchasePrice', title: '采购价（元）', align: 'right', width: 120 },
          { field: 'taxRate', title: '税率（%）', align: 'right', width: 100 },
          {
            field: 'isGift',
            title: '是否赠品',
            width: 80,
            formatter: ({ cellValue }) => {
              return cellValue ? '是' : '否';
            },
          },
          { field: 'purchaseNum', title: '采购数量', align: 'right', width: 100 },
          {
            field: 'purchaseAmount',
            title: '采购含税金额',
            align: 'right',
            width: 120,
            slots: { default: 'purchaseAmount_default' },
          },
          { field: 'description', title: '备注', width: 200 },
        ],
        tableData: [],
      };
    },
    computed: {},
    created() {
      // 初始化表单数据
      this.open();
    },
    methods: {
      // 初始化表单数据
      initFormData() {
        this.formData = {
          scName: '',
          supplierName: '',
          purchaserName: '',
          expectArriveDate: '',
          totalNum: 0,
          giftNum: 0,
          totalAmount: 0,
          description: '',
          flowInstanceId: '',
        };

        this.tableData = [];
      },
      // 加载数据
      loadData() {
        this.loading = true;
        api
          .get(this.id, this.isForm)
          .then((res) => {
            this.formData = {
              id: res.id,
              scName: res.scName,
              supplierName: res.supplierName,
              purchaserName: res.purchaserName,
              expectArriveDate: res.expectArriveDate,
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
              flowInstanceId: res.flowInstanceId,
            };
            this.tableData = res.details || [];

            this.$refs.payType.setTableData(res.payTypes || []);
            this.calcSum();

            this.$emit('load-data-complete', this.formData);
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
            return (
              this.$utils.isFloatGeZero(t.purchasePrice) &&
              this.$utils.isIntegerGeZero(t.purchaseNum)
            );
          })
          .forEach((t) => {
            const num = parseInt(t.purchaseNum);
            if (t.isGift) {
              giftNum = this.$utils.add(giftNum, num);
            } else {
              totalNum = this.$utils.add(totalNum, num);
            }

            totalAmount = this.$utils.add(totalAmount, this.$utils.mul(num, t.purchasePrice));
          });

        this.formData.totalNum = totalNum;
        this.formData.giftNum = giftNum;
        this.formData.totalAmount = totalAmount;
      },
      getFormData() {
        return this.formData;
      },
    },
  });
</script>
<style></style>
