<template>
  <div class="app-container">
    <div v-permission="['sale:config:modify']">
      <a-row>
        <a-col :md="16" :sm="24">
          <a-card v-loading="loading">
            <a-form-model ref="form" :label-col="{span: 10}" :wrapper-col="{span: 8}" :model="formData" :rules="rules">
              <a-form-model-item label="销售出库单是否关联销售订单" prop="outStockRequireSale">
                <a-select v-model="formData.outStockRequireSale" placeholder="">
                  <a-select-option :value="true">是</a-select-option>
                  <a-select-option :value="false">否</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item label="销售出库单是否多次关联销售订单" prop="outStockMultipleRelateSale">
                <a-select v-model="formData.outStockMultipleRelateSale" placeholder="">
                  <a-select-option :value="true">是</a-select-option>
                  <a-select-option :value="false">否</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item label="销售退货单是否关联销售出库单" prop="saleReturnRequireOutStock">
                <a-select v-model="formData.saleReturnRequireOutStock" placeholder="">
                  <a-select-option :value="true">是</a-select-option>
                  <a-select-option :value="false">否</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item label="销售退货单是否多次关联销售出库单" prop="saleReturnMultipleRelateOutStock">
                <a-select v-model="formData.saleReturnMultipleRelateOutStock" placeholder="">
                  <a-select-option :value="true">是</a-select-option>
                  <a-select-option :value="false">否</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-form-model>
            <div class="form-modal-footer">
              <a-space>
                <a-button type="primary" :loading="loading" @click="submit">保存</a-button>
                <a-button :loading="loading" @click="close">取消</a-button>
              </a-space>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script>

export default {
  name: 'SaleConfig',
  // 使用组件
  components: {
  },

  props: {
  },
  data() {
    return {
      // 是否显示加载框
      loading: false,
      // 表单数据
      formData: {},
      // 表单校验规则
      rules: {
        outStockRequireSale: [
          { required: true, message: '请选择销售出库单是否关联销售订单' }
        ],
        outStockMultipleRelateSale: [
          { required: true, message: '请选择销售出库单是否多次关联销售订单' }
        ],
        saleReturnRequireOutStock: [
          { required: true, message: '请选择销售退货单是否关联销售出库单' }
        ],
        saleReturnMultipleRelateOutStock: [
          { required: true, message: '请选择销售退货单是否多次关联销售出库单' }
        ]
      }
    }
  },
  created() {
    this.initFormData()

    // 查询数据
    this.loadFormData()
  },
  methods: {
    // 初始化表单数据
    initFormData() {
      this.formData = {
        outStockRequireSale: '',
        outStockMultipleRelateSale: '',
        saleReturnRequireOutStock: '',
        saleReturnMultipleRelateOutStock: ''
      }
    },
    // 查询数据
    async loadFormData() {
      this.loading = true
      await this.$api.sc.sale.saleConfig.get().then(data => {
        this.formData = data
      }).finally(() => {
        this.loading = false
      })
    },
    // 提交表单事件
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$api.sc.sale.saleConfig.modify(this.formData).then(() => {
            this.$msg.success('修改成功！')
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    close() {
      this.$utils.closeCurrentPage(this.$parent)
    }
  }
}
</script>
