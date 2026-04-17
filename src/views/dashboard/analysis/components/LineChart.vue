<template>
  <div :class="className" :style="{ height: height, width: width }"></div>
</template>

<script>
  import { defineComponent } from 'vue';
  import * as echarts from 'echarts';
  import resize from './mixins/resize';
  import { buildLineChartOptions } from './lineChartOptionHelper.mjs';

  export default defineComponent({
    mixins: [resize],
    props: {
      className: {
        type: String,
        default: 'chart',
      },
      width: {
        type: String,
        default: '100%',
      },
      height: {
        type: String,
        default: '420px',
      },
      autoResize: {
        type: Boolean,
        default: true,
      },
      chartData: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        chart: null,
      };
    },
    watch: {
      chartData: {
        deep: true,
        handler(val) {
          this.setOptions(val);
        },
      },
    },
    mounted() {
      this.initChart();
    },
    beforeUnmount() {
      if (!this.chart) {
        return;
      }
      this.chart.dispose();
      this.chart = null;
    },
    methods: {
      initChart() {
        this.$nextTick(() => {
          this.chart = echarts.init(this.$el);
          this.setOptions(this.chartData);
        });
      },
      setOptions(payload) {
        const { xAxisDatas, totalAmountDatas, totalNumDatas } = payload || {};
        const safeXAxis = Array.isArray(xAxisDatas) ? xAxisDatas : [];
        const safeAmount = Array.isArray(totalAmountDatas) ? totalAmountDatas : [];
        const safeNum = Array.isArray(totalNumDatas) ? totalNumDatas : [];

        if (this.chart) {
          this.chart.setOption(
            buildLineChartOptions({
              echarts,
              xAxisDatas: safeXAxis,
              totalAmountDatas: safeAmount,
              totalNumDatas: safeNum,
            }),
          );
        }
      },
    },
  });
</script>
