<template>
  <page-wrapper content-full-height fixed-height>
    <a-card class="online-code-placeholder" :bordered="false">
      <a-result
        status="info"
        title="在线开发已下线"
        sub-title="原 magic-api 在线开发能力已移除，后续如有替代方案，将在此入口承接。"
      >
      </a-result>
    </a-card>
  </page-wrapper>
</template>

<script>
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'SystemOnlineCodePlaceholder',
  });
</script>

<style lang="less" scoped>
  .online-code-placeholder {
    min-height: 100%;
    border-radius: 10px;
  }
</style>
