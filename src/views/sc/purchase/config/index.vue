<template>
  <div class="app-container">
    <div v-permission="['purchase:config:modify']">
      <a-row>
        <a-col :md="16" :sm="24">
          <a-card v-loading="loading">
            <a-form-model ref="form" :label-col="{span: 10}" :wrapper-col="{span: 8}" :model="formData" :rules="rules">
              <a-form-model-item label="采购收货单是否关联采购订单" prop="receiveRequirePurchase">
                <a-select v-model="formData.receiveRequirePurchase" placeholder="">
                  <a-select-option :value="true">是</a-select-option>
                  <a-select-option :value="false">否</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item label="采购收货单是否多次关联采购订单" prop="receiveMultipleRelatePurchase">
                <a-select v-model="formData.receiveMultipleRelatePurchase" placeholder="">
                  <a-select-option :value="true">是</a-select-option>
                  <a-select-option :value="false">否</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item label="采购退货单是否关联采购收货单" prop="purchaseReturnRequireReceive">
                <a-select v-model="formData.purchaseReturnRequireReceive" placeholder="">
                  <a-select-option :value="true">是</a-select-option>
                  <a-select-option :value="false">否</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item label="采购退货单是否多次关联采购收货单" prop="purchaseReturnMultipleRelateReceive">
                <a-select v-model="formData.purchaseReturnMultipleRelateReceive" placeholder="">
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
  name: 'PurchaseConfig',
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
        receiveRequirePurchase: [
          { required: true, message: '请选择采购收货单是否关联采购订单' }
        ],
        receiveMultipleRelatePurchase: [
          { required: true, message: '请选择采购收货单是否多次关联采购订单' }
        ],
        purchaseReturnRequireReceive: [
          { required: true, message: '请选择采购退货单是否关联采购收货单' }
        ],
        purchaseReturnMultipleRelateReceive: [
          { required: true, message: '请选择采购退货单是否多次关联采购收货单' }
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
        receiveRequirePurchase: '',
        receiveMultipleRelatePurchase: '',
        purchaseReturnRequireReceive: '',
        purchaseReturnMultipleRelateReceive: ''
      }
    },
    // 查询数据
    async loadFormData() {
      this.loading = true
      await this.$api.sc.purchase.purchaseConfig.get().then(data => {
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
          this.$api.sc.purchase.purchaseConfig.modify(this.formData).then(() => {
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
