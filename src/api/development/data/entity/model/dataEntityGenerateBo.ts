import { GenDataEntityDetailGenerateBo } from '@/api/development/data/entity/model/genDataEntityDetailGenerateBo';
import { GenGenerateInfoBo } from '@/api/development/data/entity/model/genGenerateInfoBo';
import { GenCreateColumnConfigBo } from '@/api/development/data/entity/model/genCreateColumnConfigBo';
import { GenDetailColumnConfigBo } from '@/api/development/data/entity/model/genDetailColumnConfigBo';
import { GenQueryParamsColumnConfigBo } from '@/api/development/data/entity/model/genQueryParamsColumnConfigBo';
import { GenQueryColumnConfigBo } from '@/api/development/data/entity/model/genQueryColumnConfigBo';
import { GenUpdateColumnConfigBo } from '@/api/development/data/entity/model/genUpdateColumnConfigBo';

export interface DataEntityGenerateBo {
  /**
   * 字段信息
   */
  columns: GenDataEntityDetailGenerateBo[];

  /**
   * 基本设置
   */
  generateInfo: GenGenerateInfoBo;

  /**
   * 新增配置
   */
  createConfigs: GenCreateColumnConfigBo[];

  /**
   * 修改配置
   */
  updateConfigs: GenUpdateColumnConfigBo[];

  /**
   * 查询配置
   */
  queryConfigs: GenQueryColumnConfigBo[];

  /**
   * 查询参数配置
   */
  queryParamsConfigs: GenQueryParamsColumnConfigBo[];

  /**
   * 详情配置
   */
  detailConfigs: GenDetailColumnConfigBo[];
}
