<template>
  <div>
    <dialog-table
      ref="selector"
      v-model="model"
      :request="getList"
      :request-params="_requestParams"
      :multiple="multiple"
      :disabled="disabled"
      :option="{
        label: 'code', value: 'id'
      }"
      :column-option="{
        label: 'code', value: 'id'
      }"
      :table-column="[
        { field: 'code', title: '业务单据号', width: 180 },
        { field: 'scCode', title: '仓库编号', width: 100 },
        { field: 'scName', title: '仓库名称', width: 120 },
        { field: 'takeStatus', title: '盘点状态', width: 120, formatter: ({ cellValue }) => { return this.$enums.PRE_TAKE_STOCK_SHEET_STATUS.getDesc(cellValue) } },
        { field: 'updateTime', title: '操作时间', width: 170 }
      ]"
      :before-open="beforeOpen"
      @input="e => $emit('input', e)"
      @clear="e => $emit('clear', e)"
    >
      <template v-slot:form>
        <j-border>
          <j-form>
            <j-form-item v-if="$utils.isEmpty(requestParams.code)" label="业务单据号">
              <el-input v-model="searchParams.code" clearable />
            </j-form-item>
            <j-form-item label="操作日期" :span="12" :content-nest="false">
              <el-date-picker
                v-model="searchParams.updateTimeStart"
                type="date"
                value-format="yyyy-MM-dd 00:00:00"
              />
              <span class="date-split">至</span>
              <el-date-picker
                v-model="searchParams.updateTimeEnd"
                type="date"
                value-format="yyyy-MM-dd 23:59:59"
              />
            </j-form-item>
            <j-form-item v-if="$utils.isEmpty(requestParams.scId)" label="仓库">
              <store-center-selector
                v-model="searchParams.sc"
              />
            </j-form-item>
            <j-form-item v-if="$utils.isEmpty(requestParams.takeStatus)" label="盘点状态">
              <el-select v-model="searchParams.takeStatus" placeholder="全部" clearable>
                <el-option v-for="item in $enums.PRE_TAKE_STOCK_SHEET_STATUS.values()" :key="item.code" :label="item.desc" :value="item.code" />
              </el-select>
            </j-form-item>
          </j-form>
        </j-border>
      </template>
      <!-- 工具栏 -->
      <template v-slot:toolbar_buttons>
        <el-form :inline="true">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="$refs.selector.search()">搜索</el-button>
          </el-form-item>
        </el-form>
      </template>
    </dialog-table>
  </div>
</template>

<script>
import DialogTable from '@/components/DialogTable'
import request from '@/utils/request'
import StoreCenterSelector from '@/components/Selector/StoreCenterSelector'
import moment from 'moment'

export default {
  name: 'TakeStockPlanSelector',
  components: { DialogTable, StoreCenterSelector },
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
    },
    multiple: { type: Boolean, default: false }
  },
  data() {
    return {
      searchParams: {
        code: '',
        sc: {},
        takeStatus: '',
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
      if (!this.$utils.isEmpty(params.sc)) {
        params.scId = params.sc.id
      }
      delete params.sc

      return params
    }
  },
  methods: {
    getList(params) {
      return request({
        url: '/selector/takestock/pre',
        method: 'get',
        params: params
      })
    }
  }
}
</script>

<style lang="scss">
</style>
