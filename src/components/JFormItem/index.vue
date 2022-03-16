<template>
  <div v-show="visible" :class="'item item--default'" :style="{width: itemWidth}">
    <span :class="'label label--default'" :style="{width: form.labelWidth, minWidth: form.labelWidth}"><span v-if="required" class="required" />{{ autoHiddenLabel && !$slots.default ? '' : (colon ? label + '：' : label) }}</span>
    <div v-if="contentNest" class="content" :style="{width: contentWidth}">
      <slot />
    </div>
    <slot v-else />
  </div>
</template>
<script>
export default {
  name: 'JFormItem',

  componentName: 'JFormItem',

  props: {
    /**
     * 文字标签内容
     */
    label: {
      type: String,
      default: ''
    },
    /**
     * 内容是否用div包裹
     */
    contentNest: {
      type: Boolean,
      default: true
    },
    /**
     * 内容宽度
     */
    contentWidth: {
      type: String,
      default: '60%'
    },
    /**
     * 占位列数
     */
    span: {
      type: Number,
      default: 8
    },
    /**
     * 当内容为空时， 是否自动隐藏文字标签
     */
    autoHiddenLabel: {
      type: Boolean,
      default: true
    },
    /**
     * 是否必填
     */
    required: {
      type: Boolean,
      default: false
    },
    /**
     * 是否显示冒号
     */
    colon: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      visible: true
    }
  },
  computed: {
    form() {
      let parent = this.$parent
      let parentName = parent.$options.componentName
      while (parentName !== 'JForm') {
        parent = parent.$parent
        parentName = parent.$options.componentName
      }
      return parent
    },
    itemWidth() {
      const span = Math.max(1, Math.min(this.span, 24))

      return (span / 24 * 100) + '%'
    }
  },
  mounted() {
    if (!this.$utils.isEmpty(this.form)) {
      this.form.addItem(this)
    }
  },
  methods: {
    setVisible(v) {
      this.visible = v
    }
  }
}
</script>
<style lang="less">
.item-container {

  .item--default {
    line-height: 46px;
    font-size: 14px;

    .label--default {

      padding: 0 12px 0 0;
    }
  }
}
</style>
