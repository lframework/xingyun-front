<template>
  <div v-if="visible" class="app-container">
    <div v-permission="['stock:take:pre:add']" v-loading="loading">
      <j-border>
        <j-form>
          <j-form-item label="仓库" required>
            <store-center-selector
              v-model="formData.sc"
              :before-open="beforeSelectSc"
              @input="afterSelectSc"
            />
          </j-form-item>
          <j-form-item label="预先盘点状态" required :span="16">
            <a-checkbox-group v-model="checkedStatus" @change="changeCheckedStatus">
              <a-checkbox :value="$enums.PRE_TAKE_STOCK_SHEET_STATUS.FIRST_TAKE.code" disabled>{{ $enums.PRE_TAKE_STOCK_SHEET_STATUS.FIRST_TAKE.desc }}</a-checkbox>
              <a-checkbox :value="$enums.PRE_TAKE_STOCK_SHEET_STATUS.SECOND_TAKE.code" :disabled="formData.takeStatus === $enums.PRE_TAKE_STOCK_SHEET_STATUS.RAND_TAKE.code">{{ $enums.PRE_TAKE_STOCK_SHEET_STATUS.SECOND_TAKE.desc }}</a-checkbox>
              <a-checkbox :value="$enums.PRE_TAKE_STOCK_SHEET_STATUS.RAND_TAKE.code" :disabled="formData.takeStatus === $enums.PRE_TAKE_STOCK_SHEET_STATUS.FIRST_TAKE.code">{{ $enums.PRE_TAKE_STOCK_SHEET_STATUS.RAND_TAKE.desc }}</a-checkbox>
            </a-checkbox-group>
          </j-form-item>
          <j-form-item label="备注" :span="24">
            <a-textarea v-model.trim="formData.description" maxlength="200" />
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
      >
        <!-- 工具栏 -->
        <template v-slot:toolbar_buttons>
          <a-space>
            <a-button type="primary" icon="plus" @click="addProduct">新增</a-button>
            <a-button type="danger" icon="delete" @click="delProduct">删除</a-button>
            <a-button icon="plus" @click="openBatchAddProductDialog">批量添加商品</a-button>
          </a-space>
        </template>

        <!-- 商品名称 列自定义内容 -->
        <template v-slot:productName_default="{ row, rowIndex }">
          <a-auto-complete
            v-if="!row.isFixed"
            v-model="row.productName"
            style="width: 100%;"
            placeholder=""
            value-key="productName"
            @search="e => queryProduct(e, row)"
            @select="e => handleSelectProduct(rowIndex, e, row)"
          >
            <template slot="dataSource">
              <a-select-option v-for="(item, index) in row.products" :key="index" :value="item.productId">
                {{ item.productCode }} {{ item.productName }}
              </a-select-option>
            </template>
          </a-auto-complete>
          <span v-else>{{ row.productName }}</span>
        </template>

        <!-- 初盘数量 列自定义内容 -->
        <template v-slot:firstNum_default="{ row }">
          <a-input v-if="$enums.PRE_TAKE_STOCK_SHEET_STATUS.FIRST_TAKE.equalsCode(formData.takeStatus)" v-model="row.firstNum" class="number-input" />
          <span v-else>{{ row.firstNum }}</span>
        </template>

        <!-- 复盘数量 列自定义内容 -->
        <template v-slot:secondNum_default="{ row }">
          <a-input v-if="$enums.PRE_TAKE_STOCK_SHEET_STATUS.SECOND_TAKE.equalsCode(formData.takeStatus)" v-model="row.secondNum" class="number-input" />
          <span v-else-if="$enums.PRE_TAKE_STOCK_SHEET_STATUS.RAND_TAKE.equalsCode(formData.takeStatus)">{{ row.secondNum }}</span>
        </template>

        <!-- 抽盘数量 列自定义内容 -->
        <template v-slot:randNum_default="{ row }">
          <a-input v-if="$enums.PRE_TAKE_STOCK_SHEET_STATUS.RAND_TAKE.equalsCode(formData.takeStatus)" v-model="row.randNum" class="number-input" />
        </template>

        <!-- 复盘初盘差异数量 列自定义内容 -->
        <template v-slot:secondDiffNum_default="{ row }">
          <span v-if="formData.takeStatus === $enums.PRE_TAKE_STOCK_SHEET_STATUS.SECOND_TAKE.code || formData.takeStatus === $enums.PRE_TAKE_STOCK_SHEET_STATUS.RAND_TAKE.code">{{ $utils.sub($utils.isInteger(row.secondNum) ? row.secondNum : 0, $utils.isInteger(row.firstNum) ? row.firstNum : 0) }}</span>
        </template>

        <!-- 抽盘复盘差异数量 列自定义内容 -->
        <template v-slot:randDiffNum_default="{ row }">
          <span v-if="formData.takeStatus === $enums.PRE_TAKE_STOCK_SHEET_STATUS.RAND_TAKE.code">{{ $utils.sub($utils.isInteger(row.randNum) ? row.randNum : 0, $utils.isInteger(row.secondNum) ? row.secondNum : 0) }}</span>
        </template>
      </vxe-grid>

      <batch-add-product
        ref="batchAddProductDialog"
        @confirm="batchAddProduct"
      />

      <div style="text-align: center; background-color: #FFFFFF;padding: 8px 0;">
        <a-space>
          <a-button v-permission="['stock:take:pre:add']" type="primary" :loading="loading" @click="submit">保存</a-button>
          <a-button :loading="loading" @click="closeDialog">关闭</a-button>
        </a-space>
      </div>
    </div>
  </div>
</template>
<script>
import StoreCenterSelector from '@/components/Selector/StoreCenterSelector'
import BatchAddProduct from '@/views/sc/stock/take/pre/batch-add-product'

export default {
  components: {
    StoreCenterSelector, BatchAddProduct
  },
  data() {
    return {
      // 是否可见
      visible: false,
      // 是否显示加载框
      loading: false,
      // 表单数据
      formData: {},
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
        { field: 'firstNum', title: '初盘数量', width: 120, slots: { default: 'firstNum_default' }, align: 'right' },
        { field: 'secondNum', title: '复盘数量', width: 120, slots: { default: 'secondNum_default' }, align: 'right' },
        { field: 'randNum', title: '抽盘数量', width: 120, slots: { default: 'randNum_default' }, align: 'right' },
        { field: 'secondDiffNum', title: '复盘初盘差异数量', width: 140, slots: { default: 'secondDiffNum_default' }, align: 'right' },
        { field: 'randDiffNum', title: '抽盘复盘差异数量', width: 140, slots: { default: 'randDiffNum_default' }, align: 'right' }
      ],
      tableData: [],
      // 已选择的预先盘点状态
      checkedStatus: []
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
        sc: {},
        description: '',
        takeStatus: this.$enums.PRE_TAKE_STOCK_SHEET_STATUS.FIRST_TAKE.code
      }

      this.checkedStatus = [this.$enums.PRE_TAKE_STOCK_SHEET_STATUS.FIRST_TAKE.code]

      this.tableData = []
    },
    // 提交表单事件
    submit() {
      if (this.$utils.isEmpty(this.formData.sc)) {
        this.$msg.error('请选择仓库！')
        return
      }
      if (this.$utils.isEmpty(this.tableData)) {
        this.$msg.error('请录入商品！')
        return
      }
      if (this.formData.takeStatus === this.$enums.PRE_TAKE_STOCK_SHEET_STATUS.FIRST_TAKE.code) {
        // 初盘
        for (let i = 0; i < this.tableData.length; i++) {
          const data = this.tableData[i]
          if (this.$utils.isEmpty(data.productId)) {
            this.$msg.error('第' + (i + 1) + '行商品不允许为空！')
            return
          }
          if (this.$utils.isEmpty(data.firstNum)) {
            this.$msg.error('第' + (i + 1) + '行商品的初盘数量不允许为空！')
            return
          }

          if (!this.$utils.isIntegerGeZero(data.firstNum)) {
            this.$msg.error('第' + (i + 1) + '行商品的初盘数量不允许小于0！')
            return
          }
        }
      } else if (this.formData.takeStatus === this.$enums.PRE_TAKE_STOCK_SHEET_STATUS.SECOND_TAKE.code) {
        // 复盘
        for (let i = 0; i < this.tableData.length; i++) {
          const data = this.tableData[i]
          if (this.$utils.isEmpty(data.secondNum)) {
            this.$msg.error('第' + (i + 1) + '行商品的复盘数量不允许为空！')
            return
          }

          if (!this.$utils.isIntegerGeZero(data.secondNum)) {
            this.$msg.error('第' + (i + 1) + '行商品的复盘数量不允许小于0！')
            return
          }
        }
      } else if (this.formData.takeStatus === this.$enums.PRE_TAKE_STOCK_SHEET_STATUS.RAND_TAKE.code) {
        // 抽盘
        for (let i = 0; i < this.tableData.length; i++) {
          const data = this.tableData[i]
          if (this.$utils.isEmpty(data.randNum)) {
            this.$msg.error('第' + (i + 1) + '行商品的抽盘数量不允许为空！')
            return
          }

          if (!this.$utils.isIntegerGeZero(data.randNum)) {
            this.$msg.error('第' + (i + 1) + '行商品的抽盘数量不允许小于0！')
            return
          }
        }
      }

      const params = {
        scId: this.formData.sc.id,
        takeStatus: this.formData.takeStatus,
        description: this.formData.description,
        products: this.tableData.map(item => {
          return {
            productId: item.productId,
            firstNum: item.firstNum,
            secondNum: item.secondNum,
            randNum: item.randNum
          }
        })
      }
      this.loading = true
      this.$api.sc.stock.take.preTakeStockSheet.create(params).then(() => {
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
    changeCheckedStatus() {
      if (this.checkedStatus.length === 1 && this.checkedStatus.includes(this.$enums.PRE_TAKE_STOCK_SHEET_STATUS.FIRST_TAKE.code)) {
        this.formData.takeStatus = this.$enums.PRE_TAKE_STOCK_SHEET_STATUS.FIRST_TAKE.code
      } else if (this.checkedStatus.includes(this.$enums.PRE_TAKE_STOCK_SHEET_STATUS.RAND_TAKE.code)) {
        this.formData.takeStatus = this.$enums.PRE_TAKE_STOCK_SHEET_STATUS.RAND_TAKE.code
      } else {
        this.formData.takeStatus = this.$enums.PRE_TAKE_STOCK_SHEET_STATUS.SECOND_TAKE.code
      }

      if (this.formData.takeStatus === this.$enums.PRE_TAKE_STOCK_SHEET_STATUS.FIRST_TAKE.code) {
        this.tableData.forEach(item => {
          item.secondNum = ''
          item.randNum = ''
        })
      } else if (this.formData.takeStatus === this.$enums.PRE_TAKE_STOCK_SHEET_STATUS.SECOND_TAKE.code) {
        this.tableData.forEach(item => {
          if (this.$utils.isEmpty(item.secondNum)) {
            item.secondNum = item.firstNum
          }
          item.randNum = ''
        })
      } else if (this.formData.takeStatus === this.$enums.PRE_TAKE_STOCK_SHEET_STATUS.RAND_TAKE.code) {
        this.tableData.forEach(item => {
          item.randNum = item.secondNum
        })
      }
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
        firstNum: '',
        secondNum: '',
        randNum: '',
        secondDiffNum: '',
        randDiffNum: '',
        products: []
      }
    },
    // 新增商品
    addProduct() {
      if (this.$utils.isEmpty(this.formData.sc)) {
        this.$msg.error('请先选择仓库！')
        return
      }
      this.tableData.push(this.emptyProduct())
    },
    // 搜索商品
    queryProduct(queryString, row) {
      if (this.$utils.isEmpty(queryString)) {
        row.products = []
        return
      }

      this.$api.sc.stock.take.preTakeStockSheet.searchProduct(queryString).then(res => {
        row.products = res
      })
    },
    // 选择商品
    handleSelectProduct(index, value, row) {
      value = row ? row.products.filter(item => item.productId === value)[0] : value
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
      if (this.$utils.isEmpty(this.formData.sc)) {
        this.$msg.error('请先选择仓库！')
        return
      }
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
    beforeSelectSc() {
      let flag = false
      if (!this.$utils.isEmpty(this.formData.sc)) {
        return this.$msg.confirm('更改仓库，会清空商品数据，是否确认更改？')
      } else {
        flag = true
      }

      return flag
    },
    afterSelectSc(e) {
      if (!this.$utils.isEmpty(e)) {
        this.tableData = []
      }
    }
  }
}
</script>
