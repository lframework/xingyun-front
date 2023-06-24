<template>
  <component :is="componentName" v-on="$listeners" />
</template>
<script>
import Vue from 'vue'

export default {
  name: 'CustomPage',
  components: {
  },
  props: {
    pageId: {
      type: String || Number,
      required: true
    }
  },
  data() {
    return {
      componentName: 'div'
    }
  },
  computed: {
  },
  watch: {
    pageId(val) {
      this.initConfig()
    }
  },
  mounted() {
    this.initConfig()
  },
  created() {
    this.openForm()
  },
  methods: {
    // 打开表单 由父页面触发
    openForm() {
      this.dialogVisible = true

      this.$nextTick(() => this.open())
    },
    open() {
      this.initConfig()

      // 初始化表单数据
      this.initFormData()
    },
    async initConfig() {
      if (this.$utils.isEmpty(this.pageId)) {
        return
      }
      await this.$api.development.gen.getCustomPageConfig(this.pageId).then(res => {
        const componentName = 'CustomPage_' + res.id
        Vue.component(componentName, new Function(res.componentConfig).call())
        this.componentName = componentName
      })
    },
    initFormData() {

    }
  }
}
</script>
<style lang="less">
</style>
