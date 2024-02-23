import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const GEN_QUERY_TYPE: BaseEnum<number, string> = new BaseEnum<number, string>();
GEN_QUERY_TYPE.set('EQ', new BaseEnumItem<number, string>(0, '='));
GEN_QUERY_TYPE.set('GT', new BaseEnumItem<number, string>(1, '>'));
GEN_QUERY_TYPE.set('GE', new BaseEnumItem<number, string>(2, '>='));
GEN_QUERY_TYPE.set('LT', new BaseEnumItem<number, string>(3, '<'));
GEN_QUERY_TYPE.set('LE', new BaseEnumItem<number, string>(4, '<='));
GEN_QUERY_TYPE.set('NE', new BaseEnumItem<number, string>(5, '!='));
GEN_QUERY_TYPE.set('IN', new BaseEnumItem<number, string>(6, 'IN'));
GEN_QUERY_TYPE.set('NOT_IN', new BaseEnumItem<number, string>(7, 'NOT IN'));
GEN_QUERY_TYPE.set('LEFT_LIKE', new BaseEnumItem<number, string>(8, 'LIKE %?'));
GEN_QUERY_TYPE.set('RIGHT_LIKE', new BaseEnumItem<number, string>(9, 'LIKE ?%'));
GEN_QUERY_TYPE.set('AROUND_LIKE', new BaseEnumItem<number, string>(10, 'LIKE %?%'));

export { GEN_QUERY_TYPE };
