import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const STOCK_ADJUST_SHEET_STATUS: BaseEnum<number, string> = new BaseEnum<number, string>();
STOCK_ADJUST_SHEET_STATUS.set('CREATED', new BaseEnumItem<number, string>(0, '待审核'));
STOCK_ADJUST_SHEET_STATUS.set('APPROVE_PASS', new BaseEnumItem<number, string>(3, '审核通过'));
STOCK_ADJUST_SHEET_STATUS.set('APPROVE_REFUSE', new BaseEnumItem<number, string>(6, '审核拒绝'));

export { STOCK_ADJUST_SHEET_STATUS };
