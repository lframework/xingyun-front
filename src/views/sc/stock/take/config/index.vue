<template>
  <div class="app-container">
    <div v-permission="['stock:take:config:modify']">
      <el-card>
        <el-form ref="form" v-loading="loading" label-width="420px" title-align="right" :model="formData" :rules="rules" style="width: 720px;">
          <el-form-item label="库存盘点单关联盘点任务后，是否显示盘点任务中的商品数据" prop="showProduct">
            <el-select v-model="formData.showProduct" clearable>
              <el-option label="显示" :value="true" />
              <el-option label="不显示" :value="false" />
            </el-select>
          </el-form-item>
          <el-form-item label="库存盘点单是否显示盘点任务创建时商品的系统库存数量" prop="showStock">
            <el-select v-model="formData.showStock" clearable>
              <el-option label="显示" :value="true" />
              <el-option label="不显示" :value="false" />
            </el-select>
          </el-form-item>
          <el-form-item label="盘点差异生成时是否自动调整盘点任务中商品的系统库存数量" prop="autoChangeStock">
            <el-select v-model="formData.autoChangeStock" clearable>
              <el-option label="调整" :value="true" />
              <el-option label="不调整" :value="false" />
            </el-select>
          </el-form-item>
          <el-form-item label="盘点差异单中的盘点数量是否允许手动修改" prop="allowChangeNum">
            <el-select v-model="formData.allowChangeNum" clearable>
              <el-option label="允许" :value="true" />
              <el-option label="不允许" :value="false" />
            </el-select>
          </el-form-item>
          <el-form-item label="盘点任务自动作废时间" prop="cancelHours">
            <el-input v-model="formData.cancelHours" style="width: 195px;" clearable>
              <template slot="append">小时</template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit">保存</el-button>
            <el-button @click="closeDialog">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TakeStockConfig',
  // 使用组件
  components: {
  },
  data() {
    return {
      // 是否显示加载框
      loading: false,
      // 表单数据
      formData: {},
      // 表单校验规则
      rules: {
        showProduct: [
          { required: true, message: '请选择库存盘点单关联盘点任务后，是否显示盘点任务中的商品数据' }
        ],
        showStock: [
          { required: true, message: '请选择库存盘点单是否显示盘点任务创建时商品的系统库存数量' }
        ],
        autoChangeStock: [
          { required: true, message: '请选择盘点差异生成时是否自动调整盘点任务中商品的系统库存数量' }
        ],
        allowChangeNum: [
          { required: true, message: '请选择盘点差异单中的盘点数量是否允许手动修改' }
        ],
        cancelHours: [
          { required: true, message: '请输入盘点任务自动作废时间' }
        ]
      }
    }
  },
  created() {
    this.initFormData()

    this.openDialog()
  },
  methods: {
    // 打开对话框 由父页面触发
    openDialog() {

      this.open()
    },
    // 关闭对话框
    closeDialog() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.go(-1)
    },
    // 初始化表单数据
    initFormData() {
      this.formData = {
        id: '',
        showProduct: '',
        showStock: '',
        autoChangeStock: '',
        allowChangeNum: '',
        cancelHours: ''
      }
    },
    // 提交表单事件
    submit() {
      if (!this.$utils.isEmpty(this.formData.cancelHours)) {
        if (!this.$utils.isInteger(this.formData.cancelHours)) {
          this.$msg.error('盘点任务自动作废时间必须是整数')
          return
        }

        if (!this.$utils.isIntegerGtZero(this.formData.cancelHours)) {
          this.$msg.error('盘点任务自动作废时间必须大于0')
          return
        }
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$api.sc.stock.take.takeStockConfig.modify(this.formData).then(() => {
            this.$msg.success('保存成功！')
            this.$emit('confirm')
            this.visible = false
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    // 页面显示时触发
    open() {
      // 初始化数据
      this.initFormData()

      // 查询数据
      this.loadFormData()
    },
    // 查询数据
    async loadFormData() {
      this.loading = true
      await this.$api.sc.stock.take.takeStockConfig.get().then(data => {
        this.formData = data
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
