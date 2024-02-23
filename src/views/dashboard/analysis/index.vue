<template>
  <PageWrapper>
    <div class="lg:flex">
      <div class="lg:w-10/10 w-full enter-y">
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
</script>
<style lang="less" scoped>
.chart-wrapper {
  background: #fff;
  padding: 16px 16px 0;
  margin-top: 32px;
}
</style>
