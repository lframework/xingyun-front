export interface GetGenCustomListBo {
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
   * 列表类型
   */
  listType: number;

  /**
   * 数据对象名称
   */
  dataObjName: string;

  /**
   * 表单Label宽度
   */
  labelWidth: number;

  /**
   * 是否分页
   */
  hasPage: boolean;

  /**
   * 是否树形列表
   */
  treeData: boolean;

  /**
   * ID字段
   */
  idColumn: string;

  /**
   * 父级ID字段
   */
  treePidColumn: string;

  /**
   * 树形节点字段
   */
  treeNodeColumn: string;

  /**
   * 子节点Key值
   */
  treeChildrenKey: string;

  /**
   * 备注
   */
  description: string;

  /**
   * 查询前置SQL
   */
  queryPrefixSql: string;

  /**
   * 查询后置SQL
   */
  querySuffixSql: string;

  /**
   * 后置SQL
   */
  suffixSql: string;

  /**
   * 是否允许导出
   */
  allowExport: boolean;

  /**
   * 状态
   */
  available: boolean;

  /**
   * 工具栏
   */
  toolbars: ToolbarBo[];

  /**
   * 操作列
   */
  handleColumns: HandleColumnBo[];

  /**
   * 查询条件
   */
  queryParams: QueryParamsBo[];

  /**
   * 详情
   */
  details: DetailBo[];
}

export interface DetailBo {
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

export interface HandleColumnBo {
  /**
   * ID
   */
  id: string;

  /**
   * 显示名称
   */
  name: string;

  /**
   * 显示类型
   */
  viewType: string;

  /**
   * 按钮类型
   */
  btnType: number;

  /**
   * 按钮配置
   */
  btnConfig: string;

  /**
   * 图标
   */
  icon: string;

  /**
   * 请求参数
   */
  requestParam: string;

  /**
   * 宽度
   */
  width: number;

  /**
   * 自定义表单ID
   */
  customFormId: string;

  /**
   * 自定义表单名称
   */
  customFormName: string;
}

export interface QueryParamsBo {
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
  defaultValue: string;

  /**
   * 类型
   */
  type: number;

  /**
   * 数据对象
   */
  dataType: number;

  /**
   * 显示类型
   */
  viewType: number;
}

export interface ToolbarBo {
  /**
   * ID
   */
  id: string;

  /**
   * 显示名称
   */
  name: string;

  /**
   * 显示类型
   */
  viewType: string;

  /**
   * 按钮类型
   */
  btnType: number;

  /**
   * 按钮配置
   */
  btnConfig: string;

  /**
   * 图标
   */
  icon: string;

  /**
   * 请求参数
   */
  requestParam: string;

  /**
   * 自定义表单ID
   */
  customFormId: string;

  /**
   * 自定义表单名称
   */
  customFormName: string;
}
