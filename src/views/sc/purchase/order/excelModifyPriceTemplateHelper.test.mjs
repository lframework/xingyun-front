import assert from 'node:assert/strict';
import test from 'node:test';

import { buildExcelModifyPriceTemplateData } from './excelModifyPriceTemplateHelper.mjs';

test('maps existing purchase-order products into template rows', () => {
  const tableData = [
    { productCode: 'A001', purchasePrice: 10.23 },
    { productCode: 'B001', purchasePrice: 20.56 },
  ];
  const originalTableData = structuredClone(tableData);

  assert.deepEqual(buildExcelModifyPriceTemplateData(tableData), [
    { productCode: 'A001', price: 10.23 },
    { productCode: 'B001', price: 20.56 },
  ]);
  assert.deepEqual(tableData, originalTableData);
});

test('skips rows without an existing product code', () => {
  const tableData = [
    { productCode: 'A001', purchasePrice: 10.23 },
    { productCode: '', purchasePrice: 88.8 },
    { productCode: '   ', purchasePrice: 99.9 },
    { productCode: null, purchasePrice: 77.7 },
    { purchasePrice: 66.6 },
  ];

  assert.deepEqual(buildExcelModifyPriceTemplateData(tableData), [
    { productCode: 'A001', price: 10.23 },
  ]);
});

test('keeps zero and empty-string prices for existing products', () => {
  const tableData = [
    { productCode: 'G001', purchasePrice: 0 },
    { productCode: 'G002', purchasePrice: '' },
  ];

  assert.deepEqual(buildExcelModifyPriceTemplateData(tableData), [
    { productCode: 'G001', price: 0 },
    { productCode: 'G002', price: '' },
  ]);
});

test('falls back to an empty array for invalid table data', () => {
  assert.deepEqual(buildExcelModifyPriceTemplateData(null), []);
  assert.deepEqual(buildExcelModifyPriceTemplateData({ productCode: 'A001' }), []);
});
