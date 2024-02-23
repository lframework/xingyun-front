<template>
  <div>
    <dialog-table
      ref="selector"
      :request="getList"
      :load="getLoad"
      :dialog-width="'80%'"
      :request-params="_requestParams"
      :table-column="[
        { field: 'code', title: '单据号', minWidth: 180 },
        { field: 'scCode', title: '仓库编号', minWidth: 100 },
        { field: 'scName', title: '仓库名称', minWidth: 120 },
        { field: 'supplierCode', title: '供应商编号', minWidth: 100 },
        { field: 'supplierName', title: '供应商名称', minWidth: 120 },
        { field: 'createTime', title: '操作时间', minWidth: 150 },
        { field: 'createBy', title: '操作人', minWidth: 100 },
        {
          field: 'status',
          title: '审核状态',
          minWidth: 100,
          formatter: ({ cellValue }) => {
            return $enums.PURCHASE_ORDER_STATUS.getDesc(cellValue);
          },
        },
      ]"
      v-bind="$attrs"
    >
      <template #form>
        <!-- 查询条件 -->
        <j-border>
          <j-form>
            <j-form-item v-if="$utils.isEmpty(requestParams.code)" label="单据号">
              <a-input v-model:value="searchParams.code" />
            </j-form-item>
            <j-form-item v-if="$utils.isEmpty(requestParams.scId)" label="仓库">
              <store-center-selector v-model:value="searchParams.scId" />
            </j-form-item>
            <j-form-item v-if="$utils.isEmpty(requestParams.supplierId)" label="供应商">
              <supplier-selector v-model:value="searchParams.supplierId" />
            </j-form-item>
            <j-form-item v-if="$utils.isEmpty(requestParams.createBy)" label="操作人">
              <user-selector v-model:value="searchParams.createBy" />
            </j-form-item>
            <j-form-item label="操作日期" :content-nest="false">
              <div class="date-range-container">
                <a-date-picker
                  v-model:value="searchParams.createStartTime"
                  placeholder=""
                  value-format="YYYY-MM-DD 00:00:00"
                />
                <span class="date-split">至</span>
                <a-date-picker
                  v-model:value="searchParams.createEndTime"
                  placeholder=""
                  value-format="YYYY-MM-DD 23:59:59"
                />
              </div>
            </j-form-item>
            <j-form-item v-if="$utils.isEmpty(requestParams.status)" label="状态">
              <a-select v-model:value="searchParams.status" placeholder="全部" allow-clear>
                <a-select-option
                  v-for="item in $enums.PURCHASE_ORDER_STATUS.values()"
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
        <a-space class="operator">
          <a-button type="primary" @click="$refs.selector.search()">
            <template #icon>
              <SearchOutlined />
            </template>
            查询</a-button
          >
        </a-space>
      </template>
    </dialog-table>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import { SearchOutlined } from '@ant-design/icons-vue';
  import * as api from '@/api/sc/purchase/order';

  export default defineComponent({
    name: 'PurchaseOrderSelector',
    components: { SearchOutlined },
    props: {
      requestParams: {
        type: Object,
        default: () => {
          return {};
        },
      },
    },
    data() {
      return {
        searchParams: {
          code: '',
          scId: '',
          supplierId: '',
          createBy: '',
          createStartTime: this.$utils.formatDateTime(this.$utils.getDateTimeWithMinTime(moment().subtract(1, 'M'))),
          createEndTime: this.$utils.formatDateTime(this.$utils.getDateTimeWithMaxTime(moment())),
          status: undefined,
        },
      };
    },
    computed: {
      _requestParams() {
        return { ...this.searchParams, ...this.requestParams };
      },
    },
    methods: {
      getList(params) {
        return api.selector({
          ...params,
          available: true,
          ...this.searchParams,
          ...this.requestParams,
        });
      },
      getLoad(ids) {
        return api.loadPurchaseOrder(ids);
      },
    },
  });
</script>

<style lang="less"></style>
