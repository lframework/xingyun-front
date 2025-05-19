import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const SYS_NOTIFY_GROUP_RECEIVER_TYPE: BaseEnum<number, string> = new BaseEnum<number, string>();
SYS_NOTIFY_GROUP_RECEIVER_TYPE.set('DEPT', new BaseEnumItem<number, string>(0, '部门及其子部门'));
SYS_NOTIFY_GROUP_RECEIVER_TYPE.set('USER', new BaseEnumItem<number, string>(1, '用户'));
SYS_NOTIFY_GROUP_RECEIVER_TYPE.set('ROLE', new BaseEnumItem<number, string>(2, '角色'));
SYS_NOTIFY_GROUP_RECEIVER_TYPE.set('USER_GROUP', new BaseEnumItem<number, string>(3, '用户组'));

export { SYS_NOTIFY_GROUP_RECEIVER_TYPE };
