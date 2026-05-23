export const PRODUCT_SELECTOR_LABEL_FIELD = 'selectorLabel';

export function formatProductSelectorLabel(product) {
  const name = product?.name || '';
  const salePropertyText = product?.salePropertyText || '';
  return [name, salePropertyText].filter(Boolean).join(' ');
}

export function withProductSelectorLabel(product) {
  if (!product) {
    return product;
  }
  return {
    ...product,
    [PRODUCT_SELECTOR_LABEL_FIELD]: formatProductSelectorLabel(product),
  };
}

export function withProductSelectorLabels(products) {
  return products?.map((item) => withProductSelectorLabel(item)) || products;
}
