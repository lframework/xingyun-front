<template>
  <div v-permission="['system:role:query']">
    <a-row>
      <a-col :span="4">
        <page-wrapper content-full-height fixed-height content-class="!mr-0">
          <category-tree style="height: 100%" @change="(e) => doSearch(e)" />
        </page-wrapper>
      </a-col>
      <a-col :span="20">
        <page-wrapper content-full-height fixed-height>
          <!-- 数据列表 -->
          <vxe-grid
            id="Role"
            ref="grid"
            resizable
            show-overflow
            highlight-hover-row
            keep-source
            row-id="id"
            :custom-config="{}"
            :proxy-config="proxyConfig"
            :columns="tableColumn"
            :toolbar-config="toolbarConfig"
            :pager-config="{}"
            :loading="loading"
            height="auto"
          >
            <template #form>
              <j-border>
                <j-form bordered label-width="80px" @collapse="$refs.grid.refreshColumn()">
                  <j-form-item label="编号">
                    <a-input v-model:value="searchFormData.code" allow-clear />
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
                <a-button
                  v-permission="['system:role:add']"
                  type="primary"
                  :icon="h(PlusOutlined)"
                  @click="$refs.addDialog.openDialog()"
                  >新增</a-button
                >
                <a-button
                  v-permission="['system:role:permission']"
                  :icon="h(ThunderboltOutlined)"
                  @click="batchSetting"
                  >批量授权</a-button
                >
                <a-button
                  v-permission="['system:role:permission']"
                  :icon="h(SettingOutlined)"
                  @click="batchDataPermmission"
                  >批量数据权限</a-button
                >
                <a-dropdown>
                  <template #overlay>
                    <a-menu @click="handleCommand">
                      <a-menu-item key="batchDelete" :icon="h(DeleteOutlined)"
                        >批量删除
                      </a-menu-item>
                    </a-menu>
                  </template>
                  <a-button v-permission="['system:role:delete']">更多<DownOutlined /></a-button>
                </a-dropdown>
              </a-space>
            </template>

            <!-- 操作 列自定义内容 -->
            <template #action_default="{ row }">
              <table-action outside :actions="createActions(row)" />
            </template>
          </vxe-grid>

          <!-- 新增窗口 -->
          <add ref="addDialog" @confirm="search" />

          <!-- 修改窗口 -->
          <modify :id="id" ref="updateDialog" @confirm="search" />

          <!-- 查看窗口 -->
          <detail :id="id" ref="viewDialog" />

          <!-- 授权窗口 -->
          <permission ref="permissionDialog" :ids="ids" @confirm="search" />

          <!-- 数据权限窗口 -->
          <data-permission
            ref="dataPermissionDialog"
            :biz-id="id"
            :biz-type="SYS_DATA_PERMISSION_DATA_BIZ_TYPE.ROLE.code"
          />
          <batch-data-permission
            ref="batchDataPermissionDialog"
            :biz-ids="ids"
            :biz-type="SYS_DATA_PERMISSION_DATA_BIZ_TYPE.ROLE.code"
          />
        </page-wrapper>
      </a-col>
    </a-row>

    <!-- 批量操作 -->
    <batch-handler
      ref="batchDeleteHandlerDialog"
      :table-column="[
        { field: 'code', title: '编号', width: 100 },
        { field: 'name', title: '名称', minWidth: 180 },
      ]"
      title="批量删除"
      :tableData="batchHandleDatas"
      :handle-fn="doBatchDelete"
      @confirm="search"
    />
  </div>
</template>

<script>
  import { h, defineComponent } from 'vue';
  import Add from './add.vue';
  import Modify from './modify.vue';
  import Detail from './detail.vue';
  import Permission from './permission.vue';
  import DataPermission from '@/components/DataPermission/index.vue';
  import BatchDataPermission from '@/components/DataPermission/batch.vue';
  import {
    SearchOutlined,
    PlusOutlined,
    ThunderboltOutlined,
    SettingOutlined,
    DeleteOutlined,
    StopOutlined,
    DownOutlined,
  } from '@ant-design/icons-vue';
  import * as api from '@/api/system/role';
  import CategoryTree from './category-tree.vue';
  import { isEmpty, isEqualWithStr, buildSortPageVo } from '@/utils/utils';
  import { createError } from '@/hooks/web/msg';
  import { AVAILABLE } from '@/enums/biz/available';
  import { SYS_DATA_PERMISSION_DATA_BIZ_TYPE } from '@/enums/biz/sysDataPermissionDataBizType';
  import BatchHandler from '@/components/BatchHandler';

  export default defineComponent({
    name: 'Role',
    components: {
      CategoryTree,
      Add,
      Modify,
      Detail,
      Permission,
      DataPermission,
      BatchDataPermission,
      DownOutlined,
      BatchHandler,
    },
    setup() {
      return {
        h,
        SearchOutlined,
        PlusOutlined,
        ThunderboltOutlined,
        SettingOutlined,
        DeleteOutlined,
        StopOutlined,
        isEmpty,
        isEqualWithStr,
        AVAILABLE,
        SYS_DATA_PERMISSION_DATA_BIZ_TYPE,
      };
    },
    data() {
      return {
        loading: false,
        // 当前行数据
        id: '',
        ids: [],
        // 查询列表的查询条件
        searchFormData: {
          available: true,
          categoryId: '',
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
          { field: 'code', title: '编号', width: 100, sortable: true },
          { field: 'name', title: '名称', minWidth: 180, sortable: true },
          { field: 'permission', title: '权限', width: 120 },
          { field: 'description', title: '备注', minWidth: 200 },
          { field: 'createBy', title: '创建人', width: 100 },
          { field: 'createTime', title: '创建时间', width: 170, sortable: true },
          { field: 'updateBy', title: '修改人', width: 100 },
          { field: 'updateTime', title: '修改时间', width: 170, sortable: true },
          { title: '操作', width: 240, fixed: 'right', slots: { default: 'action_default' } },
        ],
        // 请求接口配置
        proxyConfig: {
          response: {
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
      buildQueryParams(page, sorts) {
        return {
          ...buildSortPageVo(page, sorts),
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
          {
            permission: ['system:role:modify'],
            label: '修改',
            ifShow: () => {
              return row.permission !== 'admin';
            },
            onClick: () => {
              this.id = row.id;
              this.$nextTick(() => this.$refs.updateDialog.openDialog());
            },
          },
          {
            permission: ['system:role:permission'],
            label: '授权',
            ifShow: () => {
              return row.permission !== 'admin';
            },
            onClick: () => {
              this.setting(row);
            },
          },
          {
            permission: ['system:role:permission'],
            label: '数据权限',
            ifShow: () => {
              return row.permission !== 'admin';
            },
            onClick: () => {
              this.id = row.id;
              this.$nextTick(() => this.$refs.dataPermissionDialog.openDialog());
            },
          },
        ];
      },
      handleCommand({ key }) {
        if (key === 'batchDelete') {
          this.batchDelete();
        }
      },
      doBatchDelete(row) {
        return api.deleteById(row.id);
      },
      // 批量停用
      batchDelete() {
        const records = this.$refs.grid.getCheckboxRecords();

        if (isEmpty(records)) {
          createError('请选择要删除的角色！');
          return;
        }

        this.batchHandleDatas = records;

        this.$refs.batchDeleteHandlerDialog.openDialog();
      },
      // 授权
      setting(row) {
        this.ids = [row.id];
        this.$nextTick(() => this.$refs.permissionDialog.openDialog());
      },
      // 批量授权
      batchSetting() {
        const records = this.$refs.grid.getCheckboxRecords();

        if (isEmpty(records)) {
          createError('请选择要授权的角色！');
          return;
        }

        this.ids = records.map((item) => item.id);
        this.$nextTick(() => this.$refs.permissionDialog.openDialog());
      },
      batchDataPermmission() {
        const records = this.$refs.grid.getCheckboxRecords();

        if (isEmpty(records)) {
          createError('请选择要设置数据权限的角色！');
          return;
        }

        this.ids = records.map((item) => item.id);
        this.$nextTick(() => this.$refs.batchDataPermissionDialog.openDialog());
      },
      doSearch(categoryId) {
        if (!isEmpty(categoryId)) {
          if (isEqualWithStr(0, categoryId)) {
            this.searchFormData.categoryId = '';
          } else {
            this.searchFormData.categoryId = categoryId;
          }
        } else {
          this.searchFormData.categoryId = '';
        }

        this.search();
      },
    },
  });
</script>
<style scoped></style>
