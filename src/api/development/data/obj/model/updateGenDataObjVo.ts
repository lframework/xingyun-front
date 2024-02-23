import { GenDataObjDetailVo } from '@/api/development/data/obj/model/genDataObjDetailVo';
import { GenDataObjQueryDetailVo } from '@/api/development/data/obj/model/genDataObjQueryDetailVo';

export interface UpdateGenDataObjVo {
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
   * 主表别名
   */
  mainTableAlias: string;

  /**
   * 状态
   */
  available: boolean;

  /**
   * 关联信息
   */
  columns: GenDataObjDetailVo[];

  /**
   * 自定义查询
   */
  queryColumns: GenDataObjQueryDetailVo[];
}
