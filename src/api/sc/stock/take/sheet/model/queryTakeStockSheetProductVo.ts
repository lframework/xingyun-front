import { PageVo } from '@/api/model/pageVo';

export interface QueryTakeStockSheetProductVo extends PageVo {
  /**
   * 检索关键字
   */
  condition: string;

  /**
   * 分类ID
   */
  categoryId: string;

  /**
   * 品牌ID
   */
  brandId: string;

  /**
   * 盘点任务ID
   */
  planId: string;
}
