<template>
  <div v-if="visible" class="app-container">
    <div v-permission="['settle:sheet:add']" v-loading="loading">
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
            <el-date-picker
              v-model="formData.startTime"
              type="date"
              value-format="yyyy-MM-dd 00:00:00"
            />
            <span class="date-split">至</span>
            <el-date-picker
              v-model="formData.endTime"
              type="date"
              value-format="yyyy-MM-dd 23:59:59"
            />
          </j-form-item>
          <j-form-item>
            <el-button type="primary" icon="el-icon-search" @click="searchUnSettleItems">搜索</el-button>
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
        @checkbox-change="calcSum"
      >
        <!-- 已付款金额 列自定义内容 -->
        <template v-slot:totalPayedAmount_default="{ row }">
          <span v-if="$utils.isFloat(row.payAmount)">{{ $utils.add(row.totalPayedAmount, row.payAmount) }}</span>
          <span v-else>{{ row.totalPayedAmount }}</span>
        </template>

        <!-- 已优惠金额 列自定义内容 -->
        <template v-slot:totalDiscountAmount_default="{ row }">
          <span v-if="$utils.isFloat(row.discountAmount)">{{ $utils.add(row.totalDiscountAmount, row.discountAmount) }}</span>
          <span v-else>{{ row.totalDiscountAmount }}</span>
        </template>

        <!-- 未付款金额 列自定义内容 -->
        <template v-slot:totalUnPayAmount_default="{ row }">
          <span>{{ $utils.sub($utils.sub(row.totalUnPayAmount, $utils.isFloat(row.payAmount) ? row.payAmount : 0), $utils.isFloat(row.discountAmount) ? row.discountAmount : 0) }}</span>
        </template>

        <!-- 实付金额 列自定义内容 -->
        <template v-slot:payAmount_default="{ row }">
          <el-input v-model="row.payAmount" class="number-input" tabindex="1" @change="e => payAmountInput(row, e)" />
        </template>

        <!-- 优惠金额 列自定义内容 -->
        <template v-slot:discountAmount_default="{ row }">
          <el-input v-model="row.discountAmount" class="number-input" tabindex="1" @change="e => discountAmountInput(row, e)" />
        </template>

        <!-- 备注 列自定义内容 -->
        <template v-slot:description_default="{ row }">
          <el-input v-model="row.description" tabindex="2" />
        </template>
      </vxe-grid>

      <j-border title="合计">
        <j-form label-width="140px">
          <j-form-item label="未付款总金额" :span="6">
            <el-input v-model="formData.totalUnPayAmount" class="number-input" readonly />
          </j-form-item>
          <j-form-item label="实付总金额" :span="6">
            <el-input v-model="formData.totalAmount" class="number-input" readonly />
          </j-form-item>
          <j-form-item label="优惠总金额" :span="6">
            <el-input v-model="formData.totalDiscountAmount" class="number-input" readonly />
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
      <div style="text-align: center;">
        <el-button v-permission="['settle:sheet:add']" type="primary" :loading="loading" @click="createOrder">保存</el-button>
        <el-button v-permission="['settle:sheet:approve']" type="primary" :loading="loading" @click="directApprovePassOrder">审核通过</el-button>
        <el-button :loading="loading" @click="closeDialog">关闭</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import SupplierSelector from '@/components/Selector/SupplierSelector'
import moment from 'moment'

export default {
  name: 'AddSettleSheet',
  components: {
    SupplierSelector
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
        { type: 'checkbox', width: 40 },
        { type: 'seq', width: 40 },
        { field: 'code', title: '业务单据号', width: 200 },
        { field: 'bizType', title: '单据类型', width: 120, formatter: ({ cellValue }) => { return '供应商对账单' } },
        { field: 'approveTime', title: '审核时间', width: 170 },
        { field: 'totalPayAmount', title: '应付金额', align: 'right', width: 100 },
        { field: 'totalPayedAmount', title: '已付款金额', align: 'right', width: 100, slots: { default: 'totalPayedAmount_default' }},
        { field: 'totalDiscountAmount', title: '已优惠金额', align: 'right', width: 100, slots: { default: 'totalDiscountAmount_default' }},
        { field: 'totalUnPayAmount', title: '未付款金额', align: 'right', width: 100, slots: { default: 'totalUnPayAmount_default' }},
        { field: 'payAmount', title: '实付金额', align: 'right', width: 100, slots: { default: 'payAmount_default' }},
        { field: 'discountAmount', title: '优惠金额', align: 'right', width: 100, slots: { default: 'discountAmount_default' }},
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
        startTime: this.$utils.formatDateTime(this.$utils.getDateTimeWithMinTime(moment().subtract(1, 'M'))),
        endTime: this.$utils.formatDateTime(this.$utils.getDateTimeWithMaxTime(moment())),
        description: '',
        totalAmount: 0,
        totalUnPayAmount: 0,
        totalDiscountAmount: 0
      }

      this.tableData = []
    },
    emptyLine() {
      return {
        id: this.$utils.uuid(),
        code: '',
        bizType: '供应商对账单',
        totalPayAmount: '',
        totalPayedAmount: '',
        totalDiscountAmount: '',
        totalUnPayAmount: '',
        payAmount: '',
        discountAmount: '',
        approveTime: '',
        description: ''
      }
    },
    payAmountInput(row, value) {
      this.calcSum()
    },
    discountAmountInput(row, value) {
      this.calcSum()
    },
    // 计算汇总数据
    calcSum() {
      let totalAmount = 0
      let totalUnPayAmount = 0
      let totalDiscountAmount = 0
      const records = this.$refs.grid.getCheckboxRecords()
      if (!this.$utils.isEmpty(records)) {
        records.forEach(item => {
          if (this.$utils.isFloat(item.payAmount)) {
            totalAmount = this.$utils.add(totalAmount, item.payAmount)
          }

          if (this.$utils.isFloat(item.discountAmount)) {
            totalDiscountAmount = this.$utils.add(totalDiscountAmount, this.$utils.add(item.discountAmount, item.totalDiscountAmount))
          } else {
            totalDiscountAmount = this.$utils.add(totalDiscountAmount, item.totalDiscountAmount)
          }

          totalUnPayAmount = this.$utils.add(totalUnPayAmount, this.$utils.sub(this.$utils.sub(item.totalUnPayAmount, this.$utils.isFloat(item.payAmount) ? item.payAmount : 0), this.$utils.isFloat(item.discountAmount) ? item.discountAmount : 0))
        })
      }

      this.formData.totalAmount = totalAmount
      this.formData.totalUnPayAmount = totalUnPayAmount
      this.formData.totalDiscountAmount = totalDiscountAmount
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

      for (let i = 0; i < records.length; i++) {
        const item = records[i]

        if (this.$utils.isEmpty(item.payAmount)) {
          this.$msg.error('第' + (i + 1) + '行实付金额不能为空！')
          return false
        }

        if (!this.$utils.isFloat(item.payAmount)) {
          this.$msg.error('第' + (i + 1) + '行实付金额必须为数字！')
          return false
        }

        if (!this.$utils.isNumberPrecision(item.payAmount, 2)) {
          this.$msg.error('第' + (i + 1) + '行实付金额最多允许2位小数！')
          return false
        }

        if (this.$utils.isEmpty(item.discountAmount)) {
          this.$msg.error('第' + (i + 1) + '行优惠金额不能为空！')
          return false
        }

        if (!this.$utils.isFloat(item.discountAmount)) {
          this.$msg.error('第' + (i + 1) + '行优惠金额必须为数字！')
          return false
        }

        if (!this.$utils.isNumberPrecision(item.discountAmount, 2)) {
          this.$msg.error('第' + (i + 1) + '行优惠金额最多允许2位小数！')
          return false
        }

        if (item.totalPayAmount > 0) {
          if (item.payAmount < 0) {
            this.$msg.error('第' + (i + 1) + '行实付金额不允许小于0！')
            return false
          }

          if (item.discountAmount < 0) {
            this.$msg.error('第' + (i + 1) + '行优惠金额不允许小于0！')
            return false
          }

          if (this.$utils.add(item.payAmount, item.discountAmount) === 0) {
            this.$msg.error('第' + (i + 1) + '行实付金额、优惠金额不允许同时等于0！')
            return false
          }
          if (item.totalUnPayAmount < this.$utils.add(item.payAmount, item.discountAmount)) {
            this.$msg.error('第' + (i + 1) + '行实付金额与优惠金额相加不允许大于未付款金额！')
            return false
          }
        } else if (item.totalPayAmount < 0) {
          if (item.payAmount > 0) {
            this.$msg.error('第' + (i + 1) + '行实付金额不允许大于0！')
            return false
          }

          if (item.discountAmount > 0) {
            this.$msg.error('第' + (i + 1) + '行优惠金额不允许大于0！')
            return false
          }

          if (this.$utils.add(item.payAmount, item.discountAmount) === 0) {
            this.$msg.error('第' + (i + 1) + '行实付金额、优惠金额不允许同时等于0！')
            return false
          }
          if (item.totalUnPayAmount > this.$utils.add(item.payAmount, item.discountAmount)) {
            this.$msg.error('第' + (i + 1) + '行实付金额与优惠金额相加不允许小于未付款金额！')
            return false
          }
        } else {
          if (this.$utils.add(item.payAmount, item.discountAmount) !== 0) {
            this.$msg.error('第' + (i + 1) + '行实付金额、优惠金额必须同时等于0！')
            return false
          }
        }
      }

      return true
    },
    // 创建订单
    createOrder() {
      if (!this.validData()) {
        return
      }

      const records = this.$refs.grid.getCheckboxRecords()

      const params = {
        supplierId: this.formData.supplier.id,
        description: this.formData.description,
        startDate: this.$utils.dateTimeToDate(this.formData.startTime),
        endDate: this.$utils.dateTimeToDate(this.formData.endTime),
        items: records.map(t => {
          return {
            id: t.id,
            payAmount: t.payAmount,
            discountAmount: t.discountAmount,
            description: t.description
          }
        })
      }

      this.loading = true
      this.$api.settle.sheet.createOrder(params).then(res => {
        this.$msg.success('保存成功！')

        this.$emit('confirm')
        this.closeDialog()
      }).finally(() => {
        this.loading = false
      })
    },
    // 直接审核通过订单
    directApprovePassOrder() {
      if (!this.validData()) {
        return
      }

      const records = this.$refs.grid.getCheckboxRecords()

      const params = {
        supplierId: this.formData.supplier.id,
        description: this.formData.description,
        startDate: this.$utils.dateTimeToDate(this.formData.startTime),
        endDate: this.$utils.dateTimeToDate(this.formData.endTime),
        items: records.map(t => {
          return {
            id: t.id,
            payAmount: t.payAmount,
            discountAmount: t.discountAmount,
            description: t.description
          }
        })
      }

      this.$msg.confirm('确定执行审核通过操作？').then(() => {
        this.loading = true
        this.$api.settle.sheet.directApprovePassOrder(params).then(res => {
          this.$msg.success('审核通过！')

          this.$emit('confirm')
          this.closeDialog()
        }).finally(() => {
          this.loading = false
        })
      })
    },
    searchUnSettleItems() {
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
      this.$api.settle.sheet.getUnSettleItems({
        supplierId: this.formData.supplier.id,
        startTime: this.formData.startTime,
        endTime: this.formData.endTime
      }).then(res => {
        const tableData = []
        if (!this.$utils.isEmpty(res)) {
          res.forEach(item => {
            const obj = Object.assign(this.emptyLine(), item)
            obj.payAmount = obj.totalUnPayAmount
            obj.discountAmount = 0
            tableData.push(obj)
          })
        }
        this.tableData = tableData
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
