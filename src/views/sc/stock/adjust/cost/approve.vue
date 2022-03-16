<template>
  <div v-if="visible" class="app-container">
    <div v-permission="['stock:adjust:cost:modify']" v-loading="loading">
      <j-border>
        <j-form>
          <j-form-item label="仓库" required>
            {{ formData.scName }}
          </j-form-item>
          <j-form-item :span="16" />
          <j-form-item label="备注" :span="24">
            <a-textarea v-model.trim="formData.description" maxlength="200" />
          </j-form-item>
          <j-form-item label="状态">
            <span v-if="$enums.STOCK_COST_ADJUST_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status)" style="color: #52C41A;">{{ $enums.STOCK_COST_ADJUST_SHEET_STATUS.getDesc(formData.status) }}</span>
            <span v-else-if="$enums.STOCK_COST_ADJUST_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)" style="color: #F5222D;">{{ $enums.STOCK_COST_ADJUST_SHEET_STATUS.getDesc(formData.status) }}</span>
            <span v-else style="color: #303133;">{{ $enums.STOCK_COST_ADJUST_SHEET_STATUS.getDesc(formData.status) }}</span>
          </j-form-item>
          <j-form-item label="拒绝理由" :span="16" :content-nest="false">
            <a-input v-if="$enums.STOCK_COST_ADJUST_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)" v-model="formData.refuseReason" read-only />
          </j-form-item>
          <j-form-item label="操作人">
            <span>{{ formData.updateBy }}</span>
          </j-form-item>
          <j-form-item label="操作时间" :span="16">
            <span>{{ formData.updateTime }}</span>
          </j-form-item>
          <j-form-item v-if="$enums.STOCK_COST_ADJUST_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status) || $enums.STOCK_COST_ADJUST_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)" label="审核人">
            <span>{{ formData.approveBy }}</span>
          </j-form-item>
          <j-form-item v-if="$enums.STOCK_COST_ADJUST_SHEET_STATUS.APPROVE_PASS.equalsCode(formData.status) || $enums.STOCK_COST_ADJUST_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)" label="审核时间" :span="16">
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
          <j-form-item label="调价品种数" :span="6">
            <a-input v-model="formData.productNum" class="number-input" read-only />
          </j-form-item>
          <j-form-item label="库存调价差额" :span="6">
            <a-input v-model="formData.diffAmount" class="number-input" read-only />
          </j-form-item>
        </j-form>
      </j-border>

      <div style="text-align: center; background-color: #FFFFFF;padding: 8px 0;">
        <a-space>
          <a-button v-permission="['stock:adjust:cost:approve']" type="primary" :loading="loading" @click="approvePass">审核通过</a-button>
          <a-button v-if="$enums.STOCK_COST_ADJUST_SHEET_STATUS.CREATED.equalsCode(formData.status)" v-permission="['stock:adjust:cost:approve']" type="danger" :loading="loading" @click="approveRefuse">审核拒绝</a-button>
          <a-button :loading="loading" @click="closeDialog">关闭</a-button>
        </a-space>
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
        { field: 'productCode', title: '商品编号', width: 120 },
        { field: 'productName', title: '商品名称', width: 260 },
        { field: 'skuCode', title: '商品SKU编号', width: 120 },
        { field: 'externalCode', title: '商品外部编号', width: 120 },
        { field: 'unit', title: '单位', width: 80 },
        { field: 'spec', title: '规格', width: 80 },
        { field: 'categoryName', title: '商品类目', width: 120 },
        { field: 'brandName', title: '商品品牌', width: 120 },
        { field: 'purchasePrice', title: '档案采购价', width: 120, align: 'right' },
        { field: 'stockNum', title: '库存数量', width: 120, align: 'right' },
        { field: 'oriPrice', title: '调整前成本价', width: 120, align: 'right' },
        { field: 'price', title: '调整后成本价', width: 120, align: 'right' },
        { field: 'diffAmount', title: '库存调价差额', width: 120, align: 'right' },
        { field: 'description', title: '备注', width: 200 }
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
        scName: '',
        description: '',
        updateBy: '',
        updateTime: '',
        approveBy: '',
        approveTime: '',
        status: '',
        refuseReason: '',
        productNum: 0,
        diffAmount: 0
      }

      this.tableData = []
    },
    // 页面显示时触发
    open() {
      // 初始化表单数据
      this.initFormData()
    },
    calcSum() {
      let productNum = 0
      let diffAmount = 0
      this.tableData.forEach(item => {
        if (!this.$utils.isEmpty(item.productId)) {
          productNum += 1

          if (this.$utils.isFloatGeZero(item.price)) {
            diffAmount += this.$utils.mul(this.$utils.sub(item.price, item.oriPrice), item.stockNum)
          }
        }
      })

      this.formData.productNum = productNum
      this.formData.diffAmount = diffAmount
    },
    async loadData() {
      this.loading = true
      await this.$api.sc.stock.adjust.stockCostAdjustSheet.get(this.id).then(res => {
        Object.assign(this.formData, {
          scName: res.scName,
          description: res.description,
          updateBy: res.updateBy,
          updateTime: res.updateTime,
          approveBy: res.approveBy,
          approveTime: res.approveTime,
          status: res.status,
          refuseReason: res.refuseReason
        })

        this.tableData = res.details
        this.calcSum()
      }).finally(() => {
        this.loading = false
      })
    },
    // 审核通过
    approvePass() {
      this.$msg.confirm('对库存成本调整单执行审核通过操作？').then(() => {
        this.loading = true
        this.$api.sc.stock.adjust.stockCostAdjustSheet.approvePass({
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
    approveRefuse() {
      this.$refs.approveRefuseDialog.openDialog()
    },
    // 开始审核拒绝
    doApproveRefuse(reason) {
      this.loading = true
      this.$api.sc.stock.adjust.stockCostAdjustSheet.approveRefuse({
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
