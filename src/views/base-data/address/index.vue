<template>
  <div v-permission="['base-data:address:query']">
    <page-wrapper content-full-height fixed-height>
      <!-- 数据列表 -->
      <vxe-grid
        id="Address"
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
              <j-form-item label="实体类型">
                <a-select v-model:value="searchFormData.entityType" allow-clear>
                  <a-select-option
                    v-for="item in $enums.ADDRESS_ENTITY_TYPE.values()"
                    :key="item.code"
                    :value="item.code"
                    >{{ item.desc }}</a-select-option
                  >
                </a-select>
              </j-form-item>
              <j-form-item label="地址类型">
                <a-select v-model:value="searchFormData.addressType" allow-clear>
                  <a-select-option
                    v-for="item in $enums.ADDRESS_TYPE.values()"
                    :key="item.code"
                    :value="item.code"
                    >{{ item.desc }}</a-select-option
                  >
                </a-select>
              </j-form-item>
              <j-form-item label="姓名">
                <a-input v-model:value="searchFormData.name" allow-clear />
              </j-form-item>
              <j-form-item label="手机号">
                <a-input v-model:value="searchFormData.telephone" allow-clear />
              </j-form-item>
              <j-form-item label="详细地址">
                <a-input v-model:value="searchFormData.address" allow-clear />
              </j-form-item>
              <j-form-item label="默认地址">
                <a-select v-model:value="searchFormData.isDefault" placeholder="全部" allow-clear>
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
              v-permission="['base-data:address:add']"
              type="primary"
              :icon="h(PlusOutlined)"
              @click="$refs.addDialog.openDialog()"
              >新增</a-button
            >
            <a-button
              v-permission="['base-data:address:import']"
              :icon="h(CloudUploadOutlined)"
              @click="$refs.importer.openDialog()"
              >导入Excel</a-button
            >
            <a-button
              v-permission="['base-data:address:export']"
              :icon="h(DownloadOutlined)"
              @click="exportList"
              >导出</a-button
            >
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

    <address-importer ref="importer" @confirm="search" />
  </div>
</template>

<script>
  import { h, defineComponent } from 'vue';

  import Add from './add.vue';
  import Modify from './modify.vue';
  import Detail from './detail.vue';
  import * as api from '@/api/base-data/address';
  import {
    CloudUploadOutlined,
    DownloadOutlined,
    PlusOutlined,
    SearchOutlined,
  } from '@ant-design/icons-vue';

  export default defineComponent({
    name: 'Address',
    components: {
      Add,
      Modify,
      Detail,
    },
    setup() {
      return {
        h,
        CloudUploadOutlined,
        DownloadOutlined,
        PlusOutlined,
        SearchOutlined,
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
          available: this.$enums.AVAILABLE.ENABLE.code,
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
          {
            field: 'entityType',
            title: '实体类型',
            width: 100,
            formatter: ({ cellValue }) => {
              return this.$enums.ADDRESS_ENTITY_TYPE.getDesc(cellValue);
            },
          },
          { field: 'entityName', title: '实体名称', width: 120 },
          {
            field: 'addressType',
            title: '地址类型',
            width: 100,
            formatter: ({ cellValue }) => {
              return this.$enums.ADDRESS_TYPE.getDesc(cellValue);
            },
          },
          { field: 'name', title: '姓名', width: 100 },
          { field: 'telephone', title: '手机号', width: 160 },
          {
            field: 'areaName',
            title: '地区',
            width: 200,
            formatter: ({ cellValue, row }) => {
              return row.provinceName + ' / ' + row.cityName + ' / ' + row.districtName;
            },
          },
          { field: 'address', title: '详细地址', minWidth: 240 },
          {
            field: 'isDefault',
            title: '默认地址',
            width: 120,
            formatter: ({ cellValue }) => {
              return cellValue ? '是' : '否';
            },
          },
          { field: 'createBy', title: '创建人', width: 100 },
          { field: 'createTime', title: '创建时间', width: 170, sortable: true },
          { title: '操作', width: 120, fixed: 'right', slots: { default: 'action_default' } },
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
      exportList() {
        this.loading = true;
        api
          .exportList(this.buildQueryParams({}))
          .then(() => {
            this.$msg.createSuccessTip('导出成功！');
          })
          .finally(() => {
            this.loading = false;
          });
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
            permission: ['base-data:address:modify'],
            label: '修改',
            onClick: () => {
              this.id = row.id;
              this.$nextTick(() => this.$refs.updateDialog.openDialog());
            },
          },
        ];
      },
    },
  });
</script>
<style scoped></style>
