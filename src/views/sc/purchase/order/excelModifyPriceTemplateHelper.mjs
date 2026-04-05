export function buildExcelModifyPriceTemplateData(tableData = []) {
  const safeTableData = Array.isArray(tableData) ? tableData : [];

  return safeTableData
    .filter((item) => {
      if (!item || item.productCode === null || item.productCode === undefined) {
        return false;
      }

      return String(item.productCode).trim() !== '';
    })
    .map((item) => ({
      productCode: item.productCode,
      price: item.purchasePrice,
    }));
}
