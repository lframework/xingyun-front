export interface UpdatePayTypeVo {
  /**
   * ID
   */
  id: string;

  /**
   * 编号
   */
  code: string;

  /**
   * 名称
   */
  name: string;

  /**
   * 是否记录内容
   */
  recText: boolean;

  /**
   * 状态
   */
  available: boolean;

  /**
   * 备注
   */
  description: string;
}
