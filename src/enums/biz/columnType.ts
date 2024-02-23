import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const COLUMN_TYPE: BaseEnum<number, string> = new BaseEnum<number, string>();
COLUMN_TYPE.set('MULTIPLE', new BaseEnumItem<number, string>(1, '多选'));
COLUMN_TYPE.set('SINGLE', new BaseEnumItem<number, string>(2, '单选'));
COLUMN_TYPE.set('CUSTOM', new BaseEnumItem<number, string>(3, '手动录入'));

export { COLUMN_TYPE };
