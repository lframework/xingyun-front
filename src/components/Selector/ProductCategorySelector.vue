<template>
  <div>
    <dialog-tree
      ref="selector"
      v-model="model"
      :request="getList"
      :only-final="onlyFinal"
      :disabled="disabled"
      :before-open="beforeOpen"
      :multiple="multiple"
      condition-label="名称"
      :handle-search="handleSearch"
      @input="e => $emit('input', e)"
      @clear="e => $emit('clear', e)"
    >
      <template v-slot:form>
        <j-border>
          <j-form>
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
    </dialog-tree>
  </div>
</template>

<script>
import DialogTree from '@/components/DialogTree'
import request from '@/utils/request'

export default {
  name: 'ProductCategorySelector',
  components: { DialogTree },
  inject: {
    elForm: { default: '' },
    elFormItem: { default: '' }
  },
  props: {
    value: { type: [Object, Array], required: true },
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
    multiple: { type: Boolean, default: false }
  },
  data() {
    return {
      searchParams: { name: '', available: this.$enums.AVAILABLE.ENABLE.code }
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
        url: '/selector/category',
        method: 'get',
        params: params
      })
    },
    handleSearch(datas) {
      const filterName = this.$utils.toString(this.searchParams.name).trim()
      const isFilterName = !this.$utils.isEmpty(filterName)
      const filterAvailable = this.$utils.toString(this.searchParams.available).trim()
      const isFilterAvailable = !this.$utils.isEmpty(this.searchParams.available)
      if (isFilterName || isFilterAvailable) {
        const options = { key: 'id', parentKey: 'parentId', children: 'children' }
        const tableData = this.$utils.searchTree(datas, item => {
          let filterResult = true

          if (isFilterName) {
            filterResult &= this.$utils.toString(item['name']).indexOf(filterName) > -1
          }

          if (isFilterAvailable) {
            filterResult &= this.$utils.toString(item['available']).indexOf(filterAvailable) > -1 && this.$utils.isEmpty(item['children'])
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

<style lang="scss">
</style>
