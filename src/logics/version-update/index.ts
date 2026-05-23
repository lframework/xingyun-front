import { createConfirm } from '@/hooks/web/msg';
import { buildVersionRequestUrl, isVersionAssetError, isVersionChanged } from './helper';

const VERSION_FILE_PATH = '/version.json';
const POLL_INTERVAL = 60 * 1000;

let hasInitialized = false;
// 仅用于防止重复弹框，不影响后台继续轮询 version.json。
let isPromptVisible = false;
// 用户点击“不再提醒”后，仅在当前页面生命周期内停止提示与轮询。
let ignoreForCurrentPage = false;
let pollingTimer: number | null = null;

function isStaticAssetLoadError(event: Event): boolean {
  const target = event.target;

  if (!target) {
    return false;
  }

  if (target instanceof HTMLScriptElement) {
    return target.src.includes('/assets/');
  }

  if (target instanceof HTMLLinkElement) {
    return target.href.includes('/assets/');
  }

  return false;
}

async function fetchRemoteBuildId(): Promise<string | undefined> {
  const response = await fetch(buildVersionRequestUrl(VERSION_FILE_PATH, Date.now()), {
    cache: 'no-store',
  });

  if (!response.ok) {
    return undefined;
  }

  const data = (await response.json()) as { buildId?: unknown };

  if (typeof data?.buildId !== 'string') {
    return undefined;
  }

  return data.buildId;
}

function showUpdateConfirm() {
  if (ignoreForCurrentPage || isPromptVisible) {
    return;
  }

  isPromptVisible = true;

  createConfirm('系统已更新新版本，请刷新页面', '系统提示', {
    okText: '确定',
    cancelText: '不再提醒',
  })
    .then(() => {
      window.location.reload();
    })
    .catch(() => {
      ignoreForCurrentPage = true;
      isPromptVisible = false;
    });
}

async function checkForVersionUpdate() {
  // “不再提醒”会让当前页面后续不再提示，也不再继续轮询。
  // 弹框处于显示中时，只需要阻止重复弹框，不能阻止下一次轮询请求。
  if (ignoreForCurrentPage) {
    return;
  }

  try {
    const remoteBuildId = await fetchRemoteBuildId();
    if (isVersionChanged(__APP_BUILD_ID__, remoteBuildId)) {
      showUpdateConfirm();
    }
  } catch {
    // Ignore transient version check failures and try again later.
  }
}

function handleVisibilityChange() {
  if (document.visibilityState === 'visible') {
    void checkForVersionUpdate();
  }
}

function isReloadNavigation(): boolean {
  if (typeof performance === 'undefined' || !performance.getEntriesByType) {
    return false;
  }

  const [navigationEntry] = performance.getEntriesByType(
    'navigation',
  ) as PerformanceNavigationTiming[];
  return navigationEntry?.type === 'reload';
}

function handlePageShow(event: PageTransitionEvent) {
  if (!event.persisted && !isReloadNavigation()) {
    return;
  }

  // 浏览器恢复页面或刷新后，应重新启用当前页的版本检测能力。
  ignoreForCurrentPage = false;
  isPromptVisible = false;
  void checkForVersionUpdate();
}

function handleWindowError(event: Event) {
  const errorEvent = event as ErrorEvent;

  if (
    isStaticAssetLoadError(event) ||
    isVersionAssetError(errorEvent.error ?? errorEvent.message)
  ) {
    showUpdateConfirm();
  }
}

function handleUnhandledRejection(event: PromiseRejectionEvent) {
  if (isVersionAssetError(event.reason)) {
    showUpdateConfirm();
  }
}

export function setupAppVersionUpdate() {
  if (hasInitialized || pollingTimer) {
    return;
  }

  hasInitialized = true;

  pollingTimer = window.setInterval(() => {
    void checkForVersionUpdate();
  }, POLL_INTERVAL);

  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('pageshow', handlePageShow);
  window.addEventListener('error', handleWindowError, true);
  window.addEventListener('unhandledrejection', handleUnhandledRejection);

  void checkForVersionUpdate();
}
