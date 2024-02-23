import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const GENDER: BaseEnum<number, string> = new BaseEnum<number, string>();
GENDER.set('UNKNOWN', new BaseEnumItem<number, string>(0, '未知'));
GENDER.set('MAN', new BaseEnumItem<number, string>(1, '男'));
GENDER.set('FEMALE', new BaseEnumItem<number, string>(2, '女'));

export { GENDER };
