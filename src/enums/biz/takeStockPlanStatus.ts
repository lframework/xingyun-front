import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const TAKE_STOCK_PLAN_STATUS: BaseEnum<number, string> = new BaseEnum<number, string>();
TAKE_STOCK_PLAN_STATUS.set('CREATED', new BaseEnumItem<number, string>(0, '盘点任务生成'));
TAKE_STOCK_PLAN_STATUS.set('DIFF_CREATED', new BaseEnumItem<number, string>(6, '盘点差异生成'));
TAKE_STOCK_PLAN_STATUS.set('FINISHED', new BaseEnumItem<number, string>(9, '盘点完成'));
TAKE_STOCK_PLAN_STATUS.set('CANCELED', new BaseEnumItem<number, string>(12, '盘点已作废'));

export { TAKE_STOCK_PLAN_STATUS };
