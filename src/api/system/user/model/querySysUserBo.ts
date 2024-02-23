export interface QuerySysUserBo {
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
   * 岗位名称
   */
  positionName: string;

  /**
   * 部门名称
   */
  deptName: string;

  /**
   * 角色名称
   */
  roleName: string;

  /**
   * 用户名
   */
  username: string;

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
   * 状态
   */
  available: boolean;

  /**
   * 是否锁定
   */
  lockStatus: boolean;

  /**
   * 备注
   */
  description: string;

  /**
   * 创建人
   */
  createBy: string;

  /**
   * 创建时间
   */
  createTime: string;

  /**
   * 修改人
   */
  updateBy: string;

  /**
   * 修改时间
   */
  updateTime: string;
}
