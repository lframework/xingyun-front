import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const SYS_DATA_PERMISSION_DATA_PERMISSION_TYPE: BaseEnum<number, string> = new BaseEnum<
  number,
  string
>();
SYS_DATA_PERMISSION_DATA_PERMISSION_TYPE.set(
  'PRODUCT',
  new BaseEnumItem<number, string>(1, '商品'),
);
SYS_DATA_PERMISSION_DATA_PERMISSION_TYPE.set('ORDER', new BaseEnumItem<number, string>(2, '单据'));

const SYS_DATA_PERMISSION_DATA_PERMISSION_TYPE_NAME: BaseEnum<number, string> = new BaseEnum<
  number,
  string
>();

SYS_DATA_PERMISSION_DATA_PERMISSION_TYPE_NAME.set(
  'PRODUCT',
  new BaseEnumItem<number, string>(1, 'product'),
);
SYS_DATA_PERMISSION_DATA_PERMISSION_TYPE_NAME.set(
  'ORDER',
  new BaseEnumItem<number, string>(2, 'order'),
);

export { SYS_DATA_PERMISSION_DATA_PERMISSION_TYPE, SYS_DATA_PERMISSION_DATA_PERMISSION_TYPE_NAME };
