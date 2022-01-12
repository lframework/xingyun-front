<template>
  <el-dialog :visible.sync="visible" :close-on-click-modal="false" width="50%" title="修改" top="5vh" @open="open">
    <div v-if="visible" v-permission="['base-data:product:info:modify']" v-loading="loading">
      <el-descriptions :column="4" label-class-name="descriptions-label" content-class-name="descriptions-content" border>
        <el-descriptions-item :span="2">
          <template slot="label">
            <span class="required">商品编号</span>
          </template>
          <el-input v-model.trim="formData.code" maxlength="20" show-word-limit />
        </el-descriptions-item>
        <el-descriptions-item :span="2">
          <template slot="label">
            <span class="required">商品名称</span>
          </template>
          <el-input v-model="formData.name" maxlength="100" show-word-limit />
        </el-descriptions-item>
        <el-descriptions-item :span="2">
          <template slot="label">
            <span class="required">商品SKU编号</span>
          </template>
          <el-input v-model.trim="formData.skuCode" maxlength="20" show-word-limit />
        </el-descriptions-item>
        <el-descriptions-item label="外部编号" :span="2"><el-input v-model.trim="formData.externalCode" maxlength="20" show-word-limit /></el-descriptions-item>
        <el-descriptions-item label="商品类目" :span="2">{{ formData.categoryName }}</el-descriptions-item>
        <el-descriptions-item label="商品品牌" :span="2">{{ formData.brandName }}</el-descriptions-item>
        <el-descriptions-item label="规格" :span="2">
          <el-input v-model.trim="formData.spec" maxlength="20" show-word-limit />
        </el-descriptions-item>
        <el-descriptions-item label="单位" :span="2">
          <el-input v-model.trim="formData.unit" maxlength="20" show-word-limit />
        </el-descriptions-item>
        <el-descriptions-item label="采购价（元）" :span="2">
          <el-input v-model="formData.purchasePrice" />
        </el-descriptions-item>
        <el-descriptions-item label="销售价（元）" :span="2">
          <el-input v-model="formData.salePrice" />
        </el-descriptions-item>
        <el-descriptions-item label="零售价（元）" :span="2">
          <el-input v-model="formData.retailPrice" />
        </el-descriptions-item>
        <el-descriptions-item :span="2">
          <template slot="label">
            <span class="required">状态</span>
          </template>
          <el-select v-model="formData.available">
            <el-option v-for="item in $enums.AVAILABLE.values()" :key="item.code" :label="item.desc" :value="item.code" />
          </el-select>
        </el-descriptions-item>
        <el-descriptions-item v-for="item in formData.properties" :key="item.id" :label="item.name" :span="4">
          {{ item.text }}
        </el-descriptions-item>
      </el-descriptions>
      <div style="margin-top: 10px;text-align: center;">
        <el-button type="primary" @click="submit">保存</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  // 使用组件
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
      // 表单校验规则
      rules: {
        code: [
          { required: true, message: '请输入编号' }
        ],
        name: [
          { required: true, message: '请输入名称' }
        ],
        available: [
          { required: true, message: '请选择状态' }
        ]
      }
    }
  },
  created() {
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
        id: '',
        code: '',
        name: '',
        skuCode: '',
        externalCode: '',
        categoryName: '',
        brandName: '',
        spec: '',
        unit: '',
        purchasePrice: '',
        salePrice: '',
        retailPrice: '',
        available: '',
        properties: []
      }
    },
    // 提交表单事件
    submit() {
      if (this.$utils.isEmpty(this.formData.code)) {
        this.$msg.error('请输入商品编号！')
        return
      }

      if (this.$utils.isEmpty(this.formData.name)) {
        this.$msg.error('请输入商品名称！')
        return
      }

      if (this.$utils.isEmpty(this.formData.skuCode)) {
        this.$msg.error('请输入商品SKU编号！')
        return
      }

      if (!this.$utils.isEmpty(this.formData.purchasePrice)) {
        if (!this.$utils.isFloat(this.formData.purchasePrice)) {
          this.$msg.error('采购价必须为数字！')
          return
        }

        if (!this.$utils.isFloatGeZero(this.formData.purchasePrice)) {
          this.$msg.error('采购价不允许小于0！')
          return
        }

        if (!this.$utils.isNumberPrecision(this.formData.purchasePrice, 2)) {
          this.$msg.error('采购价最多允许两位小数！')
          return
        }
      }

      if (!this.$utils.isEmpty(this.formData.salePrice)) {
        if (!this.$utils.isFloat(this.formData.salePrice)) {
          this.$msg.error('销售价必须为数字！')
          return
        }

        if (!this.$utils.isFloatGeZero(this.formData.salePrice)) {
          this.$msg.error('销售价不允许小于0！')
          return
        }

        if (!this.$utils.isNumberPrecision(this.formData.salePrice, 2)) {
          this.$msg.error('销售价最多允许两位小数！')
          return
        }
      }

      if (!this.$utils.isEmpty(this.formData.retailPrice)) {
        if (!this.$utils.isFloat(this.formData.retailPrice)) {
          this.$msg.error('零售价必须为数字！')
          return
        }

        if (!this.$utils.isFloatGeZero(this.formData.retailPrice)) {
          this.$msg.error('零售价不允许小于0！')
          return
        }

        if (!this.$utils.isNumberPrecision(this.formData.retailPrice, 2)) {
          this.$msg.error('零售价最多允许两位小数！')
          return
        }
      }

      this.loading = true
      this.$api.baseData.product.info.modify({
        id: this.formData.id,
        code: this.formData.code,
        name: this.formData.name,
        skuCode: this.formData.skuCode,
        externalCode: this.formData.externalCode || '',
        spec: this.formData.spec || '',
        unit: this.formData.unit || '',
        purchasePrice: this.formData.purchasePrice || '',
        salePrice: this.formData.salePrice || '',
        retailPrice: this.formData.retailPrice || '',
        available: this.formData.available
      }).then(() => {
        this.$msg.success('修改成功！')
        this.$emit('confirm')
        this.visible = false
      }).finally(() => {
        this.loading = false
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
      await this.$api.baseData.product.info.get(this.id).then(data => {
        this.formData = data
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
