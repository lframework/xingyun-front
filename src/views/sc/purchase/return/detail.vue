<template>
  <div>
    <a-modal
      v-model:open="visible"
      :mask-closable="false"
      width="75%"
      title="查看"
      :style="{ top: '20px' }"
    >
      <div v-if="visible" v-permission="['purchase:return:query']" v-loading="loading">
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
            <j-form-item label="付款日期">
              {{ formData.paymentDate }}
            </j-form-item>
            <j-form-item label="采购收货单" :span="16">
              <div v-if="!$utils.isEmpty(formData.receiveSheetCode)">
                <a
                  v-permission="['purchase:receive:query']"
                  @click="(e) => $refs.viewReceiveSheetDetailDialog.openDialog()"
                  >{{ formData.receiveSheetCode }}</a
                >
                <span v-no-permission="['purchase:receive:query']">{{
                  formData.receiveSheetCode
                }}</span>
              </div>
            </j-form-item>
            <j-form-item label="状态">
              <span
                v-if="$enums.PURCHASE_RETURN_STATUS.APPROVE_PASS.equalsCode(formData.status)"
                style="color: #52c41a"
                >{{ $enums.PURCHASE_RETURN_STATUS.getDesc(formData.status) }}</span
              >
              <span
                v-else-if="$enums.PURCHASE_RETURN_STATUS.APPROVE_REFUSE.equalsCode(formData.status)"
                style="color: #f5222d"
                >{{ $enums.PURCHASE_RETURN_STATUS.getDesc(formData.status) }}</span
              >
              <span v-else style="color: #303133">{{
                $enums.PURCHASE_RETURN_STATUS.getDesc(formData.status)
              }}</span>
            </j-form-item>
            <j-form-item label="拒绝理由" :span="16" :content-nest="false">
              <a-input
                v-if="$enums.PURCHASE_RETURN_STATUS.APPROVE_REFUSE.equalsCode(formData.status)"
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
                $enums.PURCHASE_RETURN_STATUS.APPROVE_PASS.equalsCode(formData.status) ||
                $enums.PURCHASE_RETURN_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
              "
              label="审核人"
            >
              <span>{{ formData.approveBy }}</span>
            </j-form-item>
            <j-form-item
              v-if="
                $enums.PURCHASE_RETURN_STATUS.APPROVE_PASS.equalsCode(formData.status) ||
                $enums.PURCHASE_RETURN_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
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
          <!-- 含税金额 列自定义内容 -->
          <template #taxAmount_default="{ row }">
            <span
              v-if="
                $utils.isFloatGeZero(row.purchasePrice) && $utils.isIntegerGeZero(row.returnNum)
              "
              >{{ $utils.mul(row.purchasePrice, row.returnNum) }}</span
            >
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
    </a-modal>
    <!-- 采购收货单查看窗口 -->
    <receive-sheet-detail :id="formData.receiveSheetId" ref="viewReceiveSheetDetailDialog" />
  </div>
</template>
<script>
  import { defineComponent } from 'vue';
  import ReceiveSheetDetail from '@/views/sc/purchase/receive/detail.vue';
  import * as api from '@/api/sc/purchase/return';
  import { printMix } from '@/mixins/print';

  export default defineComponent({
    components: {
      ReceiveSheetDetail,
    },
    mixins: [printMix],
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
          { field: 'productCode', title: '商品编号', width: 120 },
          { field: 'productName', title: '商品名称', width: 260 },
          { field: 'skuCode', title: '商品SKU编号', width: 120 },
          { field: 'externalCode', title: '商品简码', width: 120 },
          { field: 'unit', title: '单位', width: 80 },
          { field: 'spec', title: '规格', width: 80 },
          { field: 'categoryName', title: '商品分类', width: 120 },
          { field: 'brandName', title: '商品品牌', width: 120 },
          {
            field: 'isGift',
            title: '是否赠品',
            width: 80,
            formatter: ({ cellValue }) => {
              return cellValue ? '是' : '否';
            },
          },
          { field: 'purchasePrice', title: '退货价（元）', align: 'right', width: 120 },
          {
            field: 'receiveNum',
            title: '收货数量',
            align: 'right',
            width: 100,
            formatter: ({ cellValue }) => {
              return this.$utils.isEmpty(cellValue) ? '-' : cellValue;
            },
          },
          {
            field: 'remainNum',
            title: '剩余退货数量',
            align: 'right',
            width: 120,
            formatter: ({ cellValue }) => {
              return this.$utils.isEmpty(cellValue) ? '-' : cellValue;
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
          supplierName: '',
          purchaserName: '',
          paymentDate: '',
          receiveSheetId: '',
          receiveSheetCode: '',
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
              supplierName: res.supplierName,
              purchaserName: res.purchaserName || '',
              paymentDate: res.paymentDate || '',
              receiveSheetId: res.receiveSheetId || '',
              receiveSheetCode: res.receiveSheetCode || '',
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
              this.$utils.isFloatGeZero(t.purchasePrice) && this.$utils.isIntegerGeZero(t.returnNum)
            );
          })
          .forEach((t) => {
            const num = parseInt(t.returnNum);
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
      print() {
        this.loading = true;
        api
          .print(this.id)
          .then((res) => {
            this.lodopPreview(this.$enums.PRINT_TYPE.PURCHASE_RETURN.code, res);
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
  });
</script>
<style></style>
