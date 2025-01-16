<template>
  <div>
    <div v-permission="['system:mail-message:manage']">
      <page-wrapper content-full-height fixed-height>
        <!-- 数据列表 -->
        <vxe-grid
          id="MailMessage"
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
              <j-form label-width="100px" @collapse="$refs.grid.refreshColumn()">
                <j-form-item label="标题">
                  <a-input v-model:value="searchFormData.title" allow-clear />
                </j-form-item>
                <j-form-item label="创建时间" :content-nest="false">
                  <div class="date-range-container">
                    <a-date-picker
                      v-model:value="searchFormData.createTimeStart"
                      placeholder=""
                      value-format="YYYY-MM-DD 00:00:00"
                    />
                    <span class="date-split">至</span>
                    <a-date-picker
                      v-model:value="searchFormData.createTimeEnd"
                      placeholder=""
                      value-format="YYYY-MM-DD 23:59:59"
                    />
                  </div>
                </j-form-item>
                <j-form-item label="接收邮箱">
                  <a-input v-model:value="searchFormData.mail" allow-clear />
                </j-form-item>
                <j-form-item label="发送状态">
                  <a-select
                    v-model:value="searchFormData.sendStatus"
                    placeholder="全部"
                    allow-clear
                  >
                    <a-select-option
                      v-for="item in $enums.SYS_MAIL_MESSAGE_SEND_STATUS.values()"
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

          <!-- 操作 列自定义内容 -->
          <template #action_default="{ row }">
            <table-action outside :actions="createActions(row)" />
          </template>
        </vxe-grid>
      </page-wrapper>
    </div>
    <!-- 查看窗口 -->
    <detail :id="id" ref="viewDialog" :req="api.get" />
  </div>
</template>

<script>
  import { defineComponent, h } from 'vue';
  import Detail from './detail.vue';
  import * as api from '@/api/system/mail-message';
  import { SearchOutlined } from '@ant-design/icons-vue';
  import moment from 'moment/moment';

  export default defineComponent({
    name: 'MailMessage',
    components: {
      Detail,
    },
    setup() {
      return {
        h,
        SearchOutlined,
        api,
      };
    },
    data() {
      return {
        loading: false,
        // 当前行数据
        id: '',
        // 查询列表的查询条件
        searchFormData: {
          title: '',
          createTimeStart: this.$utils.formatDateTime(
            this.$utils.getDateTimeWithMinTime(moment().subtract(1, 'M')),
          ),
          createTimeEnd: this.$utils.formatDateTime(this.$utils.getDateTimeWithMaxTime(moment())),
          mail: '',
          sendStatus: undefined,
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
          { type: 'seq', width: 50 },
          { field: 'title', title: '标题', minWidth: 160 },
          { field: 'mail', title: '接收邮箱', width: 100 },
          { field: 'createBy', title: '创建人', width: 100 },
          { field: 'createTime', title: '创建时间', width: 170 },
          {
            field: 'sendStatus',
            title: '发送状态',
            width: 80,
            formatter: ({ cellValue }) => {
              return this.$enums.SYS_MAIL_MESSAGE_SEND_STATUS.getDesc(cellValue);
            },
          },
          { title: '操作', width: 70, fixed: 'right', slots: { default: 'action_default' } },
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
              this.$nextTick(() => this.$refs.viewDialog.openDialog());
            },
          },
        ];
      },
    },
  });
</script>
<style scoped></style>
