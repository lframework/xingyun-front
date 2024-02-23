import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const GEN_VIEW_TYPE: BaseEnum<number, string> = new BaseEnum<number, string>();
GEN_VIEW_TYPE.set('INPUT', new BaseEnumItem<number, string>(0, '输入框'));
GEN_VIEW_TYPE.set('TEXTAREA', new BaseEnumItem<number, string>(1, '文本域'));
GEN_VIEW_TYPE.set('DATETIME', new BaseEnumItem<number, string>(2, '日期时间选择器'));
GEN_VIEW_TYPE.set('DATE', new BaseEnumItem<number, string>(3, '日期选择器'));
GEN_VIEW_TYPE.set('TIME', new BaseEnumItem<number, string>(4, '时间选择器'));
GEN_VIEW_TYPE.set('SELECT', new BaseEnumItem<number, string>(5, '选择器'));
GEN_VIEW_TYPE.set('DATE_RANGE', new BaseEnumItem<number, string>(6, '日期范围选择器'));
GEN_VIEW_TYPE.set('DATA_DIC', new BaseEnumItem<number, string>(7, '数据字典'));
GEN_VIEW_TYPE.set('CUSTOM_SELECTOR', new BaseEnumItem<number, string>(8, '自定义选择器'));

export { GEN_VIEW_TYPE };
