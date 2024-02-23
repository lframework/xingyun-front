<template>
  <div>
    <div v-show="visible" v-permission="['base-data:product:info:query']">
      <page-wrapper content-full-height fixed-height>
        <!-- 数据列表 -->
        <vxe-grid
          id="ProductInfo"
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
              <j-form @collapse="$refs.grid.refreshColumn()">
                <j-form-item label="编号">
                  <a-input v-model:value="searchFormData.code" allow-clear />
                </j-form-item>
                <j-form-item label="名称">
                  <a-input v-model:value="searchFormData.name" allow-clear />
                </j-form-item>
                <j-form-item label="简称">
                  <a-input v-model:value="searchFormData.shortName" allow-clear />
                </j-form-item>
                <j-form-item label="SKU编号">
                  <a-input v-model:value="searchFormData.skuCode" allow-clear />
                </j-form-item>
                <j-form-item label="类目">
                  <product-category-selector v-model:value="searchFormData.categoryId" />
                </j-form-item>
                <j-form-item label="品牌">
                  <product-brand-selector v-model:value="searchFormData.brandId" />
                </j-form-item>
                <j-form-item label="商品类型">
                  <a-select
                    v-model:value="searchFormData.productType"
                    placeholder="全部"
                    allow-clear
                  >
                    <a-select-option
                      v-for="item in $enums.PRODUCT_TYPE.values()"
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
                v-permission="['base-data:product:info:add']"
                type="primary"
                :icon="h(PlusOutlined)"
                @click="$router.push('/product/info/add')"
                >新增</a-button
              >
              <a-button
                v-permission="['base-data:product:info:import']"
                :icon="h(CloudUploadOutlined)"
                @click="$refs.importer.openDialog()"
                >导入Excel</a-button
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

      <!-- 查看窗口 -->
      <detail :id="id" ref="viewDialog" />
    </div>

    <product-importer ref="importer" @confirm="search" />
  </div>
</template>

<script>
  import { h, defineComponent } from 'vue';
  import Detail from './detail.vue';
  import * as api from '@/api/base-data/product/info';
  import { CloudUploadOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons-vue';

  export default defineComponent({
    name: 'ProductInfo',
    components: {
      Detail,
    },
    setup() {
      return {
        h,
        CloudUploadOutlined,
        PlusOutlined,
        SearchOutlined,
      };
    },
    data() {
      return {
        loading: false,
        visible: true,
        // 当前行数据
        id: '',
        ids: [],
        // 查询列表的查询条件
        searchFormData: {
          code: '',
          name: '',
          skuCode: '',
          categoryId: '',
          brandId: '',
          startTime: '',
          endTime: '',
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
          { field: 'code', title: '编号', width: 120, sortable: true },
          { field: 'name', title: '名称', minWidth: 160, sortable: true },
          { field: 'shortName', title: '简称', width: 140 },
          { field: 'skuCode', title: 'SKU编号', width: 120 },
          { field: 'categoryName', title: '类目', width: 120 },
          { field: 'brandName', title: '品牌', width: 120 },
          {
            field: 'productType',
            title: '商品类型',
            width: 120,
            formatter: ({ cellValue }) => {
              return this.$enums.PRODUCT_TYPE.getDesc(cellValue);
            },
          },
          { field: 'available', title: '状态', width: 80, slots: { default: 'available_default' } },
          { field: 'createTime', title: '创建时间', width: 170, sortable: true },
          { field: 'updateTime', title: '修改时间', width: 170, sortable: true },
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
            permission: ['base-data:product:info:modify'],
            label: '修改',
            onClick: () => {
              this.$router.push('/product/info/modify/' + row.id);
            },
          },
        ];
      },
    },
  });
</script>
<style scoped></style>
