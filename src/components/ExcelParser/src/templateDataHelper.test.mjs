import assert from 'node:assert/strict';
import test from 'node:test';

import { buildTemplateBody, buildTemplateHeader } from './templateDataHelper.mjs';

test('buildTemplateHeader marks required columns with an asterisk', () => {
  const columns = [
    { field: 'productCode', label: '商品编号', required: true },
    { field: 'price', label: '采购价', required: false },
  ];

  assert.deepEqual(buildTemplateHeader(columns), ['*商品编号', '采购价']);
});

test('buildTemplateBody aligns row cells to the declared column order', () => {
  const columns = [
    { field: 'productCode', label: '商品编号', required: true },
    { field: 'price', label: '采购价', required: false },
  ];
  const templateData = [
    { productCode: 'P001', price: 12.5, ignored: 'x' },
    { productCode: 'P002', price: 18.8, ignored: 'y' },
  ];

  assert.deepEqual(buildTemplateBody(columns, templateData), [
    ['P001', 12.5],
    ['P002', 18.8],
  ]);
});

test('buildTemplateBody exports empty cells for missing or null values', () => {
  const columns = [
    { field: 'productCode', label: '商品编号', required: true },
    { field: 'price', label: '采购价', required: false },
  ];
  const templateData = [
    { productCode: 'P001', price: null },
    { productCode: 'P002' },
  ];

  assert.deepEqual(buildTemplateBody(columns, templateData), [
    ['P001', ''],
    ['P002', ''],
  ]);
});

test('buildTemplateBody falls back to an empty row list for invalid templateData', () => {
  const columns = [
    { field: 'productCode', label: '商品编号', required: true },
    { field: 'price', label: '采购价', required: false },
  ];

  assert.deepEqual(buildTemplateBody(columns, null), []);
  assert.deepEqual(buildTemplateBody(columns, { productCode: 'P001', price: 12.5 }), []);
});

test('template helpers fall back to empty arrays for invalid columns', () => {
  const templateData = [{ productCode: 'P001' }];

  assert.deepEqual(buildTemplateHeader(null), []);
  assert.deepEqual(buildTemplateBody(null, templateData), []);
});
