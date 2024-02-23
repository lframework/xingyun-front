import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const MENU_DISPLAY: BaseEnum<number, string> = new BaseEnum<number, string>();
MENU_DISPLAY.set('CATALOG', new BaseEnumItem<number, string>(0, '目录'));
MENU_DISPLAY.set('FUNCTION', new BaseEnumItem<number, string>(1, '功能'));
MENU_DISPLAY.set('PERMISSION', new BaseEnumItem<number, string>(2, '权限'));

export { MENU_DISPLAY };
