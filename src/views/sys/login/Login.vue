<template>
  <div :class="prefixCls">
    <div class="login-shell">
      <section class="login-shell__panel login-shell__panel--brand">
        <div class="login-shell__logo">
          <AppLogo theme="dark" :alwaysShowTitle="true" />
        </div>

        <div class="login-shell__hero">
          <span class="login-shell__eyebrow">Business ERP Portal</span>
          <h1 class="login-shell__headline">
            更高效的业务协同入口
            <span>让门店、供应链与财务管理更顺畅。</span>
          </h1>
          <p class="login-shell__summary">
            聚焦开店经营、库存流转、订单协同与数据洞察，帮助团队在一个工作台内完成日常决策与执行。
          </p>

          <div class="login-shell__highlights">
            <article
              v-for="item in highlights"
              :key="item.title"
              class="login-shell__highlight-card"
            >
              <div class="login-shell__highlight-icon">
                <component :is="item.icon" />
              </div>
              <div>
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
              </div>
            </article>
          </div>

          <div class="login-shell__metrics">
            <div v-for="item in metrics" :key="item.label" class="login-shell__metric">
              <strong>{{ item.value }}</strong>
              <span>{{ item.label }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="login-shell__panel login-shell__panel--form">
        <div class="login-shell__mobile-logo">
          <AppLogo :alwaysShowTitle="true" />
        </div>

        <div :class="`${prefixCls}-form`" class="login-shell__form-stage">
          <div class="login-shell__form-backdrop"></div>
          <div class="login-shell__form-card">
            <div class="login-shell__form-intro">
              <span class="login-shell__form-tag">企业工作台登录</span>
              <h2>{{ title }}</h2>
              <p>保持现有账号体系与认证流程，快速进入系统。</p>
            </div>
            <LoginForm />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { computed } from 'vue';
  import {
    ApartmentOutlined,
    DeploymentUnitOutlined,
    LineChartOutlined,
  } from '@ant-design/icons-vue';
  import { AppLogo } from '/@/components/Application';
  import LoginForm from './LoginForm.vue';
  import { useGlobSetting } from '/@/hooks/setting';
  import { useDesign } from '/@/hooks/web/useDesign';

  defineProps({
    sessionTimeout: {
      type: Boolean,
    },
  });

  const globSetting = useGlobSetting();
  const { prefixCls } = useDesign('login');
  const title = computed(() => globSetting?.title ?? '');

  const highlights = [
    {
      title: '多租户协同',
      description: '适配品牌、门店与组织的独立登录场景，延续现有租户校验流程。',
      icon: ApartmentOutlined,
    },
    {
      title: '业务流程联动',
      description: '采购、销售、库存与财务数据在一个入口内串联，减少跨系统切换。',
      icon: DeploymentUnitOutlined,
    },
    {
      title: '经营数据驱动',
      description: '从订单执行到分析复盘，帮助团队用更少操作完成日常判断。',
      icon: LineChartOutlined,
    },
  ];

  const metrics = [
    {
      label: '统一权限认证',
      value: '01',
    },
    {
      label: '稳定业务入口',
      value: '24H',
    },
    {
      label: '数据协同视角',
      value: '360°',
    },
    {
      label: '风险与安全控制',
      value: 'A+',
    },
  ];
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-login';
  @logo-prefix-cls: ~'@{namespace}-app-logo';

  .@{prefix-cls} {
    position: relative;
    min-height: 100%;
    overflow: hidden;
    background: radial-gradient(circle at right top, rgb(59 130 246 / 12%), transparent 24%),
      linear-gradient(180deg, #f6f9fd 0%, #eef3f9 100%);

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at right top, rgb(14 165 233 / 8%), transparent 28%),
        linear-gradient(rgb(15 23 42 / 3%) 1px, transparent 1px),
        linear-gradient(90deg, rgb(15 23 42 / 3%) 1px, transparent 1px);
      background-size: auto, 36px 36px, 36px 36px;
      mask-image: linear-gradient(
        90deg,
        transparent 0%,
        rgb(0 0 0 / 60%) 56%,
        rgb(0 0 0 / 100%) 100%
      );
      pointer-events: none;
    }

    .@{logo-prefix-cls} {
      position: relative;
      z-index: 2;
      width: fit-content;
      height: auto;
      padding: 0;

      &__title {
        font-size: 22px;
        letter-spacing: 0.02em;
      }

      img {
        width: 46px;
      }
    }
  }

  .login-shell {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(340px, 0.84fr) minmax(620px, 1.16fr);
    gap: 0;
    padding: 28px 28px 32px 24px;
    min-height: 100vh;
  }

  .login-shell__panel {
    position: relative;
    display: flex;
    flex: 1;
    min-height: calc(100vh - 60px);
  }

  .login-shell__panel--brand {
    flex-direction: column;
    justify-content: space-between;
    padding: 42px 42px 42px 54px;
    color: #f5f9ff;
    overflow: hidden;
    border-radius: 40px 110px 110px 40px;
    background: radial-gradient(circle at top left, rgb(212 228 255 / 21%), transparent 34%),
      radial-gradient(circle at right center, rgb(216 235 255 / 11%), transparent 26%),
      linear-gradient(135deg, #6f96df 0%, #688dd1 58%, #5f87c6 100%);
    box-shadow: inset 0 1px 0 rgb(255 255 255 / 34%), inset 0 18px 36px rgb(255 255 255 / 8%),
      inset -24px -30px 52px rgb(31 65 133 / 24%), 0 26px 56px rgb(15 23 42 / 16%);

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
          140deg,
          rgb(255 255 255 / 16%) 0%,
          rgb(255 255 255 / 0%) 34%,
          rgb(255 255 255 / 0%) 100%
        ),
        linear-gradient(rgb(255 255 255 / 4%) 1px, transparent 1px),
        linear-gradient(90deg, rgb(255 255 255 / 4%) 1px, transparent 1px);
      background-size: auto, 36px 36px, 36px 36px;
      mask-image: linear-gradient(
        120deg,
        rgb(0 0 0 / 40%) 0%,
        rgb(0 0 0 / 18%) 52%,
        transparent 84%
      );
      pointer-events: none;
    }

    &::after {
      content: '';
      position: absolute;
      right: -90px;
      bottom: 56px;
      width: 260px;
      height: 260px;
      border-radius: 50%;
      background: radial-gradient(circle, rgb(212 228 255 / 18%) 0%, transparent 72%);
      filter: blur(8px);
      pointer-events: none;
    }
  }

  .login-shell__panel--brand::before,
  .login-shell__panel--brand::after {
    z-index: 0;
  }

  .login-shell__panel--brand::after {
    box-shadow: 0 0 140px rgb(191 219 254 / 14%);
  }

  .login-shell__logo {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
  }

  .login-shell__hero {
    position: relative;
    z-index: 1;
    max-width: 500px;
    margin: auto 0;
  }

  .login-shell__eyebrow {
    display: inline-flex;
    align-items: center;
    padding: 6px 14px;
    border: 1px solid rgb(212 228 255 / 22%);
    border-radius: 999px;
    background: rgb(255 255 255 / 10%);
    color: #f1f5ff;
    font-size: 12px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    backdrop-filter: blur(10px);
  }

  .login-shell__headline {
    margin: 24px 0 18px;
    color: #fff;
    font-size: 42px;
    font-weight: 700;
    line-height: 1.15;

    span {
      display: block;
      margin-top: 12px;
      color: rgb(239 246 255 / 88%);
      font-size: 24px;
      font-weight: 500;
      line-height: 1.45;
    }
  }

  .login-shell__summary {
    max-width: 560px;
    color: rgb(239 246 255 / 84%);
    font-size: 16px;
    line-height: 1.9;
  }

  .login-shell__highlights {
    display: grid;
    grid-template-columns: 1fr;
    gap: 14px;
    max-width: 420px;
    margin-top: 38px;
  }

  .login-shell__highlight-card {
    display: flex;
    gap: 14px;
    padding: 18px 18px;
    border: 1px solid rgb(212 228 255 / 14%);
    border-radius: 24px;
    background: linear-gradient(180deg, rgb(255 255 255 / 14%), rgb(255 255 255 / 6%));
    box-shadow: inset 0 1px 0 rgb(255 255 255 / 24%), inset 0 10px 18px rgb(255 255 255 / 5%),
      0 18px 50px rgb(29 78 216 / 16%);
    backdrop-filter: blur(14px);

    h3 {
      margin: 0 0 8px;
      color: #fff;
      font-size: 17px;
      font-weight: 600;
    }

    p {
      margin: 0;
      color: rgb(239 246 255 / 78%);
      font-size: 13px;
      line-height: 1.8;
    }
  }

  .login-shell__highlight-icon {
    display: flex;
    flex: 0 0 46px;
    align-items: center;
    justify-content: center;
    width: 46px;
    height: 46px;
    border-radius: 16px;
    background: linear-gradient(135deg, rgb(255 255 255 / 28%), rgb(191 219 254 / 16%));
    box-shadow: inset 0 1px 0 rgb(255 255 255 / 22%), 0 8px 18px rgb(37 99 235 / 16%);
    color: #eff6ff;
    font-size: 22px;
  }

  .login-shell__metrics {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px 18px;
    max-width: 360px;
    margin-top: 30px;
  }

  .login-shell__metric {
    padding: 14px 0 0;
    border-top: 1px solid rgb(212 228 255 / 16%);

    strong {
      display: block;
      margin-bottom: 8px;
      color: #fff;
      font-size: 28px;
      font-weight: 700;
      line-height: 1;
    }

    span {
      color: rgb(239 246 255 / 80%);
      font-size: 13px;
      line-height: 1.6;
    }
  }

  .login-shell__panel--form {
    align-items: center;
    justify-content: center;
    padding: 0 24px 0 12px;
    overflow: hidden;
    background: radial-gradient(circle at top right, rgb(96 165 250 / 18%), transparent 26%),
      radial-gradient(circle at 72% 68%, rgb(14 165 233 / 9%), transparent 18%),
      linear-gradient(180deg, rgb(255 255 255 / 38%) 0%, rgb(255 255 255 / 0%) 100%);
  }

  .login-shell__mobile-logo {
    display: none;
  }

  .login-shell__form-stage {
    position: relative;
    width: min(640px, 100%);
    margin-left: 0;
    z-index: 2;
  }

  .login-shell__form-backdrop {
    position: absolute;
    inset: 16px -8px -20px 24px;
    border-radius: 38px;
    background: linear-gradient(145deg, rgb(59 130 246 / 20%), rgb(14 165 233 / 8%)),
      radial-gradient(circle at top left, rgb(125 211 252 / 18%), transparent 56%);
    filter: blur(0);
  }

  .login-shell__form-card {
    position: relative;
    padding: 40px 40px 34px;
    border: 1px solid rgb(148 163 184 / 18%);
    border-radius: 38px;
    background: rgb(255 255 255 / 93%);
    box-shadow: 0 34px 78px rgb(15 23 42 / 14%);
    backdrop-filter: blur(18px);
  }

  .login-shell__form-intro {
    margin-bottom: 18px;

    h2 {
      margin: 14px 0 8px;
      color: #111827;
      font-size: 28px;
      font-weight: 700;
    }

    p {
      margin: 0;
      color: #64748b;
      font-size: 14px;
      line-height: 1.7;
    }
  }

  .login-shell__form-tag {
    display: inline-flex;
    align-items: center;
    padding: 7px 12px;
    border-radius: 999px;
    background: #e0f2fe;
    color: #0369a1;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
  }

  @media (max-width: 1600px) {
    .login-shell {
      grid-template-columns: minmax(300px, 0.88fr) minmax(520px, 1.12fr);
      padding-right: 24px;
      padding-left: 24px;
    }

    .login-shell__panel--brand {
      padding-right: 34px;
      padding-left: 42px;
    }

    .login-shell__headline {
      font-size: 38px;

      span {
        font-size: 21px;
      }
    }

    .login-shell__form-stage {
      margin-left: 0;
    }
  }

  @media (max-width: @screen-xl) {
    .@{prefix-cls} {
      background: radial-gradient(circle at top left, rgb(45 104 190 / 34%), transparent 34%),
        linear-gradient(180deg, #081426 0%, #0d223b 45%, #edf3fb 45%, #f8fafc 100%);

      &::before {
        display: none;
      }
    }

    .login-shell {
      grid-template-columns: 1fr;
      padding: 0;
    }

    .login-shell__panel {
      min-height: auto;
    }

    .login-shell__panel--brand {
      padding: 36px 28px 18px;
      border-radius: 0;
      box-shadow: none;
    }

    .login-shell__hero {
      max-width: none;
      margin: 36px 0 0;
    }

    .login-shell__headline {
      font-size: 32px;

      span {
        font-size: 18px;
      }
    }

    .login-shell__summary {
      max-width: none;
    }

    .login-shell__metrics {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .login-shell__panel--form {
      justify-content: center;
      padding: 18px 28px 40px;
      background: none;
    }

    .login-shell__form-stage {
      margin-left: 0;
    }
  }

  @media (max-width: @screen-lg) {
    .login-shell__panel--brand {
      display: none;
    }

    .login-shell__panel--form {
      min-height: 100vh;
      padding: 28px 18px;
    }

    .login-shell__mobile-logo {
      position: absolute;
      top: 24px;
      left: 18px;
      display: flex;
      z-index: 2;

      .@{logo-prefix-cls}__title {
        color: #fff;
        font-size: 18px;
      }

      .@{logo-prefix-cls} img {
        width: 38px;
      }
    }

    .login-shell__form-stage {
      margin-top: 56px;
    }

    .login-shell__form-card {
      padding: 24px 18px;
      border-radius: 24px;
      background: rgb(255 255 255 / 92%);
    }
  }
</style>
