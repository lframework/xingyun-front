<template>
  <div>
    <dialog-tree
      ref="selector"
      :request="getList"
      :load="getLoad"
      :handle-search="handleSearch"
      :check-strictly="checkStrictly"
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
  import * as api from '@/api/system/dept';
  import { isEmpty, toString, searchTree } from '@/utils/utils';

  export default defineComponent({
    name: 'SysDeptSelector',
    components: { SearchOutlined },
    props: {
      requestParams: {
        type: Object,
        default: () => {
          return {};
        },
      },
      checkStrictly: {
        type: Boolean,
        default: true,
      },
    },
    setup() {
      return {
        isEmpty,
      };
    },
    data() {
      return {
        searchParams: {
          code: '',
          name: '',
        },
      };
    },
    computed: {
      _requestParams() {
        return { ...this.searchParams, ...this.requestParams };
      },
    },
    methods: {
      getList(params) {
        return api.selector({
          ...params,
          ...this.searchParams,
          ...this.requestParams,
        });
      },
      getLoad(ids) {
        return api.loadDept(ids);
      },
      handleSearch(datas) {
        const filterCode = toString(this.searchParams.code).trim();
        const filterName = toString(this.searchParams.name).trim();
        const isFilterCode = !isEmpty(filterCode);
        const isFilterName = !isEmpty(filterName);
        if (isFilterName || isFilterCode) {
          const options = { key: 'id', parentKey: 'parentId', children: 'children', strict: true };
          let tableData = searchTree(
            datas,
            (item) => {
              let filterResult = true;

              if (isFilterName) {
                filterResult &= toString(item['name']).indexOf(filterName) > -1;
              }

              if (isFilterCode) {
                filterResult &= toString(item['code']).indexOf(filterCode) > -1;
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
