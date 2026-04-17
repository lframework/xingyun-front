<template>
  <a-card
    :loading="loading"
    :bordered="false"
    :body-style="{ padding: '22px 24px 18px' }"
    :class="['chart-card', { 'chart-card--active': active }]"
    @click="$emit('click', $event)"
  >
    <div class="chart-card-header">
      <div class="meta">
        <span class="chart-card-title">{{ title }}</span>
        <span class="chart-card-action" @click.stop>
          <slot name="action"></slot>
        </span>
      </div>
      <div class="total"
        ><span><count-to prefix="￥" :startVal="0" :endVal="total" :decimals="2" /></span
      ></div>
    </div>
    <div class="chart-card-content">
      <div class="content-fix">
        <slot></slot>
      </div>
    </div>
    <div class="chart-card-footer">
      <slot name="footer"></slot>
    </div>
  </a-card>
</template>

<script>
  import { CountTo } from '/@/components/CountTo';
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'ChartCard',
    emits: ['click'],
    components: {
      CountTo,
    },
    props: {
      title: {
        type: String,
        default: '',
      },
      total: {
        type: Number,
        default: 0,
      },
      loading: {
        type: Boolean,
        default: false,
      },
      active: {
        type: Boolean,
        default: false,
      },
    },
  });
</script>

<style scoped lang="less">
  .chart-card {
    border-radius: 16px;
    border: 1px solid rgba(148, 163, 184, 0.32);
    background: linear-gradient(135deg, #ffffff 0%, #f8fbff 100%);
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
    transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
  }

  .chart-card--active {
    border-color: rgba(37, 99, 235, 0.5);
    box-shadow: 0 14px 32px rgba(37, 99, 235, 0.18);
    transform: translateY(-2px);
  }

  .chart-card-header {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }

  .chart-card-header .meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    width: 100%;
    color: @text-color-base;
    line-height: 1.4;
  }

  .chart-card-title {
    font-size: 14px;
    color: #475569;
    font-weight: 500;
  }

  .chart-card-action {
    cursor: pointer;
    color: #94a3b8;
    line-height: 1;
  }

  .total {
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
    margin-top: 0;
    margin-bottom: 0;
    font-size: 32px;
    line-height: 1.25;
    min-height: 40px;
    font-weight: 600;
    color: #0f172a;
  }

  .chart-card-footer {
    border-top: 1px solid rgba(148, 163, 184, 0.28);
    padding-top: 9px;
    margin-top: 12px;
  }

  .chart-card-content {
    margin-bottom: 12px;
    min-height: 64px;
    position: relative;
    width: 100%;
  }

  .chart-card-content .content-fix {
    width: 100%;
    min-height: 64px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
</style>
