const AMOUNT_SERIES_NAME = '单据总金额';
const QUANTITY_SERIES_NAME = '单据总笔数';

function toNumeric(value) {
  const normalized = Number(value);
  return Number.isFinite(normalized) ? normalized : null;
}

function formatLocalizedNumber(value, { fixed = false } = {}) {
  const normalized = toNumeric(value);
  if (normalized === null) {
    return fixed ? '0.00' : '0';
  }

  const hasFraction = !Number.isInteger(normalized);

  return normalized.toLocaleString('zh-CN', {
    minimumFractionDigits: fixed ? 2 : 0,
    maximumFractionDigits: fixed ? 2 : hasFraction ? 2 : 0,
  });
}

function buildAreaGradient(echarts, colors) {
  return new echarts.graphic.LinearGradient(0, 0, 0, 1, colors);
}

export function formatAmountAxisLabel(value) {
  return `￥${formatLocalizedNumber(value, { fixed: true })}`;
}

export function formatQuantityAxisLabel(value) {
  return formatLocalizedNumber(value);
}

export function buildLineChartOptions({
  echarts,
  xAxisDatas = [],
  totalAmountDatas = [],
  totalNumDatas = [],
} = {}) {
  return {
    color: ['#0f766e', '#2563eb'],
    legend: {
      top: 4,
      right: 0,
      icon: 'roundRect',
      itemWidth: 14,
      itemHeight: 8,
      textStyle: {
        color: '#6b7280',
        fontSize: 12,
      },
      data: [AMOUNT_SERIES_NAME, QUANTITY_SERIES_NAME],
    },
    grid: {
      left: 16,
      right: 56,
      bottom: 20,
      top: 56,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: Array.isArray(xAxisDatas) ? xAxisDatas : [],
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: 'rgba(148, 163, 184, 0.45)',
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#94a3b8',
      },
      splitLine: {
        show: false,
      },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      borderColor: 'rgba(148, 163, 184, 0.2)',
      borderWidth: 1,
      textStyle: {
        color: '#f8fafc',
      },
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: 'rgba(148, 163, 184, 0.5)',
          width: 1,
        },
      },
      padding: [8, 12],
      formatter(params = []) {
        const rows = Array.isArray(params) ? params : [];
        const header = rows[0]?.axisValueLabel ? `${rows[0].axisValueLabel}<br/>` : '';
        const body = rows
          .map((item) => {
            const value =
              item.seriesName === AMOUNT_SERIES_NAME
                ? formatAmountAxisLabel(item.value)
                : formatQuantityAxisLabel(item.value);
            return `${item.seriesName}：${value}`;
          })
          .join('<br/>');

        return `${header}${body}`;
      },
    },
    yAxis: [
      {
        type: 'value',
        name: '金额',
        position: 'left',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#94a3b8',
          formatter: formatAmountAxisLabel,
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(148, 163, 184, 0.2)',
          },
        },
      },
      {
        type: 'value',
        name: '笔数',
        position: 'right',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#94a3b8',
          formatter: formatQuantityAxisLabel,
        },
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: AMOUNT_SERIES_NAME,
        smooth: true,
        type: 'line',
        yAxisIndex: 0,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          color: '#0f766e',
          width: 3,
        },
        itemStyle: {
          color: '#0f766e',
          borderColor: '#ffffff',
          borderWidth: 2,
        },
        areaStyle: {
          color: buildAreaGradient(echarts, [
            { offset: 0, color: 'rgba(15, 118, 110, 0.35)' },
            { offset: 1, color: 'rgba(15, 118, 110, 0.03)' },
          ]),
        },
        data: Array.isArray(totalAmountDatas) ? totalAmountDatas : [],
        animationDuration: 2800,
        animationEasing: 'cubicInOut',
      },
      {
        name: QUANTITY_SERIES_NAME,
        smooth: true,
        type: 'line',
        yAxisIndex: 1,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          color: '#2563eb',
          width: 3,
        },
        itemStyle: {
          color: '#2563eb',
          borderColor: '#ffffff',
          borderWidth: 2,
        },
        areaStyle: {
          color: buildAreaGradient(echarts, [
            { offset: 0, color: 'rgba(37, 99, 235, 0.33)' },
            { offset: 1, color: 'rgba(37, 99, 235, 0.03)' },
          ]),
        },
        data: Array.isArray(totalNumDatas) ? totalNumDatas : [],
        animationDuration: 2800,
        animationEasing: 'quadraticOut',
      },
    ],
  };
}
