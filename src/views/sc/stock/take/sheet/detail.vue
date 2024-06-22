<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="75%"
    title="查看"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-permission="['stock:take:sheet:query']" v-loading="loading">
      <j-border>
        <j-form label-width="120px">
          <j-form-item label="关联盘点任务">
            <div>
              <a
                v-permission="['stock:take:plan:query']"
                @click="(e) => $refs.viewTakeStockPlanDialog.openDialog()"
                >{{ formData.planCode }}</a
              >
              <span v-no-permission="['stock:take:plan:query']">{{ formData.planCode }}</span>
            </div>
          </j-form-item>
          <j-form-item label="预先盘点单">
            <div v-if="!$utils.isEmpty(formData.preSheetId)">
              <a
                v-permission="['stock:take:sheet:query']"
                @click="(e) => $refs.viewPreTakeStockSheetDialog.openDialog()"
                >{{ formData.preSheetCode }}</a
              >
              <span v-no-permission="['stock:take:sheet:query']">{{ formData.preSheetCode }}</span>
            </div>
          </j-form-item>
          <j-form-item label="仓库">
            {{ formData.scName }}
          </j-form-item>
          <j-form-item label="盘点类别">
            {{ $enums.TAKE_STOCK_PLAN_TYPE.getDesc(formData.takeType) }}
          </j-form-item>
          <j-form-item label="盘点状态">
            {{ $enums.TAKE_STOCK_PLAN_STATUS.getDesc(formData.takeStatus) }}
          </j-form-item>
          <j-form-item label="类目/品牌">
            {{ formData.bizName }}
          </j-form-item>
          <j-form-item label="备注" :span="24">
            <a-textarea v-model:value.trim="formData.description" readonly />
          </j-form-item>
          <j-form-item label="状态" :span="24">
            <span
              v-if="$enums.TAKE_STOCK_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status)"
              style="color: #52c41a"
              >{{ $enums.TAKE_STOCK_SHEET_STATUS.getDesc(formData.status) }}</span
            >
            <span
              v-else-if="$enums.TAKE_STOCK_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)"
              style="color: #f5222d"
              >{{ $enums.TAKE_STOCK_SHEET_STATUS.getDesc(formData.status) }}</span
            >
            <span v-else style="color: #303133">{{
              $enums.TAKE_STOCK_SHEET_STATUS.getDesc(formData.status)
            }}</span>
          </j-form-item>
          <j-form-item label="操作人">
            <span>{{ formData.updateBy }}</span>
          </j-form-item>
          <j-form-item label="操作时间" :span="16">
            <span>{{ formData.updateTime }}</span>
          </j-form-item>
          <j-form-item
            v-if="
              $enums.TAKE_STOCK_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status) ||
              $enums.TAKE_STOCK_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
            "
            label="审核人"
          >
            <span>{{ formData.approveBy }}</span>
          </j-form-item>
          <j-form-item
            v-if="
              $enums.TAKE_STOCK_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status) ||
              $enums.TAKE_STOCK_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)
            "
            label="审核时间"
            :span="16"
          >
            <span>{{ formData.approveTime }}</span>
          </j-form-item>
          <j-form-item label="拒绝理由" :span="24" :content-nest="false">
            <a-input
              v-if="$enums.TAKE_STOCK_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)"
              v-model:value="formData.refuseReason"
              readonly
            />
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

      <take-stock-plan-detail :id="formData.planId" ref="viewTakeStockPlanDialog" />

      <pre-take-stock-sheet-detail :id="formData.preSheetId" ref="viewPreTakeStockSheetDialog" />
    </div>
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';
  import TakeStockPlanDetail from '@/views/sc/stock/take/plan/detail.vue';
  import PreTakeStockSheetDetail from '@/views/sc/stock/take/pre/detail.vue';
  import * as api from '@/api/sc/stock/take/sheet';

  export default defineComponent({
    // 使用组件
    components: {
      TakeStockPlanDetail,
      PreTakeStockSheetDetail,
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
          { field: 'productCode', title: '商品编号', width: 120 },
          { field: 'productName', title: '商品名称', width: 260 },
          { field: 'skuCode', title: '商品SKU编号', width: 120 },
          { field: 'externalCode', title: '商品外部编号', width: 120 },
          { field: 'unit', title: '单位', width: 80 },
          { field: 'spec', title: '规格', width: 80 },
          { field: 'categoryName', title: '商品类目', width: 120 },
          { field: 'brandName', title: '商品品牌', width: 120 },
          { field: 'stockNum', title: '系统库存数量', width: 120, align: 'right' },
          { field: 'takeNum', title: '盘点数量', width: 120, align: 'right' },
          { field: 'description', title: '备注', width: 200 },
        ],
        tableData: [],
      };
    },
    created() {
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
          id: '',
          code: '',
          planId: '',
          planCode: '',
          preSheetId: '',
          preSheetCode: '',
          scName: '',
          takeType: '',
          takeStatus: '',
          bizName: '',
          status: '',
          description: '',
          updateBy: '',
          updateTime: '',
          approveBy: '',
          approveTime: '',
        };

        this.tableData = [];
      },
      // 页面显示时触发
      open() {
        // 初始化数据
        this.initFormData();

        // 查询数据
        this.loadFormData();
      },
      // 查询数据
      loadFormData() {
        this.loading = true;
        api
          .getDetail(this.id)
          .then((data) => {
            this.formData = data;
            this.tableData = data.details;
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
  });
</script>
