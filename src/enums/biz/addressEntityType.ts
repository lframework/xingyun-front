import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const ADDRESS_ENTITY_TYPE: BaseEnum<number, string> = new BaseEnum<number, string>();
ADDRESS_ENTITY_TYPE.set('SC', new BaseEnumItem<number, string>(1, '仓库'));
ADDRESS_ENTITY_TYPE.set('CUSTOMER', new BaseEnumItem<number, string>(2, '客户'));
ADDRESS_ENTITY_TYPE.set('SUPPLIER', new BaseEnumItem<number, string>(3, '供应商'));
ADDRESS_ENTITY_TYPE.set('MEMBER', new BaseEnumItem<number, string>(4, '会员'));
ADDRESS_ENTITY_TYPE.set('SHOP', new BaseEnumItem<number, string>(5, '门店'));

export { ADDRESS_ENTITY_TYPE };
