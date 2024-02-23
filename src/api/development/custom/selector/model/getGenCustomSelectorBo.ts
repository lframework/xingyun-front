export interface GetGenCustomSelectorBo {
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
   * 数据对象ID
   */
  dataObjId: string;

  /**
   * 自定义列表ID
   */
  customListId: string;

  /**
   * 自定义列表名称
   */
  customListName: string;

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
   * 名称字段
   */
  nameColumn: string;

  /**
   * 状态
   */
  available: boolean;
}
