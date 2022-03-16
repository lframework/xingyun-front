<template>
  <div>
    <dialog-table
      ref="selector"
      v-model="model"
      :request="getList"
      :request-params="_requestParams"
      :disabled="disabled"
      :before-open="beforeOpen"
      :table-column="[
        { field: 'code', title: '编号', width: 120 },
        { field: 'name', title: '姓名', minWidth: 160 },
        { field: 'available', title: '状态', width: 80, slots: { default: 'available_default' }}
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
                    label="编号"
                    :label-col="{span: 4, offset: 1}"
                    :wrapper-col="{span: 18, offset: 1}"
                  >
                    <a-input v-model="searchParams.code" />
                  </a-form-model-item>
                </a-col>
                <a-col v-if="$utils.isEmpty(requestParams.name)" :md="8" :sm="24">
                  <a-form-model-item
                    label="姓名"
                    :label-col="{span: 4, offset: 1}"
                    :wrapper-col="{span: 18, offset: 1}"
                  >
                    <a-input v-model="searchParams.name" />
                  </a-form-model-item>
                </a-col>
                <a-col v-if="$utils.isEmpty(requestParams.available)" :md="8" :sm="24">
                  <a-form-model-item
                    label="状态"
                    :label-col="{span: 4, offset: 1}"
                    :wrapper-col="{span: 18, offset: 1}"
                  >
                    <a-select v-model="searchParams.available" placeholder="全部" allow-clear>
                      <a-select-option v-for="item in $enums.AVAILABLE.values()" :key="item.code" :value="item.code">{{ item.desc }}</a-select-option>
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

export default {
  name: 'UserSelector',
  components: { DialogTable },
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
        url: '/selector/user',
        method: 'get',
        params: params
      })
    }
  }
}
</script>

<style lang="less">
</style>
