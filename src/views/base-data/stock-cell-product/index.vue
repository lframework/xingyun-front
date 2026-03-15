<template>
  <div>
    <div v-permission="['base-data:stock-cell:query']" v-loading="loading">
      <page-wrapper content-full-height fixed-height>
        <!-- 数据列表 -->
        <vxe-grid
          id="StockCellProduct"
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
                <j-form-item label="仓库编号">
                  <a-input v-model:value="searchFormData.scCode" allow-clear />
                </j-form-item>
                <j-form-item label="仓库名称">
                  <a-input v-model:value="searchFormData.scName" allow-clear />
                </j-form-item>
                <j-form-item label="仓位编号">
                  <a-input v-model:value="searchFormData.code" allow-clear />
                </j-form-item>
                <j-form-item label="仓位名称">
                  <a-input v-model:value="searchFormData.name" allow-clear />
                </j-form-item>
                <j-form-item label="仓位类别">
                  <a-select v-model:value="searchFormData.cellType" placeholder="全部" allow-clear>
                    <a-select-option
                      v-for="item in STOCK_CELL_TYPE.values()"
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
                v-permission="['base-data:stock-cell-product:modify']"
                type="primary"
                :icon="h(MenuOutlined)"
                @click="$refs.allProductDialog.openDialog()"
                >管理所有商品</a-button
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
      <all-product ref="allProductDialog" />

      <!-- 商品管理窗口 -->
      <product-manage :stock-cell-id="id" ref="productManageDialog" />

      <!-- 批量操作 -->
      <batch-handler
        ref="batchDeleteHandlerDialog"
        :table-column="[
          { field: 'code', title: '编号', width: 100, sortable: true },
          { field: 'name', title: '名称', minWidth: 180, sortable: true },
          {
            field: 'cellType',
            title: '仓位类别',
            minWidth: 100,
            formatter: ({ cellValue }) => {
              return STOCK_CELL_TYPE.getDesc(cellValue);
            },
          },
        ]"
        title="批量删除"
        :tableData="batchHandleDatas"
        :handle-fn="doBatchDelete"
        @confirm="search"
      />
    </div>
  </div>
</template>
<script>
  import { defineComponent, h } from 'vue';
  import * as api from '@/api/base-data/stock-cell';
  import { buildSortPageVo } from '@/utils/utils';
  import { STOCK_CELL_TYPE } from '@/enums/biz/stockCellType';
  import {
    SearchOutlined,
    MenuOutlined,
    ThunderboltOutlined,
    SettingOutlined,
    CheckOutlined,
    DownOutlined,
    DeleteOutlined,
    CloudUploadOutlined,
  } from '@ant-design/icons-vue';
  import Add from './add.vue';
  import Modify from './modify.vue';
  import BatchHandler from '@/components/BatchHandler';
  import ProductManage from './product-manage/index.vue';
  import AllProduct from './product-manage/all.vue'

  export default defineComponent({
    components: {
      BatchHandler,
      DownOutlined,
      Add,
      Modify,
      ProductManage,
      AllProduct,
    },
    setup() {
      return {
        h,
        SearchOutlined,
        MenuOutlined,
        ThunderboltOutlined,
        SettingOutlined,
        CheckOutlined,
        DeleteOutlined,
        CloudUploadOutlined,
        STOCK_CELL_TYPE,
      };
    },
    data() {
      return {
        // 是否可见
        visible: false,
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
          { field: 'scCode', title: '仓库编号', width: 100, sortable: true },
          { field: 'scName', title: '仓库名称', minWidth: 180, sortable: true },
          { field: 'code', title: '仓位编号', width: 100, sortable: true },
          { field: 'name', title: '仓位名称', minWidth: 180, sortable: true },
          {
            field: 'cellType',
            title: '仓位类别',
            minWidth: 100,
            formatter: ({ cellValue }) => {
              return STOCK_CELL_TYPE.getDesc(cellValue);
            },
          },
          { field: 'description', title: '备注', minWidth: 200 },
          { title: '操作', width: 85, fixed: 'right', slots: { default: 'action_default' } },
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
        batchHandleDatas: [],
      };
    },
    computed: {},
    created() {
      // 初始化表单数据
      this.initFormData();
    },
    methods: {
      openDialog() {
        this.visible = true;

        this.$nextTick(() => this.open());
      },
      // 关闭对话框
      closeDialog() {
        this.visible = false;
        this.$emit('close');
      },
      // 页面显示时触发
      open() {
        // 初始化表单数据
        this.initFormData();
      },
      initFormData() {
        this.formData = {
          id: '',
          code: '',
          name: '',
          cellType: '',
          description: '',
        };
      },
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
            permission: ['base-data:stock-cell-product:modify'],
            label: '商品管理',
            onClick: () => {
              this.id = row.id;
              this.$nextTick(() => this.$refs.productManageDialog.openDialog());
            },
          },
        ];
      },
    },
  });
</script>
