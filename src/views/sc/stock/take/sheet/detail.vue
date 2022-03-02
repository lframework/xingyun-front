<template>
  <el-dialog :visible.sync="visible" :close-on-click-modal="false" append-to-body width="75%" title="查看" top="5vh" @open="open">
    <div v-if="visible" v-permission="['stock:take:sheet:query']" v-loading="loading">
      <j-border>
        <j-form>
          <j-form-item label="关联盘点任务">
            <div>
              <el-button v-permission="['stock:take:plan:query']" type="text" @click="e => $refs.viewTakeStockPlanDialog.openDialog()">{{ formData.planCode }}</el-button>
              <span v-no-permission="['stock:take:plan:query']">{{ formData.planCode }}</span>
            </div>
          </j-form-item>
          <j-form-item label="预先盘点单">
            <div v-if="!$utils.isEmpty(formData.preSheetId)">
              <el-button v-permission="['stock:take:sheet:query']" type="text" @click="e => $refs.viewPreTakeStockSheetDialog.openDialog()">{{ formData.preSheetCode }}</el-button>
              <span v-no-permission="['stock:take:sheet:query']">{{ formData.preSheetCode }}</span>
            </div>
          </j-form-item>
          <j-form-item label="仓库">
            <el-input :value="formData.scName" readonly />
          </j-form-item>
          <j-form-item label="盘点类别">
            <el-input :value="$enums.TAKE_STOCK_PLAN_TYPE.getDesc(formData.takeType)" readonly />
          </j-form-item>
          <j-form-item label="盘点状态">
            <el-input :value="$enums.TAKE_STOCK_PLAN_STATUS.getDesc(formData.takeStatus)" readonly />
          </j-form-item>
          <j-form-item label="类目/品牌">
            <el-input :value="formData.bizName" readonly />
          </j-form-item>
          <j-form-item label="备注" :span="24">
            <el-input v-model.trim="formData.description" type="textarea" resize="none" readonly />
          </j-form-item>
          <j-form-item label="审核状态" :span="24">
            <span v-if="$enums.TAKE_STOCK_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status)" style="color: #67C23A;">{{ $enums.TAKE_STOCK_SHEET_STATUS.getDesc(formData.status) }}</span>
            <span v-else-if="$enums.TAKE_STOCK_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)" style="color: #F56C6C;">{{ $enums.TAKE_STOCK_SHEET_STATUS.getDesc(formData.status) }}</span>
            <span v-else style="color: #303133;">{{ $enums.TAKE_STOCK_SHEET_STATUS.getDesc(formData.status) }}</span>
          </j-form-item>
          <j-form-item label="操作人">
            <span>{{ formData.updateBy }}</span>
          </j-form-item>
          <j-form-item label="操作时间" :span="16">
            <span>{{ formData.updateTime }}</span>
          </j-form-item>
          <j-form-item v-if="$enums.TAKE_STOCK_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status) || $enums.TAKE_STOCK_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)" label="审核人">
            <span>{{ formData.approveBy }}</span>
          </j-form-item>
          <j-form-item v-if="$enums.TAKE_STOCK_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status) || $enums.TAKE_STOCK_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)" label="审核时间" :span="16">
            <span>{{ formData.approveTime }}</span>
          </j-form-item>
          <j-form-item label="拒绝理由" :span="24" :content-nest="false">
            <el-input v-if="$enums.TAKE_STOCK_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)" v-model="formData.refuseReason" readonly />
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
        style="margin-top: 10px;"
      />

      <take-stock-plan-detail
        :id="formData.planId"
        ref="viewTakeStockPlanDialog"
      />

      <pre-take-stock-sheet-detail
        :id="formData.preSheetId"
        ref="viewPreTakeStockSheetDialog"
      />
    </div>
  </el-dialog>
</template>
<script>
import TakeStockPlanDetail from '@/views/sc/stock/take/plan/detail'
import PreTakeStockSheetDetail from '@/views/sc/stock/take/pre/detail'
export default {
  // 使用组件
  components: {
    TakeStockPlanDetail, PreTakeStockSheetDetail
  },
  props: {
    id: {
      type: String,
      required: true
    }
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
        { field: 'description', title: '备注', width: 200 }
      ],
      tableData: []
    }
  },
  created() {
    this.initFormData()
  },
  methods: {
    // 打开对话框 由父页面触发
    openDialog() {
      this.visible = true
    },
    // 关闭对话框
    closeDialog() {
      this.visible = false
      this.$emit('close')
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
        approveTime: ''
      }

      this.tableData = []
    },
    // 页面显示时触发
    open() {
      // 初始化数据
      this.initFormData()

      // 查询数据
      this.loadFormData()
    },
    // 查询数据
    async loadFormData() {
      this.loading = true
      await this.$api.sc.stock.take.takeStockSheet.getDetail(this.id).then(data => {
        this.formData = data
        this.tableData = data.details
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>