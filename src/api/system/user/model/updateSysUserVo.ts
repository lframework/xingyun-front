export interface UpdateSysUserVo {
  /**
   * ID
   */
  id: string;

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
   * 密码 如果不为空则为修改密码
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
   * 岗位ID
   */
  positionIds: string[];

  /**
   * 角色ID
   */
  roleIds: string[];

  /**
   * 部门ID
   */
  deptIds: string[];

  /**
   * 状态
   */
  available: boolean;

  /**
   * 备注
   */
  description: string;
}
