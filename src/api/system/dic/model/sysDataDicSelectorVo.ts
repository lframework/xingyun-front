import { PageVo } from '@/api/model/pageVo';

export interface SysDataDicSelectorVo extends PageVo {
  /**
   * 编号
   */
  code: string;

  /**
   * 名称
   */
  name: string;

  /**
   * 分类ID
   */
  categoryId: string;
}
