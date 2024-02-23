import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const PROPERTY_TYPE: BaseEnum<number, string> = new BaseEnum<number, string>();
PROPERTY_TYPE.set('COMMON', new BaseEnumItem<number, string>(1, '通用属性'));
PROPERTY_TYPE.set('APPOINT', new BaseEnumItem<number, string>(2, '指定类目属性'));
PROPERTY_TYPE.set('NONE', new BaseEnumItem<number, string>(3, '无'));

export { PROPERTY_TYPE };
