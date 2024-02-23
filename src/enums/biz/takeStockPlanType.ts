import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const TAKE_STOCK_PLAN_TYPE: BaseEnum<number, string> = new BaseEnum<number, string>();
TAKE_STOCK_PLAN_TYPE.set('ALL', new BaseEnumItem<number, string>(0, '全场盘点'));
TAKE_STOCK_PLAN_TYPE.set('SIMPLE', new BaseEnumItem<number, string>(1, '单品盘点'));
TAKE_STOCK_PLAN_TYPE.set('CATEGORY', new BaseEnumItem<number, string>(2, '类目盘点'));
TAKE_STOCK_PLAN_TYPE.set('BRAND', new BaseEnumItem<number, string>(3, '品牌盘点'));

export { TAKE_STOCK_PLAN_TYPE };
