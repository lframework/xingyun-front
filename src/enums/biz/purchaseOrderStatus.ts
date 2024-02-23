import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const PURCHASE_ORDER_STATUS: BaseEnum<number, string> = new BaseEnum<number, string>();
PURCHASE_ORDER_STATUS.set('CREATED', new BaseEnumItem<number, string>(0, '待审核'));
PURCHASE_ORDER_STATUS.set('APPROVE_PASS', new BaseEnumItem<number, string>(3, '审核通过'));
PURCHASE_ORDER_STATUS.set('APPROVE_REFUSE', new BaseEnumItem<number, string>(6, '审核拒绝'));

export { PURCHASE_ORDER_STATUS };
