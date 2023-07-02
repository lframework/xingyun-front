<template>
  <div>
    <dialog-tree
      ref="selector"
      v-model="model"
      :request="getList"
      :load="getLoad"
      :show-sum="showSum"
      :only-final="onlyFinal"
      :disabled="disabled"
      :before-open="beforeOpen"
      :multiple="multiple"
      :table-column="[
        { field: 'code', title: '编号', width: 100 },
        { field: 'name', title: '名称', minWidth: 160, treeNode: true }
      ]"
      :placeholder="placeholder"
      :handle-search="handleSearch"
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
          </j-form>
        </j-border>
      </template>
      <!-- 工具栏 -->
      <template v-slot:toolbar_buttons>
        <a-space class="operator">
          <a-button type="primary" icon="search" @click="$refs.selector.search()">查询</a-button>
        </a-space>
      </template>
    </dialog-tree>
  </div>
</template>

<script>
import DialogTree from '@/components/DialogTree'
import { request } from '@/utils/request'

export default {
  name: 'GenCustomPageCategorySelector',
  components: { DialogTree },
  props: {
    value: { type: [Object, Array], required: true },
    placeholder: { type: String, default: '' },
    requestParams: {
      type: Object,
      default: e => {
        return {}
      }
    },
    onlyFinal: {
      type: Boolean,
      default: true
    },
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
    multiple: { type: Boolean, default: false },
    showSum: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchParams: { code: '', name: '' }
    }
  },
  computed: {
    model: {
      get() {
        return this.value
      },
      set() {}
    }
  },
  methods: {
    getList(params) {
      return request({
        url: '/selector/gen/custom/page/category',
        region: 'cloud-api',
        method: 'get',
        params: params
      })
    },
    getLoad(ids) {
      return request({
        url: '/selector/gen/custom/page/category/load',
        region: 'cloud-api',
        method: 'post',
        dataType: 'json',
        data: ids
      })
    },
    handleSearch(datas) {
      const filterCode = this.$utils.toString(this.searchParams.code).trim()
      const filterName = this.$utils.toString(this.searchParams.name).trim()
      const isFilterCode = !this.$utils.isEmpty(filterCode)
      const isFilterName = !this.$utils.isEmpty(filterName)
      if (isFilterCode || isFilterName) {
        const options = { key: 'id', parentKey: 'parentId', children: 'children', strict: true }
        const tableData = this.$utils.searchTree(datas, item => {
          let filterResult = true

          if (isFilterCode) {
            filterResult &= this.$utils.isEqualWithStr(this.$utils.toString(item['code']), filterName)
          }

          if (isFilterName) {
            filterResult &= this.$utils.toString(item['name']).indexOf(filterName) > -1
          }

          return filterResult
        }, options)

        return tableData
      } else {
        return datas
      }
    }
  }
}
</script>

<style lang="less">
</style>
