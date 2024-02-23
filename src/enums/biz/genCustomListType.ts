import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const GEN_CUSTOM_LIST_TYPE: BaseEnum<number, string> = new BaseEnum<number, string>();
GEN_CUSTOM_LIST_TYPE.set('SEQ', new BaseEnumItem<number, string>(0, '序列'));
GEN_CUSTOM_LIST_TYPE.set('SINGLE', new BaseEnumItem<number, string>(1, '单选'));
GEN_CUSTOM_LIST_TYPE.set('MULTIPLE', new BaseEnumItem<number, string>(2, '多选'));

export { GEN_CUSTOM_LIST_TYPE };
