<template>
  <PageWrapper>
    <div class="lg:flex">
      <div class="lg:w-10/10 w-full enter-y">
        <a-alert v-if="isPreview" message="当前为预览版" type="warning" show-icon>
          <template #description>
            <div class="whitespace-pre-wrap">{{ previewDesc }}</div>
          </template>
        </a-alert>
        <panel-group
          @handleSetLineChartData="handleSetLineChartData"
          @loading="(e) => (loading = e)"
          class="enter-y"
        />

        <a-row class="chart-wrapper">
          <a-col :span="24">
            <a-skeleton v-if="loading" active :paragraph="{ rows: 4 }" />
            <line-chart v-else :chart-data="lineChartData" />
          </a-col>
        </a-row>
      </div>
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import PanelGroup from './components/PanelGroup.vue';
  import LineChart from './components/LineChart.vue';
  import { isEmpty } from '@/utils/utils';

  const loading = ref(true);

  setTimeout(() => {
    loading.value = false;
  }, 1500);

  const lineChartData = ref({});

  const handleSetLineChartData = (title, type, res) => {
    lineChartData.value = {
      totalAmountDatas: [],
      totalNumDatas: [],
      xAxisDatas: [],
    };

    if (type === 'today') {
      lineChartData.value = {
        totalAmountDatas: res.map((item) => item.totalAmount),
        totalNumDatas: res.map((item) => item.totalNum),
        xAxisDatas: res.map((item) => item.createHour.substring(item.createHour.length - 2) + '时'),
        title: title,
      };
    } else {
      lineChartData.value = {
        totalAmountDatas: res.map((item) => item.totalAmount),
        totalNumDatas: res.map((item) => item.totalNum),
        xAxisDatas: res.map((item) => item.createDate),
        title: title,
      };
    }
  };

  const isPreview = import.meta.env.VITE_GLOB_APP_IS_PREVIEW;
  let previewDesc = import.meta.env.VITE_GLOB_APP_PREVIEW_DESC;
  if (!isEmpty(previewDesc)) {
    previewDesc = previewDesc.replaceAll('\\n', '\n');
  } else {
    previewDesc = '';
  }

  previewDesc =
    '预览版会包含一些尚未发布的功能，这些功能尚未验证，功能验证周期一般为7天，功能验证完毕后就会发布。\n以下是预览版包含的功能：\n' +
    previewDesc;
</script>
<style lang="less" scoped>
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-top: 32px;
  }
</style>
