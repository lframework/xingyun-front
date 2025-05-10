<template>
  <div>
    <page-wrapper content-full-height fixed-height>
      <!-- 数据列表 -->
      <vxe-grid
        id="ExportTaskFailList"
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
              <j-form-item label="任务名称" :span="12">
                <a-input v-model:value="searchFormData.name" allow-clear />
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

        <!-- 操作 列自定义内容 -->
        <template #action_default="{ row }">
          <table-action outside :actions="createActions(row)" />
        </template>
      </vxe-grid>
    </page-wrapper>
  </div>
</template>

<script>
  import { h, defineComponent } from 'vue';
  import * as api from '@/api/export-task';
  import { SearchOutlined } from '@ant-design/icons-vue';

  export default defineComponent({
    name: 'Address',
    components: {},
    setup() {
      return {
        h,
        SearchOutlined,
      };
    },
    data() {
      return {
        loading: false,
        // 当前行数据
        recordId: '',
        // 查询列表的查询条件
        searchFormData: {},
        // 工具栏配置
        toolbarConfig: {
          // 自定义左侧工具栏
          slots: {
            buttons: 'toolbar_buttons',
          },
        },
        // 列表数据配置
        tableColumn: [
          { type: 'seq', width: 50 },
          { field: 'name', title: '任务名称', minWidth: 120 },
          { field: 'createTime', title: '创建时间', width: 140 },
          { field: 'errorMsg', title: '错误信息', width: 200 },
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
            query: ({ page, sorts }) => {
              return api.queryFail(this.buildQueryParams(page, sorts));
            },
          },
        },
      };
    },
    created() {},
    methods: {
      // 列表发生查询时的事件
      search() {
        this.$refs.grid.commitProxy('reload');
      },
      // 查询前构建查询参数结构
      buildQueryParams(page, sorts) {
        return {
          ...this.$utils.buildSortPageVo(page, sorts),
          ...this.buildSearchFormData(),
        };
      },
      // 查询前构建具体的查询参数
      buildSearchFormData() {
        return {
          ...this.searchFormData,
        };
      },
    },
  });
</script>
<style scoped></style>
