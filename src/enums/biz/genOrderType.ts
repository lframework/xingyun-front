import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const GEN_ORDER_TYPE: BaseEnum<string, string> = new BaseEnum<string, string>();
GEN_ORDER_TYPE.set('ASC', new BaseEnumItem<string, string>('ASC', '升序'));
GEN_ORDER_TYPE.set('DESC', new BaseEnumItem<string, string>('DESC', '降序'));

export { GEN_ORDER_TYPE };
