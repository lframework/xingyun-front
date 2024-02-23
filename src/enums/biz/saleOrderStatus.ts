import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const SALE_ORDER_STATUS: BaseEnum<number, string> = new BaseEnum<number, string>();
SALE_ORDER_STATUS.set('CREATED', new BaseEnumItem<number, string>(0, '待审核'));
SALE_ORDER_STATUS.set('APPROVE_PASS', new BaseEnumItem<number, string>(3, '审核通过'));
SALE_ORDER_STATUS.set('APPROVE_REFUSE', new BaseEnumItem<number, string>(6, '审核拒绝'));

export { SALE_ORDER_STATUS };
