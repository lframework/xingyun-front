import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const FLOW_DEFINITION_EXT_BIZ_TYPE: BaseEnum<string, string> = new BaseEnum<string, string>();
FLOW_DEFINITION_EXT_BIZ_TYPE.set(
  'SYSTEM',
  new BaseEnumItem<string, string>('system', '系统内部功能'),
);

export { FLOW_DEFINITION_EXT_BIZ_TYPE };
