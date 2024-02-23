import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const GEN_RELA_MODE: BaseEnum<number, string> = new BaseEnum<number, string>();
GEN_RELA_MODE.set('LEFT_JOIN', new BaseEnumItem<number, string>(0, '左连接'));
GEN_RELA_MODE.set('RIGHT_JOIN', new BaseEnumItem<number, string>(1, '右连接'));
GEN_RELA_MODE.set('INNER_JOIN', new BaseEnumItem<number, string>(2, '全连接'));

export { GEN_RELA_MODE };
