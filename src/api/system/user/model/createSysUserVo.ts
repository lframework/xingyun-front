export interface CreateSysUserVo {
  /**
   * 编号
   */
  code: string;

  /**
   * 姓名
   */
  name: string;

  /**
   * 用户名
   */
  username: string;

  /**
   * 密码
   */
  password: string;

  /**
   * 邮箱
   */
  email: string;

  /**
   * 联系电话
   */
  telephone: string;

  /**
   * 性别
   */
  gender: number;

  /**
   * 部门ID
   */
  deptIds: string[];

  /**
   * 角色ID
   */
  roleIds: string[];

  /**
   * 岗位ID
   */
  positionIds: string[];

  /**
   * 备注
   */
  description: string;
}
