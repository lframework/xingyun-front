export interface QueryDataEntityBo {
  /**
   * ID
   */
  id: string;

  /**
   * 名称
   */
  name: string;

  /**
   * 分类ID
   */
  categoryId: string;

  /**
   * 分类名称
   */
  categoryName: string;

  /**
   * 生成状态
   */
  genStatus: number;

  /**
   * 状态
   */
  available: boolean;

  /**
   * 备注
   */
  description: string;

  /**
   * 创建人ID
   */
  createBy: string;

  /**
   * 创建时间
   */
  createTime: string;

  /**
   * 修改人ID
   */
  updateBy: string;

  /**
   * 修改时间
   */
  updateTime: string;
}
