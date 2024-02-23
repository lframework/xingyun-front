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
        { field: 'code', title: '采购收货单号', width: 180 },
        { field: 'scCode', title: '仓库编号', minWidth: 100 },
        { field: 'scName', title: '仓库名称', minWidth: 120 },
        { field: 'supplierCode', title: '供应商编号', minWidth: 100 },
        { field: 'supplierName', title: '供应商名称', minWidth: 120 },
        { field: 'createTime', title: '操作时间', minWidth: 150 },
        { field: 'createBy', title: '操作人', minWidth: 100 },
      ]"
      v-bind="$attrs"
    >
      <template #form>
        <!-- 查询条件 -->
        <j-border>
          <j-form>
            <j-form-item v-if="$utils.isEmpty(requestParams.code)" label="采购收货单号">
              <a-input v-model:value="searchParams.code" allow-clear />
            </j-form-item>
            <j-form-item label="仓库">
              <store-center-selector
                v-if="$utils.isEmpty(requestParams.scId)"
                v-model:value="searchParams.scId"
              />
            </j-form-item>
            <j-form-item label="供应商">
              <supplier-selector
                v-if="$utils.isEmpty(requestParams.supplierId)"
                v-model:value="searchParams.supplierId"
              />
            </j-form-item>
            <j-form-item label="操作人">
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
  import * as api from '@/api/sc/purchase/receive';
  import Moment from 'moment';

  export default defineComponent({
    name: 'ReceiveSheetSelectorWithReturn',
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
          supplierId: '',
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
          code: params.code,
          scId: params.scId || '',
          supplierId: params.supplierId || '',
          createBy: params.createBy || '',
          createStartTime: params.createStartTime,
          createEndTime: params.createEndTime,
        };
        return api.queryWithReturn(reqParams);
      },
      getLoad(ids) {
        return api.loadWithReturn(ids);
      },
    },
  });
</script>

<style lang="less"></style>
