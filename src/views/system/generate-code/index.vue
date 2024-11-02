<template>
  <div>
    <div v-permission="['system:parameter:manage']">
      <page-wrapper content-full-height fixed-height>
        <!-- 数据列表 -->
        <vxe-grid
          id="SysGenerateCode"
          ref="grid"
          resizable
          show-overflow
          highlight-hover-row
          keep-source
          row-id="id"
          :proxy-config="proxyConfig"
          :columns="tableColumn"
          :custom-config="{}"
          :toolbar-config="toolbarConfig"
          :pager-config="{}"
          :loading="loading"
          height="auto"
        >
          <template #form>
            <j-border>
              <j-form label-width="80px" @collapse="$refs.grid.refreshColumn()">
                <j-form-item label="规则ID">
                  <a-input v-model:value="searchFormData.id" allow-clear />
                </j-form-item>
                <j-form-item label="名称">
                  <a-input v-model:value="searchFormData.name" allow-clear />
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
    </div>
    <!-- 新增窗口 -->
    <add ref="addDialog" @confirm="search" />

    <!-- 修改窗口 -->
    <modify :id="id" ref="updateDialog" @confirm="search" />

    <!-- 查看窗口 -->
    <setting :id="id" ref="settingDialog" />
  </div>
</template>

<script>
  import { h, defineComponent } from 'vue';
  import Add from './add.vue';
  import Modify from './modify.vue';
  import Setting from './setting.vue';
  import * as api from '@/api/system/generate-code';
  import { SearchOutlined, PlusOutlined } from '@ant-design/icons-vue';

  export default defineComponent({
    name: 'SysGenerateCode',
    components: {
      Add,
      Modify,
      Setting,
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
        id: '',
        // 查询列表的查询条件
        searchFormData: {
          id: '',
          name: '',
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
          { field: 'id', title: '规则ID', width: 100, sortable: true },
          { field: 'name', title: '名称', minWidth: 120, sortable: true },
          { title: '操作', width: 160, fixed: 'right', slots: { default: 'action_default' } },
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
              return api.query(this.buildQueryParams(page, sorts));
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
      deleteRow(id) {
        this.$msg
          .createConfirm('是否确定删除该规则？注：请确定没有使用该规则，否则删除后会导致异常')
          .then(() => {
            this.loading = true;
            api
              .deleteById(id)
              .then(() => {
                this.$msg.createSuccess('删除成功！');
                this.search();
              })
              .finally(() => {
                this.loading = false;
              });
          });
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
      createActions(row) {
        return [
          {
            label: '修改',
            onClick: () => {
              this.id = row.id;
              this.$nextTick(() => this.$refs.updateDialog.openDialog());
            },
          },
          {
            label: '设置',
            onClick: () => {
              this.id = row.id;
              this.$nextTick(() => this.$refs.settingDialog.openDialog());
            },
          },
          {
            danger: true,
            label: '删除',
            onClick: () => {
              this.deleteRow(row.id);
            },
          },
        ];
      },
    },
  });
</script>
<style scoped></style>
