import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const GEN_STATUS: BaseEnum<number, string> = new BaseEnum<number, string>();
GEN_STATUS.set('CREATED', new BaseEnumItem<number, string>(0, '已生成'));
GEN_STATUS.set('SET_TABLE', new BaseEnumItem<number, string>(1, '已设置数据表'));
GEN_STATUS.set('SET_GEN', new BaseEnumItem<number, string>(2, '已设置生成配置'));

export { GEN_STATUS };
