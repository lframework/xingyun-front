import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const SYS_DATA_PERMISSION_DATA_BIZ_TYPE: BaseEnum<number, string> = new BaseEnum<number, string>();
SYS_DATA_PERMISSION_DATA_BIZ_TYPE.set('ROLE', new BaseEnumItem<number, string>(0, '角色'));
SYS_DATA_PERMISSION_DATA_BIZ_TYPE.set('DEPT', new BaseEnumItem<number, string>(1, '部门'));
SYS_DATA_PERMISSION_DATA_BIZ_TYPE.set('USER', new BaseEnumItem<number, string>(2, '用户'));

export { SYS_DATA_PERMISSION_DATA_BIZ_TYPE };
