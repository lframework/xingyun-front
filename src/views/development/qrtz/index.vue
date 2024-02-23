<template>
  <div v-permission="['development:qrtz:manage']">
    <page-wrapper content-full-height fixed-height>
      <!-- 数据列表 -->
      <vxe-grid
        id="Qrtz"
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
              <j-form-item label="名称">
                <a-input v-model:value="searchFormData.name" allow-clear />
              </j-form-item>
              <j-form-item label="组">
                <a-input v-model:value="searchFormData.group" allow-clear />
              </j-form-item>
              <j-form-item label="状态">
                <a-select v-model:value="searchFormData.state" placeholder="全部" allow-clear>
                  <a-select-option
                    v-for="item in $enums.TRIGGER_STATE.values()"
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
            <a-button type="primary" :icon="h(PlusOutlined)" @click="$refs.addDialog.openDialog()"
              >新增</a-button
            >
          </a-space>
        </template>

        <!-- 操作 列自定义内容 -->
        <template #action_default="{ row }">
          <table-action outside :actions="createActions(row)" />
        </template>
      </vxe-grid>
    </page-wrapper>

    <!-- 新增窗口 -->
    <add ref="addDialog" @confirm="search" />

    <!-- 修改窗口 -->
    <modify ref="updateDialog" :ori-name="name" :ori-group="group" @confirm="search" />

    <!-- 查看窗口 -->
    <detail ref="viewDialog" :name="name" :group="group" />
  </div>
</template>

<script>
  import { h, defineComponent } from 'vue';
  import Add from './add.vue';
  import Modify from './modify.vue';
  import Detail from './detail.vue';
  import * as api from '@/api/development/qrtz';
  import { SearchOutlined, PlusOutlined } from '@ant-design/icons-vue';

  export default defineComponent({
    name: 'Qrtz',
    components: {
      Add,
      Modify,
      Detail,
    },
    setup() {
      return {
        h,
        SearchOutlined,
        PlusOutlined,
      };
    },
    data() {
      return {
        loading: false,
        // 当前行数据
        name: '',
        group: '',
        ids: [],
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
          { type: 'checkbox', width: 45 },
          { field: 'name', title: '名称', width: 100 },
          { field: 'group', title: '组', width: 100 },
          { field: 'cron', title: 'Cron表达式', width: 180 },
          { field: 'description', title: '备注', minWidth: 200 },
          {
            field: 'state',
            title: '状态',
            width: 80,
            formatter: ({ cellValue }) => {
              return this.$enums.TRIGGER_STATE.getDesc(cellValue);
            },
          },
          { title: '操作', width: 280, fixed: 'right', slots: { default: 'action_default' } },
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
            query: ({ page, sorts, filters }) => {
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
      deleteRow(row) {
        this.$msg.createConfirm('是否确认删除此定时任务？').then(() => {
          this.loading = true;
          api
            .deleteJob({
              name: row.name,
              group: row.group,
            })
            .then(() => {
              this.$msg.createSuccess('删除成功！');
              this.search();
            })
            .finally(() => {
              this.loading = false;
            });
        });
      },
      resumeRow(row) {
        this.$msg.createConfirm('是否确认恢复此定时任务？').then(() => {
          this.loading = true;
          api
            .resume({
              name: row.name,
              group: row.group,
            })
            .then(() => {
              this.$msg.createSuccess('恢复成功！');
              this.search();
            })
            .finally(() => {
              this.loading = false;
            });
        });
      },
      pauseRow(row) {
        this.$msg.createConfirm('是否确认暂停此定时任务？').then(() => {
          this.loading = true;
          api
            .pause({
              name: row.name,
              group: row.group,
            })
            .then(() => {
              this.$msg.createSuccess('暂停成功！');
              this.search();
            })
            .finally(() => {
              this.loading = false;
            });
        });
      },
      triggerRow(row) {
        this.$msg.createConfirm('是否确认触发此定时任务？').then(() => {
          this.loading = true;
          api
            .trigger({
              name: row.name,
              group: row.group,
            })
            .then(() => {
              this.$msg.createSuccess('触发成功！');
              this.search();
            })
            .finally(() => {
              this.loading = false;
            });
        });
      },
      createActions(row) {
        return [
          {
            label: '查看',
            onClick: () => {
              this.name = row.name;
              this.group = row.group;
              this.$nextTick(() => this.$refs.viewDialog.openDialog());
            },
          },
          {
            label: '修改',
            onClick: () => {
              this.name = row.name;
              this.group = row.group;
              this.$nextTick(() => this.$refs.updateDialog.openDialog());
            },
          },
          {
            label: '暂停',
            color: 'error',
            ifShow: () => {
              return (
                this.$enums.TRIGGER_STATE.WAITING.equalsCode(row.state) ||
                this.$enums.TRIGGER_STATE.ACQUIRED.equalsCode(row.state) ||
                this.$enums.TRIGGER_STATE.ERROR.equalsCode(row.state) ||
                this.$enums.TRIGGER_STATE.COMPLETE.equalsCode(row.state)
              );
            },
            onClick: () => {
              this.pauseRow(row);
            },
          },
          {
            label: '恢复',
            ifShow: () => {
              return this.$enums.TRIGGER_STATE.PAUSED.equalsCode(row.state);
            },
            onClick: () => {
              this.resumeRow(row);
            },
          },
          {
            label: '触发',
            ifShow: () => {
              return (
                this.$enums.TRIGGER_STATE.WAITING.equalsCode(row.state) ||
                this.$enums.TRIGGER_STATE.PAUSED.equalsCode(row.state) ||
                this.$enums.TRIGGER_STATE.COMPLETE.equalsCode(row.state)
              );
            },
            onClick: () => {
              this.triggerRow(row);
            },
          },
          {
            label: '删除',
            color: 'error',
            onClick: () => {
              this.deleteRow(row);
            },
          },
        ];
      },
    },
  });
</script>
<style scoped></style>
