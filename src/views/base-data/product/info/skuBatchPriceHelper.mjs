export function applySkuBatchPrices(skus, batchPrices, selectedIds) {
  const priceFields = ['purchasePrice', 'salePrice', 'retailPrice'];
  const selectedIdSet =
    selectedIds && selectedIds.length > 0 ? new Set(selectedIds.map((id) => String(id))) : null;

  return (skus || []).map((sku) => {
    const newSku = { ...sku };
    if (selectedIdSet && !selectedIdSet.has(String(sku.id))) {
      return newSku;
    }

    priceFields.forEach((field) => {
      if (
        batchPrices[field] !== undefined &&
        batchPrices[field] !== null &&
        batchPrices[field] !== ''
      ) {
        newSku[field] = batchPrices[field];
      }
    });

    return newSku;
  });
}

export function isMultiSkuList(skus) {
  return (skus || []).length > 1;
}

export function shouldLoadSaleProperties(categoryId, skus, saleProperties) {
  return Boolean(categoryId) && isMultiSkuList(skus) && (saleProperties || []).length === 0;
}

export function buildProductSubmitParams(formData, extraParams) {
  const productParams = { ...(formData || {}) };
  [
    'skuId',
    'skuType',
    'skuCode',
    'skuMainImage',
    'multiCode',
    'multiCodes',
    'purchasePrice',
    'salePrice',
    'retailPrice',
  ].forEach((field) => {
    delete productParams[field];
  });

  return {
    ...productParams,
    ...extraParams,
  };
}
