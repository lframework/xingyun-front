<template>
  <div>
    <el-row :gutter="40" class="panel-group">
      <!-- 本日数据 -->
      <el-col :span="4" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('今日采购订单', 'today', $enums.ORDER_CHART_BIZ_TYPE.PURCHASE_ORDER.code)">
          <div class="card-panel-description">
            <div class="card-panel-text">
              今日采购订单
            </div>
            <el-row>
              <el-col :span="24">
                <span class="card-panel-num-title">数量：</span><count-to :start-val="0" :end-val="formData.todayPurchaseOrder.totalNum" :duration="2600" class="card-panel-num" />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <span class="card-panel-num-title">金额：</span><count-to :start-val="0" :end-val="formData.todayPurchaseOrder.totalAmount" :duration="2600" class="card-panel-num" />
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="4" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('今日销售订单', 'today', $enums.ORDER_CHART_BIZ_TYPE.SALE_ORDER.code)">
          <div class="card-panel-description">
            <div class="card-panel-text">
              今日销售订单
            </div>
            <el-row>
              <el-col :span="24">
                <span class="card-panel-num-title">数量：</span><count-to :start-val="0" :end-val="formData.todaySaleOrder.totalNum" :duration="2600" class="card-panel-num" />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <span class="card-panel-num-title">金额：</span><count-to :start-val="0" :end-val="formData.todaySaleOrder.totalAmount" :duration="2600" class="card-panel-num" />
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="4" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('今日零售出库单', 'today', $enums.ORDER_CHART_BIZ_TYPE.RETAIL_OUT_SHEET.code)">
          <div class="card-panel-description">
            <div class="card-panel-text">
              今日零售出库单
            </div>
            <el-row>
              <el-col :span="24">
                <span class="card-panel-num-title">数量：</span><count-to :start-val="0" :end-val="formData.todayRetailOutSheet.totalNum" :duration="2600" class="card-panel-num" />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <span class="card-panel-num-title">金额：</span><count-to :start-val="0" :end-val="formData.todayRetailOutSheet.totalAmount" :duration="2600" class="card-panel-num" />
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="4" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('今日采购退单', 'today', $enums.ORDER_CHART_BIZ_TYPE.PURCHASE_RETURN.code)">
          <div class="card-panel-description">
            <div class="card-panel-text">
              今日采购退单
            </div>
            <el-row>
              <el-col :span="24">
                <span class="card-panel-num-title">数量：</span><count-to :start-val="0" :end-val="formData.todayPurchaseReturn.totalNum" :duration="2600" class="card-panel-num" />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <span class="card-panel-num-title">金额：</span><count-to :start-val="0" :end-val="formData.todayPurchaseReturn.totalAmount" :duration="2600" class="card-panel-num" />
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="4" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('今日销售退单', 'today', $enums.ORDER_CHART_BIZ_TYPE.SALE_RETURN.code)">
          <div class="card-panel-description">
            <div class="card-panel-text">
              今日销售退单
            </div>
            <el-row>
              <el-col :span="24">
                <span class="card-panel-num-title">数量：</span><count-to :start-val="0" :end-val="formData.todaySaleReturn.totalNum" :duration="2600" class="card-panel-num" />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <span class="card-panel-num-title">金额：</span><count-to :start-val="0" :end-val="formData.todaySaleReturn.totalAmount" :duration="2600" class="card-panel-num" />
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="4" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('今日零售退单', 'today', $enums.ORDER_CHART_BIZ_TYPE.RETAIL_RETURN.code)">
          <div class="card-panel-description">
            <div class="card-panel-text">
              今日零售退单
            </div>
            <el-row>
              <el-col :span="24">
                <span class="card-panel-num-title">数量：</span><count-to :start-val="0" :end-val="formData.todayRetailReturn.totalNum" :duration="2600" class="card-panel-num" />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <span class="card-panel-num-title">金额：</span><count-to :start-val="0" :end-val="formData.todayRetailReturn.totalAmount" :duration="2600" class="card-panel-num" />
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <!-- 当月数据 -->
      <el-col :span="4" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('本月采购订单', 'sameMonth', $enums.ORDER_CHART_BIZ_TYPE.PURCHASE_ORDER.code)">
          <div class="card-panel-description">
            <div class="card-panel-text">
              本月采购订单
            </div>
            <el-row>
              <el-col :span="24">
                <span class="card-panel-num-title">数量：</span><count-to :start-val="0" :end-val="formData.sameMonthPurchaseOrder.totalNum" :duration="2600" class="card-panel-num" />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <span class="card-panel-num-title">金额：</span><count-to :start-val="0" :end-val="formData.sameMonthPurchaseOrder.totalAmount" :duration="2600" class="card-panel-num" />
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="4" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('本月销售订单', 'sameMonth', $enums.ORDER_CHART_BIZ_TYPE.SALE_ORDER.code)">
          <div class="card-panel-description">
            <div class="card-panel-text">
              本月销售订单
            </div>
            <el-row>
              <el-col :span="24">
                <span class="card-panel-num-title">数量：</span><count-to :start-val="0" :end-val="formData.sameMonthSaleOrder.totalNum" :duration="2600" class="card-panel-num" />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <span class="card-panel-num-title">金额：</span><count-to :start-val="0" :end-val="formData.sameMonthSaleOrder.totalAmount" :duration="2600" class="card-panel-num" />
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="4" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('本月零售出库单', 'sameMonth', $enums.ORDER_CHART_BIZ_TYPE.RETAIL_OUT_SHEET.code)">
          <div class="card-panel-description">
            <div class="card-panel-text">
              本月零售出库单
            </div>
            <el-row>
              <el-col :span="24">
                <span class="card-panel-num-title">数量：</span><count-to :start-val="0" :end-val="formData.sameMonthRetailOutSheet.totalNum" :duration="2600" class="card-panel-num" />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <span class="card-panel-num-title">金额：</span><count-to :start-val="0" :end-val="formData.sameMonthRetailOutSheet.totalAmount" :duration="2600" class="card-panel-num" />
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="4" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('本月采购退单', 'sameMonth', $enums.ORDER_CHART_BIZ_TYPE.PURCHASE_RETURN.code)">
          <div class="card-panel-description">
            <div class="card-panel-text">
              本月采购退单
            </div>
            <el-row>
              <el-col :span="24">
                <span class="card-panel-num-title">数量：</span><count-to :start-val="0" :end-val="formData.sameMonthPurchaseReturn.totalNum" :duration="2600" class="card-panel-num" />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <span class="card-panel-num-title">金额：</span><count-to :start-val="0" :end-val="formData.sameMonthPurchaseReturn.totalAmount" :duration="2600" class="card-panel-num" />
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="4" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('本月销售退单', 'sameMonth', $enums.ORDER_CHART_BIZ_TYPE.SALE_RETURN.code)">
          <div class="card-panel-description">
            <div class="card-panel-text">
              本月销售退单
            </div>
            <el-row>
              <el-col :span="24">
                <span class="card-panel-num-title">数量：</span><count-to :start-val="0" :end-val="formData.sameMonthSaleReturn.totalNum" :duration="2600" class="card-panel-num" />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <span class="card-panel-num-title">金额：</span><count-to :start-val="0" :end-val="formData.sameMonthSaleReturn.totalAmount" :duration="2600" class="card-panel-num" />
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="4" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('本月零售退单', 'sameMonth', $enums.ORDER_CHART_BIZ_TYPE.RETAIL_RETURN.code)">
          <div class="card-panel-description">
            <div class="card-panel-text">
              本月零售退单
            </div>
            <el-row>
              <el-col :span="24">
                <span class="card-panel-num-title">数量：</span><count-to :start-val="0" :end-val="formData.sameMonthRetailReturn.totalNum" :duration="2600" class="card-panel-num" />
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <span class="card-panel-num-title">金额：</span><count-to :start-val="0" :end-val="formData.sameMonthRetailReturn.totalAmount" :duration="2600" class="card-panel-num" />
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  data() {
    return {
      formData: {
        todayPurchaseOrder: {
          totalAmount: 0,
          totalNum: 0
        },
        todayPurchaseReturn: {
          totalAmount: 0,
          totalNum: 0
        },
        todaySaleOrder: {
          totalAmount: 0,
          totalNum: 0
        },
        todaySaleReturn: {
          totalAmount: 0,
          totalNum: 0
        },
        todayRetailOutSheet: {
          totalAmount: 0,
          totalNum: 0
        },
        todayRetailReturn: {
          totalAmount: 0,
          totalNum: 0
        },
        sameMonthPurchaseOrder: {
          totalAmount: 0,
          totalNum: 0
        },
        sameMonthPurchaseReturn: {
          totalAmount: 0,
          totalNum: 0
        },
        sameMonthSaleOrder: {
          totalAmount: 0,
          totalNum: 0
        },
        sameMonthSaleReturn: {
          totalAmount: 0,
          totalNum: 0
        },
        sameMonthRetailOutSheet: {
          totalAmount: 0,
          totalNum: 0
        },
        sameMonthRetailReturn: {
          totalAmount: 0,
          totalNum: 0
        }
      }
    }
  },
  created() {
    this.loadData()

    this.handleSetLineChartData('今日采购订单', 'today', this.$enums.ORDER_CHART_BIZ_TYPE.PURCHASE_ORDER.code)
  },
  methods: {
    handleSetLineChartData(title, type, bizType) {
      this.$emit('handleSetLineChartData', title, type, bizType)
    },
    loadData() {
      this.$api.chart.orderChart.get().then(res => {
        this.formData.todayPurchaseOrder = res.today[this.$enums.ORDER_CHART_BIZ_TYPE.PURCHASE_ORDER.code]
        this.formData.todayPurchaseReturn = res.today[this.$enums.ORDER_CHART_BIZ_TYPE.PURCHASE_RETURN.code]
        this.formData.todaySaleOrder = res.today[this.$enums.ORDER_CHART_BIZ_TYPE.SALE_ORDER.code]
        this.formData.todaySaleReturn = res.today[this.$enums.ORDER_CHART_BIZ_TYPE.SALE_RETURN.code]
        this.formData.todayRetailOutSheet = res.today[this.$enums.ORDER_CHART_BIZ_TYPE.RETAIL_OUT_SHEET.code]
        this.formData.todayRetailReturn = res.today[this.$enums.ORDER_CHART_BIZ_TYPE.RETAIL_RETURN.code]
        this.formData.sameMonthPurchaseOrder = res.sameMonth[this.$enums.ORDER_CHART_BIZ_TYPE.PURCHASE_ORDER.code]
        this.formData.sameMonthPurchaseReturn = res.sameMonth[this.$enums.ORDER_CHART_BIZ_TYPE.PURCHASE_RETURN.code]
        this.formData.sameMonthSaleOrder = res.sameMonth[this.$enums.ORDER_CHART_BIZ_TYPE.SALE_ORDER.code]
        this.formData.sameMonthSaleReturn = res.sameMonth[this.$enums.ORDER_CHART_BIZ_TYPE.SALE_RETURN.code]
        this.formData.sameMonthRetailOutSheet = res.sameMonth[this.$enums.ORDER_CHART_BIZ_TYPE.RETAIL_OUT_SHEET.code]
        this.formData.sameMonthRetailReturn = res.sameMonth[this.$enums.ORDER_CHART_BIZ_TYPE.RETAIL_RETURN.code]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {

  .card-panel-col {
    margin-bottom: 16px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      .card-panel-text {
        line-height: 18px;
        color: #909399;
        font-size: 16px;
        margin: 12px 0 20px 10px;
      }

      .card-panel-num-title {
        margin: 2px 2px 2px 10px;
        color: #909399;
        font-size: 16px;
      }

      .card-panel-num {
        color: #606266;
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
