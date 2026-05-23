import { SortPageVo } from '@/api/model/sortPageVo';

export interface QueryStockCellProductVo extends SortPageVo {
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
   * 仓位类别
   */
  stockCellType: number;
  /**
   * 仓库编号
   */
  scCode: string;
  /**
   * 仓库名称
   */
  scName: string;
  /**
   * 商品编号
   */
  productCode: string;
  /**
   * SKU编号
   */
  skuCode: string;
  /**
   * 商品名称
   */
  productName: string;
  /**
   * 商品分类ID
   */
  categoryId: string;
  /**
   * 商品品牌ID
   */
  brandId: string;
}
