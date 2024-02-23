import { GenDataObjDetailBo } from '@/api/development/data/obj/model/genDataObjDetailBo';
import { GenDataObjQueryDetailBo } from '@/api/development/data/obj/model/genDataObjQueryDetailBo';

export interface GetGenDataObjBo {
  /**
   * ID
   */
  id: string;

  /**
   * 名称
   */
  name: string;

  /**
   * 主表ID
   */
  mainTableId: string;

  /**
   * 主表名称
   */
  mainTableName: string;

  /**
   * 主表别名
   */
  mainTableAlias: string;

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
   * 关联字段
   */
  columns: GenDataObjDetailBo[];

  /**
   * 自定义查询
   */
  queryColumns: GenDataObjQueryDetailBo[];
}
