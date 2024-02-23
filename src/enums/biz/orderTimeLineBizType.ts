import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const ORDER_TIME_LINE_BIZ_TYPE: BaseEnum<number, string> = new BaseEnum<number, string>();
ORDER_TIME_LINE_BIZ_TYPE.set('NORMAL', new BaseEnumItem<number, string>(0, '普通操作'));
ORDER_TIME_LINE_BIZ_TYPE.set('CREATE', new BaseEnumItem<number, string>(1, '保存'));
ORDER_TIME_LINE_BIZ_TYPE.set('UPDATE', new BaseEnumItem<number, string>(2, '修改'));
ORDER_TIME_LINE_BIZ_TYPE.set('SEND', new BaseEnumItem<number, string>(3, '发送'));
ORDER_TIME_LINE_BIZ_TYPE.set('APPROVE_PASS', new BaseEnumItem<number, string>(4, '审核通过'));
ORDER_TIME_LINE_BIZ_TYPE.set('APPROVE_RETURN', new BaseEnumItem<number, string>(5, '审核拒绝'));
ORDER_TIME_LINE_BIZ_TYPE.set('CANCEL_APPROVE', new BaseEnumItem<number, string>(6, '取消审核'));
ORDER_TIME_LINE_BIZ_TYPE.set('RECEIVE', new BaseEnumItem<number, string>(7, '收货'));

export { ORDER_TIME_LINE_BIZ_TYPE };
