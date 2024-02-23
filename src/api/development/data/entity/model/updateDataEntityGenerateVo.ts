import { UpdateGenerateInfoVo } from '@/api/development/data/entity/model/updateGenerateInfoVo';
import { UpdateCreateColumnConfigVo } from '@/api/development/data/entity/model/updateCreateColumnConfigVo';
import { UpdateUpdateColumnConfigVo } from '@/api/development/data/entity/model/updateUpdateColumnConfigVo';
import { UpdateQueryColumnConfigVo } from '@/api/development/data/entity/model/updateQueryColumnConfigVo';
import { UpdateQueryParamsColumnConfigVo } from '@/api/development/data/entity/model/updateQueryParamsColumnConfigVo';
import { UpdateDetailColumnConfigVo } from '@/api/development/data/entity/model/updateDetailColumnConfigVo';

export interface UpdateDataEntityGenerateVo {
  /**
   * ID
   */
  id: string;

  /**
   * 基础设置
   */
  generateInfo: UpdateGenerateInfoVo;

  /**
   * 新增配置
   */
  createConfigs: UpdateCreateColumnConfigVo[];

  /**
   * 修改配置
   */
  updateConfigs: UpdateUpdateColumnConfigVo[];

  /**
   * 查询配置
   */
  queryConfigs: UpdateQueryColumnConfigVo[];

  /**
   * 查询参数配置
   */
  queryParamsConfigs: UpdateQueryParamsColumnConfigVo[];

  /**
   * 详情配置
   */
  detailConfigs: UpdateDetailColumnConfigVo[];
}
