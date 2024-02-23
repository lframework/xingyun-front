<template>
  <div :class="className" :style="{ height: height, width: width }"></div>
</template>

<script>
  import { defineComponent } from 'vue';
  import * as echarts from 'echarts';
  import resize from './mixins/resize';

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
        default: '350px',
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
      this.$nextTick(() => {
        this.initChart();
      });
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
          this.chart = echarts.init(this.$el, 'macarons');
          this.setOptions(this.chartData);
        });
      },
      setOptions({ title, xAxisDatas, totalAmountDatas, totalNumDatas } = {}) {
        if (this.chart) {
          this.chart.setOption({
            title: {
              left: 'center',
              text: title || '',
            },
            xAxis: {
              data: [...(xAxisDatas || [])],
              boundaryGap: false,
              axisTick: {
                show: false,
              },
            },
            grid: {
              left: 10,
              right: 10,
              bottom: 20,
              top: 30,
              containLabel: true,
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
              },
              padding: [5, 10],
            },
            yAxis: {
              axisTick: {
                show: false,
              },
            },
            legend: {
              left: 'right',
              data: ['单据总金额', '单据总数量'],
            },
            series: [
              {
                name: '单据总金额',
                itemStyle: {
                  normal: {
                    color: '#FF005A',
                    lineStyle: {
                      color: '#FF005A',
                      width: 2,
                    },
                  },
                },
                smooth: true,
                type: 'line',
                data: totalAmountDatas,
                animationDuration: 2800,
                animationEasing: 'cubicInOut',
              },
              {
                name: '单据总数量',
                smooth: true,
                type: 'line',
                itemStyle: {
                  normal: {
                    color: '#3888fa',
                    lineStyle: {
                      color: '#3888fa',
                      width: 2,
                    },
                    areaStyle: {
                      color: '#f3f8ff',
                    },
                  },
                },
                data: totalNumDatas,
                animationDuration: 2800,
                animationEasing: 'quadraticOut',
              },
            ],
          });
        }
      },
    },
  });
</script>
