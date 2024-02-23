import { GenCustomListDetailVo } from '@/api/development/custom/list/model/genCustomListDetailVo';
import { GenCustomListToolbarVo } from '@/api/development/custom/list/model/genCustomListToolbarVo';
import { GenCustomListHandleColumnVo } from '@/api/development/custom/list/model/genCustomListHandleColumnVo';
import { GenCustomListQueryParamsVo } from '@/api/development/custom/list/model/genCustomListQueryParamsVo';

export interface CreateGenCustomListVo {
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
   * 列表类型
   */
  listType: number;

  /**
   * 数据对象ID
   */
  dataObjId: string;

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
   * ID字段关联ID
   */
  idColumnRelaId: string;

  /**
   * 父级ID字段
   */
  treePidColumn: string;

  /**
   * 父级ID字段关联ID
   */
  treePidColumnRelaId: string;

  /**
   * 树形节点字段
   */
  treeNodeColumn: string;

  /**
   * 树形节点字段关联ID
   */
  treeNodeColumnRelaId: string;

  /**
   * 子节点Key值
   */
  treeChildrenKey: string;

  /**
   * 是否允许导出
   */
  allowExport: boolean;

  /**
   * 查询条件
   */
  queryParams: GenCustomListQueryParamsVo[];

  /**
   * 列表配置
   */
  details: GenCustomListDetailVo[];

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
   * 工具栏
   */
  toolbars: GenCustomListToolbarVo[];

  /**
   * 操作列
   */
  handleColumns: GenCustomListHandleColumnVo[];
}
