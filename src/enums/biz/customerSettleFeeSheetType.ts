import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const CUSTOMER_SETTLE_FEE_SHEET_TYPE: BaseEnum<number, string> = new BaseEnum<number, string>();
CUSTOMER_SETTLE_FEE_SHEET_TYPE.set('RECEIVE', new BaseEnumItem<number, string>(1, '应收款'));
CUSTOMER_SETTLE_FEE_SHEET_TYPE.set('PAY', new BaseEnumItem<number, string>(2, '应付款'));

export { CUSTOMER_SETTLE_FEE_SHEET_TYPE };
