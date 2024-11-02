import { PageVo } from '@/api/model/pageVo';

export interface QueryPreTakeStockProductVo extends PageVo {
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
}
