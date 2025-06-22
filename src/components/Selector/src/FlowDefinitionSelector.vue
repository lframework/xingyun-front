<template>
  <div>
    <dialog-table
      ref="selector"
      :request="getList"
      :load="getLoad"
      :request-params="_requestParams"
      :table-column="[
        { field: 'flowCode', title: '流程编号', width: 100 },
        { field: 'flowName', title: '流程名称', minWidth: 180 },
        { field: 'categoryName', title: '流程分类', width: 120 },
        { field: 'version', title: '版本号', width: 60 },
        { field: 'createTime', title: '创建时间', width: 170 },
      ]"
      :column-option="{ label: 'flowCode', value: 'id' }"
      v-bind="$attrs"
    >
      <template #form>
        <!-- 查询条件 -->
        <j-border>
          <j-form bordered>
            <j-form-item v-if="$utils.isEmpty(requestParams.code)" label="流程编号">
              <a-input v-model:value="searchParams.code" />
            </j-form-item>
            <j-form-item v-if="$utils.isEmpty(requestParams.name)" label="流程名称">
              <a-input v-model:value="searchParams.name" />
            </j-form-item>
            <j-form-item v-if="$utils.isEmpty(requestParams.categoryId)" label="流程分类">
              <flow-category-selector v-model:value="searchParams.categoryId" :only-final="true" />
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
  import * as api from '@/api/bpm/flow/definition';

  export default defineComponent({
    name: 'FlowDefinitionSelector',
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
          categoryId: '',
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
        return api.loadFlowDefinition(ids);
      },
    },
  });
</script>

<style lang="less"></style>
