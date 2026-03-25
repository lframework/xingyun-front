<template>
  <div>
    <div v-show="visible" v-permission="['base-data:product:info:query']">
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
                  <j-form bordered @collapse="$refs.grid.refreshColumn()">
                    <j-form-item label="编号">
                      <a-input v-model:value="searchFormData.code" allow-clear />
                    </j-form-item>
                    <j-form-item label="名称">
                      <a-input v-model:value="searchFormData.name" allow-clear />
                    </j-form-item>
                    <j-form-item label="简称">
                      <a-input v-model:value="searchFormData.shortName" allow-clear />
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
                          v-for="item in PRODUCT_TYPE.values()"
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
                    @click="openChildPage('/product/info/add')"
                    >新增</a-button
                  >
                  <a-button
                    v-permission="['base-data:product:info:import']"
                    :icon="h(CloudUploadOutlined)"
                    @click="$refs.importer.openDialog()"
                    >导入Excel</a-button
                  >
                  <a-dropdown>
                    <template #overlay>
                      <a-menu @click="handleCommand">
                        <a-menu-item key="batchDelete" :icon="h(DeleteOutlined)">
                          批量删除
                        </a-menu-item>
                      </a-menu>
                    </template>
                    <a-button v-permission="['base-data:product:info:delete']"
                      >更多<DownOutlined
                    /></a-button>
                  </a-dropdown>
                </a-space>
              </template>

              <!-- 操作 列自定义内容 -->
              <template #action_default="{ row }">
                <table-action outside :actions="createActions(row)" />
              </template>
            </vxe-grid>
          </page-wrapper>
        </a-col>
      </a-row>

      <!-- 查看窗口 -->
      <detail :id="id" ref="viewDialog" />
    </div>

    <product-importer ref="importer" @confirm="search" />

    <!-- 批量操作 -->
    <batch-handler
      ref="batchDeleteHandlerDialog"
      :table-column="[
        { field: 'code', title: '编号', width: 120 },
        { field: 'name', title: '名称', minWidth: 160 },
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
  import Detail from './detail.vue';
  import * as api from '@/api/base-data/product/info';
  import {
    CloudUploadOutlined,
    DownOutlined,
    PlusOutlined,
    SearchOutlined,
    DeleteOutlined,
  } from '@ant-design/icons-vue';
  import { multiplePageMix } from '@/mixins/multiplePageMix';
  import { buildSortPageVo, isEmpty, isEqualWithStr } from '@/utils/utils';
  import ProductImporter from '@/components/Importor/ProductImporter.vue';
  import ProductBrandSelector from '@/components/Selector/ProductBrandSelector.vue';
  import { PRODUCT_TYPE } from '@/enums/biz/productType';
  import BatchHandler from '@/components/BatchHandler';
  import { createError } from '@/hooks/web/msg';
  import CategoryTree from './category-tree.vue';

  export default defineComponent({
    name: 'ProductInfo',
    components: {
      CategoryTree,
      BatchHandler,
      DownOutlined,
      Detail,
      ProductImporter,
      ProductBrandSelector,
    },
    mixins: [multiplePageMix],
    setup() {
      return {
        h,
        CloudUploadOutlined,
        PlusOutlined,
        SearchOutlined,
        PRODUCT_TYPE,
        DeleteOutlined,
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
          categoryId: '',
          brandId: '',
          startTime: '',
          endTime: '',
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
          { field: 'categoryName', title: '分类', width: 120 },
          { field: 'brandName', title: '品牌', width: 120 },
          {
            field: 'productType',
            title: '商品类型',
            width: 120,
            formatter: ({ cellValue }) => {
              return PRODUCT_TYPE.getDesc(cellValue);
            },
          },
          { field: 'createTime', title: '创建时间', width: 170, sortable: true },
          { field: 'updateTime', title: '修改时间', width: 170, sortable: true },
          { title: '操作', width: 120, fixed: 'right', slots: { default: 'action_default' } },
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
      doBatchDelete(row) {
        return api.deleteById(row.id);
      },
      // 批量删除
      batchDelete() {
        const records = this.$refs.grid.getCheckboxRecords();

        if (isEmpty(records)) {
          createError('请选择要删除的商品！');
          return;
        }

        this.batchHandleDatas = records;

        this.$refs.batchDeleteHandlerDialog.openDialog();
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
              this.openChildPage('/product/info/modify/' + row.id);
            },
          },
        ];
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
      onRefreshPage() {
        this.search();
      },
    },
  });
</script>
<style scoped></style>
