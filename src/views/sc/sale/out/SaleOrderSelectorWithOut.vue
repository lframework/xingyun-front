<template>
  <div>
    <dialog-table
      ref="selector"
      :request="getList"
      :load="getLoad"
      :dialog-width="'80%'"
      :request-params="_requestParams"
      :option="{ label: 'code', value: 'id' }"
      :column-option="{ label: 'code', value: 'id' }"
      :table-column="[
        { field: 'code', title: '销售单号', width: 180 },
        { field: 'scCode', title: '仓库编号', minWidth: 100 },
        { field: 'scName', title: '仓库名称', minWidth: 120 },
        { field: 'customerCode', title: '客户编号', minWidth: 100 },
        { field: 'customerName', title: '客户名称', minWidth: 120 },
        { field: 'createTime', title: '操作时间', minWidth: 150 },
        { field: 'createBy', title: '操作人', minWidth: 100 },
      ]"
      v-bind="$attrs"
    >
      <template #form>
        <!-- 查询条件 -->
        <j-border>
          <j-form bordered>
            <j-form-item v-if="$utils.isEmpty(requestParams.code)" label="销售单号" :span="6">
              <a-input v-model:value="searchParams.code" allow-clear />
            </j-form-item>
            <j-form-item label="仓库" :span="6">
              <store-center-selector
                v-if="$utils.isEmpty(requestParams.scId)"
                v-model:value="searchParams.scId"
              />
            </j-form-item>
            <j-form-item label="客户" :span="6">
              <customer-selector
                v-if="$utils.isEmpty(requestParams.customerId)"
                v-model:value="searchParams.customerId"
              />
            </j-form-item>
            <j-form-item label="操作人" :span="6">
              <user-selector
                v-if="$utils.isEmpty(requestParams.createBy)"
                v-model:value="searchParams.createBy"
              />
            </j-form-item>
            <j-form-item label="操作日期" :content-nest="false" :span="12">
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
  import * as api from '@/api/sc/sale/order';
  import Moment from 'moment';

  export default defineComponent({
    name: 'SaleOrderSelectorWithOut',
    components: { SearchOutlined },
    props: {
      requestParams: {
        type: Object,
        default: () => {
          return {};
        },
      },
    },
    setup() {
      const moment = Moment;
      return {
        moment,
      };
    },
    data() {
      return {
        searchParams: {
          code: '',
          scId: '',
          customerId: '',
          createBy: '',
          createStartTime: this.$utils.formatDateTime(
            this.$utils.getDateTimeWithMinTime(this.moment().subtract(1, 'M')),
          ),
          createEndTime: this.$utils.formatDateTime(
            this.$utils.getDateTimeWithMaxTime(this.moment()),
          ),
        },
      };
    },
    computed: {
      model: {
        get() {
          return this.value;
        },
        set() {},
      },
      _requestParams() {
        return Object.assign({}, this.searchParams, { available: true }, this.requestParams);
      },
    },
    methods: {
      getList(params) {
        const reqParams = {
          ...params,
          code: params.code,
          scId: params.scId || '',
          customerId: params.customerId || '',
          createBy: params.createBy || '',
          createStartTime: params.createStartTime,
          createEndTime: params.createEndTime,
        };
        return api.queryWithOut(reqParams);
      },
      getLoad(ids) {
        return api.loadWithOut(ids);
      },
    },
  });
</script>

<style lang="less"></style>
