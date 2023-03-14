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
      :table-column="[
        { field: 'tableName', title: '表名', minWidth: 160 }
      ]"
      :option="{
        label: 'tableName',
        value: 'id'
      }"
      :column-option="{
        label: 'tableName',
        value: 'tableName'
      }"
      :disabled="disabled"
      :before-open="beforeOpen"
      @input="e => $emit('input', e)"
      @input-label="e => $emit('input-label', e)"
      @input-row="e => $emit('input-row', e)"
      @clear="e => $emit('clear', e)"
    >
      <template v-slot:form>
        <!-- 查询条件 -->
        <div>
          <a-form-model>
            <div>
              <a-row>
                <a-col v-if="$utils.isEmpty(requestParams.name)" :md="8" :sm="24">
                  <a-form-model-item
                    label="表名"
                    :label-col="{span: 4, offset: 1}"
                    :wrapper-col="{span: 18, offset: 1}"
                  >
                    <a-input v-model="searchParams.name" />
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

export default {
  name: 'SimpleDbTableSelector',
  components: { DialogTable },
  props: {
    value: { type: [Object, Array], required: true },
    multiple: { type: Boolean, default: false },
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
    showSum: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchParams: { name: '' }
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
      return Object.assign({}, { }, this.searchParams, this.requestParams)
    }
  },
  methods: {
    getList(params) {
      return request({
        url: '/selector/gen/table',
        region: 'common-api',
        method: 'get',
        params: params
      })
    },
    getLoad(ids) {
      return request({
        url: '/selector/gen/table/load',
        region: 'common-api',
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
