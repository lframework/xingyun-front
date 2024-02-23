import { SortPageVo } from '@/api/model/sortPageVo';

export interface QueryProductStockVo extends SortPageVo {
  /**
   * 仓库ID
   */
  scId: string;

  /**
   * 商品编号
   */
  productCode: string;

  /**
   * 商品名称
   */
  productName: string;

  /**
   * 商品类目ID
   */
  categoryId: string;

  /**
   * 商品品牌ID
   */
  brandId: string;
}
