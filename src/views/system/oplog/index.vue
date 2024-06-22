<template>
  <div v-permission="['system:oplog:query']">
    <page-wrapper content-full-height fixed-height>
      <!-- 数据列表 -->
      <vxe-grid
        id="Oplog"
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
            <j-form label-width="80px" @collapse="$refs.grid.refreshColumn()">
              <j-form-item label="日志名称">
                <a-input v-model:value="searchFormData.name" allow-clear />
              </j-form-item>
              <j-form-item label="创建人">
                <user-selector v-model:value="searchFormData.createBy" />
              </j-form-item>
              <j-form-item label="日志类型">
                <a-select v-model:value="searchFormData.logType" placeholder="全部" allow-clear>
                  <a-select-option
                    v-for="item in $enums.OP_LOG_TYPE.values()"
                    :key="item.code"
                    :value="item.code"
                    >{{ item.desc }}</a-select-option
                  >
                </a-select>
              </j-form-item>
              <j-form-item label="创建日期" :content-nest="false">
                <div class="date-range-container">
                  <a-date-picker
                    v-model:value="searchFormData.startTime"
                    placeholder=""
                    value-format="YYYY-MM-DD 00:00:00"
                  />
                  <span class="date-split">至</span>
                  <a-date-picker
                    v-model:value="searchFormData.endTime"
                    placeholder=""
                    value-format="YYYY-MM-DD 23:59:59"
                  />
                </div>
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
    <detail :id="id" ref="detailDialog" />
  </div>
</template>

<script>
  import { h, defineComponent } from 'vue';
  import Detail from './detail.vue';
  import Moment from 'moment';
  import { SearchOutlined } from '@ant-design/icons-vue';
  import * as api from '@/api/system/op-log';

  export default defineComponent({
    name: 'Oplog',
    components: {
      Detail,
    },
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
        id: '',
        // 查询列表的查询条件
        searchFormData: {
          name: '',
          createBy: '',
          logType: undefined,
          startTime: this.$utils.formatDateTime(
            this.$utils.getDateTimeWithMinTime(Moment().subtract(1, 'w').add(1, 'd')),
          ),
          endTime: this.$utils.formatDateTime(
            this.$utils.getDateTimeWithMaxTime(this.$utils.getCurrentDate()),
          ),
        },
        // 列表数据配置
        tableColumn: [
          { type: 'seq', width: 50 },
          { field: 'name', title: '日志名称', minWidth: 220 },
          {
            field: 'logType',
            title: '日志类型',
            width: 100,
            formatter: ({ cellValue }) => {
              return this.$enums.OP_LOG_TYPE.getDesc(cellValue);
            },
          },
          { field: 'createBy', title: '创建人', width: 100 },
          { field: 'ip', title: 'IP地址', width: 130 },
          { field: 'createTime', title: '创建时间', width: 170 },
          { title: '操作', width: 70, fixed: 'right', slots: { default: 'action_default' } },
        ],
        // 工具栏配置
        toolbarConfig: {
          // 自定义左侧工具栏
          slots: {
            buttons: 'toolbar_buttons',
          },
        },
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
              return api.query(this.buildQueryParams(page));
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
      buildQueryParams(page) {
        return {
          pageIndex: page.currentPage,
          pageSize: page.pageSize,
          ...this.buildSearchFormData(),
        };
      },
      // 查询前构建具体的查询参数
      buildSearchFormData() {
        return {
          ...this.searchFormData,
        };
      },
      createActions(row) {
        return [
          {
            label: '查看',
            onClick: () => {
              this.id = row.id;
              this.$nextTick(() => this.$refs.detailDialog.openDialog());
            },
          },
        ];
      },
    },
  });
</script>
<style scoped></style>
