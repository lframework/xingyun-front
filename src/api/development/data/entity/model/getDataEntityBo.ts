import { GenDataEntityDetailBo } from '@/api/development/data/entity/model/genDataEntityDetailBo';

export interface GetDataEntityBo {
  /**
   * ID
   */
  id: string;

  /**
   * 名称
   */
  name: string;

  /**
   * 数据表
   */
  tableName: string;

  /**
   * 分类ID
   */
  categoryId: string;

  /**
   * 分类名称
   */
  categoryName: string;

  /**
   * 状态
   */
  available: boolean;

  /**
   * 备注
   */
  description: string;

  /**
   * 字段信息
   */
  columns: GenDataEntityDetailBo[];
}
