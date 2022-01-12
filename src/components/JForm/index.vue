<template>
  <div>
    <div class="item-container">
      <slot />
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
  methods: {

  }
}
</script>
<style>
</style>
