<template>
  <div>
    <div class="item-container">
      <slot />
    </div>
    <div v-if="showCollapse" class="item-footer">
      <el-link v-if="collapseStatus" icon="el-icon-arrow-up" :class="'item-footer--' + $globalSize" type="info" :underline="false" @click="collapse">收起</el-link>
      <el-link v-else icon="el-icon-arrow-down" type="info" :class="'item-footer--' + $globalSize" :underline="false" @click="expand">展开</el-link>
    </div>
  </div>
</template>
<script>
export default {
  name: 'JForm',

  componentName: 'JForm',

  props: {
    /**
     * 文字标签宽度
     */
    labelWidth: {
      type: String,
      default: '100px'
    }
  },
  data() {
    return {
      items: [],
      collapseStatus: true
    }
  },
  computed: {
    showCollapse() {
      let totalSpan = 0
      for (let i = 0; i < this.items.length; i++) {
        const item = this.items[i]
        totalSpan += item.span
        if (totalSpan > 24) {
          return true
        }
      }

      return false
    }
  },
  methods: {
    addItem(item) {
      this.items.push(item)
    },
    collapse() {
      let totalSpan = 0
      for (let i = 0; i < this.items.length; i++) {
        const item = this.items[i]
        totalSpan += item.span
        if (totalSpan > 24) {
          item.setVisible(false)
        }
      }
      this.collapseStatus = !this.collapseStatus
      this.$emit('collapse')
    },
    expand() {
      let totalSpan = 0
      for (let i = 0; i < this.items.length; i++) {
        const item = this.items[i]
        totalSpan += item.span
        if (totalSpan > 24) {
          item.setVisible(true)
        }
      }
      this.collapseStatus = !this.collapseStatus
    }
  }
}
</script>
<style lang="scss">
.item-footer {
  .item-footer--default{
    font-size: 14px;
  }
  .item-footer--medium{
    font-size: 14px;
  }
  .item-footer--small{
    font-size: 13px;
  }
  .item-footer--mini{
    font-size: 12px;
  }
}

</style>
