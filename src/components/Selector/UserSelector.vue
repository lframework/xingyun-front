<template>
  <div>
    <dialog-table
      ref="selector"
      :request="getList"
      :load="getLoad"
      :table-column="[
        { field: 'code', title: '编号', width: 120 },
        { field: 'name', title: '姓名', minWidth: 160 },
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
            <j-form-item v-if="isEmpty(requestParams.name)" label="姓名">
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
  import * as api from '@/api/system/user';
  import { isEmpty } from '@/utils/utils';

  export default defineComponent({
    name: 'UserSelector',
    components: { SearchOutlined },
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
          available: true,
          ...this.searchParams,
          ...this.requestParams,
        });
      },
      getLoad(ids) {
        return api.loadUser(ids);
      },
    },
  });
</script>

<style lang="less"></style>
