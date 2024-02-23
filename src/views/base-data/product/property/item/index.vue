<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="80%"
    :style="{ top: '20px' }"
    title="属性值管理"
    :footer="null"
  >
    <div v-if="visible" v-permission="['base-data:product:property-item:query']">
      <!-- 数据列表 -->
      <vxe-grid
        ref="grid"
        resizable
        show-overflow
        highlight-hover-row
        keep-source
        row-id="id"
        :proxy-config="proxyConfig"
        :columns="tableColumn"
        :toolbar-config="toolbarConfig"
        :pager-config="{}"
        :loading="loading"
      >
        <template #form>
          <j-border>
            <j-form label-width="80px" @collapse="$refs.grid.refreshColumn()">
              <j-form-item label="编号">
                <a-input v-model:value="searchFormData.code" allow-clear />
              </j-form-item>
              <j-form-item label="名称">
                <a-input v-model:value="searchFormData.name" allow-clear />
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
            </j-form>
          </j-border>
        </template>
        <!-- 工具栏 -->
        <template #toolbar_buttons>
          <a-space>
            <a-button type="primary" :icon="h(SearchOutlined)" @click="search">查询</a-button>
            <a-button
              v-permission="['base-data:product:property-item:add']"
              type="primary"
              :icon="h(PlusOutlined)"
              @click="$refs.addDialog.openDialog()"
              >新增</a-button
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

      <!-- 新增窗口 -->
      <add ref="addDialog" :property-id="propertyId" @confirm="search" />

      <!-- 修改窗口 -->
      <modify ref="updateDialog" :group-id="propertyId" :item-id="id" @confirm="search" />
    </div>
  </a-modal>
</template>
<script>
  import { h, defineComponent } from 'vue';
  import Add from './add.vue';
  import Modify from './modify.vue';
  import * as api from '@/api/base-data/product/property-item';
  import { PlusOutlined, SearchOutlined } from '@ant-design/icons-vue';

  export default defineComponent({
    components: {
      Modify,
      Add,
    },
    props: {
      propertyId: {
        type: String,
        required: true,
      },
    },
    setup() {
      return {
        h,
        PlusOutlined,
        SearchOutlined,
      };
    },
    data() {
      return {
        // 是否可见
        visible: false,
        // 是否显示加载框
        loading: false,
        id: '',
        // 查询列表的查询条件
        searchFormData: {
          code: '',
          name: '',
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
          { type: 'checkbox', width: 45 },
          { field: 'code', title: '编号', width: 120 },
          { field: 'name', title: '名称', minWidth: 160 },
          { field: 'available', title: '状态', width: 80, slots: { default: 'available_default' } },
          { field: 'description', title: '备注', minWidth: 160 },
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
    computed: {},
    created() {},
    methods: {
      // 打开对话框 由父页面触发
      openDialog() {
        this.visible = true;

        this.$nextTick(() => this.open());
      },
      // 关闭对话框
      closeDialog() {
        this.visible = false;
        this.$emit('close');
      },
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
        return { propertyId: this.propertyId, ...this.searchFormData };
      },
      // 页面显示时触发
      open() {},
      createActions(row) {
        return [
          {
            permission: ['base-data:product:property-item:modify'],
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
