const PRODUCT_STOCK_BIZ_TYPE = {
  PURCHASE: {
    code: 1,
    desc: '采购入库'
  },
  PURCHASE_RETURN: {
    code: 2,
    desc: '采购退货出库'
  },
  SALE: {
    code: 3,
    desc: '销售出库'
  },
  SALE_RETURN: {
    code: 4,
    desc: '销售退货入库'
  },
  RETAIL: {
    code: 5,
    desc: '零售出库'
  },
  RETAIL_RETURN: {
    code: 6,
    desc: '零售退货入库'
  }
}

export default PRODUCT_STOCK_BIZ_TYPE
