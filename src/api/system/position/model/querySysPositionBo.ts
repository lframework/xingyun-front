export interface QuerySysPositionBo {
  /**
   * ID
   */
  id: string;

  /**
   * 岗位编号
   */
  code: string;

  /**
   * 岗位名称
   */
  name: string;

  /**
   * 状态
   */
  available: boolean;

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
