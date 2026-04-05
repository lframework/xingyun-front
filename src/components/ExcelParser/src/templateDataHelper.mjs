/**
 * @param {Array<{ field: string; label: string; required?: boolean }>} columns
 */
export function buildTemplateHeader(columns = []) {
  const safeColumns = Array.isArray(columns) ? columns : [];
  return safeColumns.map((col) => (col.required ? `*${col.label}` : col.label));
}

/**
 * @param {Array<{ field: string }>} columns
 * @param {unknown} templateData
 */
export function buildTemplateBody(columns = [], templateData = []) {
  if (!Array.isArray(columns)) {
    return [];
  }

  const safeColumns = Array.isArray(columns) ? columns : [];
  const safeTemplateData = Array.isArray(templateData) ? templateData : [];

  if (safeColumns.length === 0) {
    return [];
  }

  return safeTemplateData.map((item = {}) =>
    safeColumns.map((col) => {
      const value = item?.[col.field];
      return value === null || value === undefined ? '' : value;
    }),
  );
}
