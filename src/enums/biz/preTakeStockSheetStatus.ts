import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const PRE_TAKE_STOCK_SHEET_STATUS: BaseEnum<number, string> = new BaseEnum<number, string>();
PRE_TAKE_STOCK_SHEET_STATUS.set('FIRST_TAKE', new BaseEnumItem<number, string>(0, '初盘'));
PRE_TAKE_STOCK_SHEET_STATUS.set('SECOND_TAKE', new BaseEnumItem<number, string>(1, '复盘'));
PRE_TAKE_STOCK_SHEET_STATUS.set('RAND_TAKE', new BaseEnumItem<number, string>(2, '抽盘'));

export { PRE_TAKE_STOCK_SHEET_STATUS };
