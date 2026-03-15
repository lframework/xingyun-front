import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const STOCK_CELL_TYPE: BaseEnum<number, string> = new BaseEnum<number, string>();
STOCK_CELL_TYPE.set('SHELF', new BaseEnumItem<number, string>(1, '货架仓位'));
STOCK_CELL_TYPE.set('STORAGE', new BaseEnumItem<number, string>(2, '存储仓位'));

export { STOCK_CELL_TYPE };
