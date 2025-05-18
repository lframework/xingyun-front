import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const GENERATE_CODE_TYPE: BaseEnum<number, string> = new BaseEnum<number, string>();
GENERATE_CODE_TYPE.set('USER', new BaseEnumItem<number, string>(1, '用户编号'));
GENERATE_CODE_TYPE.set('DEPT', new BaseEnumItem<number, string>(2, '部门编号'));
GENERATE_CODE_TYPE.set('ROLE', new BaseEnumItem<number, string>(3, '角色编号'));
GENERATE_CODE_TYPE.set('SC', new BaseEnumItem<number, string>(4, '仓库编号'));
GENERATE_CODE_TYPE.set('CUSTOMER', new BaseEnumItem<number, string>(5, '客户编号'));
GENERATE_CODE_TYPE.set('SUPPLIER', new BaseEnumItem<number, string>(6, '供应商编号'));
GENERATE_CODE_TYPE.set('MEMBER', new BaseEnumItem<number, string>(7, '会员编号'));
GENERATE_CODE_TYPE.set('SHOP', new BaseEnumItem<number, string>(8, '门店编号'));
GENERATE_CODE_TYPE.set('BRAND', new BaseEnumItem<number, string>(9, '品牌编号'));
GENERATE_CODE_TYPE.set('PRODUCT', new BaseEnumItem<number, string>(10, '商品编号'));
GENERATE_CODE_TYPE.set('USER_GROUP', new BaseEnumItem<number, string>(11, '用户编号'));
GENERATE_CODE_TYPE.set('COMMON', new BaseEnumItem<number, string>(99, '通用编号'));
GENERATE_CODE_TYPE.set('PURCHASE_ORDER', new BaseEnumItem<number, string>(200, '采购订单号'));
GENERATE_CODE_TYPE.set('RECEIVE_SHEET', new BaseEnumItem<number, string>(201, '采购收货单号'));
GENERATE_CODE_TYPE.set('PURCHASE_RETURN', new BaseEnumItem<number, string>(202, '采购退单号'));
GENERATE_CODE_TYPE.set('SALE_ORDER', new BaseEnumItem<number, string>(203, '销售订单号'));
GENERATE_CODE_TYPE.set('SALE_OUT_SHEET', new BaseEnumItem<number, string>(204, '销售出库单号'));
GENERATE_CODE_TYPE.set('SALE_RETURN', new BaseEnumItem<number, string>(205, '销售退货单号'));
GENERATE_CODE_TYPE.set('RETAIL_OUT_SHEET', new BaseEnumItem<number, string>(206, '零售出库单号'));
GENERATE_CODE_TYPE.set('RETAIL_RETURN', new BaseEnumItem<number, string>(207, '零售退货单号'));
GENERATE_CODE_TYPE.set(
  'PRE_TAKE_STOCK_SHEET',
  new BaseEnumItem<number, string>(208, '预先盘点单号'),
);
GENERATE_CODE_TYPE.set('TAKE_STOCK_PLAN', new BaseEnumItem<number, string>(209, '盘点任务号'));
GENERATE_CODE_TYPE.set('TAKE_STOCK_SHEET', new BaseEnumItem<number, string>(210, '盘点单号'));
GENERATE_CODE_TYPE.set('STOCK_ADJUST_SHEET', new BaseEnumItem<number, string>(212, '库存调整单号'));
GENERATE_CODE_TYPE.set('SC_TRANSFER_ORDER', new BaseEnumItem<number, string>(213, '仓库调拨单号'));
GENERATE_CODE_TYPE.set('LOGISTICS_SHEET', new BaseEnumItem<number, string>(214, '物流单号'));
GENERATE_CODE_TYPE.set(
  'SETTLE_CHECK_SHEET',
  new BaseEnumItem<number, string>(300, '供应商对账单号'),
);
GENERATE_CODE_TYPE.set('SETTLE_FEE_SHEET', new BaseEnumItem<number, string>(301, '供应商费用单号'));
GENERATE_CODE_TYPE.set('SETTLE_PRE_SHEET', new BaseEnumItem<number, string>(302, '供应商付款单号'));
GENERATE_CODE_TYPE.set('SETTLE_SHEET', new BaseEnumItem<number, string>(303, '供应商结算单号'));
GENERATE_CODE_TYPE.set(
  'CUSTOMER_SETTLE_CHECK_SHEET',
  new BaseEnumItem<number, string>(304, '客户对账单号'),
);
GENERATE_CODE_TYPE.set(
  'CUSTOMER_SETTLE_FEE_SHEET',
  new BaseEnumItem<number, string>(305, '客户费用单号'),
);
GENERATE_CODE_TYPE.set(
  'CUSTOMER_SETTLE_PRE_SHEET',
  new BaseEnumItem<number, string>(306, '客户预付款单号'),
);
GENERATE_CODE_TYPE.set(
  'CUSTOMER_SETTLE_SHEET',
  new BaseEnumItem<number, string>(307, '客户结算单号'),
);

export { GENERATE_CODE_TYPE };
