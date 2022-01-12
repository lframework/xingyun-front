<template>
  <div class="j-border" style="background-color: #F2F6FC;">
    <div v-if="!$utils.isEmpty(title)" :class="'j-border-title j-border-title--' + $globalSize">{{ title }}</div>
    <slot />
  </div>
</template>
<script>
export default {
  name: 'JBorder',

  componentName: 'JBorder',

  props: {
    title: {
      type: String,
      default: ''
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
<style lang="scss">
.j-border {
  border: 1px solid #eee;
  border-radius: 4px;
  margin: 8px;
  padding: 5px;

  .j-border-title {
    position: absolute;
    font-weight: 500;
    color: #909399;
  }

  .j-border-title--default {
    font-size: 12px;
    padding: 0 20px;

    transform: translateY(-95%);
  }

  .j-border-title--medium {
    font-size: 12px;
    padding: 0 20px;

    transform: translateY(-95%);
  }

  .j-border-title--small {
    font-size: 12px;
    padding: 0 18px;

    transform: translateY(-95%);
  }

  .j-border-title--mini {
    font-size: 12px;
    padding: 0 16px;

    transform: translateY(-95%);
  }
}
</style>
