import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const ORDER_CHART_BIZ_TYPE: BaseEnum<number, string> = new BaseEnum<number, string>();
ORDER_CHART_BIZ_TYPE.set('PURCHASE_ORDER', new BaseEnumItem<number, string>(0, '采购订单'));
ORDER_CHART_BIZ_TYPE.set('PURCHASE_RETURN', new BaseEnumItem<number, string>(1, '采购退单'));
ORDER_CHART_BIZ_TYPE.set('SALE_ORDER', new BaseEnumItem<number, string>(2, '销售订单'));
ORDER_CHART_BIZ_TYPE.set('SALE_RETURN', new BaseEnumItem<number, string>(3, '销售退单'));
ORDER_CHART_BIZ_TYPE.set('RETAIL_OUT_SHEET', new BaseEnumItem<number, string>(4, '零售出库单'));
ORDER_CHART_BIZ_TYPE.set('RETAIL_RETURN', new BaseEnumItem<number, string>(5, '零售退单'));

export { ORDER_CHART_BIZ_TYPE };
