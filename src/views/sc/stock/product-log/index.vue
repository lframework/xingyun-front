<template>
  <div v-permission="['stock:product-log:query']">
    <page-wrapper content-full-height fixed-height>
      <!-- 数据列表 -->
      <vxe-grid
        id="ProductStockLog"
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
            <j-form label-width="100px" @collapse="$refs.grid.refreshColumn()">
              <j-form-item label="仓库">
                <store-center-selector v-model:value="searchFormData.scId" />
              </j-form-item>
              <j-form-item label="商品编号">
                <a-input v-model:value="searchFormData.productCode" allow-clear />
              </j-form-item>
              <j-form-item label="商品名称">
                <a-input v-model:value="searchFormData.productName" allow-clear />
              </j-form-item>
              <j-form-item label="商品类目">
                <product-category-selector
                  v-model:value="searchFormData.categoryId"
                  :only-final="false"
                />
              </j-form-item>
              <j-form-item label="商品品牌">
                <product-brand-selector v-model:value="searchFormData.brandId" />
              </j-form-item>
              <j-form-item label="操作日期" :content-nest="false">
                <div class="date-range-container">
                  <a-date-picker
                    v-model:value="searchFormData.createStartTime"
                    placeholder=""
                    value-format="YYYY-MM-DD 00:00:00"
                  />
                  <span class="date-split">至</span>
                  <a-date-picker
                    v-model:value="searchFormData.createEndTime"
                    placeholder=""
                    value-format="YYYY-MM-DD 23:59:59"
                  />
                </div>
              </j-form-item>
              <j-form-item label="业务类型">
                <a-select v-model:value="searchFormData.bizType" placeholder="全部" allow-clear>
                  <a-select-option
                    v-for="item in $enums.PRODUCT_STOCK_BIZ_TYPE.values()"
                    :key="item.code"
                    :value="item.code"
                    >{{ item.desc }}</a-select-option
                  >
                </a-select>
              </j-form-item>
            </j-form>
          </j-border>
        </template>

        <!-- 单据号 列自定义内容 -->
        <template #bizCode_default="{ row }">
          <div v-if="$enums.PRODUCT_STOCK_BIZ_TYPE.PURCHASE.equalsCode(row.bizType)">
            <a
              v-permission="['purchase:receive:query']"
              @click="
                (e) => {
                  currentRow = row;
                  $nextTick(() => $refs.viewPurchaseRecevieSheetDetailDialog.openDialog());
                }
              "
              >{{ row.bizCode }}</a
            >
            <span v-no-permission="['purchase:receive:query']">{{ row.bizCode }}</span>
          </div>
          <div v-else-if="$enums.PRODUCT_STOCK_BIZ_TYPE.PURCHASE_RETURN.equalsCode(row.bizType)">
            <a
              v-permission="['purchase:return:query']"
              @click="
                (e) => {
                  currentRow = row;
                  $nextTick(() => $refs.viewPurchaseReturnDetailDialog.openDialog());
                }
              "
              >{{ row.bizCode }}</a
            >
            <span v-no-permission="['purchase:return:query']">{{ row.bizCode }}</span>
          </div>
          <div v-else-if="$enums.PRODUCT_STOCK_BIZ_TYPE.SALE.equalsCode(row.bizType)">
            <a
              v-permission="['sale:out:query']"
              @click="
                (e) => {
                  currentRow = row;
                  $nextTick(() => $refs.viewSaleOutSheetDetailDialog.openDialog());
                }
              "
              >{{ row.bizCode }}</a
            >
            <span v-no-permission="['sale:out:query']">{{ row.bizCode }}</span>
          </div>
          <div v-else-if="$enums.PRODUCT_STOCK_BIZ_TYPE.SALE_RETURN.equalsCode(row.bizType)">
            <a
              v-permission="['sale:return:query']"
              @click="
                (e) => {
                  currentRow = row;
                  $nextTick(() => $refs.viewSaleReturnDetailDialog.openDialog());
                }
              "
              >{{ row.bizCode }}</a
            >
            <span v-no-permission="['sale:return:query']">{{ row.bizCode }}</span>
          </div>
          <div v-else-if="$enums.PRODUCT_STOCK_BIZ_TYPE.RETAIL.equalsCode(row.bizType)">
            <a
              v-permission="['retail:out:query']"
              @click="
                (e) => {
                  currentRow = row;
                  $nextTick(() => $refs.viewRetailOutSheetDetailDialog.openDialog());
                }
              "
              >{{ row.bizCode }}</a
            >
            <span v-no-permission="['retail:out:query']">{{ row.bizCode }}</span>
          </div>
          <div v-else-if="$enums.PRODUCT_STOCK_BIZ_TYPE.RETAIL_RETURN.equalsCode(row.bizType)">
            <a
              v-permission="['retail:return:query']"
              @click="
                (e) => {
                  currentRow = row;
                  $nextTick(() => $refs.viewRetailReturnDetailDialog.openDialog());
                }
              "
              >{{ row.bizCode }}</a
            >
            <span v-no-permission="['retail:return:query']">{{ row.bizCode }}</span>
          </div>
          <div v-else-if="$enums.PRODUCT_STOCK_BIZ_TYPE.TAKE_STOCK_IN.equalsCode(row.bizType)">
            <a
              v-permission="['stock:take:plan:query']"
              @click="
                (e) => {
                  currentRow = row;
                  $nextTick(() => $refs.viewTakeStockPlanDetailDialog.openDialog());
                }
              "
              >{{ row.bizCode }}</a
            >
            <span v-no-permission="['stock:take:plan:query']">{{ row.bizCode }}</span>
          </div>
          <div v-else-if="$enums.PRODUCT_STOCK_BIZ_TYPE.TAKE_STOCK_OUT.equalsCode(row.bizType)">
            <a
              v-permission="['stock:take:plan:query']"
              @click="
                (e) => {
                  currentRow = row;
                  $nextTick(() => $refs.viewTakeStockPlanDetailDialog.openDialog());
                }
              "
              >{{ row.bizCode }}</a
            >
            <span v-no-permission="['stock:take:plan:query']">{{ row.bizCode }}</span>
          </div>
          <div v-else-if="$enums.PRODUCT_STOCK_BIZ_TYPE.STOCK_COST_ADJUST.equalsCode(row.bizType)">
            <a
              v-permission="['stock:adjust:cost:query']"
              @click="
                (e) => {
                  currentRow = row;
                  $nextTick(() => $refs.viewStockCostAdjustDetailDialog.openDialog());
                }
              "
              >{{ row.bizCode }}</a
            >
            <span v-no-permission="['stock:adjust:cost:query']">{{ row.bizCode }}</span>
          </div>
          <div v-else-if="$enums.PRODUCT_STOCK_BIZ_TYPE.STOCK_ADJUST.equalsCode(row.bizType)">
            <a
              v-permission="['stock:adjust:query']"
              @click="
                (e) => {
                  currentRow = row;
                  $nextTick(() => $refs.viewStockAdjustDetailDialog.openDialog());
                }
              "
              >{{ row.bizCode }}</a
            >
            <span v-no-permission="['stock:adjust:query']">{{ row.bizCode }}</span>
          </div>
          <div v-else-if="$enums.PRODUCT_STOCK_BIZ_TYPE.SC_TRANSFER.equalsCode(row.bizType)">
            <a
              v-permission="['stock:sc-transfer:query']"
              @click="
                (e) => {
                  currentRow = row;
                  $nextTick(() => $refs.viewScTransferOrderDetailDialog.openDialog());
                }
              "
              >{{ row.bizCode }}</a
            >
            <span v-no-permission="['stock:sc-transfer:query']">{{ row.bizCode }}</span>
          </div>
          <span v-else>{{ row.bizCode }}</span>
        </template>

        <!-- 工具栏 -->
        <template #toolbar_buttons>
          <a-space>
            <a-button type="primary" :icon="h(SearchOutlined)" @click="search">查询</a-button>
            <a-button
              v-permission="['stock:product-log:export']"
              type="primary"
              :icon="h(DownloadOutlined)"
              @click="exportList"
              >导出</a-button
            >
          </a-space>
        </template>
      </vxe-grid>
    </page-wrapper>

    <purchase-receive-sheet-detail
      :id="currentRow.bizId"
      ref="viewPurchaseRecevieSheetDetailDialog"
    />
    <purchase-return-detail :id="currentRow.bizId" ref="viewPurchaseReturnDetailDialog" />
    <sale-out-sheet-detail :id="currentRow.bizId" ref="viewSaleOutSheetDetailDialog" />
    <sale-return-detail :id="currentRow.bizId" ref="viewSaleReturnDetailDialog" />
    <retail-out-sheet-detail :id="currentRow.bizId" ref="viewRetailOutSheetDetailDialog" />
    <retail-return-detail :id="currentRow.bizId" ref="viewRetailReturnDetailDialog" />
    <take-stock-plan-detail :id="currentRow.bizId" ref="viewTakeStockPlanDetailDialog" />
    <stock-cost-adjust-detail :id="currentRow.bizId" ref="viewStockCostAdjustDetailDialog" />
    <stock-adjust-detail :id="currentRow.bizId" ref="viewStockAdjustDetailDialog" />
    <sc-transfer-order-detail :id="currentRow.bizId" ref="viewScTransferOrderDetailDialog" />
  </div>
</template>

<script>
  import { h, defineComponent } from 'vue';
  import { SearchOutlined, DownloadOutlined } from '@ant-design/icons-vue';
  import Moment from 'moment';
  import PurchaseReceiveSheetDetail from '@/views/sc/purchase/receive/detail.vue';
  import PurchaseReturnDetail from '@/views/sc/purchase/return/detail.vue';
  import SaleOutSheetDetail from '@/views/sc/sale/out/detail.vue';
  import SaleReturnDetail from '@/views/sc/sale/return/detail.vue';
  import RetailOutSheetDetail from '@/views/sc/retail/out/detail.vue';
  import RetailReturnDetail from '@/views/sc/retail/return/detail.vue';
  import TakeStockPlanDetail from '@/views/sc/stock/take/plan/detail.vue';
  import StockCostAdjustDetail from '@/views/sc/stock/adjust/cost/detail.vue';
  import StockAdjustDetail from '@/views/sc/stock/adjust/stock/detail.vue';
  import ScTransferOrderDetail from '@/views/sc/stock/transfer/detail.vue';
  import * as api from '@/api/sc/stock/product-stock-log';

  export default defineComponent({
    name: 'ProductStockLog',
    components: {
      PurchaseReceiveSheetDetail,
      PurchaseReturnDetail,
      SaleOutSheetDetail,
      SaleReturnDetail,
      RetailOutSheetDetail,
      RetailReturnDetail,
      TakeStockPlanDetail,
      StockCostAdjustDetail,
      StockAdjustDetail,
      ScTransferOrderDetail,
    },
    setup() {
      return {
        h,
        SearchOutlined,
        DownloadOutlined,
      };
    },
    data() {
      return {
        loading: false,
        // 当前行数据
        currentRow: '',
        // 查询列表的查询条件
        searchFormData: {
          scId: '',
          productCode: '',
          productName: '',
          categoryId: '',
          brandId: '',
          createStartTime: this.$utils.formatDateTime(
            this.$utils.getDateTimeWithMinTime(Moment().subtract(1, 'M')),
          ),
          createEndTime: this.$utils.formatDateTime(this.$utils.getDateTimeWithMaxTime(Moment())),
          bizType: undefined,
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
          { field: 'scCode', title: '仓库编号', width: 100, sortable: true },
          { field: 'scName', title: '仓库名称', minWidth: 160 },
          { field: 'productCode', title: '商品编号', width: 120, sortable: true },
          { field: 'productName', title: '商品名称', minWidth: 180 },
          { field: 'categoryName', title: '商品类目', width: 120 },
          { field: 'brandName', title: '商品品牌', width: 120 },
          { field: 'oriStockNum', title: '变动前库存数量', align: 'right', width: 140, sortable: true },
          { field: 'curStockNum', title: '变动后库存数量', align: 'right', width: 140, sortable: true },
          { field: 'stockNum', title: '变动库存数量', align: 'right', width: 140, sortable: true },
          { field: 'oriTaxPrice', title: '变动前含税成本价', align: 'right', width: 140, sortable: true },
          { field: 'curTaxPrice', title: '变动后含税成本价', align: 'right', width: 140, sortable: true },
          { field: 'taxAmount', title: '变动含税金额', align: 'right', width: 140, sortable: true },
          { field: 'createTime', title: '操作时间', minWidth: 170, sortable: true },
          { field: 'createBy', title: '操作人', minWidth: 100 },
          { field: 'bizCode', title: '单据号', width: 180, slots: { default: 'bizCode_default' }, sortable: true },
          {
            field: 'bizType',
            title: '业务类型',
            width: 140,
            formatter: ({ cellValue }) => {
              return this.$enums.PRODUCT_STOCK_BIZ_TYPE.getDesc(cellValue);
            }, sortable: true,
          },
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
        const params = Object.assign({}, this.searchFormData, {
          scId: this.searchFormData.scId,
          categoryId: this.searchFormData.categoryId,
          brandId: this.searchFormData.brandId,
          supplierId: this.searchFormData.supplierId,
        });

        return params;
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
    },
  });
</script>
<style scoped></style>
