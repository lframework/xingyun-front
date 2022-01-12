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
        { field: 'code', title: '采购单号', width: 180 },
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
            <j-form-item v-if="$utils.isEmpty(requestParams.code)" label="采购单号" :span="6">
              <el-input v-model="searchParams.code" clearable />
            </j-form-item>
            <j-form-item label="仓库" :span="6">
              <store-center-selector
                v-if="$utils.isEmpty(requestParams.scId)"
                v-model="searchParams.sc"
              />
            </j-form-item>
            <j-form-item label="供应商" :span="6">
              <supplier-selector
                v-if="$utils.isEmpty(requestParams.supplierId)"
                v-model="searchParams.supplier"
              />
            </j-form-item>
            <j-form-item label="操作人" :span="6">
              <user-selector
                v-if="$utils.isEmpty(requestParams.createBy)"
                v-model="searchParams.createBy"
              />
            </j-form-item>
            <j-form-item label="操作日期" :content-nest="false" :span="12">
              <el-date-picker
                v-model="searchParams.createStartTime"
                type="date"
                value-format="yyyy-MM-dd 00:00:00"
              />
              <span class="date-split">至</span>
              <el-date-picker
                v-model="searchParams.createEndTime"
                type="date"
                value-format="yyyy-MM-dd 23:59:59"
              />
            </j-form-item>
            <j-form-item :span="6">
              <el-button type="primary" @click="$refs.selector.search()">查询</el-button>
            </j-form-item>
          </j-form>
        </j-border>
      </template>
    </dialog-table>
  </div>
</template>

<script>
import DialogTable from '@/components/DialogTable'
import request from '@/utils/request'
import StoreCenterSelector from '@/components/Selector/StoreCenterSelector'
import SupplierSelector from '@/components/Selector/SupplierSelector'
import UserSelector from '@/components/Selector/UserSelector'
import moment from 'moment'

export default {
  name: 'PurchaseOrderSelectorWithReceive',
  components: { DialogTable, StoreCenterSelector, SupplierSelector, UserSelector },
  inject: {
    elForm: { default: '' },
    elFormItem: { default: '' }
  },
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
        url: '/purchase/order/query/receive',
        method: 'get',
        params: reqParams
      })
    }
  }
}
</script>

<style lang="scss">
</style>
