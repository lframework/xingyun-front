import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const COLUMN_DATA_TYPE: BaseEnum<number, string> = new BaseEnum<number, string>();
COLUMN_DATA_TYPE.set('INT', new BaseEnumItem<number, string>(1, '整数型'));
COLUMN_DATA_TYPE.set('FLOAT', new BaseEnumItem<number, string>(2, '浮点型'));
COLUMN_DATA_TYPE.set('STRING', new BaseEnumItem<number, string>(3, '字符型'));
COLUMN_DATA_TYPE.set('DATE', new BaseEnumItem<number, string>(4, '日期型'));
COLUMN_DATA_TYPE.set('TIME', new BaseEnumItem<number, string>(5, '时间型'));
COLUMN_DATA_TYPE.set('DATE_TIME', new BaseEnumItem<number, string>(6, '日期时间型'));

export { COLUMN_DATA_TYPE };
