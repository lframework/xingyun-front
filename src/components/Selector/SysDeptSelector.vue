<template>
  <div>
    <a-tree-select
      v-model="model"
      :show-search="true"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      :replace-fields="{ title: 'name', key: 'id', value: 'id', children: 'children' }"
      :tree-data="options"
      :placeholder="placeholder"
      allow-clear
      :filter-tree-node="filter"
      :disabled="disabled"
      :multiple="multiple"
      style="width: 100%;"
      @change="onChange"
    />
  </div>
</template>

<script>
import { request } from '@/utils/request'
export default {
  name: 'SysDeptSelector',
  components: { },
  props: {
    value: { type: [Object, String, Array], required: true },
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
    placeholder: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options: []
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
      return Object.assign({}, this.requestParams)
    }
  },
  created() {
    this.loadOptions()
  },
  methods: {
    getList(params) {
      return request({
        url: '/selector/dept',
        method: 'get',
        params: params
      })
    },
    loadOptions() {
      this.getList(this._requestParams).then(data => {
        const options = this.$utils.toArrayTree(data, {
          strict: true
        })
        if (this.onlyFinal) {
          this.$utils.eachTree(options, item => {
            if (!this.$utils.isEmpty(item.children)) {
              item.disabled = true
            }
          })
        }

        this.options = options
      })
    },
    onChange(e) {
      if (this.$utils.isEmpty(e)) {
        this.$emit('input', e)
        this.$emit('clear', e)
      } else {
        this.$emit('input', e)
      }
    },
    filter(inputValue, node) {
      return node.data.props.name.indexOf(inputValue) > -1
    }
  }
}
</script>

<style lang="less">
</style>
