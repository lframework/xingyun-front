<template>
  <div>
    <page-wrapper
      title="请选择租户"
      content="当前功能需要先选择租户。"
      content-full-height
      fixed-height
    >
      <vxe-grid
        id="TenantList"
        ref="grid"
        resizable
        show-overflow
        highlight-hover-row
        keep-source
        row-id="id"
        :proxy-config="proxyConfig"
        :columns="tableColumn"
        :toolbar-config="toolbarConfig"
        :custom-config="{}"
        :pager-config="{}"
        :loading="loading"
        height="auto"
      >
        <template #form>
          <j-border>
            <j-form bordered label-width="80px" @collapse="$refs.grid.refreshColumn()">
              <j-form-item label="租户ID">
                <a-input v-model:value="searchFormData.tenantId" allow-clear />
              </j-form-item>
              <j-form-item label="名称">
                <a-input v-model:value="searchFormData.name" allow-clear />
              </j-form-item>
              <j-form-item label="状态">
                <a-select v-model:value="searchFormData.available" placeholder="全部" allow-clear>
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
          <a-space>
            <a-button type="primary" :icon="h(SearchOutlined)" @click="search">查询</a-button>
          </a-space>
        </template>

        <!-- 状态 列自定义内容 -->
        <template #available_default="{ row }">
          <available-tag :available="row.available" />
        </template>

        <!-- 操作 列自定义内容 -->
        <template #action_default="{ row }">
          <table-action outside :actions="createActions(row)" />
        </template>
      </vxe-grid>
    </page-wrapper>
  </div>
</template>
<script>
  import { defineComponent, h } from 'vue';
  import * as api from '@/api/system/tenant';
  import AvailableTag from '@/components/Tag/AvailableTag.vue';
  import { AVAILABLE } from '@/enums/biz/available';
  import { PlusOutlined, SearchOutlined } from '@ant-design/icons-vue';

  export default defineComponent({
    name: 'TenantList',

    componentName: 'TenantList',
    components: { AvailableTag },
    props: {},
    setup() {
      return {
        h,
        SearchOutlined,
        PlusOutlined,
        AVAILABLE,
      };
    },
    data() {
      return {
        loading: false,
        // 查询列表的查询条件
        searchFormData: {
          tenantId: '',
          name: '',
          available: true,
        },
        // 工具栏配置
        toolbarConfig: {
          // 自定义左侧工具栏
          slots: {
            buttons: 'toolbar_buttons',
          },
        },
        // 列表数据配置
        tableColumn: [
          { type: 'checkbox', width: 45 },
          { field: 'id', title: '租户ID', width: 100, sortable: true },
          { field: 'name', title: '名称', minWidth: 180, sortable: true },
          { field: 'available', title: '状态', width: 80, slots: { default: 'available_default' } },
          { title: '操作', width: 80, fixed: 'right', slots: { default: 'action_default' } },
        ],
        // 请求接口配置
        proxyConfig: {
          props: {
            // 响应结果列表字段
            result: 'datas',
            // 响应结果总条数字段
            total: 'totalCount',
          },
          ajax: {
            // 查询接口
            query: ({ page }) => {
              return api.selector(this.buildQueryParams(page));
            },
          },
        },
      };
    },
    methods: {
      // 列表发生查询时的事件
      search() {
        this.$refs.grid.commitProxy('reload');
      },
      // 查询前构建查询参数结构
      buildQueryParams(page) {
        return Object.assign(
          {
            pageIndex: page.currentPage,
            pageSize: page.pageSize,
          },
          this.buildSearchFormData(),
        );
      },
      // 查询前构建具体的查询参数
      buildSearchFormData() {
        return Object.assign({}, this.searchFormData);
      },
      createActions(row) {
        return [
          {
            label: '选择',
            onClick: () => {
              this.$nextTick(() => {
                this.$emit('select', row.id);
              });
            },
          },
        ];
      },
    },
  });
</script>
