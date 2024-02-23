export interface UpdateGenerateInfoVo {
  /**
   * 生成模板类型
   */
  templateType: number;

  /**
   * 包名
   */
  packageName: string;

  /**
   * 模块名称
   */
  moduleName: string;

  /**
   * 业务名称
   */
  bizName: string;

  /**
   * 类名
   */
  className: string;

  /**
   * 类描述
   */
  classDescription: string;

  /**
   * 父级菜单ID
   */
  parentMenuId: string;

  /**
   * 主键类型
   */
  keyType: number;

  /**
   * 作者
   */
  author: string;

  /**
   * 本级菜单编号
   */
  menuCode: string;

  /**
   * 本级菜单名称
   */
  menuName: string;

  /**
   * 详情页Span总数量
   */
  detailSpan: number;

  /**
   * 是否应用缓存
   */
  isCache: boolean;

  /**
   * 是否内置删除功能
   */
  hasDelete: boolean;
}
