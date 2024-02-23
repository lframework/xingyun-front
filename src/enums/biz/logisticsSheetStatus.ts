import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const LOGISTICS_SHEET_STATUS: BaseEnum<number, string> = new BaseEnum<number, string>();
LOGISTICS_SHEET_STATUS.set('CREATED', new BaseEnumItem<number, string>(0, '待发货'));
LOGISTICS_SHEET_STATUS.set('DELIVERY', new BaseEnumItem<number, string>(3, '已发货'));

export { LOGISTICS_SHEET_STATUS };
