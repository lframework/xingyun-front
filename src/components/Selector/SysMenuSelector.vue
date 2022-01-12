<template>
  <div>
    <el-cascader
      v-model="model"
      :options="options"
      :props="props"
      :placeholder="placeholder"
      filterable
      clearable
      :disabled="disabled"
      @change="onChange"
    />
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  name: 'SysMenuSelector',
  components: { },
  inject: {
    elForm: { default: '' },
    elFormItem: { default: '' }
  },
  props: {
    value: { type: [Object, String], required: true },
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
    }
  },
  data() {
    return {
      options: [],
      // 父级菜单控件配置
      props: {
        emitPath: false,
        // 子集菜单展开方式
        expandTrigger: 'hover',
        // 允许选择任意一级
        checkStrictly: !this.onlyFinal,
        value: 'id',
        label: 'title'
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
      return Object.assign({}, this.requestParams)
    }
  },
  created() {
    this.loadOptions()
  },
  methods: {
    getList(params) {
      return request({
        url: '/selector/menu',
        method: 'get',
        params: params
      })
    },
    loadOptions() {
      this.getList(this._requestParams).then(data => {
        this.options = this.$utils.toArrayTree(data, {
          strict: true
        })
      })
    },
    onChange(e) {
      if (this.$utils.isEmpty(e)) {
        this.$emit('input', e)
        this.$emit('clear', e)
      } else {
        this.$emit('input', e)
      }
    }
  }
}
</script>

<style lang="scss">
</style>
