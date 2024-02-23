export interface UpdateTakeStockConfigVo {
  /**
   * ID
   */
  id: string;

  /**
   * 库存盘点单关联盘点任务后，是否显示盘点任务中的商品数据
   */
  showProduct: boolean;

  /**
   * 库存盘点单是否显示盘点任务创建时商品的系统库存数量
   */
  showStock: boolean;

  /**
   * 盘点差异生成时是否自动调整盘点任务中商品的系统库存数量
   */
  autoChangeStock: boolean;

  /**
   * 盘点差异单中的盘点数量是否允许手动修改
   */
  allowChangeNum: boolean;

  /**
   * 盘点任务创建后多少小时内未完成，则自动作废
   */
  cancelHours: number;
}
