<template>
  <div>
    <dialog-table
      ref="selector"
      :request="getList"
      :load="getLoad"
      :column-option="{ label: PRODUCT_SELECTOR_LABEL_FIELD, value: 'id' }"
      :table-column="[
        { field: 'productCode', title: '商品编号', width: 120 },
        { field: 'skuCode', title: 'SKU编号', width: 120 },
        { field: 'name', title: '商品名称', minWidth: 260 },
        { field: 'salePropertyText', title: '销售属性', width: 180 },
        { field: 'unit', title: '单位', width: 80 },
        { field: 'spec', title: '规格', width: 80 },
        { field: 'categoryName', title: '商品分类', width: 120 },
        { field: 'brandName', title: '商品品牌', width: 120 },
      ]"
      :request-params="_requestParams"
      v-bind="$attrs"
    >
      <template #form>
        <!-- 查询条件 -->
        <j-border>
          <j-form bordered>
            <j-form-item v-if="isEmpty(requestParams.code)" label="编号">
              <a-input v-model:value="searchParams.code" />
            </j-form-item>
            <j-form-item v-if="isEmpty(requestParams.name)" label="名称">
              <a-input v-model:value="searchParams.name" />
            </j-form-item>
            <j-form-item v-if="isEmpty(requestParams.shortName)" label="简称">
              <a-input v-model:value="searchParams.shortName" />
            </j-form-item>
            <j-form-item v-if="isEmpty(requestParams.categoryId)" label="分类">
              <product-category-selector
                v-model:value="searchParams.categoryId"
                :only-final="true"
              />
            </j-form-item>
            <j-form-item v-if="isEmpty(requestParams.brandId)" label="品牌">
              <product-brand-selector v-model:value="searchParams.brandId" />
            </j-form-item>
            <j-form-item label="创建日期" :content-nest="false">
              <div class="date-range-container">
                <a-date-picker
                  v-model:value="searchParams.startTime"
                  placeholder=""
                  value-format="YYYY-MM-DD 00:00:00"
                />
                <span class="date-split">至</span>
                <a-date-picker
                  v-model:value="searchParams.endTime"
                  placeholder=""
                  value-format="YYYY-MM-DD 23:59:59"
                />
              </div>
            </j-form-item>
            <j-form-item v-if="isEmpty(requestParams.productType)" label="商品类型">
              <a-select v-model:value="searchParams.productType" placeholder="全部" allow-clear>
                <a-select-option
                  v-for="item in PRODUCT_TYPE.values()"
                  :key="item.code"
                  :value="item.code"
                  >{{ item.desc }}</a-select-option
                >
              </a-select>
            </j-form-item>
          </j-form>
        </j-border>
      </template>
      <!-- 工具栏 -->
      <template #toolbar_buttons>
        <a-space class="operator">
          <a-button type="primary" @click="$refs.selector.search()">
            <template #icon>
              <SearchOutlined />
            </template>
            查询</a-button
          >
        </a-space>
      </template>
    </dialog-table>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import { SearchOutlined } from '@ant-design/icons-vue';
  import * as api from '@/api/base-data/product/info';
  import { isEmpty } from '@/utils/utils';
  import ProductBrandSelector from '@/components/Selector/ProductBrandSelector.vue';
  import ProductCategorySelector from '@/components/Selector/ProductCategorySelector.vue';
  import { AVAILABLE } from '@/enums/biz/available';
  import { PRODUCT_TYPE } from '@/enums/biz/productType';
  import {
    PRODUCT_SELECTOR_LABEL_FIELD,
    withProductSelectorLabels,
  } from './productSelectorLabelHelper.mjs';

  export default defineComponent({
    name: 'ProductSelector',
    components: {
      SearchOutlined,
      ProductBrandSelector,
      ProductCategorySelector,
    },
    props: {
      requestParams: {
        type: Object,
        default: () => {
          return {};
        },
      },
    },
    setup() {
      return {
        isEmpty,
        AVAILABLE,
        PRODUCT_TYPE,
        PRODUCT_SELECTOR_LABEL_FIELD,
      };
    },
    data() {
      return {
        searchParams: { code: '', name: '', available: AVAILABLE.ENABLE.code },
      };
    },
    computed: {
      _requestParams() {
        return { available: true, ...this.searchParams, ...this.requestParams };
      },
    },
    methods: {
      getList(params) {
        return api
          .selector({
            ...params,
            available: true,
            ...this.searchParams,
            ...this.requestParams,
          })
          .then((res) => {
            return { ...res, datas: withProductSelectorLabels(res.datas) };
          });
      },
      getLoad(ids) {
        return api.loadProduct(ids).then((res) => withProductSelectorLabels(res));
      },
    },
  });
</script>

<style lang="less"></style>
