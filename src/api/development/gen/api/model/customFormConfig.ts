export interface CustomFormConfig {
  /**
   * 是否对话框表单
   */
  isDialog: boolean;

  /**
   * 对话框宽度
   */
  dialogWidth: string;

  /**
   * 对话框标题
   */
  dialogTittle: string;

  /**
   * 表单配置
   */
  formConfig: string;

  /**
   * 提交前置脚本
   */
  prefixSubmit: string;

  /**
   * 提交后置脚本
   */
  suffixSubmit: string;

  /**
   * 是否需要查询
   */
  requireQuery: boolean;

  /**
   * 操作数据Bean
   */
  handleBean: string;
}
