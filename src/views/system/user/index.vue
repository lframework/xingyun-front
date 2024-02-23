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
            <j-form label-width="80px" @collapse="$refs.grid.refreshColumn()">
              <j-form-item label="编号">
                <a-input v-model:value="searchFormData.code" allow-clear />
              </j-form-item>
              <j-form-item label="用户名">
                <a-input v-model:value="searchFormData.username" allow-clear />
              </j-form-item>
              <j-form-item label="姓名">
                <a-input v-model:value="searchFormData.name" allow-clear />
              </j-form-item>
              <j-form-item label="岗位" prop="positionId">
                <sys-position-selector v-model:value="searchFormData.positionId" />
              </j-form-item>
              <j-form-item label="状态">
                <a-select v-model:value="searchFormData.available" placeholder="全部" allow-clear>
                  <a-select-option
                    v-for="item in $enums.AVAILABLE.values()"
                    :key="item.code"
                    :value="item.code"
                    >{{ item.desc }}</a-select-option
                  >
                </a-select>
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
              v-permission="['system:user:permission']"
              :icon="h(SettingOutlined)"
              @click="batchDataPermmission"
              >批量数据权限</a-button
            >
            <a-dropdown v-permission="['system:user:modify']">
              <template #overlay>
                <a-menu @click="handleCommand">
                  <a-menu-item key="batchEnable" :icon="h(CheckOutlined)">批量启用 </a-menu-item>
                  <a-menu-item key="batchUnable" :icon="h(StopOutlined)">批量停用 </a-menu-item>
                </a-menu>
              </template>
              <a-button>更多<DownOutlined /></a-button>
            </a-dropdown>
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
      :biz-type="$enums.SYS_DATA_PERMISSION_DATA_BIZ_TYPE.USER.code"
    />
    <batch-data-permission
      ref="batchDataPermissionDialog"
      :biz-ids="ids"
      :biz-type="$enums.SYS_DATA_PERMISSION_DATA_BIZ_TYPE.USER.code"
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
  import * as api from '@/api/system/user';
  import {
    SearchOutlined,
    PlusOutlined,
    ThunderboltOutlined,
    SettingOutlined,
    DownOutlined,
    CheckOutlined,
    StopOutlined,
  } from '@ant-design/icons-vue';

  export default defineComponent({
    name: 'User',
    components: {
      Add,
      Modify,
      Detail,
      Permission,
      DataPermission,
      BatchDataPermission,
      DownOutlined,
    },
    setup() {
      return {
        h,
        SearchOutlined,
        PlusOutlined,
        ThunderboltOutlined,
        SettingOutlined,
        CheckOutlined,
        StopOutlined,
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
          positionId: '',
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
          { field: 'code', title: '编号', width: 100, sortable: true },
          { field: 'username', title: '用户名', minWidth: 120, sortable: true },
          { field: 'name', title: '姓名', minWidth: 150, sortable: true },
          { field: 'deptName', title: '部门', width: 160 },
          { field: 'roleName', title: '角色', width: 160 },
          { field: 'positionName', title: '岗位', width: 160 },
          { field: 'email', title: '邮箱', width: 120 },
          { field: 'telephone', title: '联系电话', width: 120 },
          {
            field: 'gender',
            title: '性别',
            width: 80,
            formatter: ({ cellValue }) => {
              return this.$enums.GENDER.getDesc(cellValue);
            },
          },
          { field: 'description', title: '备注', minWidth: 200 },
          { field: 'available', title: '状态', width: 80, slots: { default: 'available_default' } },
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
          { title: '操作', width: 290, fixed: 'right', slots: { default: 'action_default' } },
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
      handleCommand({ key }) {
        if (key === 'batchEnable') {
          this.batchEnable();
        } else if (key === 'batchUnable') {
          this.batchUnable();
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
            label: '授权',
            onClick: () => {
              this.setting(row);
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
      // 批量停用
      batchUnable() {
        const records = this.$refs.grid.getCheckboxRecords();

        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择要停用的用户！');
          return;
        }

        this.$msg.createConfirm('是否确定停用选择的用户？').then(() => {
          this.loading = true;
          const ids = records.map((t) => t.id);
          api
            .batchUnable(ids)
            .then((data) => {
              this.$msg.createSuccess('停用成功！');
              this.search();
            })
            .finally(() => {
              this.loading = false;
            });
        });
      },
      // 批量启用
      batchEnable() {
        const records = this.$refs.grid.getCheckboxRecords();

        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择要启用的用户！');
          return;
        }

        this.$msg.createConfirm('是否确定启用选择的用户？').then(() => {
          this.loading = true;
          const ids = records.map((t) => t.id);
          api
            .batchEnable(ids)
            .then((data) => {
              this.$msg.createSuccess('启用成功！');
              this.search();
            })
            .finally(() => {
              this.loading = false;
            });
        });
      },
      // 授权
      setting(row) {
        this.ids = [row.id];
        this.$refs.permissionDialog.openDialog();
      },
      // 批量授权
      batchSetting() {
        const records = this.$refs.grid.getCheckboxRecords();

        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择要授权的用户！');
          return;
        }

        this.ids = records.map((item) => item.id);
        this.$refs.permissionDialog.openDialog();
      },
      unlock(row) {
        this.$msg.createConfirm('是否确定解锁该用户？').then(() => {
          this.loading = true;
          api
            .unlock(row.id)
            .then(() => {
              this.$msg.createSuccess('解锁成功！');
              this.search();
            })
            .finally(() => {
              this.loading = false;
            });
        });
      },
      batchDataPermmission() {
        const records = this.$refs.grid.getCheckboxRecords();

        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择要设置数据权限的用户！');
          return;
        }

        this.ids = records.map((item) => item.id);
        this.$nextTick(() => this.$refs.batchDataPermissionDialog.openDialog());
      },
    },
  });
</script>
<style scoped></style>
