<template>
  <vxe-pulldown ref="iconPicker">
    <template #default>
      <div class="icon-picker-input-wrapper">
        <a-input :value="value" read-only @focus="focusEvent">
          <a-icon slot="suffix" type="search" />
        </a-input>
      </div>
    </template>
    <template #dropdown>
      <vxe-list height="200" class="icon-picker-dropdown" :data="list2" auto-resize>
        <template #default="{ items }">
          <a-input v-model="selectData" allow-clear />
          <div style="cursor: pointer;" v-for="item in items" :key="item.value" class="list-item2" @click="selectEvent2(item)">
            <svg-icon :icon-class="item.value" /> {{ item.label }}
          </div>
        </template>
      </vxe-list>
    </template>
  </vxe-pulldown>
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
      selectData: ''
    }
  },
  computed: {
    _icons() {
      return icons.map(item => {
        return {
          label: item,
          value: item
        }
      })
    },
    list2() {
      return this.selectData ? this._icons.filter(item => item.label.indexOf(this.selectData) > -1) : this._icons
    }
  },
  created() {
    this.list2 = this._icons
  },
  methods: {
    focusEvent() {
      this.$refs.iconPicker.showPanel()
    },
    selectEvent2(item) {
      this.$refs.iconPicker.hidePanel().then(() => {
        this.list2 = this._icons
      })

      console.log(item.value)
      this.$emit('input', item.value)
    }
  }
}
</script>

<style lang="less">
.icon-picker-input-wrapper {
  cursor: pointer !important;
  .ant-input {
    cursor: pointer !important;
  }
}

.icon-picker-dropdown {
  background-color: #000;
}
</style>
