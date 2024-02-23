export interface GenCustomListQueryParamsVo {
  /**
   * ID
   */
  id: string;

  /**
   * 关联ID
   */
  relaId: string;

  /**
   * 前端显示
   */
  frontShow: boolean;

  /**
   * 查询类型
   */
  queryType: number;

  /**
   * 表单宽度
   */
  formWidth: number;

  /**
   * 默认值
   */
  defaultValue: object;

  /**
   * 类型
   */
  type: number;
}
