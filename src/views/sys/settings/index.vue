<template>
  <page-wrapper content-full-height fixed-height>
    <a-card>
      <a-tabs default-active-key="securitySetting" tab-position="left">
        <a-tab-pane key="securitySetting" tab="安全设置">
          <security-setting />
        </a-tab-pane>
        <a-tab-pane key="customSetting" tab="个性化">
          <custom-setting />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </page-wrapper>
</template>
<script>
  import { defineComponent } from 'vue';
  import SecuritySetting from './components/SecuritySetting/index.vue';
  import CustomSetting from './components/CustomSetting/index.vue';

  export default defineComponent({
    // 使用组件
    components: {
      SecuritySetting,
      CustomSetting,
    },

    props: {},
    data() {
      return {
        // 是否显示加载框
        loading: false,
        activeName: 'baseSetting',
      };
    },
    created() {},
    methods: {},
  });
</script>
<style scoped></style>
