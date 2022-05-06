<template>
  <a-modal v-model="visible" :mask-closable="false" width="50%" title="查看" :dialog-style="{ top: '20px' }" :footer="null">
    <div v-if="visible" v-permission="['base-data:product:poly:query']" v-loading="loading">
      <a-descriptions :column="4" bordered>
        <a-descriptions-item label="商品货号" :span="2">
          {{ formData.code }}
        </a-descriptions-item>
        <a-descriptions-item label="SPU名称" :span="2">
          {{ formData.name }}
        </a-descriptions-item>
        <a-descriptions-item label="简称" :span="2">
          {{ formData.shortName }}
        </a-descriptions-item>
        <a-descriptions-item label="商品类目" :span="2">
          {{ formData.categoryName }}
        </a-descriptions-item>
        <a-descriptions-item label="商品品牌" :span="2">
          {{ formData.brandName }}
        </a-descriptions-item>
        <a-descriptions-item label="是否多规格" :span="2">
          {{ formData.multiSaleProp ? '是' : '否' }}
        </a-descriptions-item>
        <a-descriptions-item label="进项税率（%）" :span="2">
          {{ formData.taxRate }}
        </a-descriptions-item>
        <a-descriptions-item label="销项税率（%）" :span="2">
          {{ formData.saleTaxRate }}
        </a-descriptions-item>
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

      this.$nextTick(() => this.open())
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
        shortName: '',
        categoryId: '',
        brandId: '',
        multiSaleprop: '',
        taxRate: '',
        saleTaxRate: ''
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
      await this.$api.baseData.product.poly.get(this.id).then(data => {
        this.formData = data
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
