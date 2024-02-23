import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const CUSTOMER_SETTLE_CHECK_SHEET_BIZ_TYPE: BaseEnum<number, string> = new BaseEnum<number, string>();
CUSTOMER_SETTLE_CHECK_SHEET_BIZ_TYPE.set('OUT_SHEET', new BaseEnumItem<number, string>(1, '销售出库单'));
CUSTOMER_SETTLE_CHECK_SHEET_BIZ_TYPE.set('SALE_RETURN', new BaseEnumItem<number, string>(2, '销售退单'));
CUSTOMER_SETTLE_CHECK_SHEET_BIZ_TYPE.set('SETTLE_FEE_SHEET', new BaseEnumItem<number, string>(3, '客户费用单'));
CUSTOMER_SETTLE_CHECK_SHEET_BIZ_TYPE.set('SETTLE_PRE_SHEET', new BaseEnumItem<number, string>(4, '客户预收款单'));

export { CUSTOMER_SETTLE_CHECK_SHEET_BIZ_TYPE };
