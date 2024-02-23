export interface QuerySysModuleBo {
  /**
   * ID
   */
  id: number;

  /**
   * 名称
   */
  name: string;

  /**
   * 备注
   */
  description: string;

  /**
   * 是否启用
   */
  enabled: boolean;

  /**
   * 过期时间
   */
  expireTime: string;
}
