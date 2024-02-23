export interface GenCustomListDetailVo {
  /**
   * ID
   */
  id: string;

  /**
   * 关联ID
   */
  relaId: string;

  /**
   * 宽度类型
   */
  widthType: number;

  /**
   * 是否页面排序
   */
  sortable: boolean;

  /**
   * 宽度
   */
  width: number;

  /**
   * 类型
   */
  type: number;

  /**
   * 格式化脚本
   */
  formatter: string;
}
