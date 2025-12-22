<template>
  <div>
    <dialog-table
      ref="selector"
      :request="getList"
      :load="getLoad"
      :table-column="[{ field: 'name', title: '名称', minWidth: 160 }]"
      :request-params="_requestParams"
      v-bind="$attrs"
    >
      <template #form>
        <!-- 查询条件 -->
        <j-border>
          <j-form bordered>
<<<<<<<< HEAD:src/components/Selector/SimpleDbTableSelector.vue
            <j-form-item v-if="isEmpty(requestParams.name)" label="表名">
========
            <j-form-item v-if="isEmpty(requestParams.name)" label="名称">
>>>>>>>> develop:src/components/Selector/SysNotifyGroupSelector.vue
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
<<<<<<<< HEAD:src/components/Selector/SimpleDbTableSelector.vue
  import * as api from '@/api/development/gen/simple-db';
========
  import * as api from '@/api/system/notify-group';
>>>>>>>> develop:src/components/Selector/SysNotifyGroupSelector.vue
  import { isEmpty } from '@/utils/utils';

  export default defineComponent({
    name: 'SysNotifyGroupSelector',
    components: { SearchOutlined },
    setup() {
      return {
        isEmpty,
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
    setup() {
      return {
        isEmpty,
      };
    },
    data() {
      return {
        searchParams: {
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
        return api.loadNotifyGroup(ids);
      },
    },
  });
</script>

<style lang="less"></style>
