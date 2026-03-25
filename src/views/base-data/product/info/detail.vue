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
      <vxe-form border title-background title-width="120" ref="form" :data="formData">
        <vxe-form-item title="编号" field="code" span="12" />
        <vxe-form-item title="名称" field="name" span="12" />
        <vxe-form-item title="简称" field="shortName" span="12" />
        <vxe-form-item title="分类" field="categoryName" span="12" />
        <vxe-form-item title="品牌" field="brandName" span="12" />
        <vxe-form-item title="规格" field="spec" span="12" />
        <vxe-form-item title="单位" field="unit" span="12" />
        <vxe-form-item title="重量（kg）" span="12">
          {{ PRODUCT_TYPE.NORMAL.equalsCode(formData.productType) ? formData.weight : '-' }}
        </vxe-form-item>
        <vxe-form-item title="体积（cm³）" span="12">
          {{ PRODUCT_TYPE.NORMAL.equalsCode(formData.productType) ? formData.volume : '-' }}
        </vxe-form-item>
        <vxe-form-item title="进项税率（%）" span="12">
          {{ PRODUCT_TYPE.NORMAL.equalsCode(formData.productType) ? formData.taxRate : '-' }}
        </vxe-form-item>
        <vxe-form-item title="销项税率（%）" span="12">
          {{ PRODUCT_TYPE.NORMAL.equalsCode(formData.productType) ? formData.saleTaxRate : '-' }}
        </vxe-form-item>
        <vxe-form-item title="采购价（元）" field="purchasePrice" span="12" />
        <vxe-form-item title="销售价（元）" field="salePrice" span="12" />
        <vxe-form-item title="零售价（元）" field="retailPrice" span="12" />
        <vxe-form-item title="商品类型" span="24">
          {{ PRODUCT_TYPE.getDesc(formData.productType) }}
        </vxe-form-item>
        <vxe-form-item
          v-for="item in formData.properties"
          :key="item.id"
          :title="item.name"
          span="24"
        >
          {{ item.textStr }}
        </vxe-form-item>
      </vxe-form>
    </div>
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';
  import * as api from '@/api/base-data/product/info';
  import { PRODUCT_TYPE } from '@/enums/biz/productType';

  export default defineComponent({
    // 使用组件
    components: {},
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    setup() {
      return {
        PRODUCT_TYPE,
      };
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
          categoryName: '',
          brandName: '',
          spec: '',
          unit: '',
          purchasePrice: '',
          salePrice: '',
          retailPrice: '',
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
