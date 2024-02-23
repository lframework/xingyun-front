import { PageVo } from '@/api/model/pageVo';

export interface QuerySaleProductVo extends PageVo {
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

  /**
   * 是否退货
   */
  isReturn: boolean;
}
