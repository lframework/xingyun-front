import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const SETTLE_CHECK_SHEET_CALC_TYPE: BaseEnum<number, string> = new BaseEnum<number, string>();
SETTLE_CHECK_SHEET_CALC_TYPE.set('ADD', new BaseEnumItem<number, string>(1, '加'));
SETTLE_CHECK_SHEET_CALC_TYPE.set('SUB', new BaseEnumItem<number, string>(2, '减'));

export { SETTLE_CHECK_SHEET_CALC_TYPE };
