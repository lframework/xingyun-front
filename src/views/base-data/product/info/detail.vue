<template>
  <el-dialog :visible.sync="visible" :close-on-click-modal="false" append-to-body width="50%" title="查看" top="5vh" @open="open">
    <div v-if="visible" v-permission="['base-data:product:info:query']">
      <el-descriptions :column="4" label-class-name="descriptions-label" content-class-name="descriptions-content" border>
        <el-descriptions-item label="商品编号" :span="2">{{ formData.code }}</el-descriptions-item>
        <el-descriptions-item label="商品名称" :span="2">{{ formData.name }}</el-descriptions-item>
        <el-descriptions-item label="商品SKU编号" :span="2">{{ formData.skuCode }}</el-descriptions-item>
        <el-descriptions-item label="外部编号" :span="2">{{ formData.externalCode }}</el-descriptions-item>
        <el-descriptions-item label="商品类目" :span="2">{{ formData.categoryName }}</el-descriptions-item>
        <el-descriptions-item label="商品品牌" :span="2">{{ formData.brandName }}</el-descriptions-item>
        <el-descriptions-item label="规格" :span="2">{{ formData.spec }}</el-descriptions-item>
        <el-descriptions-item label="单位" :span="2">{{ formData.unit }}</el-descriptions-item>
        <el-descriptions-item label="采购价（元）" :span="2">{{ formData.purchasePrice }}</el-descriptions-item>
        <el-descriptions-item label="销售价（元）" :span="2">{{ formData.salePrice }}</el-descriptions-item>
        <el-descriptions-item label="零售价（元）" :span="2">{{ formData.retailPrice }}</el-descriptions-item>
        <el-descriptions-item label="状态" :span="2">{{ $enums.AVAILABLE.getDesc(formData.available) }}</el-descriptions-item>
        <el-descriptions-item v-for="item in formData.properties" :key="item.id" :label="item.name" :span="4">
          {{ item.text }}
        </el-descriptions-item>
      </el-descriptions>
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
