import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const GEN_CUSTOM_LIST_BTN_TYPE: BaseEnum<number, string> = new BaseEnum<number, string>();
GEN_CUSTOM_LIST_BTN_TYPE.set('EXTERNAL', new BaseEnumItem<number, string>(0, '外部链接'));
GEN_CUSTOM_LIST_BTN_TYPE.set('ROUTE', new BaseEnumItem<number, string>(1, '路由跳转'));
GEN_CUSTOM_LIST_BTN_TYPE.set('EXCUTE_SCRIPT', new BaseEnumItem<number, string>(3, '执行脚本'));

export { GEN_CUSTOM_LIST_BTN_TYPE };
