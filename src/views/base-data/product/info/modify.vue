<template>
  <div class="app-card-container">
    <div v-loading="loading" v-permission="['base-data:product:info:modify']">
      <vxe-form
        :key="formRenderKey"
        border
        title-background
        title-width="120"
        ref="form"
        :data="formData"
        :rules="rules"
      >
        <vxe-form-group span="24" title="基础信息" title-bold vertical>
          <vxe-form-item :visible="showProductInfoItems" title="商品编号" field="code" span="8">
            <a-input-group compact>
              <a-input
                v-model:value.trim="formData.code"
                style="width: calc(100% - 75px)"
                allow-clear
              />
              <a-button type="primary" @click="onGenerateCode">点此生成</a-button>
            </a-input-group>
          </vxe-form-item>
          <vxe-form-item :visible="showProductInfoItems" title="名称" field="name" span="8">
            <a-input v-model:value="formData.name" allow-clear />
          </vxe-form-item>
          <vxe-form-item :visible="showProductInfoItems" title="简称" field="shortName" span="8">
            <a-input v-model:value="formData.shortName" allow-clear />
          </vxe-form-item>
          <vxe-form-item
            :visible="showProductInfoItems"
            title="商品分类"
            field="categoryId"
            span="8"
          >
            <product-category-selector
              v-model:value="formData.categoryId"
              :only-final="true"
              @update:value="selectCategory"
            />
          </vxe-form-item>
          <vxe-form-item :visible="showProductInfoItems" title="商品品牌" field="brandId" span="8">
            <product-brand-selector v-model:value="formData.brandId" />
          </vxe-form-item>
          <vxe-form-item :visible="showProductInfoItems" title="规格" field="spec" span="8">
            <a-input v-model:value="formData.spec" allow-clear />
          </vxe-form-item>
          <vxe-form-item :visible="showProductInfoItems" title="单位" field="unit" span="8">
            <a-input v-model:value="formData.unit" allow-clear />
          </vxe-form-item>
          <vxe-form-item
            :visible="PRODUCT_TYPE.NORMAL.equalsCode(productType)"
            title="重量（kg）"
            field="weight"
            span="8"
          >
            <a-input v-model:value="formData.weight" allow-clear />
          </vxe-form-item>
          <vxe-form-item
            :visible="PRODUCT_TYPE.NORMAL.equalsCode(productType)"
            title="体积（cm³）"
            field="volume"
            span="8"
          >
            <a-input v-model:value="formData.volume" allow-clear />
          </vxe-form-item>
          <vxe-form-item
            :visible="PRODUCT_TYPE.NORMAL.equalsCode(productType)"
            title="进项税率（%）"
            field="taxRate"
            span="8"
          >
            <a-input v-model:value="formData.taxRate" allow-clear />
          </vxe-form-item>
          <vxe-form-item
            :visible="PRODUCT_TYPE.NORMAL.equalsCode(productType)"
            title="销项税率（%）"
            field="saleTaxRate"
            span="8"
          >
            <a-input v-model:value="formData.saleTaxRate" allow-clear />
          </vxe-form-item>
        </vxe-form-group>
        <vxe-form-group
          v-if="showCategoryPropertyItems"
          span="24"
          title="分类属性"
          title-bold
          vertical
        >
          <vxe-form-item
            v-for="modelor in modelorList"
            :key="modelor.id"
            :class-name="modelor.isRequired ? 'is--required' : ''"
            :field="'property_' + modelor.id"
            :title="modelor.name"
            :title-asterisk="modelor.isRequired"
            span="8"
          >
            <a-select
              v-if="COLUMN_TYPE.MULTIPLE.equalsCode(modelor.columnType)"
              v-model:value="modelor.text"
              mode="multiple"
              placeholder="请选择"
            >
              <a-select-option v-for="item in modelor.items" :key="item.id" :value="item.id">{{
                item.name
              }}</a-select-option>
            </a-select>
            <a-select
              v-else-if="COLUMN_TYPE.SINGLE.equalsCode(modelor.columnType)"
              v-model:value="modelor.text"
              allow-clear
              placeholder="请选择"
            >
              <a-select-option v-for="item in modelor.items" :key="item.id" :value="item.id">{{
                item.name
              }}</a-select-option>
            </a-select>
            <a-input
              v-else-if="COLUMN_TYPE.CUSTOM.equalsCode(modelor.columnType)"
              v-model:value="modelor.text"
            />
          </vxe-form-item>
        </vxe-form-group>
        <vxe-form-group span="24" title="商品图片" title-bold vertical>
          <vxe-form-item
            :visible="showProductInfoItems"
            title="商品主图"
            field="mainImage"
            span="24"
          >
            <image-upload
              v-model:value="formData.mainImage"
              :api="uploadProductImage"
              :multiple="true"
              :max-count="20"
              :sortable="true"
            />
          </vxe-form-item>
          <vxe-form-item
            :visible="showProductInfoItems"
            title="详情图片"
            field="detailImages"
            span="24"
          >
            <image-upload
              v-model:value="formData.detailImages"
              :api="uploadProductImage"
              :multiple="true"
              :max-count="20"
              :sortable="true"
            />
          </vxe-form-item>
        </vxe-form-group>
        <vxe-form-group span="24" title="SKU信息" title-bold vertical>
          <vxe-form-item
            :visible="showSingleSkuItems"
            title="SKU主图"
            field="skuMainImage"
            span="8"
          >
            <image-upload v-model:value="formData.skuMainImage" :api="uploadProductImage" />
          </vxe-form-item>
          <vxe-form-item :visible="showSingleSkuItems" title="一品多码" field="multiCode" span="8">
            <a-switch v-model:checked="formData.multiCode" />
          </vxe-form-item>
          <vxe-form-item :visible="showSingleSkuItems" title="SKU编号" field="skuCode" span="8">
            <template v-if="!formData.multiCode">
              <a-input-group compact>
                <a-input
                  v-model:value.trim="formData.skuCode"
                  style="width: calc(100% - 75px)"
                  allow-clear
                />
                <a-button type="primary" @click="onGenerateSkuCode">点此生成</a-button>
              </a-input-group>
            </template>
            <template v-else>
              <a-input
                class="cursor-pointer"
                readonly
                v-model:value.trim="formData.skuCode"
                @click="openMultiCodeDialog"
              />
            </template>
          </vxe-form-item>
          <vxe-form-item
            :visible="showSingleSkuItems"
            title="采购价（元）"
            field="purchasePrice"
            span="8"
          >
            <a-input v-model:value="formData.purchasePrice" allow-clear />
          </vxe-form-item>
          <vxe-form-item
            :visible="showSingleSkuItems"
            title="销售价（元）"
            field="salePrice"
            span="8"
          >
            <a-input v-model:value="formData.salePrice" allow-clear />
          </vxe-form-item>
          <vxe-form-item
            :visible="showSingleSkuItems"
            title="零售价（元）"
            field="retailPrice"
            span="8"
          >
            <a-input v-model:value="formData.retailPrice" allow-clear />
          </vxe-form-item>
          <vxe-form-item :visible="showSkuListItems" span="24">
            <vxe-grid
              ref="skuGrid"
              style="min-width: 1100px"
              resizable
              show-overflow
              highlight-hover-row
              keep-source
              row-id="id"
              height="420"
              :row-config="{ height: 118 }"
              :data="skuList"
              :columns="skuColumns"
              :toolbar-config="{
                zoom: false,
                custom: false,
                refresh: false,
                slots: {
                  buttons: 'sku_toolbar_buttons',
                },
              }"
            >
              <template #sku_toolbar_buttons>
                <a-space>
                  <a-button type="primary" :icon="h(PlusOutlined)" @click="addSkuRow"
                    >新增SKU</a-button
                  >
                  <a-button danger :icon="h(DeleteOutlined)" @click="delSkuRow">删除</a-button>
                  <a-input
                    v-model:value="skuBatchPrices.purchasePrice"
                    class="number-input batch-price-input"
                    placeholder="采购价（元）"
                  />
                  <a-input
                    v-model:value="skuBatchPrices.salePrice"
                    class="number-input batch-price-input"
                    placeholder="销售价（元）"
                  />
                  <a-input
                    v-model:value="skuBatchPrices.retailPrice"
                    class="number-input batch-price-input"
                    placeholder="零售价（元）"
                  />
                  <a-button @click="batchSetSkuPrices">批量设置</a-button>
                </a-space>
              </template>

              <template
                v-for="property in salePropertyList"
                :key="property.id"
                #[`sale_property_${property.id}`]="{ row }"
              >
                <a-select
                  v-model:value="row.salePropertyValues[property.id]"
                  allow-clear
                  placeholder="请选择"
                >
                  <a-select-option v-for="item in property.items" :key="item.id" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </template>

              <template #skuCode_default="{ row }">
                <a-input-group v-if="!row.multiCode" compact>
                  <a-input
                    v-model:value.trim="row.code"
                    style="width: calc(100% - 75px)"
                    allow-clear
                  />
                  <a-button type="primary" @click="onGenerateRowSkuCode(row)">生成</a-button>
                </a-input-group>
                <a-input
                  v-else
                  class="cursor-pointer"
                  readonly
                  v-model:value.trim="row.code"
                  @click="openRowMultiCodeDialog(row)"
                />
              </template>

              <template #skuMultiCode_default="{ row }">
                <a-switch v-model:checked="row.multiCode" />
              </template>

              <template #skuMainImage_default="{ row }">
                <image-upload v-model:value="row.mainImage" :api="uploadProductImage" />
              </template>

              <template #skuPurchasePrice_default="{ row }">
                <a-input v-model:value="row.purchasePrice" class="number-input" />
              </template>

              <template #skuSalePrice_default="{ row }">
                <a-input v-model:value="row.salePrice" class="number-input" />
              </template>

              <template #skuRetailPrice_default="{ row }">
                <a-input v-model:value="row.retailPrice" class="number-input" />
              </template>
            </vxe-grid>
          </vxe-form-item>
          <vxe-form-item :visible="PRODUCT_TYPE.BUNDLE.equalsCode(productType)" span="24">
            <vxe-grid
              ref="grid"
              resizable
              show-overflow
              highlight-hover-row
              keep-source
              row-id="id"
              height="500"
              :data="productBundles"
              :columns="[
                { type: 'checkbox', width: 45 },
                {
                  field: 'product',
                  title: '单品',
                  minWidth: 260,
                  slots: { default: 'product_default' },
                },
                {
                  field: 'bundle_num',
                  title: '包含数量',
                  width: 200,
                  align: 'right',
                  slots: { default: 'bundleNum_default', header: 'bundleNum_header' },
                },
                {
                  field: 'purchasePrice',
                  title: '采购价（元）',
                  width: 200,
                  align: 'right',
                  slots: { default: 'purchasePrice_default', header: 'purchasePrice_header' },
                },
                {
                  field: 'salePrice',
                  title: '销售价（元）',
                  width: 200,
                  align: 'right',
                  slots: { default: 'salePrice_default', header: 'salePrice_header' },
                },
                {
                  field: 'retailPrice',
                  title: '零售价（元）',
                  width: 200,
                  align: 'right',
                  slots: { default: 'retailPrice_default', header: 'retailPrice_header' },
                },
              ]"
              :toolbar-config="{
                zoom: false,
                custom: false,
                refresh: false,
                slots: {
                  buttons: 'toolbar_buttons',
                },
              }"
            >
              <template #toolbar_buttons>
                <a-space>
                  <a-button type="primary" :icon="h(PlusOutlined)" @click="addRow">新增</a-button>
                  <a-button danger :icon="h(DeleteOutlined)" @click="delRow">删除</a-button>
                </a-space>
              </template>

              <template #product_default="{ row }">
                <product-selector
                  v-model:value="row.productId"
                  :request-params="{ productType: PRODUCT_TYPE.NORMAL.code }"
                />
              </template>

              <template #bundleNum_header>
                <a-space>
                  <span>包含数量</span
                  ><a-tooltip title="表示一个组合商品中包含的单品数量"
                    ><a-icon type="question-circle"
                  /></a-tooltip>
                </a-space>
              </template>

              <template #bundleNum_default="{ row }">
                <a-input v-model:value="row.bundleNum" class="number-input" />
              </template>

              <template #purchasePrice_header>
                <a-space>
                  <span>采购价（元）</span
                  ><a-tooltip
                    title="表示一个组合商品采购后的单品的采购价，此处的计算公式：每行单品的【包含数量】乘以【采购价】的总和 等于【组合商品的采购价】"
                    ><a-icon type="question-circle"
                  /></a-tooltip>
                </a-space>
              </template>

              <template #purchasePrice_default="{ row }">
                <a-input v-model:value="row.purchasePrice" class="number-input" />
              </template>

              <template #salePrice_header>
                <a-space>
                  <span>销售价（元）</span
                  ><a-tooltip
                    title="表示一个组合商品销售后的单品的销售价，此处的计算公式：每行单品的【包含数量】乘以【销售价】的总和 等于【组合商品的销售价】"
                    ><a-icon type="question-circle"
                  /></a-tooltip>
                </a-space>
              </template>

              <template #salePrice_default="{ row }">
                <a-input v-model:value="row.salePrice" class="number-input" />
              </template>

              <template #retailPrice_header>
                <a-space>
                  <span>零售价（元）</span
                  ><a-tooltip
                    title="表示一个组合商品零售后的单品的零售价，此处的计算公式：每行单品的【包含数量】乘以【零售价】的总和 等于【组合商品的零售价】"
                    ><a-icon type="question-circle"
                  /></a-tooltip>
                </a-space>
              </template>

              <template #retailPrice_default="{ row }">
                <a-input v-model:value="row.retailPrice" class="number-input" />
              </template>
            </vxe-grid>
          </vxe-form-item>
        </vxe-form-group>
        <vxe-form-item span="24">
          <div class="form-modal-footer">
            <a-space>
              <a-button type="primary" html-type="submit" @click="submit">保存</a-button>
              <a-button @click="closeDialog">关闭</a-button>
            </a-space>
          </div>
        </vxe-form-item>
      </vxe-form>
    </div>

    <multi-code
      ref="multiCodeDialog"
      :main-code="multiCodeMainCode"
      :multi-codes="multiCodeExtCodes"
      @complete="onCompleteMultiCode"
    />
  </div>
</template>
<script>
  import { h, defineComponent } from 'vue';
  import { validCode } from '@/utils/validate';
  import * as api from '@/api/base-data/product/info';
  import * as propertyApi from '@/api/base-data/product/property';
  import * as categorySalePropertyApi from '@/api/base-data/product/category-sale-property';
  import * as salePropertyItemApi from '@/api/base-data/product/sale-property-item';
  import { multiplePageMix } from '@/mixins/multiplePageMix';
  import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue';
  import {
    isEmpty,
    isFloat,
    isFloatGeZero,
    isNumberPrecision,
    isInteger,
    isIntegerGtZero,
    isFloatGtZero,
    add,
    mul,
    eq,
    isArray,
    uuid,
  } from '@/utils/utils';
  import { createError, createSuccess, createConfirm } from '@/hooks/web/msg';
  import ProductBrandSelector from '@/components/Selector/ProductBrandSelector.vue';
  import ProductCategorySelector from '@/components/Selector/ProductCategorySelector.vue';
  import ProductSelector from '@/components/Selector/ProductSelector.vue';
  import { ImageUpload } from '@/components/Form';
  import { PRODUCT_TYPE } from '@/enums/biz/productType';
  import { COLUMN_TYPE } from '@/enums/biz/columnType';
  import MultiCode from './multi-code.vue';
  import { generateCode, uploadImage } from '@/api/components';
  import { GENERATE_CODE_TYPE } from '@/enums/biz/generateCodeType';
  import {
    applySkuBatchPrices,
    buildProductSubmitParams,
    isMultiSkuList,
    shouldLoadSaleProperties,
  } from './skuBatchPriceHelper.mjs';

  export default defineComponent({
    name: 'ModifyProduct',
    // 使用组件
    components: {
      MultiCode,
      ProductBrandSelector,
      ProductCategorySelector,
      ProductSelector,
      ImageUpload,
    },
    mixins: [multiplePageMix],
    props: {},
    setup() {
      return {
        h,
        PlusOutlined,
        DeleteOutlined,
        PRODUCT_TYPE,
        COLUMN_TYPE,
      };
    },
    data() {
      return {
        id: this.$route.params.id,
        // 是否显示加载框
        loading: false,
        // 表单数据
        formData: {},
        formRenderKey: uuid(),
        productType: undefined,
        productBundles: [],
        skuList: [],
        skuBatchPrices: {},
        salePropertyList: [],
        currentMultiCodeSku: null,
        modelorList: [],
        // 表单校验规则
        rules: {
          code: [
            { validator: validCode, message: '编号必须由字母、数字、“-_.”组成，长度不能超过20位' },
          ],
          skuCode: [
            {
              validator: ({ itemValue }) => {
                if (!this.showSingleSkuItems) {
                  return;
                }
                if (isEmpty(itemValue)) {
                  return new Error('请输入SKU编号');
                }

                return validCode({ itemValue });
              },
            },
          ],
          name: [{ required: true, message: '请输入名称' }],
          categoryId: [{ required: true, message: '请选择分类' }],
          weight: [
            {
              validator: ({ itemValue }) => {
                if (!isEmpty(itemValue)) {
                  if (!isFloat(itemValue)) {
                    return new Error('重量（kg）必须是数字');
                  }
                  if (!isFloatGeZero(itemValue)) {
                    return new Error('重量（kg）不允许小于0');
                  }
                  if (!isNumberPrecision(itemValue, 2)) {
                    return new Error('重量（kg）最多允许2位小数');
                  }
                }
              },
            },
          ],
          volume: [
            {
              validator: ({ itemValue }) => {
                if (!isEmpty(itemValue)) {
                  if (!isFloat(itemValue)) {
                    return new Error('体积（cm³）必须是数字');
                  }
                  if (!isFloatGeZero(itemValue)) {
                    return new Error('体积（cm³）不允许小于0');
                  }
                  if (!isNumberPrecision(itemValue, 2)) {
                    return new Error('体积（cm³）最多允许2位小数');
                  }
                }
              },
            },
          ],
          taxRate: [
            {
              validator: ({ itemValue }) => {
                if (!isEmpty(itemValue)) {
                  if (!isFloat(itemValue)) {
                    return new Error('进项税率（%）必须是数字');
                  }
                  if (!isFloatGeZero(itemValue)) {
                    return new Error('进项税率（%）不允许小于0');
                  }
                  if (!isNumberPrecision(itemValue, 2)) {
                    return new Error('进项税率（%）最多允许2位小数');
                  }
                }
              },
            },
          ],
          saleTaxRate: [
            {
              validator: ({ itemValue }) => {
                if (!isEmpty(itemValue)) {
                  if (!isFloat(itemValue)) {
                    return new Error('销项税率（%）必须是数字');
                  }
                  if (!isFloatGeZero(itemValue)) {
                    return new Error('销项税率（%）不允许小于0');
                  }
                  if (!isNumberPrecision(itemValue, 2)) {
                    return new Error('销项税率（%）最多允许2位小数');
                  }
                }
              },
            },
          ],
          purchasePrice: [
            {
              validator: ({ itemValue }) => {
                if (!this.showSingleSkuItems) {
                  return;
                }
                if (isEmpty(itemValue)) {
                  return new Error('请输入采购价（元）');
                }
                if (!isEmpty(itemValue)) {
                  if (!isFloat(itemValue)) {
                    return new Error('采购价（元）必须是数字');
                  }
                  if (!isFloatGeZero(itemValue)) {
                    return new Error('采购价（元）不允许小于0');
                  }
                  if (!isNumberPrecision(itemValue, 6)) {
                    return new Error('采购价（元）最多允许6位小数');
                  }
                }
              },
            },
          ],
          salePrice: [
            {
              validator: ({ itemValue }) => {
                if (!this.showSingleSkuItems) {
                  return;
                }
                if (isEmpty(itemValue)) {
                  return new Error('请输入销售价（元）');
                }
                if (!isEmpty(itemValue)) {
                  if (!isFloat(itemValue)) {
                    return new Error('销售价（元）必须是数字');
                  }
                  if (!isFloatGeZero(itemValue)) {
                    return new Error('销售价（元）不允许小于0');
                  }
                  if (!isNumberPrecision(itemValue, 6)) {
                    return new Error('销售价（元）最多允许6位小数');
                  }
                }
              },
            },
          ],
          retailPrice: [
            {
              validator: ({ itemValue }) => {
                if (!this.showSingleSkuItems) {
                  return;
                }
                if (isEmpty(itemValue)) {
                  return new Error('请输入零售价（元）');
                }
                if (!isEmpty(itemValue)) {
                  if (!isFloat(itemValue)) {
                    return new Error('零售价（元）必须是数字');
                  }
                  if (!isFloatGeZero(itemValue)) {
                    return new Error('零售价（元）不允许小于0');
                  }
                  if (!isNumberPrecision(itemValue, 6)) {
                    return new Error('零售价（元）最多允许6位小数');
                  }
                }
              },
            },
          ],
        },
      };
    },
    computed: {
      showProductInfoItems() {
        return (
          PRODUCT_TYPE.NORMAL.equalsCode(this.productType) ||
          PRODUCT_TYPE.BUNDLE.equalsCode(this.productType)
        );
      },
      showCategoryPropertyItems() {
        return !isEmpty(this.formData.categoryId) && !isEmpty(this.modelorList);
      },
      showSingleSkuItems() {
        return PRODUCT_TYPE.BUNDLE.equalsCode(this.productType);
      },
      showSkuListItems() {
        return PRODUCT_TYPE.NORMAL.equalsCode(this.productType);
      },
      showMultiSkuItems() {
        return this.showSkuListItems && isMultiSkuList(this.skuList);
      },
      skuColumns() {
        const salePropertyColumns = this.showMultiSkuItems
          ? this.salePropertyList.map((item) => {
              return {
                field: `salePropertyValues.${item.id}`,
                title: item.name,
                width: 160,
                slots: { default: `sale_property_${item.id}` },
              };
            })
          : [];
        return [
          { type: 'checkbox', width: 45 },
          ...salePropertyColumns,
          {
            field: 'mainImage',
            title: 'SKU主图',
            width: 120,
            showOverflow: false,
            slots: { default: 'skuMainImage_default' },
          },
          {
            field: 'multiCode',
            title: '一品多码',
            width: 100,
            slots: { default: 'skuMultiCode_default' },
          },
          {
            field: 'code',
            title: 'SKU编号',
            width: 240,
            slots: { default: 'skuCode_default' },
          },
          {
            field: 'purchasePrice',
            title: '采购价（元）',
            width: 150,
            align: 'right',
            slots: { default: 'skuPurchasePrice_default' },
          },
          {
            field: 'salePrice',
            title: '销售价（元）',
            width: 150,
            align: 'right',
            slots: { default: 'skuSalePrice_default' },
          },
          {
            field: 'retailPrice',
            title: '零售价（元）',
            width: 150,
            align: 'right',
            slots: { default: 'skuRetailPrice_default' },
          },
        ];
      },
      multiCodeMainCode() {
        return this.currentMultiCodeSku ? this.currentMultiCodeSku.code : this.formData.skuCode;
      },
      multiCodeExtCodes() {
        return this.currentMultiCodeSku
          ? this.currentMultiCodeSku.multiCodes || []
          : this.formData.multiCodes;
      },
    },
    created() {
      // 初始化数据
      this.initFormData();
      // 查询数据
      this.loadFormData();
    },
    methods: {
      // 关闭对话框
      closeDialog() {
        this.closeCurrentPage();
      },
      // 初始化表单数据
      initFormData() {
        this.formData = {
          multiCode: false,
          multiCodes: [],
          code: '',
          skuCode: '',
          mainImage: [],
          skuMainImage: '',
          detailImages: [],
        };
        this.skuBatchPrices = {};
      },
      // 提交表单事件
      async submit() {
        const errMaps = await this.$refs.form.validate();
        if (errMaps) {
          return;
        }

        let valid = true;
        if (PRODUCT_TYPE.BUNDLE.equalsCode(this.productType)) {
          // 如果是组合商品
          if (isEmpty(this.productBundles)) {
            createError('组合商品必须包含单品数据！');
            return;
          }

          let purchasePrice = 0;
          let salePrice = 0;
          let retailPrice = 0;
          for (let i = 0; i < this.productBundles.length; i++) {
            const bundleProduct = this.productBundles[i];
            if (isEmpty(bundleProduct.productId)) {
              createError('第' + (i + 1) + '行单品不能为空！');
              return;
            }

            if (isEmpty(bundleProduct.bundleNum)) {
              createError('第' + (i + 1) + '行单品包含数量不能为空！');
              return;
            }
            if (!isInteger(bundleProduct.bundleNum)) {
              createError('第' + (i + 1) + '行单品包含数量必须为整数！');
              return;
            }
            if (!isIntegerGtZero(bundleProduct.bundleNum)) {
              createError('第' + (i + 1) + '行单品包含数量必须大于0！');
              return;
            }

            if (isEmpty(bundleProduct.purchasePrice)) {
              createError('第' + (i + 1) + '行单品采购价（元）不能为空！');
              return;
            }
            if (!isFloat(bundleProduct.purchasePrice)) {
              createError('第' + (i + 1) + '行单品采购价（元）必须是数字！');
              return;
            }
            if (!isFloatGtZero(bundleProduct.purchasePrice)) {
              createError('第' + (i + 1) + '行单品采购价（元）必须大于0！');
              return;
            }
            if (!isNumberPrecision(bundleProduct.purchasePrice, 6)) {
              createError('第' + (i + 1) + '行单品采购价（元）最多允许6位小数！');
              return;
            }

            if (isEmpty(bundleProduct.salePrice)) {
              createError('第' + (i + 1) + '行单品销售价（元）不能为空！');
              return;
            }
            if (!isFloat(bundleProduct.salePrice)) {
              createError('第' + (i + 1) + '行单品销售价（元）必须是数字！');
              return;
            }
            if (!isFloatGtZero(bundleProduct.salePrice)) {
              createError('第' + (i + 1) + '行单品销售价（元）必须大于0！');
              return;
            }
            if (!isNumberPrecision(bundleProduct.salePrice, 6)) {
              createError('第' + (i + 1) + '行单品销售价（元）最多允许6位小数！');
              return;
            }

            if (isEmpty(bundleProduct.retailPrice)) {
              createError('第' + (i + 1) + '行单品零售价（元）不能为空！');
              return;
            }
            if (!isFloat(bundleProduct.retailPrice)) {
              createError('第' + (i + 1) + '行单品零售价（元）必须是数字！');
              return;
            }
            if (!isFloatGtZero(bundleProduct.retailPrice)) {
              createError('第' + (i + 1) + '行单品零售价（元）必须大于0！');
              return;
            }
            if (!isNumberPrecision(bundleProduct.retailPrice, 6)) {
              createError('第' + (i + 1) + '行单品零售价（元）最多允许6位小数！');
              return;
            }

            purchasePrice = add(
              purchasePrice,
              mul(bundleProduct.bundleNum, bundleProduct.purchasePrice),
            );
            salePrice = add(salePrice, mul(bundleProduct.bundleNum, bundleProduct.salePrice));
            retailPrice = add(retailPrice, mul(bundleProduct.bundleNum, bundleProduct.retailPrice));
          }

          if (!eq(purchasePrice, this.formData.purchasePrice)) {
            createError(
              '当前所有单品的【包含数量】乘以【采购价（元）】的总和为' +
                purchasePrice +
                '元，组合商品的采购价为' +
                this.formData.purchasePrice +
                '元，两个值不相等，请调整！',
            );
            return;
          }

          if (!eq(salePrice, this.formData.salePrice)) {
            createError(
              '当前所有单品的【包含数量】乘以【销售价（元）】的总和为' +
                salePrice +
                '元，组合商品的销售价为' +
                this.formData.salePrice +
                '元，两个值不相等，请调整！',
            );
            return;
          }

          if (!eq(retailPrice, this.formData.retailPrice)) {
            createError(
              '当前所有单品的【包含数量】乘以【零售价（元）】的总和为' +
                retailPrice +
                '元，组合商品的零售价为' +
                this.formData.retailPrice +
                '元，两个值不相等，请调整！',
            );
            return;
          }
        }
        if (this.showSkuListItems && !this.validateSkuList()) {
          return;
        }
        if (!isEmpty(this.modelorList)) {
          this.modelorList
            .filter((item) => item.isRequired)
            .every((item) => {
              if (isEmpty(item.text)) {
                createError(item.name + '不能为空！');
                valid = false;
                return false;
              }

              return true;
            });
        }

        if (!valid) {
          return;
        }

        const properties = this.modelorList
          .filter((item) => !isEmpty(item.text))
          .map((item) => {
            return {
              id: item.id,
              text: isArray(item.text) ? JSON.stringify(item.text) : item.text,
            };
          });

        const params = buildProductSubmitParams(this.formData, {
          properties: properties,
          productBundles: this.productBundles,
          skus: this.buildSkus(),
        });
        this.loading = true;
        api
          .update(params)
          .then(() => {
            createSuccess('修改成功！');
            this.closeDialog();
          })
          .finally(() => {
            this.loading = false;
          });
      },
      // 查询数据
      loadFormData() {
        this.loading = true;
        api
          .get(this.id)
          .then((data) => {
            this.formData = Object.assign({}, data);
            const sku = (data.skus || [])[0] || {};
            this.formData.skuId = sku.id;
            this.formData.skuCode = sku.code || data.code;
            this.formData.multiCode = sku.multiCode || false;
            this.formData.multiCodes = sku.multiCodes || data.multiCodes || [];
            this.formData.purchasePrice = sku.purchasePrice || data.purchasePrice;
            this.formData.salePrice = sku.salePrice || data.salePrice;
            this.formData.retailPrice = sku.retailPrice || data.retailPrice;
            this.formData.mainImage = data.mainImage || [];
            this.formData.skuMainImage = sku.mainImage || '';
            this.formData.detailImages = data.detailImages || [];
            this.skuList = (data.skus || []).map((item) => {
              const salePropertyValues = {};
              (item.saleProperties || []).forEach((property) => {
                salePropertyValues[property.propertyId] = property.propertyItemId;
              });
              return {
                id: item.id || uuid(),
                code: item.code,
                multiCode: item.multiCode || false,
                salePropertyValues,
                mainImage: item.mainImage || '',
                purchasePrice: item.purchasePrice,
                salePrice: item.salePrice,
                retailPrice: item.retailPrice,
                multiCodes: item.multiCodes || [],
              };
            });
            if (isEmpty(this.skuList)) {
              this.addSkuRow();
            }
            this.selectCategory(this.formData.categoryId, this.formData);
            this.productType = this.formData.productType;
            this.productBundles = data.productBundles;
          })
          .finally(() => {
            this.loading = false;
          });
      },
      selectCategory(val, formData) {
        this.formData.categoryId = val;
        this.resetModelorList();
        this.salePropertyList = [];
        if (!isEmpty(val)) {
          propertyApi.getModelorByCategory(val).then((res) => {
            if (!this.isCurrentCategory(val)) {
              return;
            }
            const modelorList = res;
            if (formData) {
              const properties = formData.properties || [];
              modelorList.forEach((item) => {
                item.text = (properties.filter((p) => p.id === item.id)[0] || {}).text;
                if (COLUMN_TYPE.MULTIPLE.equalsCode(item.columnType)) {
                  item.text = isEmpty(item.text) ? [] : item.text.split(',');
                }
              });
            }

            modelorList
              .filter((item) => isEmpty(item.text))
              .forEach((item) => {
                if (COLUMN_TYPE.MULTIPLE.equalsCode(item.columnType)) {
                  item.text = [];
                } else {
                  item.text = '';
                }
              });

            this.modelorList = modelorList;
          });
          this.loadSaleProperties(val);
        }
      },
      resetModelorList() {
        this.formRenderKey = uuid();
        this.modelorList = [];
      },
      isCurrentCategory(categoryId) {
        return (
          !isEmpty(this.formData.categoryId) &&
          !isEmpty(categoryId) &&
          String(this.formData.categoryId) === String(categoryId)
        );
      },
      loadSaleProperties(categoryId) {
        categorySalePropertyApi.query(categoryId).then((properties) => {
          if (!this.isCurrentCategory(categoryId)) {
            return;
          }
          if (isEmpty(properties)) {
            this.salePropertyList = [];
            return;
          }

          Promise.all(
            properties.map((property) => {
              return salePropertyItemApi
                .query({
                  pageIndex: 1,
                  pageSize: 200,
                  code: '',
                  name: '',
                  propertyId: property.id,
                })
                .then((pageResult) => {
                  return {
                    ...property,
                    items: pageResult.datas || [],
                  };
                });
            }),
          ).then((results) => {
            if (!this.isCurrentCategory(categoryId)) {
              return;
            }
            this.salePropertyList = results;
          });
        });
      },
      loadSalePropertiesIfNeeded() {
        if (
          shouldLoadSaleProperties(this.formData.categoryId, this.skuList, this.salePropertyList)
        ) {
          this.loadSaleProperties(this.formData.categoryId);
        }
      },
      addSkuRow() {
        this.skuList.push({
          id: uuid(),
          code: '',
          multiCode: false,
          salePropertyValues: {},
          mainImage: '',
          purchasePrice: '',
          salePrice: '',
          retailPrice: '',
          multiCodes: [],
        });
        this.loadSalePropertiesIfNeeded();
      },
      delSkuRow() {
        const records = this.$refs.skuGrid.getCheckboxRecords();
        if (isEmpty(records)) {
          createError('请选择要删除的SKU数据！');
          return;
        }

        createConfirm('是否确定删除选中的SKU？').then(() => {
          this.skuList = this.skuList.filter((t) => {
            const tmp = records.filter((item) => item.id === t.id);
            return isEmpty(tmp);
          });
        });
      },
      validateSkuList() {
        if (this.showMultiSkuItems && isEmpty(this.salePropertyList)) {
          createError('多SKU商品分类必须先配置销售属性！');
          return false;
        }
        if (isEmpty(this.skuList)) {
          createError('SKU信息不能为空！');
          return false;
        }
        if (this.showMultiSkuItems && this.skuList.length < 2) {
          createError('多SKU商品至少需要2个SKU！');
          return false;
        }

        const skuKeys = [];
        for (let i = 0; i < this.skuList.length; i++) {
          const sku = this.skuList[i];
          if (this.showMultiSkuItems) {
            for (let j = 0; j < this.salePropertyList.length; j++) {
              const property = this.salePropertyList[j];
              if (isEmpty(sku.salePropertyValues[property.id])) {
                createError('第' + (i + 1) + '行SKU的【' + property.name + '】不能为空！');
                return false;
              }
            }
          }
          if (isEmpty(sku.code)) {
            createError('第' + (i + 1) + '行SKU编号不能为空！');
            return false;
          }
          const skuCodeValidResult = validCode({ itemValue: sku.code });
          if (skuCodeValidResult) {
            createError('第' + (i + 1) + '行SKU编号格式错误！');
            return false;
          }
          if (!this.validateSkuPrice(sku.purchasePrice, i, '采购价（元）')) {
            return false;
          }
          if (!this.validateSkuPrice(sku.salePrice, i, '销售价（元）')) {
            return false;
          }
          if (!this.validateSkuPrice(sku.retailPrice, i, '零售价（元）')) {
            return false;
          }

          if (this.showMultiSkuItems) {
            const skuKey = this.salePropertyList
              .map((property) => property.id + ':' + sku.salePropertyValues[property.id])
              .join('|');
            if (skuKeys.includes(skuKey)) {
              createError('第' + (i + 1) + '行SKU销售属性组合重复！');
              return false;
            }
            skuKeys.push(skuKey);
          }
        }

        return true;
      },
      validateSkuPrice(value, index, title) {
        if (isEmpty(value)) {
          createError('第' + (index + 1) + '行SKU' + title + '不能为空！');
          return false;
        }
        if (!isFloat(value)) {
          createError('第' + (index + 1) + '行SKU' + title + '必须是数字！');
          return false;
        }
        if (!isFloatGeZero(value)) {
          createError('第' + (index + 1) + '行SKU' + title + '不允许小于0！');
          return false;
        }
        if (!isNumberPrecision(value, 6)) {
          createError('第' + (index + 1) + '行SKU' + title + '最多允许6位小数！');
          return false;
        }

        return true;
      },
      validateSkuBatchPrice(value, title) {
        if (isEmpty(value)) {
          return true;
        }
        if (!isFloat(value)) {
          createError('批量设置' + title + '必须是数字！');
          return false;
        }
        if (!isFloatGeZero(value)) {
          createError('批量设置' + title + '不允许小于0！');
          return false;
        }
        if (!isNumberPrecision(value, 6)) {
          createError('批量设置' + title + '最多允许6位小数！');
          return false;
        }

        return true;
      },
      batchSetSkuPrices() {
        const records = this.$refs.skuGrid.getCheckboxRecords();
        if (isEmpty(records)) {
          createError('请选择要批量设置的SKU！');
          return;
        }
        if (
          isEmpty(this.skuBatchPrices.purchasePrice) &&
          isEmpty(this.skuBatchPrices.salePrice) &&
          isEmpty(this.skuBatchPrices.retailPrice)
        ) {
          createError('请至少输入一个要批量设置的价格！');
          return;
        }
        if (!this.validateSkuBatchPrice(this.skuBatchPrices.purchasePrice, '采购价（元）')) {
          return;
        }
        if (!this.validateSkuBatchPrice(this.skuBatchPrices.salePrice, '销售价（元）')) {
          return;
        }
        if (!this.validateSkuBatchPrice(this.skuBatchPrices.retailPrice, '零售价（元）')) {
          return;
        }

        this.skuList = applySkuBatchPrices(
          this.skuList,
          this.skuBatchPrices,
          records.map((item) => item.id),
        );
      },
      buildSkus() {
        if (this.showSkuListItems) {
          return this.skuList.map((sku) => {
            return {
              id: sku.id,
              code: sku.code,
              multiCodes: sku.multiCode ? sku.multiCodes || [] : [],
              mainImage: sku.mainImage,
              purchasePrice: sku.purchasePrice,
              salePrice: sku.salePrice,
              retailPrice: sku.retailPrice,
              saleProperties: this.showMultiSkuItems
                ? this.salePropertyList.map((property) => {
                    return {
                      propertyId: property.id,
                      propertyItemId: sku.salePropertyValues[property.id],
                    };
                  })
                : [],
            };
          });
        }

        return [
          {
            id: this.formData.skuId,
            code: this.formData.skuCode,
            multiCodes: this.formData.multiCodes,
            mainImage: this.formData.skuMainImage,
            purchasePrice: this.formData.purchasePrice,
            salePrice: this.formData.salePrice,
            retailPrice: this.formData.retailPrice,
          },
        ];
      },
      addRow() {
        this.productBundles.push(this.emptyProduct());
      },
      emptyProduct() {
        return {
          id: uuid(),
          productId: '',
        };
      },
      delRow() {
        const records = this.$refs.grid.getCheckboxRecords();
        if (isEmpty(records)) {
          createError('请选择要删除的商品数据！');
          return;
        }

        createConfirm('是否确定删除选中的商品？').then(() => {
          this.productBundles = this.productBundles.filter((t) => {
            const tmp = records.filter((item) => item.id === t.id);
            return isEmpty(tmp);
          });
        });
      },
      openMultiCodeDialog() {
        this.currentMultiCodeSku = null;
        this.$refs.multiCodeDialog.openDialog();
      },
      openRowMultiCodeDialog(row) {
        this.currentMultiCodeSku = row;
        this.$refs.multiCodeDialog.openDialog();
      },
      onCompleteMultiCode({ mainCode, multiCodes }) {
        if (this.currentMultiCodeSku) {
          this.currentMultiCodeSku.code = mainCode;
          this.currentMultiCodeSku.multiCodes = multiCodes;
          return;
        }

        this.formData.skuCode = mainCode;
        this.formData.multiCodes = multiCodes;
      },
      onGenerateCode() {
        generateCode(GENERATE_CODE_TYPE.PRODUCT.code).then((res) => {
          this.formData.code = res;
        });
      },
      onGenerateSkuCode() {
        generateCode(GENERATE_CODE_TYPE.PRODUCT.code).then((res) => {
          this.formData.skuCode = res;
        });
      },
      onGenerateRowSkuCode(row) {
        generateCode(GENERATE_CODE_TYPE.PRODUCT.code).then((res) => {
          row.code = res;
        });
      },
      uploadProductImage({ file }) {
        return uploadImage(file.originFileObj || file);
      },
    },
  });
</script>

<style scoped>
  .batch-price-input {
    width: 110px;
  }
</style>
