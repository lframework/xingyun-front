export interface LocationLike {
  origin: string;
  pathname: string;
  search?: string;
  hash?: string;
}

function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string') {
      return message;
    }
  }

  return '';
}

export function buildVersionRequestUrl(path: string, now: number): string {
  const connector = path.includes('?') ? '&' : '?';
  return `${path}${connector}t=${now}`;
}

export function buildRefreshUrl(locationLike: LocationLike, now: number): string {
  const searchParams = new URLSearchParams(locationLike.search ?? '');
  searchParams.set('__app_update__', String(now));

  const search = searchParams.toString();
  const hash = locationLike.hash ?? '';

  return `${locationLike.origin}${locationLike.pathname}${search ? `?${search}` : ''}${hash}`;
}

export function isVersionChanged(localBuildId: string, remoteBuildId?: string): boolean {
  if (!remoteBuildId) {
    return false;
  }

  return localBuildId !== remoteBuildId;
}

export function isVersionAssetError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase();

  if (!message) {
    return false;
  }

  return [
    'failed to fetch dynamically imported module',
    'importing a module script failed',
    'loading chunk',
    'chunkloaderror',
  ].some((pattern) => message.includes(pattern));
}
