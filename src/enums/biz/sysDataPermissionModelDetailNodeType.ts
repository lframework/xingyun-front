import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const SYS_DATA_PERMISSION_MODEL_DETAIL_NODE_TYPE: BaseEnum<number, string> = new BaseEnum<
  number,
  string
>();
SYS_DATA_PERMISSION_MODEL_DETAIL_NODE_TYPE.set(
  'CALC',
  new BaseEnumItem<number, string>(1, '运算节点'),
);
SYS_DATA_PERMISSION_MODEL_DETAIL_NODE_TYPE.set(
  'CONDITION',
  new BaseEnumItem<number, string>(2, '条件节点'),
);

export { SYS_DATA_PERMISSION_MODEL_DETAIL_NODE_TYPE };
