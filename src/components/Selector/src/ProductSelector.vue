<template>
  <div>
    <dialog-table
      ref="selector"
      :request="getList"
      :load="getLoad"
      :table-column="[
        { field: 'code', title: '商品编号', width: 120 },
        { field: 'name', title: '商品名称', minWidth: 260 },
        { field: 'skuCode', title: '商品SKU编号', width: 120 },
        { field: 'externalCode', title: '商品外部编号', width: 120 },
        { field: 'unit', title: '单位', width: 80 },
        { field: 'spec', title: '规格', width: 80 },
        { field: 'categoryName', title: '商品类目', width: 120 },
        { field: 'brandName', title: '商品品牌', width: 120 },
        { field: 'available', title: '状态', width: 80, slots: { default: 'available_default' } },
      ]"
      :request-params="_requestParams"
      v-bind="$attrs"
    >
      <template #form>
        <!-- 查询条件 -->
        <j-border>
          <j-form>
            <j-form-item v-if="$utils.isEmpty(requestParams.code)" label="编号">
              <a-input v-model:value="searchParams.code" />
            </j-form-item>
            <j-form-item v-if="$utils.isEmpty(requestParams.name)" label="名称">
              <a-input v-model:value="searchParams.name" />
            </j-form-item>
            <j-form-item v-if="$utils.isEmpty(requestParams.shortName)" label="简称">
              <a-input v-model:value="searchParams.shortName" />
            </j-form-item>
            <j-form-item v-if="$utils.isEmpty(requestParams.skuCode)" label="SKU编号">
              <a-input v-model:value="searchParams.skuCode" />
            </j-form-item>
            <j-form-item v-if="$utils.isEmpty(requestParams.categoryId)" label="类目">
              <product-category-selector v-model:value="searchParams.categoryId" />
            </j-form-item>
            <j-form-item v-if="$utils.isEmpty(requestParams.brandId)" label="品牌">
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
            <j-form-item v-if="$utils.isEmpty(requestParams.productType)" label="商品类型">
              <a-select v-model:value="searchParams.productType" placeholder="全部" allow-clear>
                <a-select-option
                  v-for="item in $enums.PRODUCT_TYPE.values()"
                  :key="item.code"
                  :value="item.code"
                  >{{ item.desc }}</a-select-option
                >
              </a-select>
            </j-form-item>
            <j-form-item v-if="$utils.isEmpty(requestParams.available)" label="状态">
              <a-select v-model:value="searchParams.available" placeholder="全部" allow-clear>
                <a-select-option
                  v-for="item in $enums.AVAILABLE.values()"
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

  export default defineComponent({
    name: 'ProductSelector',
    components: { SearchOutlined },
    props: {
      requestParams: {
        type: Object,
        default: () => {
          return {};
        },
      },
    },
    data() {
      return {
        searchParams: { code: '', name: '', available: this.$enums.AVAILABLE.ENABLE.code },
      };
    },
    computed: {
      _requestParams() {
        return { available: true, ...this.searchParams, ...this.requestParams };
      },
    },
    methods: {
      getList(params) {
        return api.selector({
          ...params,
          available: true,
          ...this.searchParams,
          ...this.requestParams,
        });
      },
      getLoad(ids) {
        return api.loadProduct(ids);
      },
    },
  });
</script>

<style lang="less"></style>
