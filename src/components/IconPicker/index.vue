<template>
  <vxe-pulldown ref="iconPicker">
    <template #default>
      <div class="icon-picker-input-wrapper" @mouseover="hoverSuffix = true" @mouseout="hoverSuffix = false">
        <a-input :disabled="disabled" :value="value" read-only allow-clear @focus="focusEvent">
          <div slot="prefix">
            <svg-icon v-if="_value" :icon-class="_value" />
          </div>
          <div slot="suffix">
            <a-icon v-if="!$utils.isEmpty(value) && hoverSuffix && !disabled" type="close-circle" theme="filled" style="color: #bbb;" @click="clearValue" />
            <a-icon v-else type="search" style="color: #bbb;" />
          </div>
        </a-input>
      </div>
    </template>
    <template #dropdown>
      <div class="icon-picker-dropdown">
        <div style="padding: 2px 5px;"><a-input v-model="selectData" allow-clear /></div>
        <vxe-list height="200" class="" :data="filterIcons" auto-resize>
          <template #default="{ items }">
            <div v-for="item in items" :key="item.value" class="icon-picker-dropdown-item" @click="selectEvent(item)">
              <svg-icon :icon-class="item.value" /> {{ item.label }}
            </div>
          </template>
        </vxe-list>
      </div>
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
      selectData: '',
      hoverSuffix: false
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
    filterIcons() {
      return this.selectData ? this._icons.filter(item => item.label.indexOf(this.selectData) > -1) : this._icons
    },
    _value() {
      return this._icons.filter(item => item.value === this.value).map(item => item.value)[0] || undefined
    }
  },
  created() {},
  methods: {
    focusEvent() {
      if (this.disabled) {
        return
      }
      this.$refs.iconPicker.showPanel()
    },
    selectEvent(item) {
      this.$refs.iconPicker.hidePanel()

      this.$emit('input', item.value)
    },
    clearValue() {
      this.$emit('input', undefined)
    }
  }
}
</script>

<style lang="less">
.icon-picker-input-wrapper {
  cursor: pointer;
  .ant-input {
    cursor: pointer;
  }
}

.icon-picker-dropdown {
  background-color: #fff;
  box-shadow: 0 0 6px 2px rgba(0, 0, 0, 0.1);
}

.icon-picker-dropdown-item {
  cursor: pointer;
  padding-left: 10px;
}
.icon-picker-dropdown-item:hover {
  background: #e6f7ff;
}
</style>
