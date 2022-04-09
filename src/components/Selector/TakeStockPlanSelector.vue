<template>
  <div>
    <dialog-table
      ref="selector"
      v-model="model"
      :request="getList"
      :request-params="_requestParams"
      :multiple="multiple"
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
        { field: 'takeType', title: '盘点类别', width: 100, formatter: ({ cellValue }) => { return this.$enums.TAKE_STOCK_PLAN_TYPE.getDesc(cellValue) } },
        { field: 'takeStatus', title: '盘点状态', width: 120, formatter: ({ cellValue }) => { return this.$enums.TAKE_STOCK_PLAN_STATUS.getDesc(cellValue) } },
        { field: 'createTime', title: '创建时间', width: 170 },
        { field: 'updateTime', title: '操作时间', width: 170 }
      ]"
      :before-open="beforeOpen"
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
                <a-col v-if="$utils.isEmpty(requestParams.takeType)" :md="8" :sm="24">
                  <a-form-model-item
                    label="盘点类别"
                    :label-col="{span: 4, offset: 1}"
                    :wrapper-col="{span: 18, offset: 1}"
                  >
                    <a-select v-model="searchParams.takeType" placeholder="全部" allow-clear>
                      <a-select-option v-for="item in $enums.TAKE_STOCK_PLAN_TYPE.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col v-if="$utils.isEmpty(requestParams.takeStatus) && !requestParams.taking" :md="8" :sm="24">
                  <a-form-model-item
                    label="盘点状态"
                    :label-col="{span: 4, offset: 1}"
                    :wrapper-col="{span: 18, offset: 1}"
                  >
                    <a-select v-model="searchParams.takeStatus" placeholder="全部" allow-clear>
                      <a-select-option v-for="item in $enums.TAKE_STOCK_PLAN_STATUS.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-model-item
                    label="创建日期"
                    :label-col="{span: 4, offset: 1}"
                    :wrapper-col="{span: 18, offset: 1}"
                  >
                    <div class="date-range-container">
                      <a-date-picker v-model="searchParams.createTimeStart" placeholder="" value-format="YYYY-MM-DD 00:00:00" />
                      <span class="date-split">至</span>
                      <a-date-picker
                        v-model="searchParams.createTimeEnd"
                        placeholder=""
                        value-format="YYYY-MM-DD 23:59:59"
                      />
                    </div>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </div>
          </a-form-model>
        </div>
      </template>
      <!-- 工具栏 -->
      <template v-slot:toolbar_buttons>
        <a-space>
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
        takeType: undefined,
        takeStatus: undefined,
        taking: '',
        createTimeStart: this.$utils.formatDateTime(this.$utils.getDateTimeWithMinTime(moment().subtract(1, 'M'))),
        createTimeEnd: this.$utils.formatDateTime(this.$utils.getDateTimeWithMaxTime(moment()))
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
        url: '/selector/takestock/plan',
        method: 'get',
        params: params
      })
    }
  }
}
</script>

<style lang="less">
</style>
