<template>
  <div>
    <div v-show="visible">
      <page-wrapper content-full-height fixed-height>
        <!-- 数据列表 -->
        <vxe-grid
          id="MyFlow"
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
              <j-form label-width="60px" @collapse="$refs.grid.refreshColumn()">
                <j-form-item label="流程编号" :span="6">
                  <a-input v-model:value="searchFormData.flowCode" allow-clear />
                </j-form-item>
                <j-form-item label="流程名称" :span="6">
                  <a-input v-model:value="searchFormData.flowName" allow-clear />
                </j-form-item>
                <j-form-item label="标题" :span="6">
                  <a-input v-model:value="searchFormData.title" allow-clear />
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
    <bpm-approve
      ref="systemApproveDialog"
      :instance-id="instanceId"
      :business-id="businessId"
      :component-path="componentPath"
      page-from="my"
      @confirm="search"
    />
  </div>
</template>

<script>
  import { h, defineComponent } from 'vue';
  import { SearchOutlined } from '@ant-design/icons-vue';
  import * as api from '@/api/bpm/flow/task';
  import { multiplePageMix } from '@/mixins/multiplePageMix';
  import { getSysFlowComponentPath, getSysFlowRestartRouter } from '@/views/bpm/flow/task/common';

  export default defineComponent({
    name: 'MyFlow',
    // 使用组件
    components: {},
    mixins: [multiplePageMix],
    setup() {
      return {
        h,
        SearchOutlined,
      };
    },
    data() {
      return {
        // 当前行数据
        id: '',
        instanceId: '',
        businessId: '',
        componentPath: '',
        // 是否显示加载框
        loading: false,
        visible: true,
        // 查询列表的查询条件
        searchFormData: {
          flowCode: '',
          flowName: '',
          title: '',
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
          { type: 'seq', width: 45 },
          { field: 'flowCode', title: '流程编号', width: 100 },
          { field: 'flowName', title: '流程名称', width: 120 },
          { field: 'title', title: '标题', minWidth: 180 },
          { field: 'categoryName', title: '流程分类', width: 120 },
          { field: 'nodeName', title: '节点名称', width: 120 },
          {
            field: 'flowStatus',
            title: '流程状态',
            width: 100,
            formatter: ({ cellValue }) => this.$enums.FLOW_INSTANCE_STATUS.getDesc(cellValue),
          },
          { field: 'startBy', title: '发起人', width: 100 },
          { field: 'startTime', title: '发起时间', width: 170 },
          { field: 'endTime', title: '结束时间', width: 170 },
          { field: 'executeTime', title: '审核时长', width: 120 },
          { title: '操作', width: 130, fixed: 'right', slots: { default: 'action_default' } },
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
              return api.queryMyList(this.buildQueryParams(page));
            },
          },
        },
        batchHandleDatas: [],
      };
    },
    created() {},
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
      // 删除
      createActions(row) {
        return [
          {
            label: '查看',
            onClick: () => {
              this.instanceId = row.instanceId;
              this.businessId = row.businessId;
              const ext = JSON.parse(row.ext || '{}');
              if (this.$enums.FLOW_DEFINITION_EXT_BIZ_TYPE.SYSTEM.equalsCode(ext.bizType)) {
                this.componentPath = getSysFlowComponentPath(ext.bizFlag);
                this.$refs.systemApproveDialog.openDialog();
              }
            },
          },
          {
            label: '重新发起',
            ifShow: () => {
              return (
                this.$enums.FLOW_INSTANCE_STATUS.TERMINATION.equalsCode(row.flowStatus) ||
                this.$enums.FLOW_INSTANCE_STATUS.UNDO.equalsCode(row.flowStatus) ||
                this.$enums.FLOW_INSTANCE_STATUS.REFUSE.equalsCode(row.flowStatus) ||
                this.$enums.FLOW_INSTANCE_STATUS.REVOKE.equalsCode(row.flowStatus)
              );
            },
            onClick: () => {
              this.instanceId = row.instanceId;
              this.businessId = row.businessId;
              const ext = JSON.parse(row.ext || '{}');
              if (this.$enums.FLOW_DEFINITION_EXT_BIZ_TYPE.SYSTEM.equalsCode(ext.bizType)) {
                const routeUrl = getSysFlowRestartRouter(ext.bizFlag, this.businessId);
                this.openChildPage(routeUrl);
              }
            },
          },
        ];
      },
      onRefreshPage() {
        this.search();
      },
    },
  });
</script>
