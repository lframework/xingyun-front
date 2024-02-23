import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const SETTLE_TYPE: BaseEnum<number, string> = new BaseEnum<number, string>();
SETTLE_TYPE.set('ARBITRARILY', new BaseEnumItem<number, string>(1, '任意指定'));
SETTLE_TYPE.set('CASH_ON_DELIVERY', new BaseEnumItem<number, string>(2, '货到付款'));

export { SETTLE_TYPE };
