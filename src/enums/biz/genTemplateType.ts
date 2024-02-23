import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const GEN_TEMPLATE_TYPE: BaseEnum<number, string> = new BaseEnum<number, string>();
GEN_TEMPLATE_TYPE.set('LIST', new BaseEnumItem<number, string>(1, '列表'));

export { GEN_TEMPLATE_TYPE };
