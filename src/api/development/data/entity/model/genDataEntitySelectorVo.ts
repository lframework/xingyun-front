import { PageVo } from '@/api/model/pageVo';

export interface GenDataEntitySelectorVo extends PageVo {
  /**
   * 名称
   */
  name: string;

  /**
   * 分类ID
   */
  categoryId: string;

  /**
   * 状态
   */
  available: boolean;
}
