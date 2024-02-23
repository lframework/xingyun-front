import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const SYS_DATA_PERMISSION_MODEL_DETAIL_CALC_TYPE: BaseEnum<number, string> = new BaseEnum<number, string>();
SYS_DATA_PERMISSION_MODEL_DETAIL_CALC_TYPE.set('AND', new BaseEnumItem<number, string>(1, '并且'));
SYS_DATA_PERMISSION_MODEL_DETAIL_CALC_TYPE.set('OR', new BaseEnumItem<number, string>(2, '或者'));

export { SYS_DATA_PERMISSION_MODEL_DETAIL_CALC_TYPE };
