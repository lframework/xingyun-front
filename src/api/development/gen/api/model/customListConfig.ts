export interface CustomListConfig {
  /**
   * 工具栏
   */
  toolbars: Toolbar[];

  /**
   * 查询参数
   */
  queryParams: QueryParam[];

  /**
   * 操作列
   */
  handleColumns: HandleColumn[];

  /**
   * 列表配置
   */
  listConfig: ListConfig;
}

export interface ListConfig {
  /**
   * ID
   */
  id: string;

  /**
   * 列表类型
   */
  listType: number;

  /**
   * 表单宽度列表
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
   * 是否允许导出
   */
  allowExport: boolean;

  /**
   * 字段
   */
  fields: FieldConfig[];
}

export interface Toolbar {
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
}

export interface QueryParam {
  /**
   * 表别名
   */
  tableAlias: string;

  /**
   * 字段名称
   */
  columnName: string;

  /**
   * 显示名称
   */
  name: string;

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
   * 显示类型
   */
  viewType: number;

  /**
   * 数据类型
   */
  dataType: number;

  /**
   * 是否内置枚举
   */
  fixEnum: boolean;

  /**
   * 前端字段类型 只有字段是枚举时生效，此值为前端枚举类型
   */
  frontType: string;

  /**
   * 是否包含状态Tag
   */
  hasAvailableTag: boolean;

  /**
   * 数据字典Code
   */
  dataDicCode: string;

  /**
   * 自定义选择器ID
   */
  customSelectorId: string;

  /**
   * 默认值
   */
  defaultValue: any;
}

export interface HandleColumn {
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
   * 宽度
   */
  width: number;

  /**
   * 请求参数
   */
  requestParam: string;
}

export interface FieldConfig {
  /**
   * 显示名称
   */
  name: string;

  /**
   * 字段名称
   */
  columnName: string;

  /**
   * 宽度类型
   */
  widthType: number;

  /**
   * 宽度
   */
  width: number;

  /**
   * 是否页面排序
   */
  sortable: boolean;

  /**
   * 是否数字类型
   */
  isNumberType: boolean;

  /**
   * 是否包含状态Tag
   */
  hasAvailableTag: boolean;

  /**
   * 是否内置枚举
   */
  fixEnum: boolean;

  /**
   * 前端字段类型 只有字段是枚举时生效，此值为前端枚举类型
   */
  frontType: string;

  /**
   * 数据类型
   */
  dataType: number;

  /**
   * 格式化脚本
   */
  formatter: string;
}
