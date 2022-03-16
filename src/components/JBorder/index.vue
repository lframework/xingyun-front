<template>
  <div class="j-border" style="background-color: #FFFFFF;">
    <div v-if="!$utils.isEmpty(title)" :class="'j-border-title j-border-title--default'">{{ title }}</div>
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
<style lang="less">
.j-border {
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 5px;

  .j-border-title {
    margin-left: 20px;
    color: rgba(0,0,0,.85);
    font-weight: 700;
    font-size: 16px;
    line-height: 1.5;
  }

  /*.j-border-title--default {
    font-size: 12px;
    padding: 0 20px;

    transform: translateY(-80%);
  }*/
}
</style>
