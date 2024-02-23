export interface SysDeptSelectorBo {
  /**
   * ID
   */
  id: string;

  /**
   * 名称
   */
  name: string;

  /**
   * 父级ID
   */
  parentId: string;

  /**
   * 状态
   */
  available: boolean;
}
