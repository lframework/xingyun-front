<template>
  <div v-if="visible" class="app-container">
    <div v-permission="['stock:take:sheet:modify']" v-loading="loading">
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
            <el-input v-model.trim="formData.description" maxlength="200" show-word-limit type="textarea" resize="none" />
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
        :toolbar-config="toolbarConfig"
        style="margin-top: 10px;"
      >
        <!-- 工具栏 -->
        <template v-slot:toolbar_buttons>
          <el-form :inline="true">
            <el-form-item>
              <el-button type="primary" @click="addProduct">新增</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="danger" @click="delProduct">删除</el-button>
            </el-form-item>
            <el-form-item>
              <el-button @click="openBatchAddProductDialog">批量添加商品</el-button>
            </el-form-item>
          </el-form>
        </template>

        <!-- 商品名称 列自定义内容 -->
        <template v-slot:productName_default="{ row, rowIndex }">
          <el-autocomplete
            v-if="!row.isFixed"
            v-model="row.productName"
            style="width: 100%;"
            :fetch-suggestions="queryProduct"
            placeholder=""
            value-key="productName"
            @select="e => handleSelectProduct(rowIndex, e)"
          >
            <template slot-scope="{ item }">
              <span>{{ item.productCode }} {{ item.productName }}</span>
            </template>
          </el-autocomplete>
          <span v-else>{{ row.productName }}</span>
        </template>

        <!-- 盘点数量 列自定义内容 -->
        <template v-slot:takeNum_default="{ row }">
          <el-input v-model="row.takeNum" class="number-input" />
        </template>

        <!-- 备注 列自定义内容 -->
        <template v-slot:description_default="{ row }">
          <el-input v-model="row.description" />
        </template>
      </vxe-grid>

      <batch-add-product
        ref="batchAddProductDialog"
        :plan-id="formData.planId"
        @confirm="batchAddProduct"
      />

      <div style="text-align: center;">
        <el-button v-permission="['stock:take:sheet:modify']" type="primary" :loading="loading" @click="submit">保存</el-button>
        <el-button :loading="loading" @click="closeDialog">关闭</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import BatchAddProduct from '@/views/sc/stock/take/sheet/batch-add-product'

export default {
  components: {
    BatchAddProduct
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
      // 工具栏配置
      toolbarConfig: {
        // 缩放
        zoom: false,
        // 自定义表头
        custom: false,
        // 右侧是否显示刷新按钮
        refresh: false,
        // 自定义左侧工具栏
        slots: {
          buttons: 'toolbar_buttons'
        }
      },
      // 列表数据配置
      tableColumn: [
        { type: 'checkbox', width: 40 },
        { field: 'productCode', title: '商品编号', width: 120 },
        { field: 'productName', title: '商品名称', width: 260, slots: { default: 'productName_default' }},
        { field: 'skuCode', title: '商品SKU编号', width: 120 },
        { field: 'externalCode', title: '商品外部编号', width: 120 },
        { field: 'unit', title: '单位', width: 80 },
        { field: 'spec', title: '规格', width: 80 },
        { field: 'categoryName', title: '商品类目', width: 120 },
        { field: 'brandName', title: '商品品牌', width: 120 },
        { field: 'stockNum', title: '系统库存数量', width: 120, align: 'right' },
        { field: 'takeNum', title: '盘点数量', width: 120, slots: { default: 'takeNum_default' }, align: 'right' },
        { field: 'description', title: '备注', slots: { default: 'description_default' }, width: 200 }
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
    // 提交表单事件
    submit() {
      if (this.$utils.isEmpty(this.tableData)) {
        this.$msg.error('请录入商品！')
        return
      }

      for (let i = 0; i < this.tableData.length; i++) {
        const column = this.tableData[i]
        if (this.$utils.isEmpty(column.productId)) {
          this.$msg.error('第' + (i + 1) + '商品不允许为空！')
          return
        }
        if (this.$utils.isEmpty(column.takeNum)) {
          this.$msg.error('第' + (i + 1) + '商品的盘点数量不允许为空！')
          return
        }

        if (!this.$utils.isIntegerGeZero(column.takeNum)) {
          this.$msg.error('第' + (i + 1) + '商品的盘点数量不允许小于0！')
          return
        }
      }

      const params = {
        id: this.id,
        description: this.formData.description,
        products: this.tableData.map(item => {
          return {
            productId: item.productId,
            takeNum: item.takeNum,
            description: item.description
          }
        })
      }

      this.loading = true
      this.$api.sc.stock.take.takeStockSheet.modify(params).then(() => {
        this.$msg.success('保存成功！')
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
