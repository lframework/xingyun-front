<template>
  <div>
    <dialog-table
      ref="selector"
      v-model="model"
      :request="getList"
      :request-params="_requestParams"
      :disabled="disabled"
      :before-open="beforeOpen"
      @input="e => $emit('input', e)"
      @clear="e => $emit('clear', e)"
    >
      <template v-slot:form>j
        <j-border>
          <j-form>
            <j-form-item v-if="$utils.isEmpty(requestParams.code)" label="编号">
              <el-input v-model="searchParams.code" clearable />
            </j-form-item>
            <j-form-item v-if="$utils.isEmpty(requestParams.name)" label="名称">
              <el-input v-model="searchParams.name" clearable />
            </j-form-item>
            <j-form-item v-if="$utils.isEmpty(requestParams.available)" label="状态">
              <el-select v-model="searchParams.available" placeholder="全部" clearable>
                <el-option v-for="item in $enums.AVAILABLE.values()" :key="item.code" :label="item.desc" :value="item.code" />
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

export default {
  name: 'ProductSalePropGroupSelector',
  components: { DialogTable },
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
      return Object.assign({}, this.searchParams, { available: true }, this.requestParams)
    }
  },
  methods: {
    getList(params) {
      return request({
        url: '/selector/salepropgroup',
        method: 'get',
        params: params
      })
    }
  }
}
</script>

<style lang="scss">
</style>
