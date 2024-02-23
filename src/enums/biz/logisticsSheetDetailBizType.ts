import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const LOGISTICS_SHEET_DETAIL_BIZ_TYPE: BaseEnum<number, string> = new BaseEnum<number, string>();
LOGISTICS_SHEET_DETAIL_BIZ_TYPE.set(
  'SALE_OUT_SHEET',
  new BaseEnumItem<number, string>(1, '销售出库单'),
);
LOGISTICS_SHEET_DETAIL_BIZ_TYPE.set(
  'RETAIL_OUT_SHEET',
  new BaseEnumItem<number, string>(2, '零售出库单'),
);

export { LOGISTICS_SHEET_DETAIL_BIZ_TYPE };
