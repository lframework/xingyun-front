import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const SC_TRANSFER_ORDER_STATUS: BaseEnum<number, string> = new BaseEnum<number, string>();
SC_TRANSFER_ORDER_STATUS.set('CREATED', new BaseEnumItem<number, string>(0, '待审核'));
SC_TRANSFER_ORDER_STATUS.set('APPROVE_PASS', new BaseEnumItem<number, string>(3, '审核通过'));
SC_TRANSFER_ORDER_STATUS.set('APPROVE_REFUSE', new BaseEnumItem<number, string>(6, '审核拒绝'));
SC_TRANSFER_ORDER_STATUS.set('PART_RECEIVED', new BaseEnumItem<number, string>(9, '部分收货'));
SC_TRANSFER_ORDER_STATUS.set('RECEIVED', new BaseEnumItem<number, string>(12, '已收货'));

export { SC_TRANSFER_ORDER_STATUS };
