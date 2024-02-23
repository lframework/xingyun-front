import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const GEN_RELA_TYPE: BaseEnum<number, string> = new BaseEnum<number, string>();
GEN_RELA_TYPE.set('ONE_RELA_ONE', new BaseEnumItem<number, string>(0, '一对一'));
GEN_RELA_TYPE.set('ONE_RELA_MANY', new BaseEnumItem<number, string>(1, '一对多'));

export { GEN_RELA_TYPE };
