<template>
  <div class="app-container">
    <div v-permission="['purchase:config:modify']">
      <el-card>
        <el-form ref="form" v-loading="loading" label-width="260px" title-align="right" :model="formData" :rules="rules">
          <el-form-item label="采购收货单是否关联采购订单" prop="receiveRequirePurchase">
            <el-select v-model="formData.receiveRequirePurchase" placeholder="">
              <el-option label="是" :value="true" />
              <el-option label="否" :value="false" />
            </el-select>
          </el-form-item>
          <el-form-item label="采购收货单是否多次关联采购订单" prop="receiveMultipleRelatePurchase">
            <el-select v-model="formData.receiveMultipleRelatePurchase" placeholder="">
              <el-option label="是" :value="true" />
              <el-option label="否" :value="false" />
            </el-select>
          </el-form-item>
          <el-form-item label="采购退货单是否关联采购收货单" prop="purchaseReturnRequireReceive">
            <el-select v-model="formData.purchaseReturnRequireReceive" placeholder="">
              <el-option label="是" :value="true" />
              <el-option label="否" :value="false" />
            </el-select>
          </el-form-item>
          <el-form-item label="采购退货单是否多次关联采购收货单" prop="purchaseReturnMultipleRelateReceive">
            <el-select v-model="formData.purchaseReturnMultipleRelateReceive" placeholder="">
              <el-option label="是" :value="true" />
              <el-option label="否" :value="false" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit">保存</el-button>
            <el-button @click="close">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
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
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.go(-1)
    }
  }
}
</script>
