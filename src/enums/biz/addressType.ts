import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const ADDRESS_TYPE: BaseEnum<number, string> = new BaseEnum<number, string>();
ADDRESS_TYPE.set('DELIVERY', new BaseEnumItem<number, string>(1, '发货地址'));
ADDRESS_TYPE.set('RECEIVE', new BaseEnumItem<number, string>(2, '收货地址'));

export { ADDRESS_TYPE };
