<template>
  <div>
    <dialog-table
      ref="selector"
      v-model="model"
      :request="getList"
      :request-params="_requestParams"
      :disabled="disabled"
      :before-open="beforeOpen"
      :option="{ label: 'code', value: 'id' }"
      :column-option="{ label: 'code', value: 'id' }"
      :table-column="[
        { field: 'code', title: '销售出库单号', width: 180 },
        { field: 'scCode', title: '仓库编号', minWidth: 100 },
        { field: 'scName', title: '仓库名称', minWidth: 120 },
        { field: 'customerCode', title: '客户编号', minWidth: 100 },
        { field: 'customerName', title: '客户名称', minWidth: 120 },
        { field: 'createTime', title: '操作时间', minWidth: 150 },
        { field: 'createBy', title: '操作人', minWidth: 100 }
      ]"
      @input="e => $emit('input', e)"
      @clear="e => $emit('clear', e)"
    >
      <template v-slot:form>
        <j-border>
          <j-form>
            <j-form-item v-if="$utils.isEmpty(requestParams.code)" label="销售出库单号" :span="6">
              <a-input v-model="searchParams.code" allow-clear />
            </j-form-item>
            <j-form-item label="仓库" :span="6">
              <store-center-selector
                v-if="$utils.isEmpty(requestParams.scId)"
                v-model="searchParams.sc"
              />
            </j-form-item>
            <j-form-item label="客户" :span="6">
              <customer-selector
                v-if="$utils.isEmpty(requestParams.customerId)"
                v-model="searchParams.customer"
              />
            </j-form-item>
            <j-form-item label="操作人" :span="6">
              <user-selector
                v-if="$utils.isEmpty(requestParams.createBy)"
                v-model="searchParams.createBy"
              />
            </j-form-item>
            <j-form-item label="操作日期" :content-nest="false" :span="12">
              <div class="date-range-container">
                <a-date-picker
                  v-model="searchParams.createStartTime"
                  placeholder=""
                  value-format="YYYY-MM-DD 00:00:00"
                />
                <span class="date-split">至</span>
                <a-date-picker
                  v-model="searchParams.createEndTime"
                  placeholder=""
                  value-format="YYYY-MM-DD 23:59:59"
                />
              </div>
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
import CustomerSelector from '@/components/Selector/CustomerSelector'
import UserSelector from '@/components/Selector/UserSelector'
import moment from 'moment'

export default {
  name: 'SaleOutSheetSelectorWithReturn',
  components: { DialogTable, StoreCenterSelector, CustomerSelector, UserSelector },
  props: {
    value: { type: [Object, Array], required: true },
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
    }
  },
  data() {
    return {
      searchParams: {
        code: '',
        sc: {},
        customer: {},
        createBy: {},
        createStartTime: this.$utils.formatDateTime(this.$utils.getDateTimeWithMinTime(moment().subtract(1, 'M'))),
        createEndTime: this.$utils.formatDateTime(this.$utils.getDateTimeWithMaxTime(moment()))
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
      return Object.assign({}, this.searchParams, { available: true }, this.requestParams)
    }
  },
  methods: {
    getList(params) {
      const reqParams = {
        code: params.code,
        scId: params.sc.id || '',
        customerId: params.customer.id || '',
        createBy: params.createBy.id || '',
        createStartTime: params.createStartTime,
        createEndTime: params.createEndTime
      }
      return request({
        url: '/sale/out/sheet/query/return',
        method: 'get',
        params: reqParams
      })
    }
  }
}
</script>

<style lang="less">
</style>
