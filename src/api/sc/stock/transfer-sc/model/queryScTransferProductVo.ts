import { PageVo } from '@/api/model/pageVo';

export interface QueryScTransferProductVo extends PageVo {
  /**
   * 仓库ID
   */
  scId: string;

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
