import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const TAX_RATE: BaseEnum<number, string> = new BaseEnum<number, string>();
TAX_RATE.set('RATE17', new BaseEnumItem<number, string>(17, '17%'));
TAX_RATE.set('RATE11', new BaseEnumItem<number, string>(11, '11%'));
TAX_RATE.set('RATE6', new BaseEnumItem<number, string>(6, '6%'));
TAX_RATE.set('RATE3', new BaseEnumItem<number, string>(3, '3%'));
TAX_RATE.set('RATE0', new BaseEnumItem<number, string>(0, '0%'));
TAX_RATE.set('FREE', new BaseEnumItem<number, string>(-1, '免税'));

export { TAX_RATE };
