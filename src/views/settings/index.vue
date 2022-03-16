<template>
  <a-card>
    <a-tabs default-active-key="securitySetting" tab-position="left" :tab-bar-style="{width: '15%'}">
      <a-tab-pane key="securitySetting" tab="安全设置">
        <security-setting />
      </a-tab-pane>
      <a-tab-pane key="customSetting" tab="个性化">
        <custom-setting />
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>
<script>
import SecuritySetting from './components/SecuritySetting'
import CustomSetting from './components/CustomSetting'

export default {
  // 使用组件
  components: {
    SecuritySetting, CustomSetting
  },

  props: {
  },
  data() {
    return {
      // 是否显示加载框
      loading: false,
      activeName: 'baseSetting'
    }
  },
  created() {
  },
  methods: {
  }
}
</script>
<style scoped>
</style>
