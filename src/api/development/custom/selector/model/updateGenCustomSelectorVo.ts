export interface UpdateGenCustomSelectorVo {
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
   * 备注
   */
  description: string;

  /**
   * 对话框标题
   */
  dialogTittle: string;

  /**
   * 对话框宽度
   */
  dialogWidth: string;

  /**
   * 占位符
   */
  placeholder: string;

  /**
   * ID字段
   */
  idColumn: string;

  /**
   * ID字段关联ID
   */
  idColumnRelaId: string;

  /**
   * 名称字段
   */
  nameColumn: string;

  /**
   * 名称字段关联ID
   */
  nameColumnRelaId: string;

  /**
   * 状态
   */
  available: boolean;
}
