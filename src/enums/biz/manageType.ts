import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const MANAGE_TYPE: BaseEnum<number, string> = new BaseEnum<number, string>();
MANAGE_TYPE.set('DISTRIBUTION', new BaseEnumItem<number, string>(1, '经销'));

export { MANAGE_TYPE };
