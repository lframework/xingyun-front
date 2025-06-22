export const getSysFlowComponentPath = (bizFlag) => {
  if (bizFlag === 'PurchaseOrder') {
    return 'PurchaseOrderViewer';
  }

  return;
};

export const getSysFlowRestartRouter = (bizFlag, businessId) => {
  if (bizFlag === 'PurchaseOrder') {
    return '/purchase/order/modify/' + businessId + '?isForm=true';
  }

  return;
};
