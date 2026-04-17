<template>
  <PageWrapper class="analysis-dashboard-page">
    <div class="analysis-dashboard">
      <section class="analysis-hero enter-y">
        <p class="analysis-hero__eyebrow">运营总览</p>
        <h2 class="analysis-hero__title">分析页</h2>
        <p class="analysis-hero__subtitle">聚焦交易规模、趋势变化与核心指标，帮助你快速定位业务状态。</p>
        <a-alert v-if="isPreview" message="当前为预览版" type="warning" show-icon>
          <template #description>
            <div class="whitespace-pre-wrap">{{ previewDesc }}</div>
          </template>
        </a-alert>
      </section>

      <section class="analysis-metrics">
        <panel-group
          class="enter-y"
          @change="handleMetricChange"
          @loading="(e) => (loading = e)"
        />
      </section>

      <section class="analysis-content">
        <article class="chart-panel">
          <a-skeleton v-if="loading" active :paragraph="{ rows: 6 }" />
          <template v-else>
            <header class="chart-panel__header">
              <div>
                <h3 class="chart-panel__title">{{ activeMetric.title }}</h3>
                <p class="chart-panel__desc">{{ activeMetric.scopeLabel }}{{ activeMetric.seriesLabel }}趋势</p>
              </div>
            </header>
            <line-chart :chart-data="lineChartData" />
          </template>
        </article>

        <aside class="summary-panel">
          <h3 class="summary-panel__title">{{ activeMetric.title }}</h3>
          <p class="summary-panel__desc">{{ activeMetric.description }}</p>
          <div class="summary-panel__item">
            <span class="summary-panel__label">总金额</span>
            <span class="summary-panel__value">{{ formatCurrency(activeMetric.totalAmount) }}</span>
          </div>
          <div class="summary-panel__item">
            <span class="summary-panel__label">总笔数</span>
            <span class="summary-panel__value">{{ formatNumber(activeMetric.totalNum) }}</span>
          </div>
          <div class="summary-panel__item">
            <span class="summary-panel__label">统计维度</span>
            <span class="summary-panel__value">{{ activeMetric.dimensionLabel }}</span>
          </div>
          <div class="summary-panel__item">
            <span class="summary-panel__label">数据点数量</span>
            <span class="summary-panel__value">{{ formatNumber(activeMetric.pointCount) }}</span>
          </div>
        </aside>
      </section>
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import PanelGroup from './components/PanelGroup.vue';
  import LineChart from './components/LineChart.vue';
  import { isEmpty } from '@/utils/utils';

  type MetricPayload = {
    key: 'today-order' | 'today-returned' | 'month-order' | 'month-returned';
    title: string;
    type: 'today' | 'sameMonth';
    description: string;
    totalAmount: number;
    totalNum: number;
    charts: ChartPoint[];
  };

  type ChartPoint = {
    totalAmount: number | string | null;
    totalNum: number | string | null;
    createHour: string | null;
    createDate: string | null;
  };

  type LineChartData = {
    title: string;
    totalAmountDatas: Array<number | null>;
    totalNumDatas: Array<number | null>;
    xAxisDatas: string[];
  };

  type ActiveMetric = {
    key: MetricPayload['key'];
    title: string;
    description: string;
    scopeLabel: '今日' | '本月';
    seriesLabel: '订单' | '退单';
    dimensionLabel: '小时' | '日期';
    totalAmount: number;
    totalNum: number;
    pointCount: number;
  };

  const loading = ref(true);

  const lineChartData = ref<LineChartData>({
    title: '',
    totalAmountDatas: [],
    totalNumDatas: [],
    xAxisDatas: [],
  });

  const activeMetric = ref<ActiveMetric>({
    key: 'today-order',
    title: '今日订单',
    description: '展示今日订单在小时维度上的金额与笔数趋势。',
    scopeLabel: '今日',
    seriesLabel: '订单',
    dimensionLabel: '小时',
    totalAmount: 0,
    totalNum: 0,
    pointCount: 0,
  });

  const normalizeSeriesValue = (value: unknown): number | null => {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
  };

  const handleMetricChange = (payload: MetricPayload) => {
    const charts = Array.isArray(payload.charts) ? payload.charts : [];
    const isTodayType = payload.type === 'today';
    const isReturnedSeries = payload.key.includes('returned');

    lineChartData.value = {
      title: payload.title,
      totalAmountDatas: charts.map((item) => normalizeSeriesValue(item.totalAmount)),
      totalNumDatas: charts.map((item) => normalizeSeriesValue(item.totalNum)),
      xAxisDatas: charts.map((item) => {
        if (isTodayType) {
          const hour = `${item.createHour ?? ''}`.trim();
          if (!hour) {
            return '--时';
          }
          return `${hour.padStart(2, '0')}时`;
        }
        return `${item.createDate || ''}`;
      }),
    };

    activeMetric.value = {
      key: payload.key,
      title: payload.title,
      description: payload.description,
      scopeLabel: isTodayType ? '今日' : '本月',
      seriesLabel: isReturnedSeries ? '退单' : '订单',
      dimensionLabel: isTodayType ? '小时' : '日期',
      totalAmount: Number(payload.totalAmount || 0),
      totalNum: Number(payload.totalNum || 0),
      pointCount: charts.length,
    };
  };

  const formatCurrency = (value: number) =>
    `￥${Number(value || 0).toLocaleString('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatNumber = (value: number) => Number(value || 0).toLocaleString('zh-CN');

  const isPreview = import.meta.env.VITE_GLOB_APP_IS_PREVIEW === 'true';
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
  .analysis-dashboard-page {
    background:
      radial-gradient(circle at 12% 0%, rgba(59, 130, 246, 0.08), transparent 45%),
      radial-gradient(circle at 88% 10%, rgba(16, 185, 129, 0.08), transparent 42%),
      linear-gradient(180deg, #f8fafc 0%, #f4f7fb 100%);
  }

  .analysis-dashboard {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .analysis-hero,
  .chart-panel,
  .summary-panel {
    border-radius: 16px;
    border: 1px solid rgba(15, 23, 42, 0.08);
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
    backdrop-filter: blur(4px);
  }

  .analysis-hero {
    padding: 20px 24px;
  }

  .analysis-hero__eyebrow {
    margin: 0;
    font-size: 12px;
    color: #1d4ed8;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-weight: 600;
  }

  .analysis-hero__title {
    margin: 8px 0 0;
    font-size: 28px;
    color: #0f172a;
    font-weight: 700;
    line-height: 1.2;
  }

  .analysis-hero__subtitle {
    margin: 10px 0 18px;
    color: #475569;
    font-size: 14px;
    line-height: 1.6;
    max-width: 760px;
  }

  .analysis-metrics {
    min-width: 0;
  }

  .analysis-content {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
    gap: 20px;
    align-items: start;
  }

  .chart-panel {
    padding: 18px 20px 8px;
  }

  .chart-panel__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
  }

  .chart-panel__title {
    margin: 0;
    font-size: 18px;
    color: #0f172a;
    font-weight: 600;
  }

  .chart-panel__desc {
    margin: 6px 0 0;
    font-size: 13px;
    color: #64748b;
  }

  .summary-panel {
    padding: 20px;
  }

  .summary-panel__title {
    margin: 0;
    font-size: 18px;
    color: #0f172a;
    font-weight: 600;
  }

  .summary-panel__desc {
    margin: 8px 0 18px;
    color: #475569;
    font-size: 13px;
    line-height: 1.5;
  }

  .summary-panel__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-top: 1px dashed rgba(100, 116, 139, 0.2);
  }

  .summary-panel__label {
    color: #64748b;
    font-size: 13px;
  }

  .summary-panel__value {
    color: #0f172a;
    font-size: 16px;
    font-weight: 600;
  }

  @media (max-width: 1200px) {
    .analysis-content {
      grid-template-columns: 1fr;
    }
  }
</style>
