<template>
  <div class="analysis">
    <a-row style="margin-top: 0" :gutter="[24, 24]">
      <a-col :sm="24" :md="12" :xl="6">
        <chart-card
          class="analysis-panel-card"
          :active="activeMetricKey === 'today-order'"
          :loading="loading"
          title="今日订单"
          :total="Number(formData.today.order.totalAmount || 0)"
          @click="emitMetricChange('today-order', formData.today.order)"
        >
          <template #action>
            <a-tooltip :title="metricDescriptorMap['today-order'].description">
              <InfoCircleOutlined />
            </a-tooltip>
          </template>
          <div class="analysis-panel-card__meta">
            <a-space class="analysis-panel-card__stat">
              <span>{{ countLabel }}</span>
              <span
                ><count-to :startVal="0" :endVal="Number(formData.today.order.totalNum || 0)"
              /></span>
            </a-space>
            <p>{{ metricDescriptorMap['today-order'].description }}</p>
          </div>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6">
        <chart-card
          class="analysis-panel-card"
          :active="activeMetricKey === 'today-returned'"
          :loading="loading"
          title="今日退单"
          :total="Number(formData.today.returned.totalAmount || 0)"
          @click="emitMetricChange('today-returned', formData.today.returned)"
        >
          <template #action>
            <a-tooltip :title="metricDescriptorMap['today-returned'].description">
              <InfoCircleOutlined />
            </a-tooltip>
          </template>
          <div class="analysis-panel-card__meta">
            <a-space class="analysis-panel-card__stat">
              <span>{{ countLabel }}</span>
              <span
                ><count-to :startVal="0" :endVal="Number(formData.today.returned.totalNum || 0)"
              /></span>
            </a-space>
            <p>{{ metricDescriptorMap['today-returned'].description }}</p>
          </div>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6">
        <chart-card
          class="analysis-panel-card"
          :active="activeMetricKey === 'month-order'"
          :loading="loading"
          title="本月订单"
          :total="Number(formData.sameMonth.order.totalAmount || 0)"
          @click="emitMetricChange('month-order', formData.sameMonth.order)"
        >
          <template #action>
            <a-tooltip :title="metricDescriptorMap['month-order'].description">
              <InfoCircleOutlined />
            </a-tooltip>
          </template>
          <div class="analysis-panel-card__meta">
            <a-space class="analysis-panel-card__stat">
              <span>{{ countLabel }}</span>
              <span
                ><count-to :startVal="0" :endVal="Number(formData.sameMonth.order.totalNum || 0)"
              /></span>
            </a-space>
            <p>{{ metricDescriptorMap['month-order'].description }}</p>
          </div>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6">
        <chart-card
          class="analysis-panel-card"
          :active="activeMetricKey === 'month-returned'"
          :loading="loading"
          title="本月退单"
          :total="Number(formData.sameMonth.returned.totalAmount || 0)"
          @click="emitMetricChange('month-returned', formData.sameMonth.returned)"
        >
          <template #action>
            <a-tooltip :title="metricDescriptorMap['month-returned'].description">
              <InfoCircleOutlined />
            </a-tooltip>
          </template>
          <div class="analysis-panel-card__meta">
            <a-space class="analysis-panel-card__stat">
              <span>{{ countLabel }}</span>
              <span
                ><count-to
                  :startVal="0"
                  :endVal="Number(formData.sameMonth.returned.totalNum || 0)"
              /></span>
            </a-space>
            <p>{{ metricDescriptorMap['month-returned'].description }}</p>
          </div>
        </chart-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  import ChartCard from '@/components/ChartCard';
  import { InfoCircleOutlined } from '@ant-design/icons-vue';
  import { message } from 'ant-design-vue';
  import { CountTo } from '/@/components/CountTo';
  import * as api from '@/api/chart';
  import {
    ANALYSIS_CARD_COUNT_LABEL,
    ANALYSIS_METRIC_DESCRIPTOR_MAP,
  } from './analysisMetricDescriptor.mjs';

  export default defineComponent({
    components: {
      ChartCard,
      InfoCircleOutlined,
      CountTo,
    },
    data() {
      return {
        loading: false,
        activeMetricKey: 'today-order',
        countLabel: ANALYSIS_CARD_COUNT_LABEL,
        metricDescriptorMap: ANALYSIS_METRIC_DESCRIPTOR_MAP,
        formData: {
          today: {
            order: {
              totalAmount: '',
              totalNum: '',
              charts: [],
            },
            returned: {
              totalAmount: '',
              totalNum: '',
              charts: [],
            },
          },
          sameMonth: {
            order: {
              totalAmount: '',
              totalNum: '',
              charts: [],
            },
            returned: {
              totalAmount: '',
              totalNum: '',
              charts: [],
            },
          },
        },
      };
    },
    watch: {
      loading(val) {
        this.$emit('loading', val);
      },
    },
    created() {
      this.loadData();
    },
    methods: {
      emitMetricChange(key, segment) {
        const safeKey = this.metricDescriptorMap[key] ? key : 'today-order';
        const descriptor = this.metricDescriptorMap[safeKey];
        this.activeMetricKey = safeKey;
        this.$emit('change', {
          key: safeKey,
          title: descriptor.title,
          type: descriptor.type,
          description: descriptor.description,
          totalAmount: Number(segment?.totalAmount || 0),
          totalNum: Number(segment?.totalNum || 0),
          charts: Array.isArray(segment?.charts) ? segment.charts : [],
        });
      },
      normalizeFormData(res) {
        const safeRes = res || {};
        const normalizeSegment = (segment) => ({
          totalAmount: segment?.totalAmount ?? '',
          totalNum: segment?.totalNum ?? '',
          charts: Array.isArray(segment?.charts) ? segment.charts : [],
        });
        return {
          today: {
            order: normalizeSegment(safeRes?.today?.order),
            returned: normalizeSegment(safeRes?.today?.returned),
          },
          sameMonth: {
            order: normalizeSegment(safeRes?.sameMonth?.order),
            returned: normalizeSegment(safeRes?.sameMonth?.returned),
          },
        };
      },
      loadData() {
        this.loading = true;
        api
          .orderChart()
          .then((res) => {
            this.formData = this.normalizeFormData(res);
            this.emitMetricChange('today-order', this.formData.today.order);
          })
          .catch(() => {
            message.error('看板数据加载失败，请稍后重试');
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
  });
</script>

<style scoped lang="less">
  .analysis-panel-card {
    cursor: pointer;
  }

  .analysis-panel-card__meta {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .analysis-panel-card__stat {
    font-size: 13px;
    color: #64748b;
  }

  .analysis-panel-card__meta p {
    margin: 0;
    font-size: 12px;
    line-height: 1.5;
    color: #94a3b8;
  }
</style>
