<template>
  <div>
    <div class="item-container" :class="a">
      <slot ref="children" />
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
    }
  },
  computed: {
    a() {
      let children = this.$slots.default
      if (!this.$utils.isEmpty(children)) {
        for (let i = 0; i < children.length; i++) {
          const child = children[i]
          console.log(child)
        }
      }

      return children
    }
  },
  methods: {

  }
}
</script>
<style>
</style>
