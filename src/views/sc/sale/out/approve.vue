<template>
  <div class="app-card-container">
    <div v-permission="['sale:out:approve']" v-loading="loading">
      <j-border>
        <j-form bordered>
          <j-form-item label="仓库">
            {{ formData.scName }}
          </j-form-item>
          <j-form-item label="客户">
            {{ formData.customerName }}
          </j-form-item>
          <j-form-item label="销售员">
            {{ formData.salerName }}
          </j-form-item>
          <j-form-item label="付款日期">
            {{ formData.paymentDate }}
          </j-form-item>
          <j-form-item label="销售订单" :span="16">
            <div v-if="!$utils.isEmpty(formData.saleOrderCode)">
              <a
                v-permission="['sale:order:query']"
                @click="(e) => $refs.viewSaleOrderDetailDialog.openDialog()"
                >{{ formData.saleOrderCode }}</a
              >
              <span v-no-permission="['sale:order:query']">{{ formData.saleOrderCode }}</span>
            </div>
          </j-form-item>
          <j-form-item label="状态">
            <span
              v-if="$enums.SALE_OUT_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status)"
              style="color: #52c41a"
              >{{ $enums.SALE_OUT_SHEET_STATUS.getDesc(formData.status) }}</span
            >
            <span
              v-else-if="$enums.SALE_OUT_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)"
              style="color: #f5222d"
              >{{ $enums.SALE_OUT_SHEET_STATUS.getDesc(formData.status) }}</span
            >
            <span v-else style="color: #303133">{{
              $enums.SALE_OUT_SHEET_STATUS.getDesc(formData.status)
            }}</span>
          </j-form-item>
          <j-form-item label="拒绝理由" :span="16" :content-nest="false">
            <a-input
              v-if="$enums.SALE_OUT_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)"
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
              $enums.SALE_OUT_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status) ||
              $enums.SALE_OUT_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
            "
            label="审核人"
          >
            <span>{{ formData.approveBy }}</span>
          </j-form-item>
          <j-form-item
            v-if="
              $enums.SALE_OUT_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status) ||
              $enums.SALE_OUT_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
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
        <!-- 库存数量 列自定义内容 -->
        <template #stockNum_default="{ row }">
          <span v-if="checkStockNum(row)">{{ row.stockNum }}</span>
          <span v-else style="color: #f5222d">{{ row.stockNum }}</span>
        </template>

        <!-- 含税金额 列自定义内容 -->
        <template #taxAmount_default="{ row }">
          <span v-if="$utils.isFloatGeZero(row.taxPrice) && $utils.isIntegerGeZero(row.outNum)">{{
            $utils.mul(row.taxPrice, row.outNum)
          }}</span>
        </template>
      </vxe-grid>

      <order-time-line :id="id" />

      <j-border title="合计">
        <j-form bordered label-width="140px">
          <j-form-item label="出库数量" :span="6">
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

      <j-border>
        <j-form bordered label-width="140px">
          <j-form-item label="备注" :span="24" :content-nest="false">
            <a-textarea v-model:value.trim="formData.description" maxlength="200" />
          </j-form-item>
        </j-form>
      </j-border>

      <div
        v-if="
          $enums.SALE_OUT_SHEET_STATUS.CREATED.equalsCode(formData.status) ||
          $enums.SALE_OUT_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
        "
        style="text-align: center; background-color: #ffffff; padding: 8px 0"
      >
        <a-space>
          <a-button
            v-permission="['sale:out:approve']"
            type="primary"
            :loading="loading"
            @click="approvePassOrder"
            >审核通过</a-button
          >
          <a-button
            v-if="$enums.SALE_OUT_SHEET_STATUS.CREATED.equalsCode(formData.status)"
            v-permission="['sale:out:approve']"
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

    <!-- 销售订单查看窗口 -->
    <sale-order-detail :id="formData.saleOrderId" ref="viewSaleOrderDetailDialog" />
  </div>
</template>
<script>
  import { defineComponent } from 'vue';
  import ApproveRefuse from '@/components/ApproveRefuse';
  import SaleOrderDetail from '@/views/sc/sale/order/detail.vue';
  import * as api from '@/api/sc/sale/out';
  import { multiplePageMix } from '@/mixins/multiplePageMix';

  export default defineComponent({
    name: 'ApproveSaleOutSheet',
    components: {
      ApproveRefuse,
      SaleOrderDetail,
    },
    mixins: [multiplePageMix],
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
          { field: 'skuCode', title: '商品SKU编号', width: 120 },
          { field: 'externalCode', title: '商品简码', width: 120 },
          { field: 'unit', title: '单位', width: 80 },
          { field: 'spec', title: '规格', width: 80 },
          { field: 'categoryName', title: '商品分类', width: 120 },
          { field: 'brandName', title: '商品品牌', width: 120 },
          { field: 'mainProductName', title: '所属组合商品', width: 120 },
          { field: 'salePrice', title: '参考销售价（元）', align: 'right', width: 150 },
          {
            field: 'isGift',
            title: '是否赠品',
            width: 80,
            formatter: ({ cellValue }) => {
              return cellValue ? '是' : '否';
            },
          },
          {
            field: 'stockNum',
            title: '库存数量',
            align: 'right',
            width: 100,
            slots: { default: 'stockNum_default' },
          },
          { field: 'discountRate', title: '折扣（%）', align: 'right', width: 120 },
          { field: 'taxPrice', title: '价格（元）', align: 'right', width: 120 },
          {
            field: 'orderNum',
            title: '销售数量',
            align: 'right',
            width: 100,
            formatter: ({ cellValue }) => {
              return this.$utils.isEmpty(cellValue) ? '-' : cellValue;
            },
          },
          {
            field: 'remainNum',
            title: '剩余出库数量',
            align: 'right',
            width: 120,
            formatter: ({ cellValue }) => {
              return this.$utils.isEmpty(cellValue) ? '-' : cellValue;
            },
          },
          { field: 'outNum', title: '出库数量', align: 'right', width: 100 },
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
          customerName: '',
          salerName: '',
          paymentDate: '',
          saleOrderId: '',
          saleOrderCode: '',
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
              !this.$enums.SALE_OUT_SHEET_STATUS.CREATED.equalsCode(res.status) &&
              !this.$enums.SALE_OUT_SHEET_STATUS.APPROVE_REFUSE.equalsCode(res.status)
            ) {
              this.$msg.createError('销售出库单已审核通过，无需重复审核！');
              this.closeDialog();
              return;
            }
            this.formData = {
              scName: res.scName,
              customerName: res.customerName,
              salerName: res.salerName || '',
              paymentDate: res.paymentDate || '',
              saleOrderId: res.saleOrderId || '',
              saleOrderCode: res.saleOrderCode || '',
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
            return this.$utils.isFloatGeZero(t.taxPrice) && this.$utils.isIntegerGeZero(t.outNum);
          })
          .forEach((t) => {
            const num = parseInt(t.outNum);
            if (t.isGift) {
              giftNum = this.$utils.add(giftNum, num);
            } else {
              totalNum = this.$utils.add(totalNum, num);
            }

            totalAmount = this.$utils.add(totalAmount, this.$utils.mul(num, t.taxPrice));
          });

        this.formData.totalNum = totalNum;
        this.formData.giftNum = giftNum;
        this.formData.totalAmount = totalAmount;
      },
      // 审核通过
      approvePassOrder() {
        const checkStockNumArr = [];
        this.tableData
          .filter((item) => this.$utils.isIntegerGtZero(item.outNum))
          .forEach((item) => {
            if (checkStockNumArr.map((v) => item.productId).includes(item.productId)) {
              checkStockNumArr
                .filter((v) => v.productId === item.productId)
                .forEach((v) => {
                  v.outNum = this.$utils.add(v.outNum, item.outNum);
                });
            } else {
              checkStockNumArr.push({
                productId: item.productId,
                productCode: item.productCode,
                productName: item.productName,
                stockNum: item.stockNum,
                outNum: item.outNum,
              });
            }
          });

        const unValidStockNumArr = checkStockNumArr.filter((item) => item.stockNum < item.outNum);
        if (!this.$utils.isEmpty(unValidStockNumArr)) {
          this.$msg.createError(
            '商品（' +
              unValidStockNumArr[0].productCode +
              '）' +
              unValidStockNumArr[0].productName +
              '当前库存为' +
              unValidStockNumArr[0].stockNum +
              '，总出库数量为' +
              unValidStockNumArr[0].outNum +
              '，无法完成销售出库！',
          );
          return false;
        }

        this.$msg.createConfirm('对销售出库单执行审核通过操作？').then(() => {
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
      // 检查库存数量
      checkStockNum(row) {
        const checkArr = this.tableData
          .filter((item) => item.productId === row.productId)
          .map((item) => item.outNum);
        if (this.$utils.isEmpty(checkArr)) {
          checkArr.push(0);
        }
        const totalOutNum = checkArr.reduce((total, item) => {
          const outNum = this.$utils.isIntegerGtZero(item) ? item : 0;
          return this.$utils.add(total, outNum);
        }, 0);

        return totalOutNum <= row.stockNum;
      },
    },
  });
</script>
<style></style>
