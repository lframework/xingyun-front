import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const TRIGGER_STATE: BaseEnum<string, string> = new BaseEnum<string, string>();
TRIGGER_STATE.set('WAITING', new BaseEnumItem<string, string>('WAITING', '等待执行'));
TRIGGER_STATE.set('PAUSED', new BaseEnumItem<string, string>('PAUSED', '暂停执行'));
TRIGGER_STATE.set('ACQUIRED', new BaseEnumItem<string, string>('ACQUIRED', '正常执行'));
TRIGGER_STATE.set('BLOCKED', new BaseEnumItem<string, string>('BLOCKED', '阻塞'));
TRIGGER_STATE.set('ERROR', new BaseEnumItem<string, string>('ERROR', '执行错误'));
TRIGGER_STATE.set('COMPLETE', new BaseEnumItem<string, string>('COMPLETE', '执行完毕'));
TRIGGER_STATE.set('PAUSED_BLOCKED', new BaseEnumItem<string, string>('PAUSED_BLOCKED', '阻塞暂停'));

export { TRIGGER_STATE };
