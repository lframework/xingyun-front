import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const CUSTOMER_SETTLE_CHECK_SHEET_CALC_TYPE: BaseEnum<number, string> = new BaseEnum<
  number,
  string
>();
CUSTOMER_SETTLE_CHECK_SHEET_CALC_TYPE.set('ADD', new BaseEnumItem<number, string>(1, '加'));
CUSTOMER_SETTLE_CHECK_SHEET_CALC_TYPE.set('SUB', new BaseEnumItem<number, string>(2, '减'));

export { CUSTOMER_SETTLE_CHECK_SHEET_CALC_TYPE };
