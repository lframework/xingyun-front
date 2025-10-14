<template>
  <div>
    <dialog-tree
      ref="selector"
      :request="getList"
      :load="getLoad"
      :handle-search="handleSearch"
      :request-params="_requestParams"
      v-bind="$attrs"
    >
      <template #form>
        <!-- 查询条件 -->
        <j-border>
          <j-form bordered>
            <j-form-item v-if="isEmpty(requestParams.name)" label="名称">
              <a-input v-model:value="searchParams.name" />
            </j-form-item>
            <j-form-item v-if="isEmpty(requestParams.available)" label="状态">
              <a-select v-model:value="searchParams.available" placeholder="全部" allow-clear>
                <a-select-option
                  v-for="item in AVAILABLE.values()"
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
    </dialog-tree>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import { SearchOutlined } from '@ant-design/icons-vue';
  import * as api from '@/api/base-data/product/category';
  import {
    isEmpty,
    toString,
    searchTree,
    toTreeArray,
    isEqualWithStr,
    toArrayTree,
  } from '@/utils/utils';
  import { AVAILABLE } from '@/enums/biz/available';

  export default defineComponent({
    name: 'ProductCategorySelector',
    components: { SearchOutlined },
    setup() {
      return {
        isEmpty,
        AVAILABLE,
      };
    },
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
        searchParams: {
          code: '',
          name: '',
          available: AVAILABLE.ENABLE.code,
        },
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
        return api.loadProductCategory(ids);
      },
      handleSearch(datas) {
        const filterName = toString(this.searchParams.name).trim();
        const isFilterName = !isEmpty(filterName);
        const filterAvailable = toString(this.searchParams.available).trim();
        const isFilterAvailable = !isEmpty(this.searchParams.available);
        if (isFilterName || isFilterAvailable) {
          const options = { key: 'id', parentKey: 'parentId', children: 'children', strict: true };
          let tableData = searchTree(
            datas,
            (item) => {
              let filterResult = true;

              if (isFilterName) {
                filterResult &= toString(item['name']).indexOf(filterName) > -1;
              }

              return filterResult;
            },
            options,
          );

          if (isFilterAvailable) {
            tableData = toTreeArray(tableData, options);
            tableData = tableData.filter((item) =>
              isEqualWithStr(item['available'], filterAvailable),
            );
            tableData = toArrayTree(tableData, options);
          }

          return tableData;
        } else {
          return datas;
        }
      },
    },
  });
</script>

<style lang="less"></style>
