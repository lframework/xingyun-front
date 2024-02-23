import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const SALE_RETURN_STATUS: BaseEnum<number, string> = new BaseEnum<number, string>();
SALE_RETURN_STATUS.set('CREATED', new BaseEnumItem<number, string>(0, '待审核'));
SALE_RETURN_STATUS.set('APPROVE_PASS', new BaseEnumItem<number, string>(3, '审核通过'));
SALE_RETURN_STATUS.set('APPROVE_REFUSE', new BaseEnumItem<number, string>(6, '审核拒绝'));

export { SALE_RETURN_STATUS };
