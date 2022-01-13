<template>
  <div v-if="visible" class="app-container">
    <div v-permission="['settle:check-sheet:approve']" v-loading="loading">
      <j-border>
        <j-form>
          <j-form-item label="供应商">
            <el-input
              v-model="formData.supplierName"
              readonly
            />
          </j-form-item>
          <j-form-item label="审核日期" :content-nest="false" required>
            <el-date-picker
              v-model="formData.startTime"
              type="date"
              value-format="yyyy-MM-dd 00:00:00"
              disabled
            />
            <span class="date-split">至</span>
            <el-date-picker
              v-model="formData.endTime"
              type="date"
              value-format="yyyy-MM-dd 23:59:59"
              disabled
            />
          </j-form-item>
          <j-form-item />
          <j-form-item label="审核状态">
            <span v-if="$enums.SETTLE_CHECK_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status)" style="color: #67C23A;">{{ $enums.SETTLE_CHECK_SHEET_STATUS.getDesc(formData.status) }}</span>
            <span v-else-if="$enums.SETTLE_CHECK_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)" style="color: #F56C6C;">{{ $enums.SETTLE_CHECK_SHEET_STATUS.getDesc(formData.status) }}</span>
            <span v-else style="color: #303133;">{{ $enums.SETTLE_CHECK_SHEET_STATUS.getDesc(formData.status) }}</span>
          </j-form-item>
          <j-form-item label="拒绝理由" :content-nest="false" :span="16">
            <el-input v-if="$enums.SETTLE_CHECK_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)" v-model="formData.refuseReason" readonly />
          </j-form-item>
          <j-form-item label="操作人">
            <span>{{ formData.createBy }}</span>
          </j-form-item>
          <j-form-item label="操作时间" :span="16">
            <span>{{ formData.createTime }}</span>
          </j-form-item>
          <j-form-item v-if="$enums.SETTLE_CHECK_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status) || $enums.SETTLE_CHECK_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)" label="审核人">
            <span>{{ formData.approveBy }}</span>
          </j-form-item>
          <j-form-item v-if="$enums.SETTLE_CHECK_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status) || $enums.SETTLE_CHECK_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)" label="审核时间" :span="16">
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
        style="margin-top: 10px;"
      >
        <!-- 项目 列自定义内容 -->
        <template v-slot:item_default="{ row }">
          <span>{{ row.item.name }}</span>
        </template>

        <!-- 金额 列自定义内容 -->
        <template v-slot:amount_default="{ row }">
          <span>{{ row.amount }}</span>
        </template>
      </vxe-grid>

      <j-border title="合计">
        <j-form label-width="140px">
          <j-form-item label="单据总金额" :span="6">
            <el-input v-model="formData.totalAmount" class="number-input" readonly />
          </j-form-item>
          <j-form-item label="应付总金额" :span="6">
            <el-input v-model="formData.totalPayAmount" class="number-input" readonly />
          </j-form-item>
        </j-form>
      </j-border>

      <j-border>
        <j-form label-width="140px">
          <j-form-item label="备注" :span="24" :content-nest="false">
            <el-input v-model.trim="formData.description" maxlength="200" show-word-limit type="textarea" resize="none" />
          </j-form-item>
        </j-form>
      </j-border>

      <div v-if="$enums.SETTLE_CHECK_SHEET_STATUS.CREATED.equalsCode(formData.status) || $enums.SETTLE_CHECK_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)" style="text-align: center;">
        <el-button v-permission="['settle:check-sheet:approve']" type="primary" :loading="loading" @click="approvePassOrder">审核通过</el-button>
        <el-button v-if="$enums.SETTLE_CHECK_SHEET_STATUS.CREATED.equalsCode(formData.status)" v-permission="['settle:check-sheet:approve']" type="danger" :loading="loading" @click="approveRefuseOrder">审核拒绝</el-button>
        <el-button :loading="loading" @click="closeDialog">关闭</el-button>
      </div>
    </div>
    <approve-refuse ref="approveRefuseDialog" @confirm="doApproveRefuse" />
  </div>
</template>
<script>
import ApproveRefuse from '@/components/ApproveRefuse'
export default {
  components: {
    ApproveRefuse
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
        { type: 'seq', width: 40 },
        { field: 'bizCode', title: '业务单据号', width: 200 },
        { field: 'bizType', title: '单据类型', width: 120, formatter: ({ cellValue }) => { return this.$enums.SETTLE_CHECK_SHEET_BIZ_TYPE.getDesc(cellValue) } },
        { field: 'approveTime', title: '审核时间', width: 150 },
        { field: 'totalAmount', title: '单据金额', align: 'right', width: 100 },
        { field: 'payAmount', title: '应付金额', align: 'right', width: 100 },
        { field: 'description', title: '备注', width: 260 }
      ],
      tableData: []
    }
  },
  computed: {
  },
  created() {
    // 初始化表单数据
    this.initFormData()
  },
  methods: {
    // 打开对话框 由父页面触发
    openDialog() {
      // 初始化表单数据
      this.initFormData()
      this.visible = true
      this.loadData()
    },
    // 关闭对话框
    closeDialog() {
      this.visible = false
      this.$emit('close')
    },
    // 初始化表单数据
    initFormData() {
      this.formData = {
        supplierName: '',
        description: '',
        startTime: '',
        endTime: '',
        totalAmount: 0,
        totalPayAmount: 0
      }
    },
    // 加载数据
    loadData() {
      this.loading = true
      this.$api.settle.checkSheet.get(this.id).then(res => {
        if (!this.$enums.SETTLE_CHECK_SHEET_STATUS.CREATED.equalsCode(res.status) && !this.$enums.SETTLE_CHECK_SHEET_STATUS.APPROVE_REFUSE.equalsCode(res.status)) {
          this.$msg.error('单据已审核通过，无需重复审核！')
          this.closeDialog()
          return
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
          totalPayAmount: 0
        }
        const details = res.details.map(item => {
          return {
            id: item.id,
            bizId: item.bizId,
            bizCode: item.bizCode,
            bizType: item.bizType,
            totalAmount: item.totalAmount,
            payAmount: item.payAmount,
            approveTime: item.approveTime,
            description: item.description
          }
        })

        this.tableData = details

        this.calcSum()
      }).finally(() => {
        this.loading = false
      })
    },
    // 计算汇总数据
    calcSum() {
      let totalAmount = 0
      let totalPayAmount = 0
      this.tableData.forEach(item => {
        if (this.$utils.isFloat(item.totalAmount)) {
          totalAmount = this.$utils.add(totalAmount, item.totalAmount)
        }

        if (this.$utils.isFloat(item.payAmount)) {
          totalPayAmount = this.$utils.add(totalPayAmount, item.payAmount)
        }
      })

      this.formData.totalAmount = totalAmount
      this.formData.totalPayAmount = totalPayAmount
    },
    // 审核通过
    approvePassOrder() {
      this.$msg.confirm('确定执行审核通过操作？').then(() => {
        this.loading = true
        this.$api.settle.checkSheet.approvePassOrder({
          id: this.id,
          description: this.formData.description
        }).then(res => {
          this.$msg.success('审核通过！')

          this.$emit('confirm')
          this.closeDialog()
        }).finally(() => {
          this.loading = false
        })
      })
    },
    // 审核拒绝
    approveRefuseOrder() {
      this.$refs.approveRefuseDialog.openDialog()
    },
    // 开始审核拒绝
    doApproveRefuse(reason) {
      this.loading = true
      this.$api.settle.checkSheet.approveRefuseOrder({
        id: this.id,
        refuseReason: reason
      }).then(() => {
        this.$msg.success('审核拒绝！')

        this.$emit('confirm')
        this.closeDialog()
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style>
</style>
