<template>
  <div>
    <div class="item-container">
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
  },
  methods: {

  }
}
</script>
<style>
</style>
