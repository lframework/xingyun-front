import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const SYS_MAIL_MESSAGE_SEND_STATUS: BaseEnum<number, string> = new BaseEnum<number, string>();
SYS_MAIL_MESSAGE_SEND_STATUS.set('UN_SEND', new BaseEnumItem<number, string>(0, '待发送'));
SYS_MAIL_MESSAGE_SEND_STATUS.set('SENDING', new BaseEnumItem<number, string>(1, '发送中'));
SYS_MAIL_MESSAGE_SEND_STATUS.set('SENDED', new BaseEnumItem<number, string>(2, '已发送'));
SYS_MAIL_MESSAGE_SEND_STATUS.set('FAIL', new BaseEnumItem<number, string>(9, '发送失败'));

export { SYS_MAIL_MESSAGE_SEND_STATUS };
