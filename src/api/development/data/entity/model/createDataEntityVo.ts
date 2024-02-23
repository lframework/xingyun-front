import { GenDataEntityDetailVo } from '@/api/development/data/entity/model/genDataEntityDetailVo';

export interface CreateDataEntityVo {
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
   * 数据表
   */
  tableName: string;

  /**
   * 字段信息
   */
  columns: GenDataEntityDetailVo[];
}
