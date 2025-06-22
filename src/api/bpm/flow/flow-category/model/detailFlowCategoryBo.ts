export interface DetailFlowCategoryBo {
  /**
   * ID
   */
  id: number;

  /**
   * 流程类型名称
   */
  name: string;

  /**
   * 父节点ID
   */
  parentId: number;

  /**
   * 父节点名称
   */
  parentName: string;
}
