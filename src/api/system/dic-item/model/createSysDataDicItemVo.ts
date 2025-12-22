export interface CreateSysDataDicItemVo {
  /**
   * 租户ID
   */
  tenantId: number;

  /**
   * 编号
   */
  code: string;

  /**
   * 名称
   */
  name: string;

  /**
   * 字典ID
   */
  dicId: string;

  /**
   * 排序
   */
  orderNo: number;
}
