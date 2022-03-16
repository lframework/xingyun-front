<template>
  <div>
    <dialog-table
      ref="selector"
      v-model="model"
      :request="getList"
      :request-params="_requestParams"
      :disabled="disabled"
      :before-open="beforeOpen"
      :dialog-width="'80%'"
      :option="{ label: 'code', value: 'id' }"
      :column-option="{ label: 'code', value: 'id' }"
      :table-column="[
        { field: 'code', title: '单据号', minWidth: 180 },
        { field: 'scCode', title: '仓库编号', minWidth: 100 },
        { field: 'scName', title: '仓库名称', minWidth: 120 },
        { field: 'supplierCode', title: '供应商编号', minWidth: 100 },
        { field: 'supplierName', title: '供应商名称', minWidth: 120 },
        { field: 'createTime', title: '操作时间', minWidth: 150 },
        { field: 'createBy', title: '操作人', minWidth: 100 },
        { field: 'status', title: '审核状态', minWidth: 100, formatter: ({cellValue}) => { return this.$enums.PURCHASE_ORDER_STATUS.getDesc(cellValue) } }
      ]"
      @input="e => $emit('input', e)"
      @clear="e => $emit('clear', e)"
    >
      <template v-slot:form>
        <div>
          <a-form-model>
            <div>
              <a-row>
                <a-col v-if="$utils.isEmpty(requestParams.code)" :md="8" :sm="24">
                  <a-form-model-item
                    label="单据号"
                    :label-col="{span: 4, offset: 1}"
                    :wrapper-col="{span: 18, offset: 1}"
                  >
                    <a-input v-model="searchParams.code" />
                  </a-form-model-item>
                </a-col>
                <a-col v-if="$utils.isEmpty(requestParams.scId)" :md="8" :sm="24">
                  <a-form-model-item
                    label="仓库"
                    :label-col="{span: 4, offset: 1}"
                    :wrapper-col="{span: 18, offset: 1}"
                  >
                    <store-center-selector
                      v-model="searchParams.sc"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col v-if="$utils.isEmpty(requestParams.supplierId)" :md="8" :sm="24">
                  <a-form-model-item
                    label="供应商"
                    :label-col="{span: 4, offset: 1}"
                    :wrapper-col="{span: 18, offset: 1}"
                  >
                    <supplier-selector
                      v-model="searchParams.supplier"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col v-if="$utils.isEmpty(requestParams.createBy)" :md="8" :sm="24">
                  <a-form-model-item
                    label="操作人"
                    :label-col="{span: 4, offset: 1}"
                    :wrapper-col="{span: 18, offset: 1}"
                  >
                    <user-selector
                      v-model="searchParams.createBy"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-model-item
                    label="操作日期"
                    :label-col="{span: 4, offset: 1}"
                    :wrapper-col="{span: 18, offset: 1}"
                  >
                    <div class="date-range-container">
                      <a-date-picker v-model="searchParams.createStartTime" placeholder="" value-format="YYYY-MM-DD 00:00:00" />
                      <span class="date-split">至</span>
                      <a-date-picker
                        v-model="searchParams.createEndTime"
                        placeholder=""
                        value-format="YYYY-MM-DD 23:59:59"
                      />
                    </div>
                  </a-form-model-item>
                </a-col>
                <a-col v-if="$utils.isEmpty(requestParams.status)" :md="8" :sm="24">
                  <a-form-model-item
                    label="状态"
                    :label-col="{span: 4, offset: 1}"
                    :wrapper-col="{span: 18, offset: 1}"
                  >
                    <a-select v-model="searchParams.status" placeholder="全部" allow-clear>
                      <a-select-option v-for="item in $enums.PURCHASE_ORDER_STATUS.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </div>
          </a-form-model>
        </div>
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
  name: 'PurchaseOrderSelector',
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
        createEndTime: this.$utils.formatDateTime(this.$utils.getDateTimeWithMaxTime(moment())),
        status: undefined
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
      return Object.assign({}, this.searchParams, this.requestParams)
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
        createEndTime: params.createEndTime,
        status: params.status
      }
      return request({
        url: '/selector/purchaseorder',
        method: 'get',
        params: reqParams
      })
    }
  }
}
</script>

<style lang="less">
</style>
