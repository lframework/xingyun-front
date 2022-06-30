<template>
  <a-modal v-model="visible" :mask-closable="false" width="50%" title="修改" :dialog-style="{ top: '20px' }" :footer="null">
    <div v-if="visible" v-permission="['base-data:product:info:modify']" v-loading="loading">
      <a-form-model ref="form" :label-col="{span: 4}" :wrapper-col="{span: 16}" :model="formData" :rules="rules">
        <a-form-model-item label="商品编号" prop="code">
          <a-input v-model.trim="formData.code" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="商品名称" prop="name">
          <a-input v-model.trim="formData.name" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="商品SKU编号" prop="skuCode">
          <a-input v-model.trim="formData.skuCode" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="外部编号" prop="externalCode">
          <a-input v-model.trim="formData.externalCode" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="商品类目" prop="categoryName">
          <a-input v-model.trim="formData.categoryName" disabled />
        </a-form-model-item>
        <a-form-model-item label="商品品牌" prop="brandName">
          <a-input v-model.trim="formData.brandName" disabled />
        </a-form-model-item>
        <a-form-model-item label="规格" prop="spec">
          <a-input v-model.trim="formData.spec" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="单位" prop="unit">
          <a-input v-model.trim="formData.unit" allow-clear />
        </a-form-model-item>
        <a-form-model-item v-if="formData.multiSaleProp" :label="formData.salePropGroup1Name" prop="saleProp1.id">
          <product-sale-prop-item-selector v-model="formData.saleProp1" :request-params="{salePropGroupId: formData.salePropGroup1Id}" allow-clear />
        </a-form-model-item>
        <a-form-model-item v-if="formData.multiSaleProp && !$utils.isEmpty(formData.salePropGroup2Name)" :label="formData.salePropGroup2Name" prop="saleProp2.id">
          <product-sale-prop-item-selector v-model="formData.saleProp2" :request-params="{salePropGroupId: formData.salePropGroup2Id}" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="采购价（元）" prop="purchasePrice">
          <a-input v-model.trim="formData.purchasePrice" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="销售价（元）" prop="salePrice">
          <a-input v-model.trim="formData.salePrice" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="零售价（元）" prop="retailPrice">
          <a-input v-model.trim="formData.retailPrice" allow-clear />
        </a-form-model-item>
        <a-form-model-item label="状态" prop="available">
          <a-select v-model="formData.available" allow-clear>
            <a-select-option v-for="item in $enums.AVAILABLE.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item v-for="item in formData.properties" :key="item.id" :label="item.name">
          <a-input v-model="item.text" disabled />
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
import { validCode } from '@/utils/validate'
import ProductSalePropItemSelector from '@/components/Selector/ProductSalePropItemSelector'

export default {
  // 使用组件
  components: {
    ProductSalePropItemSelector
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
          { required: true, message: '请输入商品编号' },
          { validator: validCode, message: '商品编号必须由字母、数字、“-_.”组成，长度不能超过20位' }
        ],
        name: [
          { required: true, message: '请输入商品名称' }
        ],
        skuCode: [
          { required: true, message: '请输入商品SKU编号' }
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
        properties: [],
        salePropGroup1Id: '',
        salePropGroup2Id: '',
        salePropGroup1Name: '',
        salePropGroup2Name: '',
        saleProp1: {},
        saleProp2: {}
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
      this.$refs.form.validate((valid) => {
        if (valid) {
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
            available: this.formData.available,
            salePropItem1Id: this.formData.saleProp1.id,
            salePropItem2Id: this.formData.saleProp2.id
          }).then(() => {
            this.$msg.success('修改成功！')
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
      await this.$api.baseData.product.info.get(this.id).then(data => {
        if (data.multiSaleProp) {
          data.saleProp1 = {
            id: data.salePropItem1Id,
            name: data.salePropItem1Name
          }

          data.saleProp2 = {
            id: data.salePropItem2Id,
            name: data.salePropItem2Name
          }
        }
        this.formData = Object.assign({}, this.formData, data)
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
