export interface GetPreTakeStockSheetBo {
  /**
   * ID
   */
  id: string;

  /**
   * 业务单据号
   */
  code: string;

  /**
   * 仓库ID
   */
  scId: string;

  /**
   * 仓库名称
   */
  scName: string;

  /**
   * 盘点状态
   */
  takeStatus: number;

  /**
   * 备注
   */
  description: string;

  /**
   * 操作人
   */
  updateBy: string;

  /**
   * 操作时间
   */
  updateTime: string;

  /**
   * 明细
   */
  details: SheetDetailBo[];
}

export interface SheetDetailBo {
  /**
   * ID
   */
  id: string;

  /**
   * 商品ID
   */
  productId: string;

  /**
   * 编号
   */
  productCode: string;

  /**
   * 名称
   */
  productName: string;

  /**
   * 类目名称
   */
  categoryName: string;

  /**
   * 品牌名称
   */
  brandName: string;

  /**
   * SKU
   */
  skuCode: string;

  /**
   * 外部编号
   */
  externalCode: string;

  /**
   * 规格
   */
  spec: string;

  /**
   * 单位
   */
  unit: string;

  /**
   * 初盘数量
   */
  firstNum: number;

  /**
   * 复盘数量
   */
  secondNum: number;

  /**
   * 抽盘数量
   */
  randNum: number;
}
