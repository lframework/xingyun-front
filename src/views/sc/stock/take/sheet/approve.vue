<template>
  <div v-if="visible" class="app-container">
    <div v-permission="['stock:take:sheet:approve']" v-loading="loading">
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

      <div v-if="$enums.TAKE_STOCK_SHEET_STATUS.CREATED.equalsCode(formData.status) || $enums.TAKE_STOCK_SHEET_STATUS.APPROVE_REFUSE.equalsCode(formData.status)" style="text-align: center;">
        <el-button v-permission="['stock:take:sheet:approve']" type="primary" :loading="loading" @click="approvePass">审核通过</el-button>
        <el-button v-if="$enums.TAKE_STOCK_SHEET_STATUS.CREATED.equalsCode(formData.status)" v-permission="['stock:take:sheet:approve']" type="danger" :loading="loading" @click="approveRefuse">审核拒绝</el-button>
        <el-button :loading="loading" @click="closeDialog">关闭</el-button>
      </div>

      <approve-refuse ref="approveRefuseDialog" @confirm="doApproveRefuse" />
    </div>
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
      // 设置信息
      config: {},
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

      this.loadFormData()
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
    // 审核通过
    approvePass() {
      const params = {
        id: this.id,
        description: this.formData.description
      }

      this.loading = true
      this.$api.sc.stock.take.takeStockSheet.approvePass(params).then(() => {
        this.$msg.success('审核通过！')
        this.$emit('confirm')

        this.closeDialog()
      }).finally(() => {
        this.loading = false
      })
    },
    approveRefuse() {
      this.$refs.approveRefuseDialog.openDialog()
    },
    doApproveRefuse(reason) {
      this.loading = true
      this.$api.sc.stock.take.takeStockSheet.approveRefuse({
        id: this.id,
        refuseReason: reason
      }).then(() => {
        this.$msg.success('审核拒绝！')

        this.$emit('confirm')
        this.closeDialog()
      }).finally(() => {
        this.loading = false
      })
    },
    // 页面显示时触发
    open() {
      // 初始化表单数据
      this.initFormData()
    },
    emptyProduct() {
      return {
        id: this.$utils.uuid(),
        productId: '',
        productCode: '',
        productName: '',
        skuCode: '',
        externalCode: '',
        unit: '',
        spec: '',
        categoryName: '',
        brandName: '',
        stockNum: '',
        takeNum: '',
        description: ''
      }
    },
    // 新增商品
    addProduct() {
      this.tableData.push(this.emptyProduct())
    },
    // 搜索商品
    queryProduct(queryString, cb) {
      if (this.$utils.isEmpty(queryString)) {
        return cb([])
      }

      this.$api.sc.stock.take.takeStockSheet.searchProduct(this.formData.planId, queryString).then(res => {
        cb(res)
      })
    },
    // 选择商品
    handleSelectProduct(index, value) {
      for (let i = 0; i < this.tableData.length; i++) {
        const data = this.tableData[i]
        if (data.productId === value.productId) {
          this.$msg.error('新增商品与第' + (i + 1) + '行商品相同，请勿重复添加')
          this.tableData[index] = Object.assign(this.tableData[index], this.emptyProduct())
          return
        }
      }
      this.tableData[index] = Object.assign(this.tableData[index], this.emptyProduct(), value)
    },
    // 删除商品
    delProduct() {
      const records = this.$refs.grid.getCheckboxRecords()
      if (this.$utils.isEmpty(records)) {
        this.$msg.error('请选择要删除的商品数据！')
        return
      }

      this.$msg.confirm('是否确定删除选中的商品？').then(() => {
        const tableData = this.tableData.filter(t => {
          const tmp = records.filter(item => item.id === t.id)
          return this.$utils.isEmpty(tmp)
        })

        this.tableData = tableData
      })
    },
    openBatchAddProductDialog() {
      this.$refs.batchAddProductDialog.openDialog()
    },
    // 批量新增商品
    batchAddProduct(productList) {
      const filterProductList = []
      productList.forEach(item => {
        if (this.$utils.isEmpty(this.tableData.filter(data => item.productId === data.productId))) {
          filterProductList.push(item)
        }
      })

      filterProductList.forEach(item => {
        this.tableData.push(this.emptyProduct())
        this.handleSelectProduct(this.tableData.length - 1, item)
      })
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
