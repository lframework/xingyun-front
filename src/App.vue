<template>
  <ConfigProvider :locale="getAntdLocale" :theme="isDark ? darkTheme : defaultTheme">
    <AppProvider>
      <RouterView />
    </AppProvider>
  </ConfigProvider>
</template>

<script lang="ts" setup>
  import { ConfigProvider } from 'ant-design-vue';
  import { AppProvider } from '@/components/Application';
  import { useTitle } from '@/hooks/web/useTitle';
  import { useLocale } from '@/locales/useLocale';

  import 'dayjs/locale/zh-cn';
  import { useDarkModeTheme } from '@/hooks/setting/useDarkModeTheme';
  import { useDefaultTheme } from '@/hooks/setting/useDefaultTheme';

  // support Multi-language
  const { getAntdLocale } = useLocale();

  const { isDark, darkTheme } = useDarkModeTheme();
  const { defaultTheme } = useDefaultTheme();

  // Listening to page changes and dynamically changing site titles
  useTitle();
</script>
