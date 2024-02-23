export interface QueryProductStockLogBo {
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
   * 原库存数量
   */
  oriStockNum: number;

  /**
   * 现库存数量
   */
  curStockNum: number;

  /**
   * 原含税成本价
   */
  oriTaxPrice: number;

  /**
   * 现含税成本价
   */
  curTaxPrice: number;

  /**
   * 含税金额
   */
  taxAmount: number;

  /**
   * 创建人
   */
  createBy: string;

  /**
   * 创建时间
   */
  createTime: string;

  /**
   * 业务单据ID
   */
  bizId: string;

  /**
   * 业务单据号
   */
  bizCode: string;

  /**
   * 业务类型
   */
  bizType: number;
}
