<template>
  <a-modal v-model="visible" :mask-closable="false" width="40%" title="新增" :dialog-style="{ top: '20px' }" :footer="null">
    <div v-if="visible" v-permission="['stock:take:plan:add']" v-loadind="loading">
      <a-form-model ref="form" :label-col="{span: 4}" :wrapper-col="{span: 16}" :model="formData" :rules="rules">
        <a-form-model-item label="仓库" prop="sc.id">
          <store-center-selector
            v-model="formData.sc"
          />
        </a-form-model-item>
        <a-form-model-item label="盘点类别" prop="takeType">
          <a-select v-model="formData.takeType" @change="changeTakeType">
            <a-select-option v-for="item in $enums.TAKE_STOCK_PLAN_TYPE.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item v-if="$enums.TAKE_STOCK_PLAN_TYPE.CATEGORY.equalsCode(formData.takeType)" label="类目" required prop="category">
          <product-category-selector v-model="formData.category" :only-final="false" :multiple="true" />
        </a-form-model-item>
        <a-form-model-item v-if="$enums.TAKE_STOCK_PLAN_TYPE.BRAND.equalsCode(formData.takeType)" label="品牌" required prop="brand">
          <product-brand-selector v-model="formData.brand" :multiple="true" />
        </a-form-model-item>
        <a-form-model-item label="备注" prop="description">
          <a-textarea v-model.trim="formData.description" maxlength="200" />
        </a-form-model-item>
        <div class="form-modal-footer">
          <a-space>
            <a-button type="primary" :loading="loading" html-type="submit" @click="submit">保存</a-button>
            <a-button :loading="loading" @click="closeDialog">取消</a-button>
          </a-space>
        </div>
      </a-form-model>
    </div>
  </a-modal>
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

      this.open()
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
