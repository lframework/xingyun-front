<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="50%"
    title="查看"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-permission="['base-data:product:info:query']" v-loading="loading">
      <a-descriptions :column="4" bordered>
        <a-descriptions-item label="编号" :span="2">{{ formData.code }}</a-descriptions-item>
        <a-descriptions-item label="名称" :span="2">{{ formData.name }}</a-descriptions-item>
        <a-descriptions-item label="简称" :span="2">{{ formData.shortName }}</a-descriptions-item>
        <a-descriptions-item label="SKU编号" :span="2">{{ formData.skuCode }}</a-descriptions-item>
        <a-descriptions-item label="外部编号" :span="2">{{
          formData.externalCode
        }}</a-descriptions-item>
        <a-descriptions-item label="类目" :span="2">{{
          formData.categoryName
        }}</a-descriptions-item>
        <a-descriptions-item label="品牌" :span="2">{{ formData.brandName }}</a-descriptions-item>
        <a-descriptions-item label="规格" :span="2">{{ formData.spec }}</a-descriptions-item>
        <a-descriptions-item label="单位" :span="2">{{ formData.unit }}</a-descriptions-item>
        <a-descriptions-item label="重量（kg）" :span="2">{{
          $enums.PRODUCT_TYPE.NORMAL.equalsCode(formData.productType) ? formData.weight : '-'
        }}</a-descriptions-item>
        <a-descriptions-item label="体积（cm³）" :span="2">{{
          $enums.PRODUCT_TYPE.NORMAL.equalsCode(formData.productType) ? formData.volume : '-'
        }}</a-descriptions-item>
        <a-descriptions-item label="进项税率（%）" :span="2">{{
          $enums.PRODUCT_TYPE.NORMAL.equalsCode(formData.productType) ? formData.taxRate : '-'
        }}</a-descriptions-item>
        <a-descriptions-item label="销项税率（%）" :span="2">{{
          $enums.PRODUCT_TYPE.NORMAL.equalsCode(formData.productType) ? formData.saleTaxRate : '-'
        }}</a-descriptions-item>
        <a-descriptions-item label="采购价（元）" :span="2">{{
          $enums.PRODUCT_TYPE.NORMAL.equalsCode(formData.productType) ? formData.purchasePrice : '-'
        }}</a-descriptions-item>
        <a-descriptions-item label="销售价（元）" :span="2">{{
          formData.salePrice
        }}</a-descriptions-item>
        <a-descriptions-item label="零售价（元）" :span="2">{{
          formData.retailPrice
        }}</a-descriptions-item>
        <a-descriptions-item label="商品类型" :span="4">{{
          $enums.PRODUCT_TYPE.getDesc(formData.productType)
        }}</a-descriptions-item>
        <a-descriptions-item label="状态" :span="4"
          ><available-tag :available="formData.available"
        /></a-descriptions-item>
        <a-descriptions-item
          v-for="item in formData.properties"
          :key="item.id"
          :label="item.name"
          :span="4"
        >
          {{ item.textStr }}
        </a-descriptions-item>
      </a-descriptions>
    </div>
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';
  import * as api from '@/api/base-data/product/info';

  export default defineComponent({
    // 使用组件
    components: {},

    props: {
      id: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        // 是否可见
        visible: false,
        // 是否显示加载框
        loading: false,
        // 表单数据
        formData: {},
      };
    },
    created() {
      this.initFormData();
    },
    methods: {
      // 打开对话框 由父页面触发
      openDialog() {
        this.visible = true;

        this.$nextTick(() => this.open());
      },
      // 关闭对话框
      closeDialog() {
        this.visible = false;
        this.$emit('close');
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
        };
      },
      // 页面显示时触发
      open() {
        // 初始化数据
        this.initFormData();

        // 查询数据
        this.loadFormData();
      },
      // 查询数据
      loadFormData() {
        this.loading = true;
        api
          .get(this.id)
          .then((data) => {
            this.formData = data;
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
  });
</script>
