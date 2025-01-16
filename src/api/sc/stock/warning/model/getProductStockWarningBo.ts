export interface GetProductStockWarningBo {
  /**
   * ID
   */
  id: string;

  /**
   * 仓库ID
   */
  scId: string;

  /**
   * 仓库编号
   */
  scCode: string;

  /**
   * 仓库名称
   */
  scName: string;

  /**
   * 商品ID
   */
  productId: string;

  /**
   * 商品编号
   */
  productCode: string;

  /**
   * 商品名称
   */
  productName: string;

  /**
   * 预警下限
   */
  minLimit: number;

  /**
   * 预警上限
   */
  maxLimit: number;

  /**
   * 操作人
   */
  updateBy: string;

  /**
   * 操作时间
   */
  updateTime: string;

  /**
   * 状态
   */
  available: boolean;
}
