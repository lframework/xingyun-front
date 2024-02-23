import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const PURCHASE_RETURN_STATUS: BaseEnum<number, string> = new BaseEnum<number, string>();
PURCHASE_RETURN_STATUS.set('CREATED', new BaseEnumItem<number, string>(0, '待审核'));
PURCHASE_RETURN_STATUS.set('APPROVE_PASS', new BaseEnumItem<number, string>(3, '审核通过'));
PURCHASE_RETURN_STATUS.set('APPROVE_REFUSE', new BaseEnumItem<number, string>(6, '审核拒绝'));

export { PURCHASE_RETURN_STATUS };
