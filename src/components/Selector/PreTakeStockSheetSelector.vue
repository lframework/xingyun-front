<template>
  <div>
    <dialog-table
      ref="selector"
      v-model="model"
      :request="getList"
      :load="getLoad"
      :show-sum="showSum"
      :request-params="_requestParams"
      :multiple="multiple"
      :placeholder="placeholder"
      :disabled="disabled"
      :dialog-width="'80%'"
      :option="{
        label: 'code', value: 'id'
      }"
      :column-option="{
        label: 'code', value: 'id'
      }"
      :table-column="[
        { field: 'code', title: '单据号', minWidth: 180 },
        { field: 'scCode', title: '仓库编号', width: 100 },
        { field: 'scName', title: '仓库名称', width: 120 },
        { field: 'takeStatus', title: '盘点状态', width: 120, formatter: ({ cellValue }) => { return this.$enums.PRE_TAKE_STOCK_SHEET_STATUS.getDesc(cellValue) } },
        { field: 'updateTime', title: '操作时间', width: 170 }
      ]"
      :before-open="beforeOpen"
      @input="e => $emit('input', e)"
      @input-label="e => $emit('input-label', e)"
      @input-row="e => $emit('input-row', e)"
      @clear="e => $emit('clear', e)"
    >
      <template v-slot:form>
        <!-- 查询条件 -->
        <j-border>
          <j-form>
            <j-form-item v-if="$utils.isEmpty(requestParams.code)" label="单据号">
              <a-input v-model="searchParams.code" />
            </j-form-item>
            <j-form-item v-if="$utils.isEmpty(requestParams.scId)" label="仓库">
              <store-center-selector
                v-model="searchParams.scId"
              />
            </j-form-item>
            <j-form-item label="操作日期" :content-nest="false">
              <div class="date-range-container">
                <a-date-picker v-model="searchParams.updateTimeStart" placeholder="" value-format="YYYY-MM-DD 00:00:00" />
                <span class="date-split">至</span>
                <a-date-picker
                  v-model="searchParams.updateTimeEnd"
                  placeholder=""
                  value-format="YYYY-MM-DD 23:59:59"
                />
              </div>
            </j-form-item>
            <j-form-item v-if="$utils.isEmpty(requestParams.takeStatus)" label="盘点状态">
              <a-select v-model="searchParams.takeStatus" placeholder="全部" allow-clear>
                <a-select-option v-for="item in $enums.PRE_TAKE_STOCK_SHEET_STATUS.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
              </a-select>
            </j-form-item>
          </j-form>
        </j-border>
      </template>
      <!-- 工具栏 -->
      <template v-slot:toolbar_buttons>
        <a-space class="operator">
          <a-button type="primary" icon="search" @click="$refs.selector.search()">查询</a-button>
        </a-space>
      </template>
    </dialog-table>
  </div>
</template>

<script>
import DialogTable from '@/components/DialogTable'
import { request } from '@/utils/request'
import StoreCenterSelector from '@/components/Selector/StoreCenterSelector'
import moment from 'moment'

export default {
  name: 'TakeStockPlanSelector',
  components: { DialogTable, StoreCenterSelector },
  props: {
    value: { type: [Object, Array], required: true },
    placeholder: { type: String, default: '' },
    disabled: {
      type: Boolean,
      default: false
    },
    beforeOpen: {
      type: Function,
      default: e => {
        return () => {
          return true
        }
      }
    },
    requestParams: {
      type: Object,
      default: e => {
        return {}
      }
    },
    multiple: { type: Boolean, default: false },
    showSum: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchParams: {
        code: '',
        scId: '',
        takeStatus: undefined,
        updateTimeStart: this.$utils.formatDateTime(this.$utils.getDateTimeWithMinTime(moment().subtract(1, 'M'))),
        updateTimeEnd: this.$utils.formatDateTime(this.$utils.getDateTimeWithMaxTime(moment()))
      }
    }
  },
  computed: {
    model: {
      get() {
        return this.value
      },
      set() {}
    },
    _requestParams() {
      const params = Object.assign({}, this.searchParams, this.requestParams)

      return params
    }
  },
  methods: {
    getList(params) {
      return request({
        url: '/selector/takestock/pre',
        region: 'sc-api',
        method: 'get',
        params: params
      })
    },
    getLoad(ids) {
      return request({
        url: '/selector/takestock/pre/load',
        region: 'sc-api',
        method: 'post',
        dataType: 'json',
        data: ids
      })
    }
  }
}
</script>

<style lang="less">
</style>
