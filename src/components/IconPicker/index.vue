<template>
  <a-select :default-value="value" :disabled="disabled" :show-search="true" allow-clear @change="handleChange">
    <a-select-option v-for="item in icons" :key="item" :value="item">
      <svg-icon :icon-class="item" /> {{ item }}
    </a-select-option>
  </a-select>
</template>
<script>

import { icons } from './constants'
export default {
  name: 'IconPicker',
  components: {
  },
  props: {
    value: { type: String, default: '' },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  },
  computed: {
    icons() {
      return icons
    }
  },
  methods: {
    handleChange(e) {
      this.$emit('input', e)
    }
  }
}
</script>

<style lang="less">
</style>
