import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const SYS_DATA_PERMISSION_MODEL_DETAIL_CONDITION_TYPE: BaseEnum<number, string> = new BaseEnum<
  number,
  string
>();
SYS_DATA_PERMISSION_MODEL_DETAIL_CONDITION_TYPE.set(
  'EQ',
  new BaseEnumItem<number, string>(0, '等于'),
);
SYS_DATA_PERMISSION_MODEL_DETAIL_CONDITION_TYPE.set(
  'GT',
  new BaseEnumItem<number, string>(1, '大于'),
);
SYS_DATA_PERMISSION_MODEL_DETAIL_CONDITION_TYPE.set(
  'GE',
  new BaseEnumItem<number, string>(2, '大于或等于'),
);
SYS_DATA_PERMISSION_MODEL_DETAIL_CONDITION_TYPE.set(
  'LT',
  new BaseEnumItem<number, string>(3, '小于'),
);
SYS_DATA_PERMISSION_MODEL_DETAIL_CONDITION_TYPE.set(
  'LE',
  new BaseEnumItem<number, string>(4, '小于或等于'),
);
SYS_DATA_PERMISSION_MODEL_DETAIL_CONDITION_TYPE.set(
  'NE',
  new BaseEnumItem<number, string>(5, '不等于'),
);
SYS_DATA_PERMISSION_MODEL_DETAIL_CONDITION_TYPE.set(
  'IN',
  new BaseEnumItem<number, string>(6, '在列表中'),
);
SYS_DATA_PERMISSION_MODEL_DETAIL_CONDITION_TYPE.set(
  'NOT_IN',
  new BaseEnumItem<number, string>(7, '不在列表中'),
);
SYS_DATA_PERMISSION_MODEL_DETAIL_CONDITION_TYPE.set(
  'LEFT_LIKE',
  new BaseEnumItem<number, string>(8, '结尾'),
);
SYS_DATA_PERMISSION_MODEL_DETAIL_CONDITION_TYPE.set(
  'RIGHT_LIKE',
  new BaseEnumItem<number, string>(9, '开头'),
);
SYS_DATA_PERMISSION_MODEL_DETAIL_CONDITION_TYPE.set(
  'AROUND_LIKE',
  new BaseEnumItem<number, string>(10, '包含'),
);

export { SYS_DATA_PERMISSION_MODEL_DETAIL_CONDITION_TYPE };
