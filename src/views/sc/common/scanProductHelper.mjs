function toNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

export function formatScannedProductDisplayName(product = {}) {
  return [product.productCode, product.skuCode, product.productName, product.salePropertyText]
    .filter(Boolean)
    .join(' ');
}

export function openScanDialogState(state = {}) {
  return {
    ...state,
    scanDialogVisible: true,
    scanCode: '',
    scanMessage: '',
    scanMessageType: 'info',
    scanCandidates: [],
    scanQueue: [],
    scanPendingCode: '',
    scanQueuePaused: false,
  };
}

export function closeScanDialogState(state = {}) {
  return {
    ...state,
    scanDialogVisible: false,
    scanCandidates: [],
    scanQueue: [],
    scanPendingCode: '',
    scanQueuePaused: false,
    scanLoading: false,
  };
}

export function shouldIgnoreGlobalEnter(state = {}) {
  return !!(state.scanDialogVisible || state.isScanInputFocused);
}

export function enqueueScanCodeState(state = {}, code = '') {
  return {
    ...state,
    scanCode: '',
    scanQueue: [...(state.scanQueue || []), code],
  };
}

export function beginNextScanConsumeState(state = {}) {
  if (state.scanLoading || state.scanQueuePaused || !(state.scanQueue || []).length) {
    return {
      state,
      code: '',
    };
  }

  const [code, ...restQueue] = state.scanQueue || [];
  return {
    state: {
      ...state,
      scanLoading: true,
      scanQueue: restQueue,
      scanPendingCode: code,
    },
    code,
  };
}

export function pauseScanQueueState(state = {}, candidates = []) {
  return {
    ...state,
    scanLoading: false,
    scanQueuePaused: true,
    scanCandidates: candidates,
  };
}

export function resumeScanQueueState(state = {}) {
  return {
    ...state,
    scanLoading: false,
    scanQueuePaused: false,
    scanPendingCode: '',
    scanCandidates: [],
  };
}

export function finishScanConsumeState(state = {}) {
  return {
    ...state,
    scanLoading: false,
    scanPendingCode: '',
  };
}

export function applyScannedProductResult(tableData, product, options = {}) {
  const {
    purchaseStep = 1,
    quantityField = 'purchaseNum',
    identityField = 'productId',
    createRow = (item, step) => ({ ...item, isGift: false, [quantityField]: step }),
  } = options;
  const nextTableData = tableData.map((item) => ({ ...item }));
  const normalRowIndex = nextTableData.findIndex(
    (item) => item[identityField] === product[identityField] && !item.isGift,
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
