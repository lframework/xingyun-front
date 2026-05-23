export function buildExcelModifyPriceTemplateData(tableData = []) {
  const safeTableData = Array.isArray(tableData) ? tableData : [];

  return safeTableData
    .filter((item) => {
      if (!item || item.skuCode === null || item.skuCode === undefined) {
        return false;
      }

      return String(item.skuCode).trim() !== '';
    })
    .map((item) => ({
      skuCode: item.skuCode,
      price: item.purchasePrice,
    }));
}
