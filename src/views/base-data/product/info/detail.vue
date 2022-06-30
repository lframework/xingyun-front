<template>
  <a-modal v-model="visible" :mask-closable="false" width="50%" title="查看" :dialog-style="{ top: '20px' }" :footer="null">
    <div v-if="visible" v-permission="['base-data:product:info:query']" v-loading="loading">
      <a-descriptions :column="4" bordered>
        <a-descriptions-item label="商品编号" :span="2">{{ formData.code }}</a-descriptions-item>
        <a-descriptions-item label="商品名称" :span="2">{{ formData.name }}</a-descriptions-item>
        <a-descriptions-item label="商品SKU编号" :span="2">{{ formData.skuCode }}</a-descriptions-item>
        <a-descriptions-item label="外部编号" :span="2">{{ formData.externalCode }}</a-descriptions-item>
        <a-descriptions-item label="商品类目" :span="2">{{ formData.categoryName }}</a-descriptions-item>
        <a-descriptions-item label="商品品牌" :span="2">{{ formData.brandName }}</a-descriptions-item>
        <a-descriptions-item label="规格" :span="2">{{ formData.spec }}</a-descriptions-item>
        <a-descriptions-item label="单位" :span="2">{{ formData.unit }}</a-descriptions-item>
        <a-descriptions-item v-if="formData.multiSaleProp" :label="formData.salePropGroup1Name" :span="2">{{ formData.salePropItem1Name }}</a-descriptions-item>
        <a-descriptions-item v-if="formData.multiSaleProp && !$utils.isEmpty(formData.salePropGroup2Name)" :label="formData.salePropGroup2Name" :span="2">{{ formData.salePropItem2Name }}</a-descriptions-item>
        <a-descriptions-item label="采购价（元）" :span="2">{{ formData.purchasePrice }}</a-descriptions-item>
        <a-descriptions-item label="销售价（元）" :span="2">{{ formData.salePrice }}</a-descriptions-item>
        <a-descriptions-item label="零售价（元）" :span="2">{{ formData.retailPrice }}</a-descriptions-item>
        <a-descriptions-item label="状态" :span="2">{{ $enums.AVAILABLE.getDesc(formData.available) }}</a-descriptions-item>
        <a-descriptions-item v-for="item in formData.properties" :key="item.id" :label="item.name" :span="4">
          {{ item.text }}
        </a-descriptions-item>
      </a-descriptions>
    </div>
  </a-modal>
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
      formData: {}
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
        multiSaleProp: false,
        salePropGroup1Name: '',
        salePropItem1Name: '',
        salePropGroup2Name: '',
        salePropItem2Name: ''
      }
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
