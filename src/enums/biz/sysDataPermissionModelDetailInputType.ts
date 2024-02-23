import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const SYS_DATA_PERMISSION_MODEL_DETAIL_INPUT_TYPE: BaseEnum<number, string> = new BaseEnum<
  number,
  string
>();
SYS_DATA_PERMISSION_MODEL_DETAIL_INPUT_TYPE.set(
  'INPUT',
  new BaseEnumItem<number, string>(0, '输入框'),
);
SYS_DATA_PERMISSION_MODEL_DETAIL_INPUT_TYPE.set(
  'SELECT',
  new BaseEnumItem<number, string>(1, '选择器'),
);
SYS_DATA_PERMISSION_MODEL_DETAIL_INPUT_TYPE.set(
  'DATE_TIME',
  new BaseEnumItem<number, string>(2, '日期时间选择器'),
);
SYS_DATA_PERMISSION_MODEL_DETAIL_INPUT_TYPE.set(
  'DATE',
  new BaseEnumItem<number, string>(3, '日期选择器'),
);
SYS_DATA_PERMISSION_MODEL_DETAIL_INPUT_TYPE.set('SQL', new BaseEnumItem<number, string>(99, 'SQL'));

export { SYS_DATA_PERMISSION_MODEL_DETAIL_INPUT_TYPE };
