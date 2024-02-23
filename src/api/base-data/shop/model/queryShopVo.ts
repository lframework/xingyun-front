import { SortPageVo } from '@/api/model/sortPageVo';

export interface QueryShopVo extends SortPageVo {
  /**
   * 编号
   */
  code: string;

  /**
   * 名称
   */
  name: string;

  /**
   * 所属部门ID
   */
  deptId: string;

  /**
   * 创建时间 起始时间
   */
  createTimeStart: string;

  /**
   * 创建时间 截止时间
   */
  createTimeEnd: string;

  /**
   * 状态
   */
  available: boolean;
}
