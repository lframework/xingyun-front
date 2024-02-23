import { PageVo } from '@/api/model/pageVo';

export interface QuerySysUserVo extends PageVo {
  /**
   * 编号
   */
  code: string;

  /**
   * 用户名
   */
  username: string;

  /**
   * 姓名
   */
  name: string;

  /**
   * 岗位ID
   */
  positionId: string;

  /**
   * 部门ID
   */
  deptId: string;

  /**
   * 状态
   */
  available: boolean;

  /**
   * 是否锁定
   */
  lockStatus: boolean;
}
