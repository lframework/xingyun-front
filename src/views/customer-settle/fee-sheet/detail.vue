<template>
  <a-modal v-model="visible" :mask-closable="false" width="75%" title="查看" :dialog-style="{ top: '20px' }" :footer="null">
    <div v-if="visible" v-permission="['settle:fee-sheet:query']" v-loading="loading">
      <j-border>
        <j-form>
          <j-form-item label="客户">
            {{ formData.customerName }}
          </j-form-item>
          <j-form-item label="收支方式">
            {{ formData.sheetType }}
          </j-form-item>
          <j-form-item />
          <j-form-item label="状态">
            <span v-if="$enums.CUSTOMER_SETTLE_FEE_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status)" style="color: #52C41A;">{{ $enums.CUSTOMER_SETTLE_FEE_SHEET_STATUS.getDesc(formData.status) }}</span>
            <span v-else-if="$enums.CUSTOMER_SETTLE_FEE_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)" style="color: #F5222D;">{{ $enums.CUSTOMER_SETTLE_FEE_SHEET_STATUS.getDesc(formData.status) }}</span>
            <span v-else style="color: #303133;">{{ $enums.CUSTOMER_SETTLE_FEE_SHEET_STATUS.getDesc(formData.status) }}</span>
          </j-form-item>
          <j-form-item label="拒绝理由" :content-nest="false" :span="16">
            <a-input v-if="$enums.CUSTOMER_SETTLE_FEE_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)" v-model="formData.refuseReason" read-only />
          </j-form-item>
          <j-form-item label="操作人">
            <span>{{ formData.createBy }}</span>
          </j-form-item>
          <j-form-item label="操作时间" :span="16">
            <span>{{ formData.createTime }}</span>
          </j-form-item>
          <j-form-item v-if="$enums.CUSTOMER_SETTLE_FEE_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status) || $enums.CUSTOMER_SETTLE_FEE_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)" label="审核人">
            <span>{{ formData.approveBy }}</span>
          </j-form-item>
          <j-form-item v-if="$enums.CUSTOMER_SETTLE_FEE_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status) || $enums.CUSTOMER_SETTLE_FEE_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)" label="审核时间" :span="16">
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

      <j-border title="合计">
        <j-form label-width="140px">
          <j-form-item label="总金额" :span="6">
            <a-input v-model="formData.totalAmount" class="number-input" read-only />
          </j-form-item>
        </j-form>
      </j-border>

      <j-border>
        <j-form label-width="140px">
          <j-form-item label="备注" :span="24" :content-nest="false">
            <a-textarea v-model.trim="formData.description" read-only />
          </j-form-item>
        </j-form>
      </j-border>
    </div>
  </a-modal>
</template>
<script>
export default {
  components: {
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
        { field: 'item', title: '项目', width: 200, formatter: ({ cellValue, row }) => { return row.item.name } },
        { field: 'amount', title: '金额', align: 'right', width: 120 }
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
      this.visible = true

      this.open()
    },
    // 关闭对话框
    closeDialog() {
      this.visible = false
      this.$emit('close')
    },
    // 初始化表单数据
    initFormData() {
      this.formData = {
        customerName: '',
        sheetType: '',
        totalNum: 0,
        giftNum: 0,
        totalAmount: 0,
        description: ''
      }
    },
    // 加载数据
    loadData() {
      this.loading = true
      this.$api.customerSettle.feeSheet.get(this.id).then(res => {
        this.formData = {
          customerName: res.customerName,
          sheetType: this.$enums.CUSTOMER_SETTLE_FEE_SHEET_TYPE.getDesc(res.sheetType),
          description: res.description,
          status: res.status,
          createBy: res.createBy,
          createTime: res.createTime,
          approveBy: res.approveBy,
          approveTime: res.approveTime,
          refuseReason: res.refuseReason,
          totalAmount: 0
        }
        const details = res.details.map(item => {
          return {
            id: item.id,
            item: {
              id: item.itemId,
              name: item.itemName
            },
            amount: item.amount
          }
        })

        this.tableData = details

        this.calcSum()
      }).finally(() => {
        this.loading = false
      })
    },
    // 页面显示时触发
    open() {
      // 初始化表单数据
      this.initFormData()

      this.loadData()
    },
    // 计算汇总数据
    calcSum() {
      let totalAmount = 0

      this.tableData.filter(t => {
        return this.$utils.isFloatGeZero(t.amount) && !this.$utils.isEmpty(t.item)
      }).forEach(t => {
        totalAmount = this.$utils.add(totalAmount, t.amount)
      })

      this.formData.totalAmount = totalAmount
    }
  }
}
</script>
<style>
</style>