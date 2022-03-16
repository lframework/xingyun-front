<template>
  <div>
    <div class="item-container">
      <slot />
    </div>
    <div v-if="showCollapse" class="item-footer">
      <a v-if="collapseStatus" :class="'item-footer--default'" type="info" @click="collapse">收起<a-icon type="up" /></a>
      <a v-else type="info" :class="'item-footer--default'" @click="expand">展开<a-icon type="down" /></a>
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
<style lang="less">
.item-footer {
  .item-footer--default{
    font-size: 14px;
  }
}

</style>
