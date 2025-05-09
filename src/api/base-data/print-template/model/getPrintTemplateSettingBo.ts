export interface GetPrintTemplateSettingBo {
  /**
   * ID
   */
  id: string;

  /**
   * JSON配置
   */
  templateJson: object;

  /**
   * 示例数据
   */
  demoData: object;

  /**
   * 附加组件配置
   */
  compJsonList: object[];
}
