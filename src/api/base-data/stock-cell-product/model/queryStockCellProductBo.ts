export interface QueryStockCellProductBo {
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
   * 仓位ID
   */
  stockCellId: string;
  /**
   * 仓位编号
   */
  stockCellCode: string;
  /**
   * 仓位名称
   */
  stockCellName: string;
  /**
   * 仓位类型
   */
  stockCellType: number;
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
   * 商品规格
   */
  spec: string;
  /**
   * 单位
   */
  unit: string;
  /**
   * 分类ID
   */
  categoryId: string;
  /**
   * 分类编号
   */
  categoryCode: string;
  /**
   * 分类名称
   */
  categoryName: string;
  /**
   * 品牌ID
   */
  brandId: string;
  /**
   * 品牌编号
   */
  brandCode: string;
  /**
   * 品牌名称
   */
  brandName: string;
}
