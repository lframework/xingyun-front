function toNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

export function openScanDialogState(state = {}) {
  return {
    ...state,
    scanDialogVisible: true,
    scanCode: '',
    scanMessage: '',
    scanMessageType: 'info',
    scanCandidates: [],
  };
}

export function closeScanDialogState(state = {}) {
  return {
    ...state,
    scanDialogVisible: false,
    scanCandidates: [],
  };
}

export function shouldIgnoreGlobalEnter(state = {}) {
  return !!(state.scanDialogVisible || state.isScanInputFocused);
}

export function applyScannedProductResult(tableData, product, options = {}) {
  const {
    purchaseStep = 1,
    quantityField = 'purchaseNum',
    createRow = (item, step) => ({ ...item, isGift: false, [quantityField]: step }),
  } = options;
  const nextTableData = tableData.map((item) => ({ ...item }));
  const normalRowIndex = nextTableData.findIndex(
    (item) => item.productId === product.productId && !item.isGift,
  );

  if (normalRowIndex >= 0) {
    const row = {
      ...nextTableData[normalRowIndex],
      [quantityField]: toNumber(nextTableData[normalRowIndex][quantityField]) + purchaseStep,
    };
    nextTableData[normalRowIndex] = row;

    return {
      type: 'merged',
      row,
      rowIndex: normalRowIndex,
      tableData: nextTableData,
    };
  }

  const row = createRow(product, purchaseStep);
  nextTableData.unshift(row);

  return {
    type: 'inserted',
    row,
    rowIndex: 0,
    tableData: nextTableData,
  };
}
