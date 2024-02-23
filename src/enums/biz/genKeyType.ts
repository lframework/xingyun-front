import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const GEN_KEY_TYPE: BaseEnum<number, string> = new BaseEnum<number, string>();
GEN_KEY_TYPE.set('AUTO', new BaseEnumItem<number, string>(0, '自增ID'));
GEN_KEY_TYPE.set('UUID', new BaseEnumItem<number, string>(1, 'UUID'));
GEN_KEY_TYPE.set('SNOW_FLAKE', new BaseEnumItem<number, string>(2, '雪花算法ID'));

export { GEN_KEY_TYPE };
