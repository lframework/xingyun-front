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
          <j-form>
            <j-form-item v-if="$utils.isEmpty(requestParams.name)" label="名称">
              <a-input v-model:value="searchParams.name" />
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
    </dialog-tree>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import { SearchOutlined } from '@ant-design/icons-vue';
  import * as api from '@/api/base-data/product/category';

  export default defineComponent({
    name: 'ProductCategorySelector',
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
        searchParams: {
          code: '',
          name: '',
          available: this.$enums.AVAILABLE.ENABLE.code,
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
        const filterName = this.$utils.toString(this.searchParams.name).trim();
        const isFilterName = !this.$utils.isEmpty(filterName);
        const filterAvailable = this.$utils.toString(this.searchParams.available).trim();
        const isFilterAvailable = !this.$utils.isEmpty(this.searchParams.available);
        if (isFilterName || isFilterAvailable) {
          const options = { key: 'id', parentKey: 'parentId', children: 'children', strict: true };
          let tableData = this.$utils.searchTree(
            datas,
            (item) => {
              let filterResult = true;

              if (isFilterName) {
                filterResult &= this.$utils.toString(item['name']).indexOf(filterName) > -1;
              }

              return filterResult;
            },
            options,
          );

          if (isFilterAvailable) {
            tableData = this.$utils.toTreeArray(tableData, options);
            tableData = tableData.filter((item) =>
              this.$utils.isEqualWithStr(item['available'], filterAvailable),
            );
            tableData = this.$utils.toArrayTree(tableData, options);
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
