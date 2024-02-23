<template>
  <div>
    <dialog-table
      ref="selector"
      :request="getList"
      :load="getLoad"
      :request-params="_requestParams"
      :option="{
        label: 'code',
        value: 'id',
      }"
      :column-option="{
        label: 'code',
        value: 'id',
      }"
      :table-column="[
        { field: 'code', title: '单据号', minWidth: 180 },
        { field: 'scCode', title: '仓库编号', width: 100 },
        { field: 'scName', title: '仓库名称', width: 120 },
        {
          field: 'takeType',
          title: '盘点类别',
          width: 100,
          formatter: ({ cellValue }) => {
            return $enums.TAKE_STOCK_PLAN_TYPE.getDesc(cellValue);
          },
        },
        {
          field: 'takeStatus',
          title: '盘点状态',
          width: 120,
          formatter: ({ cellValue }) => {
            return $enums.TAKE_STOCK_PLAN_STATUS.getDesc(cellValue);
          },
        },
        { field: 'createTime', title: '创建时间', width: 170 },
        { field: 'updateTime', title: '操作时间', width: 170 },
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
            <j-form-item v-if="$utils.isEmpty(requestParams.takeType)" label="盘点类别">
              <a-select v-model:value="searchParams.takeType" placeholder="全部" allow-clear>
                <a-select-option
                  v-for="item in $enums.TAKE_STOCK_PLAN_TYPE.values()"
                  :key="item.code"
                  :value="item.code"
                  >{{ item.desc }}</a-select-option
                >
              </a-select>
            </j-form-item>
            <j-form-item
              v-if="$utils.isEmpty(requestParams.takeStatus) && !requestParams.taking"
              label="盘点状态"
            >
              <a-select v-model:value="searchParams.takeStatus" placeholder="全部" allow-clear>
                <a-select-option
                  v-for="item in $enums.TAKE_STOCK_PLAN_STATUS.values()"
                  :key="item.code"
                  :value="item.code"
                  >{{ item.desc }}</a-select-option
                >
              </a-select>
            </j-form-item>
            <j-form-item label="创建日期" :content-nest="false">
              <div class="date-range-container">
                <a-date-picker
                  v-model:value="searchParams.createTimeStart"
                  placeholder=""
                  value-format="YYYY-MM-DD 00:00:00"
                />
                <span class="date-split">至</span>
                <a-date-picker
                  v-model:value="searchParams.createTimeEnd"
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
  import moment from 'moment';
  import * as api from '@/api/sc/stock/take/plan';

  export default defineComponent({
    name: 'TakeStockPlanSelector',
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
          takeType: undefined,
          takeStatus: undefined,
          taking: '',
          createTimeStart: this.$utils.formatDateTime(
            this.$utils.getDateTimeWithMinTime(moment().subtract(1, 'M')),
          ),
          createTimeEnd: this.$utils.formatDateTime(this.$utils.getDateTimeWithMaxTime(moment())),
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
        return api.loadTakeStockPlan(ids);
      },
    },
  });
</script>

<style lang="less"></style>
