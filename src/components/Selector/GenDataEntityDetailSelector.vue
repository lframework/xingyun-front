<template>
  <div>
    <a-select v-model="value" mode="multiple" style="width: 100%" @change="e => this.$emit('input', e)">
      <a-select-option v-for="item in selectOptions" :key="item.id" :value="item.id">
        {{ item.name }}
      </a-select-option>
    </a-select>
  </div>
</template>

<script>
import { request } from '@/utils/request'

export default {
  name: 'GenDataEntityDetailSelector',
  components: { },
  props: {
    value: { type: Array, required: true },
    entityId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      selectOptions: []
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
  created() {
    this.loadSelectOptions()
  },
  methods: {
    getList() {
      return request({
        url: '/selector/gen/data/entity/detail',
        region: 'common-api',
        method: 'get',
        params: {
          entityId: this.entityId
        }
      })
    },
    loadSelectOptions() {
      this.selectOptions = []
      if (!this.$utils.isEmpty(this.entityId)) {
        this.getList().then(res => {
          this.selectOptions = res
        })
      }
    }
  }
}
</script>

<style lang="less">
</style>
