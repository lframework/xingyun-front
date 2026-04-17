export const ANALYSIS_CARD_COUNT_LABEL = '单据笔数';

export const ANALYSIS_METRIC_DESCRIPTOR_MAP = {
  'today-order': {
    title: '今日订单',
    type: 'today',
    description: '今日销售订单、零售出库单、采购订单趋势。',
  },
  'today-returned': {
    title: '今日退单',
    type: 'today',
    description: '今日销售退单、零售退单、采购退单趋势。',
  },
  'month-order': {
    title: '本月订单',
    type: 'sameMonth',
    description: '本月订单金额与笔数变化趋势。',
  },
  'month-returned': {
    title: '本月退单',
    type: 'sameMonth',
    description: '本月退单金额与笔数变化趋势。',
  },
};
