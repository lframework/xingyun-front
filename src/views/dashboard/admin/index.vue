<template>
  <div class="dashboard-editor-container">

    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <a-row class="chart-wrapper">
      <a-col :span="24">
        <line-chart :chart-data="lineChartData" />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart
  },
  data() {
    return {
      lineChartData: {}
    }
  },
  created() {
  },
  methods: {
    handleSetLineChartData(title, type, res) {
      this.lineChartData = {
        totalAmountDatas: [],
        totalNumDatas: [],
        xAxisDatas: []
      }
      if (type === 'today') {
        this.lineChartData = {
          totalAmountDatas: res.map(item => item.totalAmount),
          totalNumDatas: res.map(item => item.totalNum),
          xAxisDatas: res.map(item => item.createHour.substring(item.createHour.length - 2) + '时'),
          title: title
        }
      } else {
        this.lineChartData = {
          totalAmountDatas: res.map(item => item.totalAmount),
          totalNumDatas: res.map(item => item.totalNum),
          xAxisDatas: res.map(item => item.createDate),
          title: title
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.dashboard-editor-container {
  padding: 0 32px 32px 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-top: 32px;
  }
}
</style>
