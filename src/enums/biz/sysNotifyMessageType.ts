import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const SYS_NOTIFY_GROUP_MESSAGE_TYPE: BaseEnum<number, string> = new BaseEnum<number, string>();
SYS_NOTIFY_GROUP_MESSAGE_TYPE.set('SYS', new BaseEnumItem<number, string>(0, '站内信'));
SYS_NOTIFY_GROUP_MESSAGE_TYPE.set('EMAIL', new BaseEnumItem<number, string>(1, '邮件'));

export { SYS_NOTIFY_GROUP_MESSAGE_TYPE };
