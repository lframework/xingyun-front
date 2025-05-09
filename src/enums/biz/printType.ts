import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const PRINT_TYPE: BaseEnum<number, string> = new BaseEnum<number, string>();
PRINT_TYPE.set('PURCHASE_ORDER', new BaseEnumItem<number, string>(1, '采购订单'));
PRINT_TYPE.set('RECEIVE_SHEET', new BaseEnumItem<number, string>(2, '采购收货单'));
PRINT_TYPE.set('PURCHASE_RETURN', new BaseEnumItem<number, string>(3, '采购退货单'));
PRINT_TYPE.set('RETAIL_OUT', new BaseEnumItem<number, string>(4, '零售出库单'));
PRINT_TYPE.set('RETAIL_RETURN', new BaseEnumItem<number, string>(5, '零售退货单'));
PRINT_TYPE.set('SALE_ORDER', new BaseEnumItem<number, string>(6, '销售订单'));
PRINT_TYPE.set('SALE_OUT', new BaseEnumItem<number, string>(7, '销售出库单'));
PRINT_TYPE.set('SALE_RETURN', new BaseEnumItem<number, string>(8, '销售退货单'));

export { PRINT_TYPE };
