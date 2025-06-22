import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const FLOW_COOPERATE_TYPE: BaseEnum<number, string> = new BaseEnum<number, string>();
FLOW_COOPERATE_TYPE.set('NORMAL', new BaseEnumItem<number, string>(0, '或签'));
FLOW_COOPERATE_TYPE.set('ALL', new BaseEnumItem<number, string>(1, '会签'));
FLOW_COOPERATE_TYPE.set('VOTE', new BaseEnumItem<number, string>(2, '票签'));

export { FLOW_COOPERATE_TYPE };
