import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const MENU_COMPONENT_TYPE: BaseEnum<number, string> = new BaseEnum<number, string>();
MENU_COMPONENT_TYPE.set('NORMAL', new BaseEnumItem<number, string>(0, '普通'));

export { MENU_COMPONENT_TYPE };
