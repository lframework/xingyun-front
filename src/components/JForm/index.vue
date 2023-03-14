<template>
  <div>
    <div class="item-container">
      <slot />
    </div>
    <div v-if="enableCollapse">
      <div v-if="showCollapse" class="item-footer">
        <a v-if="collapseStatus" :class="'item-footer--default'" type="info" @click="collapse">收起<a-icon type="up" /></a>
        <a v-else type="info" :class="'item-footer--default'" @click="expand">展开<a-icon type="down" /></a>
      </div>
    </div>
  </div>
</template>
<script>
import Schema from 'async-validator'
export default {
  name: 'JForm',

  componentName: 'JForm',

  props: {
    model: {
      type: Object,
      default: undefined
    },
    rules: {
      type: Object,
      default: undefined
    },
    /**
     * 文字标签宽度
     */
    labelWidth: {
      type: String,
      default: '100px'
    },
    enableCollapse: {
      type: Boolean,
      default: true
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
        if (!item.itemShow) {
          continue
        }
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
        if (!item.itemShow) {
          continue
        }
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
        if (!item.itemShow) {
          continue
        }
        totalSpan += item.span
        if (totalSpan > 24) {
          item.setVisible(true)
        }
      }
      this.collapseStatus = !this.collapseStatus
    },
    validate() {
      const that = this
      return new Promise((resolve, reject) => {
        if (!that.model || !that.rules) {
          resolve(true)
        } else {
          const validator = new Schema(that.rules)
          validator.validate(that.model, {
            suppressWarning: true,
            first: true,
            firstFields: true
          }).then(() => {
            resolve(true)
          }).catch(({ errors, fields }) => {
            that.$msg.error(errors[0].message)
            resolve(false, errors, fields)
          })
        }
      })
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
