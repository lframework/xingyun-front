import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const FLOW_DEFINITION_ACTIVITY_STATUS: BaseEnum<number, string> = new BaseEnum<number, string>();
FLOW_DEFINITION_ACTIVITY_STATUS.set('ACTIVATE', new BaseEnumItem<number, string>(1, '已激活'));
FLOW_DEFINITION_ACTIVITY_STATUS.set('DEACTIVATE', new BaseEnumItem<number, string>(0, '已挂起'));

export { FLOW_DEFINITION_ACTIVITY_STATUS };
