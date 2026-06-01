export interface GetSysParameterBo {
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
}
