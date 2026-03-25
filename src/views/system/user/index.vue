<template>
  <div v-permission="['system:user:query']">
    <page-wrapper content-full-height fixed-height>
      <!-- 数据列表 -->
      <vxe-grid
        id="User"
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
              <j-form-item label="编号">
                <a-input v-model:value="searchFormData.code" allow-clear />
              </j-form-item>
              <j-form-item label="用户名">
                <a-input v-model:value="searchFormData.username" allow-clear />
              </j-form-item>
              <j-form-item label="姓名">
                <a-input v-model:value="searchFormData.name" allow-clear />
              </j-form-item>
              <j-form-item label="部门">
                <sys-dept-selector v-model:value="searchFormData.deptId" :only-final="false" />
              </j-form-item>
              <j-form-item label="角色">
                <sys-role-selector v-model:value="searchFormData.roleId" />
              </j-form-item>
              <j-form-item label="是否锁定">
                <a-select v-model:value="searchFormData.lockStatus" placeholder="全部" allow-clear>
                  <a-select-option :value="true">是</a-select-option>
                  <a-select-option :value="false">否</a-select-option>
                </a-select>
              </j-form-item>
            </j-form>
          </j-border>
        </template>
        <!-- 工具栏 -->
        <template #toolbar_buttons>
          <a-space>
            <a-button type="primary" :icon="h(SearchOutlined)" @click="search">查询</a-button>
            <a-button
              v-permission="['system:user:add']"
              type="primary"
              :icon="h(PlusOutlined)"
              @click="$refs.addDialog.openDialog()"
              >新增</a-button
            >
            <a-button
              v-permission="['system:user:permission']"
              :icon="h(ThunderboltOutlined)"
              @click="batchSetting"
              >批量授权</a-button
            >
            <a-button
              v-permission="['system:user:modify']"
              :icon="h(EditOutlined)"
              @click="batchModifyDept"
              >修改部门</a-button
            >
            <a-button
              v-permission="['system:user:permission']"
              :icon="h(SettingOutlined)"
              @click="batchDataPermission"
              >批量数据权限</a-button
            >
            <a-dropdown>
              <template #overlay>
                <a-menu @click="handleCommand">
                  <a-menu-item key="batchDelete" :icon="h(DeleteOutlined)">批量删除 </a-menu-item>
                </a-menu>
              </template>
              <a-button v-permission="['system:user:delete']">更多<DownOutlined /></a-button>
            </a-dropdown>
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
    <modify :id="id" ref="updateDialog" @confirm="search" />

    <!-- 查看窗口 -->
    <detail :id="id" ref="viewDialog" />

    <!-- 授权窗口 -->
    <permission ref="permissionDialog" :ids="ids" @confirm="search" />

    <!-- 数据权限窗口 -->
    <data-permission
      ref="dataPermissionDialog"
      :biz-id="id"
      :biz-type="SYS_DATA_PERMISSION_DATA_BIZ_TYPE.USER.code"
    />
    <batch-data-permission
      ref="batchDataPermissionDialog"
      :biz-ids="ids"
      :biz-type="SYS_DATA_PERMISSION_DATA_BIZ_TYPE.USER.code"
    />

    <!-- 批量操作 -->
    <batch-handler
      ref="batchDeleteHandlerDialog"
      :table-column="[
        { field: 'code', title: '编号', width: 100 },
        { field: 'username', title: '用户名', minWidth: 120 },
      ]"
      title="批量删除"
      :tableData="batchHandleDatas"
      :handle-fn="doBatchDelete"
      @confirm="search"
    />

    <modify-dept :ids="ids" ref="modifyDeptDialog" @confirm="search" />
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
  import * as api from '@/api/system/user';
  import { createError, createSuccess, createConfirm } from '@/hooks/web/msg';
  import {
    SearchOutlined,
    PlusOutlined,
    ThunderboltOutlined,
    SettingOutlined,
    DownOutlined,
    CheckOutlined,
    DeleteOutlined,
    EditOutlined,
  } from '@ant-design/icons-vue';
  import { isEmpty, buildSortPageVo } from '@/utils/utils';
  import { SYS_DATA_PERMISSION_DATA_BIZ_TYPE } from '@/enums/biz/sysDataPermissionDataBizType';
  import { GENDER } from '@/enums/biz/gender';
  import BatchHandler from '@/components/BatchHandler';
  import SysDeptSelector from '@/components/Selector/SysDeptSelector.vue';
  import SysRoleSelector from '@/components/Selector/SysRoleSelector.vue';
  import ModifyDept from '@/views/system/user/modify-dept.vue';

  export default defineComponent({
    name: 'User',
    components: {
      SysDeptSelector,
      SysRoleSelector,
      Add,
      Modify,
      Detail,
      Permission,
      DataPermission,
      BatchDataPermission,
      DownOutlined,
      BatchHandler,
      ModifyDept,
    },
    setup() {
      return {
        h,
        SearchOutlined,
        PlusOutlined,
        ThunderboltOutlined,
        SettingOutlined,
        CheckOutlined,
        DeleteOutlined,
        EditOutlined,
        isEmpty,
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
          { field: 'code', title: '编号', width: 100, sortable: true },
          { field: 'username', title: '用户名', minWidth: 120, sortable: true },
          { field: 'name', title: '姓名', minWidth: 150, sortable: true },
          { field: 'deptName', title: '部门', width: 160 },
          { field: 'roleName', title: '角色', width: 160 },
          { field: 'email', title: '邮箱', width: 120 },
          { field: 'telephone', title: '联系电话', width: 120 },
          {
            field: 'gender',
            title: '性别',
            width: 80,
            formatter: ({ cellValue }) => {
              return GENDER.getDesc(cellValue);
            },
          },
          { field: 'description', title: '备注', minWidth: 200 },
          {
            field: 'lockStatus',
            title: '是否锁定',
            width: 80,
            formatter: ({ cellValue }) => {
              return cellValue ? '是' : '否';
            },
          },
          { field: 'createBy', title: '创建人', width: 100 },
          { field: 'createTime', title: '创建时间', width: 170, sortable: true },
          { field: 'updateBy', title: '修改人', width: 100 },
          { field: 'updateTime', title: '修改时间', width: 170, sortable: true },
          { title: '操作', width: 220, fixed: 'right', slots: { default: 'action_default' } },
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
      handleCommand({ key }) {
        if (key === 'batchDelete') {
          this.batchDelete();
        }
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
            permission: ['system:user:modify'],
            label: '修改',
            onClick: () => {
              this.id = row.id;
              this.$nextTick(() => this.$refs.updateDialog.openDialog());
            },
          },
          {
            permission: ['system:user:modify'],
            ifShow: row.lockStatus,
            label: '解锁',
            onClick: () => {
              this.unlock(row);
            },
          },
          {
            permission: ['system:user:permission'],
            label: '数据权限',
            onClick: () => {
              this.id = row.id;
              this.$nextTick(() => this.$refs.dataPermissionDialog.openDialog());
            },
          },
        ];
      },
      doBatchDelete(row) {
        return api.deleteById(row.id);
      },
      // 批量停用
      batchDelete() {
        const records = this.$refs.grid.getCheckboxRecords();

        if (isEmpty(records)) {
          createError('请选择要删除的用户！');
          return;
        }

        this.batchHandleDatas = records;

        this.$refs.batchDeleteHandlerDialog.openDialog();
      },
      batchModifyDept() {
        const records = this.$refs.grid.getCheckboxRecords();

        if (isEmpty(records)) {
          createError('请选择要修改部门的用户！');
          return;
        }

        this.ids = records.map((item) => item.id);

        this.$refs.modifyDeptDialog.openDialog();
      },
      // 批量授权
      batchSetting() {
        const records = this.$refs.grid.getCheckboxRecords();

        if (isEmpty(records)) {
          createError('请选择要授权的用户！');
          return;
        }

        this.ids = records.map((item) => item.id);
        this.$refs.permissionDialog.openDialog();
      },
      unlock(row) {
        createConfirm('是否确定解锁该用户？').then(() => {
          this.loading = true;
          api
            .unlock(row.id)
            .then(() => {
              createSuccess('解锁成功！');
              this.search();
            })
            .finally(() => {
              this.loading = false;
            });
        });
      },
      batchDataPermission() {
        const records = this.$refs.grid.getCheckboxRecords();

        if (isEmpty(records)) {
          createError('请选择要设置数据权限的用户！');
          return;
        }

        this.ids = records.map((item) => item.id);
        this.$nextTick(() => this.$refs.batchDataPermissionDialog.openDialog());
      },
    },
  });
</script>
<style scoped></style>
