import { createConfirm } from '@/hooks/web/msg';
import {
  buildRefreshUrl,
  buildVersionRequestUrl,
  isVersionAssetError,
  isVersionChanged,
} from './helper';

const VERSION_FILE_PATH = '/version.json';
const POLL_INTERVAL = 60 * 1000;

let hasInitialized = false;
let isPromptVisible = false;
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
      window.location.replace(buildRefreshUrl(window.location, Date.now()));
    })
    .catch(() => {
      ignoreForCurrentPage = true;
      isPromptVisible = false;
    });
}

async function checkForVersionUpdate() {
  if (ignoreForCurrentPage || isPromptVisible) {
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

function handleWindowError(event: Event) {
  const errorEvent = event as ErrorEvent;

  if (isStaticAssetLoadError(event) || isVersionAssetError(errorEvent.error ?? errorEvent.message)) {
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
  window.addEventListener('error', handleWindowError, true);
  window.addEventListener('unhandledrejection', handleUnhandledRejection);

  void checkForVersionUpdate();
}
