<template>
  <el-dialog :visible.sync="visible" :close-on-click-modal="false" :modal="false" width="75%" title="销售订单查看" top="5vh" @open="open">
    <div v-if="visible" v-permission="['sale:order:query']" v-loading="loading">
      <j-border>
        <j-form>
          <j-form-item label="仓库">
            <el-input
              v-model="formData.scName"
              readonly
            />
          </j-form-item>
          <j-form-item label="客户">
            <el-input
              v-model="formData.customerName"
              readonly
            />
          </j-form-item>
          <j-form-item label="销售员">
            <el-input
              v-model="formData.salerName"
              readonly
            />
          </j-form-item>
          <j-form-item label="审核状态">
            <span v-if="$enums.SALE_ORDER_STATUS.APPROVE_PASS.equalsCode(formData.status)" style="color: #67C23A;">{{ $enums.SALE_ORDER_STATUS.getDesc(formData.status) }}</span>
            <span v-else-if="$enums.SALE_ORDER_STATUS.APPROVE_REFUSE.equalsCode(formData.status)" style="color: #F56C6C;">{{ $enums.SALE_ORDER_STATUS.getDesc(formData.status) }}</span>
            <span v-else style="color: #303133;">{{ $enums.SALE_ORDER_STATUS.getDesc(formData.status) }}</span>
          </j-form-item>
          <j-form-item label="拒绝理由" :content-nest="false" :span="16">
            <el-input v-if="$enums.SALE_ORDER_STATUS.APPROVE_REFUSE.equalsCode(formData.status)" v-model="formData.refuseReason" readonly />
          </j-form-item>
          <j-form-item label="操作人">
            <span>{{ formData.createBy }}</span>
          </j-form-item>
          <j-form-item label="操作时间" :span="16">
            <span>{{ formData.createTime }}</span>
          </j-form-item>
          <j-form-item v-if="$enums.SALE_ORDER_STATUS.APPROVE_PASS.equalsCode(formData.status) || $enums.SALE_ORDER_STATUS.APPROVE_REFUSE.equalsCode(formData.status)" label="审核人">
            <span>{{ formData.approveBy }}</span>
          </j-form-item>
          <j-form-item v-if="$enums.SALE_ORDER_STATUS.APPROVE_PASS.equalsCode(formData.status) || $enums.SALE_ORDER_STATUS.APPROVE_REFUSE.equalsCode(formData.status)" label="审核时间" :span="16">
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
        <!-- 含税金额 列自定义内容 -->
        <template v-slot:orderAmount_default="{ row }">
          <span v-if="$utils.isFloatGeZero(row.taxPrice) && $utils.isFloatGeZero(row.orderNum)">{{ $utils.mul(row.taxPrice, row.orderNum) }}</span>
        </template>
      </vxe-grid>

      <j-border title="合计">
        <j-form label-width="140px">
          <j-form-item label="销售数量" :span="6">
            <el-input v-model="formData.totalNum" class="number-input" readonly />
          </j-form-item>
          <j-form-item label="赠品数量" :span="6">
            <el-input v-model="formData.giftNum" class="number-input" readonly />
          </j-form-item>
          <j-form-item label="含税总金额" :span="6">
            <el-input v-model="formData.totalAmount" class="number-input" readonly />
          </j-form-item>
        </j-form>
      </j-border>

      <j-border>
        <j-form label-width="140px">
          <j-form-item label="备注" :span="24" :content-nest="false">
            <el-input v-model.trim="formData.description" maxlength="200" show-word-limit type="textarea" resize="none" readonly />
          </j-form-item>
        </j-form>
      </j-border>
    </div>
  </el-dialog>
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
        { field: 'productCode', title: '商品编号', width: 120 },
        { field: 'productName', title: '商品名称', width: 260 },
        { field: 'skuCode', title: '商品SKU编号', width: 120 },
        { field: 'externalCode', title: '商品外部编号', width: 120 },
        { field: 'unit', title: '单位', width: 80 },
        { field: 'spec', title: '规格', width: 80 },
        { field: 'categoryName', title: '商品类目', width: 120 },
        { field: 'brandName', title: '商品品牌', width: 120 },
        { field: 'oriPrice', title: '参考销售价（元）', align: 'right', width: 150 },
        { field: 'isGift', title: '是否赠品', width: 80, formatter: ({ cellValue }) => { return cellValue ? '是' : '否' } },
        { field: 'stockNum', title: '库存数量', align: 'right', width: 100 },
        { field: 'discountRate', title: '折扣（%）', align: 'right', width: 120 },
        { field: 'taxPrice', title: '价格（元）', align: 'right', width: 120 },
        { field: 'orderNum', title: '销售数量', align: 'right', width: 100 },
        { field: 'orderAmount', title: '含税金额', align: 'right', width: 120, slots: { default: 'orderAmount_default' }},
        { field: 'taxRate', title: '税率（%）', align: 'right', width: 100 },
        { field: 'salePropItemName1', title: '销售属性1', width: 120 },
        { field: 'salePropItemName2', title: '销售属性2', width: 120 },
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
        scName: '',
        customerName: '',
        salerName: '',
        totalNum: 0,
        giftNum: 0,
        totalAmount: 0,
        description: ''
      }
    },
    // 加载数据
    loadData() {
      this.loading = true
      this.$api.sc.sale.saleOrder.get(this.id).then(res => {
        this.formData = {
          scName: res.scName,
          customerName: res.customerName,
          salerName: res.salerName,
          description: res.description,
          status: res.status,
          createBy: res.createBy,
          createTime: res.createTime,
          approveBy: res.approveBy,
          approveTime: res.approveTime,
          refuseReason: res.refuseReason,
          totalNum: 0,
          giftNum: 0,
          totalAmount: 0
        }
        this.tableData = res.details || []

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
      let totalNum = 0
      let giftNum = 0
      let totalAmount = 0

      this.tableData.filter(t => {
        return this.$utils.isFloatGeZero(t.taxPrice) && this.$utils.isIntegerGeZero(t.orderNum)
      }).forEach(t => {
        const num = parseInt(t.orderNum)
        if (t.isGift) {
          giftNum = this.$utils.add(num, giftNum)
        } else {
          totalNum = this.$utils.add(num, totalNum)
        }

        totalAmount = this.$utils.add(totalAmount, this.$utils.mul(num, t.taxPrice))
      })

      this.formData.totalNum = totalNum
      this.formData.giftNum = giftNum
      this.formData.totalAmount = totalAmount
    }
  }
}
</script>
<style>
</style>
