import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const SETTLE_STATUS: BaseEnum<number, string> = new BaseEnum<number, string>();
SETTLE_STATUS.set('UN_SETTLE', new BaseEnumItem<number, string>(0, '未结算'));
SETTLE_STATUS.set('PART_SETTLE', new BaseEnumItem<number, string>(1, '结算中'));
SETTLE_STATUS.set('SETTLED', new BaseEnumItem<number, string>(3, '已结算'));
SETTLE_STATUS.set('UN_REQUIRE', new BaseEnumItem<number, string>(6, '无需结算'));

export { SETTLE_STATUS };
