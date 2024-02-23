import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const GEN_QUERY_WIDTH_TYPE: BaseEnum<number, string> = new BaseEnum<number, string>();
GEN_QUERY_WIDTH_TYPE.set('FIX', new BaseEnumItem<number, string>(0, '固定宽度'));
GEN_QUERY_WIDTH_TYPE.set('MIN', new BaseEnumItem<number, string>(1, '最小宽度'));

export { GEN_QUERY_WIDTH_TYPE };
