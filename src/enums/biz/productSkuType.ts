import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const PRODUCT_SKU_TYPE: BaseEnum<number, string> = new BaseEnum<number, string>();
PRODUCT_SKU_TYPE.set('SINGLE', new BaseEnumItem<number, string>(1, '单SKU'));
PRODUCT_SKU_TYPE.set('MULTI', new BaseEnumItem<number, string>(2, '多SKU'));

export { PRODUCT_SKU_TYPE };
