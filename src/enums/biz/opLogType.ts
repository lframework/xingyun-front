import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const OP_LOG_TYPE: BaseEnum<number, string> = new BaseEnum<number, string>();
OP_LOG_TYPE.set('AUTH', new BaseEnumItem<number, string>(1, '用户认证'));
OP_LOG_TYPE.set('SYSTEM', new BaseEnumItem<number, string>(2, '系统管理'));
OP_LOG_TYPE.set('BASE_DATA', new BaseEnumItem<number, string>(1000, '基础信息'));
OP_LOG_TYPE.set('LOGISTICS', new BaseEnumItem<number, string>(2000, '物流单管理'));
OP_LOG_TYPE.set('PURCHASE', new BaseEnumItem<number, string>(2001, '采购业务'));
OP_LOG_TYPE.set('RETAIL', new BaseEnumItem<number, string>(2002, '零售业务'));
OP_LOG_TYPE.set('SALE', new BaseEnumItem<number, string>(2003, '销售业务'));
OP_LOG_TYPE.set('STOCK_ADJUST', new BaseEnumItem<number, string>(2004, '库存调整'));
OP_LOG_TYPE.set('SC_TRANSFER', new BaseEnumItem<number, string>(2005, '仓库调拨'));
OP_LOG_TYPE.set('TAKE_STOCK', new BaseEnumItem<number, string>(2006, '库存盘点'));
OP_LOG_TYPE.set('SETTLE', new BaseEnumItem<number, string>(3000, '结算业务'));
OP_LOG_TYPE.set('SW', new BaseEnumItem<number, string>(4000, '便捷办公'));
OP_LOG_TYPE.set('OTHER', new BaseEnumItem<number, string>(99, '其他'));
export { OP_LOG_TYPE };
