import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const FLOW_DEFINITION_IS_PUBLISH: BaseEnum<number, string> = new BaseEnum<number, string>();
FLOW_DEFINITION_IS_PUBLISH.set('Y', new BaseEnumItem<number, string>(1, '已发布'));
FLOW_DEFINITION_IS_PUBLISH.set('N', new BaseEnumItem<number, string>(0, '未发布'));
FLOW_DEFINITION_IS_PUBLISH.set('UNABLE', new BaseEnumItem<number, string>(9, '已失效'));

export { FLOW_DEFINITION_IS_PUBLISH };
