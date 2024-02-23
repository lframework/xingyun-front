<template>
  <div>
    <dialog-table
      ref="selector"
      :request="getList"
      :load="getLoad"
      :table-column="[{ field: 'tableName', title: '表名', minWidth: 160 }]"
      :option="{
        label: 'tableName',
        value: 'id',
      }"
      :column-option="{
        label: 'tableName',
        value: 'tableName',
      }"
      :request-params="_requestParams"
      v-bind="$attrs"
    >
      <template #form>
        <!-- 查询条件 -->
        <j-border>
          <j-form>
            <j-form-item v-if="$utils.isEmpty(requestParams.name)" label="表名">
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
  import * as api from '@/api/development/gen/simple-db';

  export default defineComponent({
    name: 'SimpleDbTableSelector',
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
        searchParams: { name: '' },
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
        return api.loadTable(ids);
      },
    },
  });
</script>

<style lang="less"></style>
