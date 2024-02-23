<template>
  <div class="lg:flex">
    <Avatar :size="64" style="font-size: 32px" />
    <div class="md:ml-6 flex flex-col justify-center md:mt-0 mt-2">
      <h1 class="md:text-lg text-md">{{ welcomeMsg(userinfo.name) }}</h1>
      <span class="text-secondary"> 当前时间：{{ curTime }} </span>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
  import Avatar from '@/layouts/default/header/components/avatar/Avatar.vue';
  import { useUserStore } from '/@/store/modules/user';
  import { getCurrentDateTime, formatDateTime, welcomeMsg } from '@/utils/utils';

  const userStore = useUserStore();
  const userinfo = computed(() => userStore.getUserInfo);

  const curTime = ref('');

  let curTimeTimer: NodeJS.Timer | null = null;

  function updateCurTime() {
    curTime.value = formatDateTime(getCurrentDateTime(), 'YYYY年MM月DD日 HH时mm分ss秒');
  }

  onBeforeUnmount(() => {
    if (curTimeTimer) {
      clearInterval(curTimeTimer);
      curTimeTimer = null;
    }
  });
  onMounted(() => {
    if (!curTimeTimer) {
      curTimeTimer = setInterval(updateCurTime, 1000);
    }
  });
</script>
