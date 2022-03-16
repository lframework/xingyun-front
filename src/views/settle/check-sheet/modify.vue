<template>
  <div v-if="visible" class="app-container">
    <div v-permission="['settle:check-sheet:modify']" v-loading="loading">
      <j-border>
        <j-form>
          <j-form-item label="供应商" required>
            <supplier-selector
              v-model="formData.supplier"
              :request-params="{
                manageType: $enums.MANAGE_TYPE.DISTRIBUTION.code
              }"
            />
          </j-form-item>
          <j-form-item label="审核日期" :content-nest="false" required>
            <div class="date-range-container">
              <a-date-picker
                v-model="formData.startTime"
                placeholder=""
                value-format="YYYY-MM-DD 00:00:00"
                disabled
              />
              <span class="date-split">至</span>
              <a-date-picker
                v-model="formData.endTime"
                placeholder=""
                value-format="YYYY-MM-DD 23:59:59"
                disabled
              />
            </div>
          </j-form-item>
          <j-form-item />
          <j-form-item label="状态">
            <span v-if="$enums.SETTLE_CHECK_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status)" style="color: #52C41A;">{{ $enums.SETTLE_CHECK_SHEET_STATUS.getDesc(formData.status) }}</span>
            <span v-else-if="$enums.SETTLE_CHECK_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)" style="color: #F5222D;">{{ $enums.SETTLE_CHECK_SHEET_STATUS.getDesc(formData.status) }}</span>
            <span v-else style="color: #303133;">{{ $enums.SETTLE_CHECK_SHEET_STATUS.getDesc(formData.status) }}</span>
          </j-form-item>
          <j-form-item label="拒绝理由" :content-nest="false" :span="16">
            <a-input v-if="$enums.SETTLE_CHECK_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)" v-model="formData.refuseReason" read-only />
          </j-form-item>
          <j-form-item label="操作人">
            <span>{{ formData.createBy }}</span>
          </j-form-item>
          <j-form-item label="操作时间">
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
        @checkbox-change="calcSum"
      >
        <!-- 工具栏 -->
        <template v-slot:toolbar_buttons>
          <a-space>
            <a-button type="primary" icon="search" @click="searchUnCheckItems">查询</a-button>
          </a-space>
        </template>

        <!-- 应付金额 列自定义内容 -->
        <template v-slot:payAmount_default="{ row }">
          <a-input v-model="row.payAmount" class="number-input" tabindex="1" @change="e => payAmountInput(row, e.target.value)" />
        </template>

        <!-- 备注 列自定义内容 -->
        <template v-slot:description_default="{ row }">
          <a-input v-model="row.description" tabindex="2" />
        </template>
      </vxe-grid>

      <j-border title="合计">
        <j-form label-width="140px">
          <j-form-item label="单据总金额" :span="6">
            <a-input v-model="formData.totalAmount" class="number-input" read-only />
          </j-form-item>
          <j-form-item label="应付总金额" :span="6">
            <a-input v-model="formData.totalPayAmount" class="number-input" read-only />
          </j-form-item>
        </j-form>
      </j-border>

      <j-border>
        <j-form label-width="140px">
          <j-form-item label="备注" :span="24" :content-nest="false">
            <a-textarea v-model.trim="formData.description" maxlength="200" />
          </j-form-item>
        </j-form>
      </j-border>
      <div style="text-align: center; background-color: #FFFFFF;padding: 8px 0;">
        <a-space>
          <a-button v-permission="['settle:check-sheet:modify']" type="primary" :loading="loading" @click="updateOrder">保存</a-button>
          <a-button :loading="loading" @click="closeDialog">关闭</a-button>
        </a-space>
      </div>
    </div>
  </div>
</template>
<script>
import SupplierSelector from '@/components/Selector/SupplierSelector'
export default {
  name: 'ModifySettlePreSheet',
  components: {
    SupplierSelector
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
      // 工具栏配置
      toolbarConfig: {
        // 自定义左侧工具栏
        slots: {
          buttons: 'toolbar_buttons'
        }
      },
      // 表单数据
      formData: {},
      // 列表数据配置
      tableColumn: [
        { type: 'checkbox', width: 40 },
        { type: 'seq', width: 40 },
        { field: 'bizCode', title: '单据号', width: 200 },
        { field: 'bizType', title: '单据类型', width: 120, formatter: ({ cellValue }) => { return this.$enums.SETTLE_CHECK_SHEET_BIZ_TYPE.getDesc(cellValue) } },
        { field: 'approveTime', title: '审核时间', width: 170 },
        { field: 'totalAmount', title: '单据金额', align: 'right', width: 100 },
        { field: 'payAmount', title: '应付金额', align: 'right', width: 100, slots: { default: 'payAmount_default' }},
        { field: 'description', title: '备注', width: 260, slots: { default: 'description_default' }}
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
        supplier: {},
        startTime: '',
        endTime: '',
        description: '',
        totalAmount: 0,
        totalPayAmount: 0
      }

      this.tableData = []
    },
    // 加载数据
    loadData() {
      this.loading = true
      this.$api.settle.checkSheet.get(this.id).then(res => {
        if (!this.$enums.SETTLE_CHECK_SHEET_STATUS.CREATED.equalsCode(res.status) && !this.$enums.SETTLE_CHECK_SHEET_STATUS.APPROVE_REFUSE.equalsCode(res.status)) {
          this.$msg.error('单据已审核通过，无法修改！')
          this.closeDialog()
          return
        }
        this.initFormData()
        this.formData = Object.assign(this.formData, {
          supplier: {
            id: res.supplierId,
            name: res.supplierName
          },
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
        })
        const details = res.details.map(item => {
          return {
            id: item.id,
            bizId: item.bizId,
            bizCode: item.bizCode,
            bizType: item.bizType,
            calcType: item.calcType,
            totalAmount: item.totalAmount,
            payAmount: item.payAmount,
            approveTime: item.approveTime,
            description: item.description
          }
        })

        this.tableData = details

        this.$nextTick(() => {
          this.$refs.grid.setAllCheckboxRow(true)
          this.calcSum()
        })
      }).finally(() => {
        this.loading = false
      })
    },
    emptyLine() {
      return {
        id: this.$utils.uuid(),
        bizCode: '',
        bizType: '',
        calcType: '',
        totalAmount: '',
        payAmount: '',
        approveTime: '',
        description: ''
      }
    },
    payAmountInput(row, value) {
      this.calcSum()
    },
    // 计算汇总数据
    calcSum() {
      let totalAmount = 0
      let totalPayAmount = 0
      const records = this.$refs.grid.getCheckboxRecords()
      if (!this.$utils.isEmpty(records)) {
        records.forEach(item => {
          if (this.$utils.isFloat(item.totalAmount)) {
            totalAmount = this.$utils.add(totalAmount, item.totalAmount)
          }

          if (this.$utils.isFloat(item.payAmount)) {
            totalPayAmount = this.$utils.add(totalPayAmount, item.payAmount)
          }
        })
      }

      this.formData.totalAmount = totalAmount
      this.formData.totalPayAmount = totalPayAmount
    },
    // 校验数据
    validData() {
      if (this.$utils.isEmpty(this.formData.supplier.id)) {
        this.$msg.error('供应商不允许为空！')
        return false
      }

      if (this.$utils.isEmpty(this.formData.startTime)) {
        this.$msg.error('审核起始日期不能为空！')
        return
      }

      if (this.$utils.isEmpty(this.formData.endTime)) {
        this.$msg.error('审核截止日期不能为空！')
        return
      }

      const records = this.$refs.grid.getCheckboxRecords()
      if (this.$utils.isEmpty(records)) {
        this.$msg.error('请选择业务单据！')
        return false
      }

      if (this.$utils.isEmpty(this.tableData)) {
        this.$msg.error('请录入项目！')
        return false
      }

      for (let i = 0; i < records.length; i++) {
        const item = records[i]

        if (this.$utils.isEmpty(item.payAmount)) {
          this.$msg.error('第' + (i + 1) + '行应付金额不能为空！')
          return false
        }

        if (!this.$utils.isFloat(item.payAmount)) {
          this.$msg.error('第' + (i + 1) + '行应付金额必须为数字！')
          return false
        }

        if (!this.$utils.isNumberPrecision(item.payAmount, 2)) {
          this.$msg.error('第' + (i + 1) + '行应付金额最多允许2位小数！')
          return false
        }

        if (this.$enums.SETTLE_CHECK_SHEET_CALC_TYPE.SUB.equalsCode(item.calcType)) {
          if (item.payAmount > 0) {
            this.$msg.error('第' + (i + 1) + '行应付金额不允许大于0！')
            return false
          }
        }

        if (this.$enums.SETTLE_CHECK_SHEET_CALC_TYPE.ADD.equalsCode(item.calcType)) {
          if (item.payAmount < 0) {
            this.$msg.error('第' + (i + 1) + '行应付金额不允许小于0！')
            return false
          }
        }
      }

      return true
    },
    // 创建订单
    updateOrder() {
      if (!this.validData()) {
        return
      }

      const records = this.$refs.grid.getCheckboxRecords()

      const params = {
        id: this.id,
        supplierId: this.formData.supplier.id,
        description: this.formData.description,
        startDate: this.$utils.dateTimeToDate(this.formData.startTime),
        endDate: this.$utils.dateTimeToDate(this.formData.endTime),
        items: records.map(t => {
          return {
            id: t.bizId,
            bizType: t.bizType,
            payAmount: t.payAmount,
            description: t.description
          }
        })
      }

      this.loading = true
      this.$api.settle.checkSheet.updateOrder(params).then(res => {
        this.$msg.success('保存成功！')

        this.$emit('confirm')
        this.closeDialog()
      }).finally(() => {
        this.loading = false
      })
    },
    searchUnCheckItems() {
      if (this.$utils.isEmpty(this.formData.supplier)) {
        this.$msg.error('请先选择供应商！')
        return
      }

      if (this.$utils.isEmpty(this.formData.startTime)) {
        this.$msg.error('审核起始日期不能为空！')
        return
      }

      if (this.$utils.isEmpty(this.formData.endTime)) {
        this.$msg.error('审核截止日期不能为空！')
        return
      }

      this.loading = true
      this.$api.settle.checkSheet.getUnCheckItems({
        supplierId: this.formData.supplier.id,
        startTime: this.formData.startTime,
        endTime: this.formData.endTime
      }).then(res => {
        const tmpData = []
        if (!this.$utils.isEmpty(res)) {
          res.forEach(item => {
            item.bizCode = item.code
            item.bizId = item.id
            item.id = this.$utils.uuid()
            const obj = Object.assign(this.emptyLine(), item)
            obj.payAmount = obj.totalAmount
            tmpData.push(obj)
          })

          const tableData = [...this.tableData]
          const bizIds = this.tableData.map(item => {
            return item.bizId
          })
          tmpData.forEach(item => {
            if (!bizIds.includes(item.bizId)) {
              tableData.push(item)
            }
          })

          this.tableData = tableData
        }

        this.$nextTick(() => {
          this.$refs.grid.setAllCheckboxRow(true)
          this.calcSum()
        })
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style>
</style>
