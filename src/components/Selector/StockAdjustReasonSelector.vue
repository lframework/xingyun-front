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
      :before-open="beforeOpen"
      :table-column="[
        { field: 'code', title: '编号', width: 120 },
        { field: 'name', title: '名称', minWidth: 160 },
        { field: 'available', title: '状态', width: 80, slots: { default: 'available_default' }}
      ]"
      @input="e => $emit('input', e)"
      @input-label="e => $emit('input-label', e)"
      @input-row="e => $emit('input-row', e)"
      @clear="e => $emit('clear', e)"
    >
      <template v-slot:form>
        <!-- 查询条件 -->
        <j-border>
          <j-form>
            <j-form-item v-if="$utils.isEmpty(requestParams.code)" label="编号">
              <a-input v-model="searchParams.code" />
            </j-form-item>
            <j-form-item v-if="$utils.isEmpty(requestParams.name)" label="名称">
              <a-input v-model="searchParams.name" />
            </j-form-item>
            <j-form-item v-if="$utils.isEmpty(requestParams.available)" label="状态">
              <a-select v-model="searchParams.available" placeholder="全部" allow-clear>
                <a-select-option v-for="item in $enums.AVAILABLE.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
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

export default {
  name: 'StockAdjustReasonSelector',
  components: { DialogTable },
  props: {
    value: { type: [Object, String, Array], required: true },
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
        return {
        }
      }
    },
    multiple: {
      type: Boolean,
      default: false
    },
    showSum: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchParams: { code: '', name: '', available: this.$enums.AVAILABLE.ENABLE.code }
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
      return Object.assign({}, { available: true }, this.searchParams, this.requestParams)
    }
  },
  methods: {
    getList(params) {
      return request({
        url: '/selector/stock/adjust/reason',
        region: 'sc-api',
        method: 'get',
        params: params
      })
    },
    getLoad(ids) {
      return request({
        url: '/selector/stock/adjust/reason/load',
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
