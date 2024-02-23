export interface QueryProductStockBo {
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
   * 商品类目
   */
  categoryName: string;

  /**
   * 商品品牌
   */
  brandName: string;

  /**
   * 库存数量
   */
  stockNum: number;

  /**
   * 含税价格
   */
  taxPrice: number;

  /**
   * 含税金额
   */
  taxAmount: number;
}
