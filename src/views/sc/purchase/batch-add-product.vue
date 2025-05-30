<template>
  <a-modal
    v-model:open="visible"
    :mask-closable="false"
    width="70%"
    title="批量添加商品"
    :style="{ top: '20px' }"
  >
    <div
      v-if="visible"
      v-permission="[
        'purchase:order:add',
        'purchase:order:modify',
        'purchase:receive:add',
        'purchase:receive:modify',
        'purchase:return:add',
        'purchase:return:modify',
      ]"
    >
      <!-- 数据列表 -->
      <vxe-grid
        v-if="visible"
        ref="grid"
        resizable
        show-overflow
        highlight-hover-row
        keep-source
        row-id="productId"
        height="500"
        :proxy-config="proxyConfig"
        :columns="tableColumn"
        :toolbar-config="toolbarConfig"
        :pager-config="{}"
        :checkbox-config="{
          trigger: 'row',
          highlight: true,
        }"
        :loading="loading"
      >
        <template #form>
          <j-border>
            <j-form bordered>
              <j-form-item label="商品">
                <a-input v-model:value="searchFormData.condition" allow-clear />
              </j-form-item>
              <j-form-item label="商品分类">
                <product-category-selector
                  v-model:value="searchFormData.categoryId"
                  :only-final="false"
                />
              </j-form-item>
              <j-form-item label="商品品牌">
                <product-brand-selector
                  v-model:value="searchFormData.brandId"
                  :request-params="{ available: true }"
                />
              </j-form-item>
            </j-form>
          </j-border>
        </template>
        <!-- 工具栏 -->
        <template #toolbar_buttons>
          <a-space>
            <a-button type="primary" :icon="h(SearchOutlined)" @click="search">查询</a-button>
          </a-space>
        </template>
      </vxe-grid>
    </div>
    <template #footer>
      <a-space>
        <a-button @click="closeDialog">取 消</a-button>
        <a-button
          v-permission="['purchase:order:add', 'purchase:order:modify']"
          type="primary"
          :loading="loading"
          @click="doSelect"
          >确 定</a-button
        >
      </a-space>
    </template>
  </a-modal>
</template>
<script>
  import { h, defineComponent } from 'vue';
  import { SearchOutlined } from '@ant-design/icons-vue';
  import * as api from '@/api/sc/purchase/order';

  export default defineComponent({
    // 使用组件
    components: {},
    props: {
      scId: {
        type: String,
        default: '',
      },
    },
    setup() {
      return {
        h,
        SearchOutlined,
      };
    },
    data() {
      return {
        // 是否可见
        visible: false,
        // 是否显示加载框
        loading: false,
        // 查询列表的查询条件
        searchFormData: {
          condition: '',
          categoryId: '',
          brandId: '',
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
          { field: 'productCode', title: '商品编号', width: 120 },
          { field: 'productName', title: '商品名称', width: 260 },
          { field: 'skuCode', title: '商品SKU编号', width: 120 },
          { field: 'externalCode', title: '商品简码', width: 120 },
          { field: 'unit', title: '单位', width: 80 },
          { field: 'spec', title: '规格', width: 80 },
          { field: 'categoryName', title: '商品分类', width: 120 },
          { field: 'brandName', title: '商品品牌', width: 120 },
          { field: 'purchasePrice', title: '采购价（元）', align: 'right', width: 120 },
          { field: 'taxRate', title: '税率（%）', align: 'right', width: 100 },
          { field: 'taxCostPrice', title: '含税成本价（元）', align: 'right', width: 140 },
          { field: 'stockNum', title: '库存数量', align: 'right', width: 100 },
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
              return api.queryPurchaseProductList(this.buildQueryParams(page));
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
        return {
          scId: this.scId,
          condition: this.searchFormData.condition,
          categoryId: this.searchFormData.categoryId || '',
          brandId: this.searchFormData.brandId || '',
        };
      },
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
      // 页面显示时触发
      open() {},
      // 选择商品
      doSelect() {
        const records = this.$refs.grid.getCheckboxRecords();
        if (this.$utils.isEmpty(records)) {
          this.$msg.createError('请选择商品数据！');
          return;
        }

        this.$emit('confirm', records);

        this.closeDialog();
      },
    },
  });
</script>
