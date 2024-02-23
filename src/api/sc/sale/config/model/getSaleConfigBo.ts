export interface GetSaleConfigBo {
  /**
   * 销售出库单是否关联销售订单
   */
  outStockRequireSale: boolean;

  /**
   * 销售出库单是否多次关联销售订单
   */
  outStockMultipleRelateSale: boolean;

  /**
   * 销售退货单是否关联销售出库单
   */
  saleReturnRequireOutStock: boolean;

  /**
   * 销售退货单是否多次关联销售出库单
   */
  saleReturnMultipleRelateOutStock: boolean;

  /**
   * 销售出库单是否关联物流单
   */
  outStockRequireLogistics: boolean;
}
