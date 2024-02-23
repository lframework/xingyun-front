import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const STOCK_ADJUST_SHEET_BIZ_TYPE: BaseEnum<number, string> = new BaseEnum<number, string>();
STOCK_ADJUST_SHEET_BIZ_TYPE.set('IN', new BaseEnumItem<number, string>(0, '入库'));
STOCK_ADJUST_SHEET_BIZ_TYPE.set('OUT', new BaseEnumItem<number, string>(2, '出库'));

export { STOCK_ADJUST_SHEET_BIZ_TYPE };
