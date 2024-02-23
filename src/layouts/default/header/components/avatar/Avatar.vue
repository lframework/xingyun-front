<template>
  <a-avatar :style="{ backgroundColor: avatarColor }" v-bind="$props">
    {{ getUserInfo.name.substring(0, 1) }}
  </a-avatar>
</template>
<script setup>
  import { computed } from 'vue';
  import { useUserStore } from '/@/store/modules/user';
  import projectSetting from '@/settings/projectSetting';

  const userStore = useUserStore();

  const getUserInfo = computed(() => {
    const { name = '' } = userStore.getUserInfo || {};
    return { name };
  });

  const avatarColor = projectSetting.themeColor;
</script>
