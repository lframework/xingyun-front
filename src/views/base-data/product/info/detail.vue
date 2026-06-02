<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="80%"
    title="查看"
    :style="{ top: '20px' }"
    :footer="null"
  >
    <div v-if="visible" v-permission="['base-data:product:info:query']" v-loading="loading">
      <vxe-form border title-background title-width="120" ref="form" :data="formData">
        <vxe-form-group span="24" title="基础信息" title-bold vertical>
          <vxe-form-item title="商品编号" field="code" span="8" />
          <vxe-form-item title="名称" field="name" span="8" />
          <vxe-form-item title="简称" field="shortName" span="8" />
          <vxe-form-item title="商品分类" field="categoryName" span="8" />
          <vxe-form-item title="商品品牌" field="brandName" span="8" />
          <vxe-form-item title="规格" field="spec" span="8" />
          <vxe-form-item title="单位" field="unit" span="8" />
          <vxe-form-item title="商品类型" span="8">
            {{ PRODUCT_TYPE.getDesc(formData.productType) }}
          </vxe-form-item>
          <vxe-form-item title="SKU类型" span="8">
            {{ PRODUCT_SKU_TYPE.getDesc(formData.skuType) }}
          </vxe-form-item>
          <vxe-form-item
            :visible="PRODUCT_TYPE.NORMAL.equalsCode(formData.productType)"
            title="重量（kg）"
            field="weight"
            span="8"
          />
          <vxe-form-item
            :visible="PRODUCT_TYPE.NORMAL.equalsCode(formData.productType)"
            title="体积（cm³）"
            field="volume"
            span="8"
          />
          <vxe-form-item
            :visible="PRODUCT_TYPE.NORMAL.equalsCode(formData.productType)"
            title="进项税率（%）"
            field="taxRate"
            span="8"
          />
          <vxe-form-item
            :visible="PRODUCT_TYPE.NORMAL.equalsCode(formData.productType)"
            title="销项税率（%）"
            field="saleTaxRate"
            span="8"
          />
        </vxe-form-group>

        <vxe-form-group
          v-if="showCategoryProperties"
          span="24"
          title="分类属性"
          title-bold
          vertical
        >
          <vxe-form-item
            v-for="item in formData.properties"
            :key="item.id"
            :title="item.name"
            span="8"
          >
            {{ item.textStr }}
          </vxe-form-item>
        </vxe-form-group>

        <vxe-form-group span="24" title="商品图片" title-bold vertical>
          <vxe-form-item title="商品主图" span="24">
            <a-image-preview-group v-if="showMainImages">
              <a-space wrap>
                <a-image
                  v-for="item in formData.mainImage"
                  :key="item"
                  :src="item"
                  :width="96"
                  :height="96"
                />
              </a-space>
            </a-image-preview-group>
            <span v-else>-</span>
          </vxe-form-item>
          <vxe-form-item title="详情图片" span="24">
            <a-image-preview-group v-if="showDetailImages">
              <a-space wrap>
                <a-image
                  v-for="item in formData.detailImages"
                  :key="item"
                  :src="item"
                  :width="96"
                  :height="96"
                />
              </a-space>
            </a-image-preview-group>
            <span v-else>-</span>
          </vxe-form-item>
        </vxe-form-group>

        <vxe-form-group span="24" title="SKU信息" title-bold vertical>
          <vxe-form-item span="24">
            <vxe-grid
              resizable
              show-overflow
              border
              row-id="id"
              :data="formData.skus"
              :columns="skuColumns"
              :pager-config="undefined"
            >
              <template #skuMainImage_default="{ row }">
                <a-image v-if="row.mainImage" :src="row.mainImage" :width="64" :height="64" />
                <span v-else>-</span>
              </template>
            </vxe-grid>
          </vxe-form-item>
        </vxe-form-group>

        <vxe-form-group
          v-if="PRODUCT_TYPE.BUNDLE.equalsCode(formData.productType)"
          span="24"
          title="组合商品明细"
          title-bold
          vertical
        >
          <vxe-form-item span="24">
            <vxe-grid
              resizable
              show-overflow
              border
              row-id="id"
              :data="formData.productBundles"
              :columns="bundleColumns"
              :pager-config="undefined"
            />
          </vxe-form-item>
        </vxe-form-group>
      </vxe-form>
    </div>
  </a-modal>
</template>
<script>
  import { defineComponent } from 'vue';
  import * as api from '@/api/base-data/product/info';
  import { PRODUCT_SKU_TYPE } from '@/enums/biz/productSkuType';
  import { PRODUCT_TYPE } from '@/enums/biz/productType';
  import { isEmpty } from '@/utils/utils';

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
        PRODUCT_SKU_TYPE,
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
        skuColumns: [
          { field: 'code', title: 'SKU编号', width: 180 },
          {
            field: 'mainImage',
            title: 'SKU主图',
            width: 100,
            showOverflow: false,
            slots: { default: 'skuMainImage_default' },
          },
          { field: 'salePropertyText', title: '销售属性', minWidth: 220 },
          { field: 'multiCode', title: '一品多码', width: 100, formatter: this.formatBoolean },
          { field: 'multiCodesStr', title: '扩展编号', minWidth: 220 },
          { field: 'purchasePrice', title: '采购价（元）', width: 140, align: 'right' },
          { field: 'salePrice', title: '销售价（元）', width: 140, align: 'right' },
          { field: 'retailPrice', title: '零售价（元）', width: 140, align: 'right' },
        ],
        bundleColumns: [
          { field: 'productCode', title: '单品编号', width: 160 },
          { field: 'productName', title: '单品名称', minWidth: 180 },
          { field: 'skuCode', title: 'SKU编号', width: 180 },
          { field: 'bundleNum', title: '包含数量', width: 120, align: 'right' },
          { field: 'purchasePrice', title: '采购价（元）', width: 140, align: 'right' },
          { field: 'salePrice', title: '销售价（元）', width: 140, align: 'right' },
          { field: 'retailPrice', title: '零售价（元）', width: 140, align: 'right' },
        ],
      };
    },
    computed: {
      showCategoryProperties() {
        return !isEmpty(this.formData.properties);
      },
      showDetailImages() {
        return !isEmpty(this.formData.detailImages);
      },
      showMainImages() {
        return !isEmpty(this.formData.mainImage);
      },
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
          shortName: '',
          categoryName: '',
          brandName: '',
          spec: '',
          unit: '',
          productType: '',
          skuType: '',
          weight: '',
          volume: '',
          taxRate: '',
          saleTaxRate: '',
          mainImage: [],
          detailImages: [],
          skus: [],
          productBundles: [],
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
            this.formData = Object.assign({}, data, {
              mainImage: data.mainImage || [],
              detailImages: data.detailImages || [],
              skus: (data.skus || []).map((sku) => {
                return Object.assign({}, sku, {
                  multiCodesStr: this.formatMultiCodes(sku.multiCodes),
                });
              }),
              productBundles: data.productBundles || [],
              properties: data.properties || [],
            });
          })
          .finally(() => {
            this.loading = false;
          });
      },
      formatBoolean({ cellValue }) {
        return cellValue ? '是' : '否';
      },
      formatMultiCodes(multiCodes) {
        return isEmpty(multiCodes) ? '' : multiCodes.join('，');
      },
    },
  });
</script>
