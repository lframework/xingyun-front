import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const MENU_COMPONENT_TYPE: BaseEnum<number, string> = new BaseEnum<number, string>();
MENU_COMPONENT_TYPE.set('NORMAL', new BaseEnumItem<number, string>(0, '普通'));
MENU_COMPONENT_TYPE.set('CUSTOM_LIST', new BaseEnumItem<number, string>(1, '自定义列表'));
MENU_COMPONENT_TYPE.set('CUSTOM_PAGE', new BaseEnumItem<number, string>(3, '自定义页面'));

export { MENU_COMPONENT_TYPE };
