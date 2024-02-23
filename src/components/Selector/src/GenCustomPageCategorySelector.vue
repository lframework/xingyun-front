<template>
  <div>
    <dialog-table
      ref="selector"
      :request="getList"
      :load="getLoad"
      :table-column="[
        { field: 'code', title: '编号', width: 100 },
        { field: 'name', title: '名称', minWidth: 160, treeNode: true },
      ]"
      :request-params="_requestParams"
      :handle-search="handleSearch"
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
  import * as api from '@/api/development/custom/list-category';

  export default defineComponent({
    name: 'GenCustomPageCategorySelector',
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
        searchParams: { code: '', name: '' },
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
        return api.loadCustomListCategory(ids);
      },
      handleSearch(datas) {
        const filterCode = this.$utils.toString(this.searchParams.code).trim();
        const filterName = this.$utils.toString(this.searchParams.name).trim();
        const isFilterCode = !this.$utils.isEmpty(filterCode);
        const isFilterName = !this.$utils.isEmpty(filterName);
        if (isFilterCode || isFilterName) {
          const options = { key: 'id', parentKey: 'parentId', children: 'children', strict: true };
          const tableData = this.$utils.searchTree(
            datas,
            (item) => {
              let filterResult = true;

              if (isFilterCode) {
                filterResult &= this.$utils.isEqualWithStr(
                  this.$utils.toString(item['code']),
                  filterName,
                );
              }

              if (isFilterName) {
                filterResult &= this.$utils.toString(item['name']).indexOf(filterName) > -1;
              }

              return filterResult;
            },
            options,
          );

          return tableData;
        } else {
          return datas;
        }
      },
    },
  });
</script>

<style lang="less"></style>
