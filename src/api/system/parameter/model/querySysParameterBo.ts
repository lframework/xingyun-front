export interface QuerySysParameterBo {
  /**
   * ID
   */
  id: number;

  /**
   * 键
   */
  pmKey: string;

  /**
   * 值
   */
  pmValue: string;

  /**
   * 是否加密值
   */
  isEncrypt: boolean;

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
}
