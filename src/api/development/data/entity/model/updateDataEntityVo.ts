import { GenDataEntityDetailVo } from '@/api/development/data/entity/model/genDataEntityDetailVo';

export interface UpdateDataEntityVo {
  /**
   * ID
   */
  id: string;

  /**
   * 名称
   */
  name: string;

  /**
   * 分类ID
   */
  categoryId: string;

  /**
   * 备注
   */
  description: string;

  /**
   * 状态
   */
  available: boolean;

  /**
   * 字段信息
   */
  columns: GenDataEntityDetailVo[];
}
