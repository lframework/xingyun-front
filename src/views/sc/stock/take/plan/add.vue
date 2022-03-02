<template>
  <el-dialog :visible.sync="visible" :close-on-click-modal="false" append-to-body width="40%" title="新增" top="5vh" @open="open">
    <div v-if="visible" v-permission="['stock:take:plan:add']">
      <el-form ref="form" v-loading="loading" label-width="100px" title-align="right" :model="formData" :rules="rules">
        <el-form-item label="仓库" prop="sc.id">
          <store-center-selector
            v-model="formData.sc"
          />
        </el-form-item>
        <el-form-item label="盘点类别" prop="takeType">
          <el-select v-model="formData.takeType" @change="changeTakeType">
            <el-option v-for="item in $enums.TAKE_STOCK_PLAN_TYPE.values()" :key="item.code" :label="item.desc" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="$enums.TAKE_STOCK_PLAN_TYPE.CATEGORY.equalsCode(formData.takeType)" label="类目" required prop="category">
          <product-category-selector v-model="formData.category" :only-final="false" :multiple="true" />
        </el-form-item>
        <el-form-item v-if="$enums.TAKE_STOCK_PLAN_TYPE.BRAND.equalsCode(formData.takeType)" label="品牌" required prop="brand">
          <product-brand-selector v-model="formData.brand" :multiple="true" />
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input v-model.trim="formData.description" maxlength="200" show-word-limit type="textarea" resize="none" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">保存</el-button>
          <el-button @click="closeDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>
<script>
import StoreCenterSelector from '@/components/Selector/StoreCenterSelector'
import ProductCategorySelector from '@/components/Selector/ProductCategorySelector'
import ProductBrandSelector from '@/components/Selector/ProductBrandSelector'

export default {
  components: {
    StoreCenterSelector, ProductCategorySelector, ProductBrandSelector
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
        sc: {
          id: [
            { required: true, message: '请选择仓库' }
          ]
        },
        takeType: [
          { required: true, message: '请选择盘点类别' }
        ],
        category: [
          {
            validator: (rule, value, callback) => {
              if (!this.$enums.TAKE_STOCK_PLAN_TYPE.CATEGORY.equalsCode(this.formData.takeType)) {
                return callback()
              }

              if (this.$utils.isEmpty(value)) {
                return callback(new Error('请选择商品类目'))
              }

              return callback()
            }
          }
        ],
        brand: [
          {
            validator: (rule, value, callback) => {
              if (!this.$enums.TAKE_STOCK_PLAN_TYPE.BRAND.equalsCode(this.formData.takeType)) {
                return callback()
              }

              if (this.$utils.isEmpty(value)) {
                return callback(new Error('请选择商品品牌'))
              }

              return callback()
            }
          }
        ]
      }
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
        sc: {},
        takeType: this.$enums.TAKE_STOCK_PLAN_TYPE.ALL.code,
        description: '',
        category: [],
        brand: []
      }
    },
    // 提交表单事件
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const params = {
            scId: this.formData.sc.id,
            takeType: this.formData.takeType,
            description: this.formData.description
          }

          if (this.$enums.TAKE_STOCK_PLAN_TYPE.CATEGORY.equalsCode(this.formData.takeType)) {
            params.bizIds = this.formData.category.map(item => item.id)
          } else if (this.$enums.TAKE_STOCK_PLAN_TYPE.BRAND.equalsCode(this.formData.takeType)) {
            params.bizIds = this.formData.brand.map(item => item.id)
          }

          this.loading = true
          this.$api.sc.stock.take.takeStockPlan.create(params).then(() => {
            this.$msg.success('盘点任务生成！')
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
      // 初始化表单数据
      this.initFormData()
    },
    changeTakeType() {
      this.formData.category = []
      this.formData.brand = []
    }
  }
}
</script>
