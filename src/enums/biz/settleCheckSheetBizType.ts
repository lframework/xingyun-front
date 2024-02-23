import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const SETTLE_CHECK_SHEET_BIZ_TYPE: BaseEnum<number, string> = new BaseEnum<number, string>();
SETTLE_CHECK_SHEET_BIZ_TYPE.set('RECEIVE_SHEET', new BaseEnumItem<number, string>(1, '采购收货单'));
SETTLE_CHECK_SHEET_BIZ_TYPE.set('PURCHASE_RETURN', new BaseEnumItem<number, string>(2, '采购退单'));
SETTLE_CHECK_SHEET_BIZ_TYPE.set(
  'SETTLE_FEE_SHEET',
  new BaseEnumItem<number, string>(3, '供应商费用单'),
);
SETTLE_CHECK_SHEET_BIZ_TYPE.set(
  'SETTLE_PRE_SHEET',
  new BaseEnumItem<number, string>(4, '供应商预付款单'),
);

export { SETTLE_CHECK_SHEET_BIZ_TYPE };
