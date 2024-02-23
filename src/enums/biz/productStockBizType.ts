import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const PRODUCT_STOCK_BIZ_TYPE: BaseEnum<number, string> = new BaseEnum<number, string>();
PRODUCT_STOCK_BIZ_TYPE.set('PURCHASE', new BaseEnumItem<number, string>(1, '采购入库'));
PRODUCT_STOCK_BIZ_TYPE.set('PURCHASE_RETURN', new BaseEnumItem<number, string>(2, '采购退货出库'));
PRODUCT_STOCK_BIZ_TYPE.set('SALE', new BaseEnumItem<number, string>(3, '销售出库'));
PRODUCT_STOCK_BIZ_TYPE.set('SALE_RETURN', new BaseEnumItem<number, string>(4, '销售退货入库'));
PRODUCT_STOCK_BIZ_TYPE.set('RETAIL', new BaseEnumItem<number, string>(5, '零售出库'));
PRODUCT_STOCK_BIZ_TYPE.set('RETAIL_RETURN', new BaseEnumItem<number, string>(6, '零售退货入库'));
PRODUCT_STOCK_BIZ_TYPE.set('TAKE_STOCK_IN', new BaseEnumItem<number, string>(7, '盘点入库'));
PRODUCT_STOCK_BIZ_TYPE.set('TAKE_STOCK_OUT', new BaseEnumItem<number, string>(8, '盘点出库'));
PRODUCT_STOCK_BIZ_TYPE.set(
  'STOCK_COST_ADJUST',
  new BaseEnumItem<number, string>(9, '库存成本调整'),
);
PRODUCT_STOCK_BIZ_TYPE.set('STOCK_ADJUST', new BaseEnumItem<number, string>(10, '库存调整'));
PRODUCT_STOCK_BIZ_TYPE.set('SC_TRANSFER', new BaseEnumItem<number, string>(11, '仓库调拨'));

export { PRODUCT_STOCK_BIZ_TYPE };
