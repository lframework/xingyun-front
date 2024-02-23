import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const SETTLE_PRE_SHEET_STATUS: BaseEnum<number, string> = new BaseEnum<number, string>();
SETTLE_PRE_SHEET_STATUS.set('CREATED', new BaseEnumItem<number, string>(0, '待审核'));
SETTLE_PRE_SHEET_STATUS.set('APPROVE_PASS', new BaseEnumItem<number, string>(3, '审核通过'));
SETTLE_PRE_SHEET_STATUS.set('APPROVE_REFUSE', new BaseEnumItem<number, string>(6, '审核拒绝'));

export { SETTLE_PRE_SHEET_STATUS };
