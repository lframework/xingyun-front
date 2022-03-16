<template>
  <div>
    <dialog-table
      ref="selector"
      v-model="model"
      :request="getList"
      :request-params="_requestParams"
      :disabled="disabled"
      dialog-width="80%"
      :before-open="beforeOpen"
      :option="{ label: 'code', value: 'id' }"
      :column-option="{ label: 'code', value: 'id' }"
      :table-column="[
        { field: 'code', title: '采购收货单号', width: 180 },
        { field: 'scCode', title: '仓库编号', minWidth: 100 },
        { field: 'scName', title: '仓库名称', minWidth: 120 },
        { field: 'supplierCode', title: '供应商编号', minWidth: 100 },
        { field: 'supplierName', title: '供应商名称', minWidth: 120 },
        { field: 'createTime', title: '操作时间', minWidth: 150 },
        { field: 'createBy', title: '操作人', minWidth: 100 }
      ]"
      @input="e => $emit('input', e)"
      @clear="e => $emit('clear', e)"
    >
      <template v-slot:form>
        <j-border>
          <j-form>
            <j-form-item v-if="$utils.isEmpty(requestParams.code)" label="采购收货单号">
              <a-input v-model="searchParams.code" allow-clear />
            </j-form-item>
            <j-form-item label="仓库">
              <store-center-selector
                v-if="$utils.isEmpty(requestParams.scId)"
                v-model="searchParams.sc"
              />
            </j-form-item>
            <j-form-item label="供应商">
              <supplier-selector
                v-if="$utils.isEmpty(requestParams.supplierId)"
                v-model="searchParams.supplier"
              />
            </j-form-item>
            <j-form-item label="操作人">
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
import SupplierSelector from '@/components/Selector/SupplierSelector'
import UserSelector from '@/components/Selector/UserSelector'
import moment from 'moment'

export default {
  name: 'ReceiveSheetSelectorWithReturn',
  components: { DialogTable, StoreCenterSelector, SupplierSelector, UserSelector },
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
        supplier: {},
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
        supplierId: params.supplier.id || '',
        createBy: params.createBy.id || '',
        createStartTime: params.createStartTime,
        createEndTime: params.createEndTime
      }
      return request({
        url: '/purchase/receive/sheet/query/return',
        method: 'get',
        params: reqParams
      })
    }
  }
}
</script>

<style lang="less">
</style>
