import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const RECEIVE_SHEET_STATUS: BaseEnum<number, string> = new BaseEnum<number, string>();
RECEIVE_SHEET_STATUS.set('CREATED', new BaseEnumItem<number, string>(0, '待审核'));
RECEIVE_SHEET_STATUS.set('APPROVE_PASS', new BaseEnumItem<number, string>(3, '审核通过'));
RECEIVE_SHEET_STATUS.set('APPROVE_REFUSE', new BaseEnumItem<number, string>(6, '审核拒绝'));

export { RECEIVE_SHEET_STATUS };
