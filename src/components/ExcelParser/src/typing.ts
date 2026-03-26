/** Excel 模板列定义 */
export interface ExcelParserColumn {
  /** 字段 key，解析后作为对象的属性名 */
  field: string;
  /** 显示标签，作为 Excel 表头文本 */
  label: string;
  /** 是否必填，必填字段在模板表头前加 * 标记 */
  required?: boolean;
}

/** 解析结果 */
export interface ExcelParserResult<T = Record<string, any>> {
  /** 解析后的数据行数组，key 为 column.field */
  data: T[];
  /** 总行数 */
  totalCount: number;
}
