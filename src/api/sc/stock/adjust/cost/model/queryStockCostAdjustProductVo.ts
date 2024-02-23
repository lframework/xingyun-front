import { PageVo } from '@/api/model/pageVo';

export interface QueryStockCostAdjustProductVo extends PageVo {
  /**
   * 仓库ID
   */
  scId: string;

  /**
   * 检索关键字
   */
  condition: string;

  /**
   * 类目ID
   */
  categoryId: string;

  /**
   * 品牌ID
   */
  brandId: string;
}
