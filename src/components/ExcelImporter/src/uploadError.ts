const DEFAULT_IMPORT_UPLOAD_ERROR = '导入失败，请稍后重试！';

export function isImportUploadTimeoutError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const record = error as Record<string, unknown>;
  if (record.code === 'ECONNABORTED') {
    return true;
  }

  return typeof record.message === 'string' && record.message.toLowerCase().includes('timeout');
}

export function getImportUploadErrorMessage(error: unknown): string {
  if (!error || typeof error !== 'object') {
    return DEFAULT_IMPORT_UPLOAD_ERROR;
  }

  const record = error as Record<string, unknown>;
  const errorData = record.error;
  const message =
    record.msg ||
    record.message ||
    (errorData && typeof errorData === 'object'
      ? (errorData as Record<string, unknown>).message
      : undefined);

  return typeof message === 'string' && message ? message : DEFAULT_IMPORT_UPLOAD_ERROR;
}
