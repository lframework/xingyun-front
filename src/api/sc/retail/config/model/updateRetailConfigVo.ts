export interface UpdateRetailConfigVo {
  /**
   * 零售出库单上的会员是否必填
   */
  retailOutSheetRequireMember: boolean;

  /**
   * 零售退货单是否关联零售出库单
   */
  retailReturnRequireOutStock: boolean;

  /**
   * 零售退货单是否多次关联零售出库单
   */
  retailReturnMultipleRelateOutStock: boolean;

  /**
   * 零售退货单上的会员是否必填
   */
  retailReturnRequireMember: boolean;

  /**
   * 零售出库单是否需要发货
   */
  retailOutSheetRequireLogistics: boolean;
}
