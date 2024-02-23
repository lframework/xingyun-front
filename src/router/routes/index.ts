import type { AppRouteRecordRaw, AppRouteModule } from '/@/router/types';

import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '/@/router/routes/basic';

import { PageEnum } from '/@/enums/pageEnum';
import { t } from '/@/hooks/web/useI18n';
import { LAYOUT } from '@/router/constant';

// import.meta.glob() 直接引入所有的模块 Vite 独有的功能
const modules = import.meta.glob('./modules/**/*.ts', { eager: true });
const routeModuleList: AppRouteModule[] = [];

// 加入到路由集合中
Object.keys(modules).forEach((key) => {
  const mod = (modules as Recordable)[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routeModuleList.push(...modList);
});

export const asyncRoutes = [PAGE_NOT_FOUND_ROUTE, ...routeModuleList];

// 根路由
export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'Root',
  },
};

export const LoginRoute: AppRouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('/@/views/sys/login/Login.vue'),
  meta: {
    title: t('routes.basic.login'),
  },
};

export const SettingsRoute: AppRouteRecordRaw = {
  path: '/settings',
  name: 'Settings',
  component: LAYOUT,
  redirect: '/settings/index',
  children: [
    {
      path: 'index',
      name: 'SettingsIndex',
      component: () => import('/@/views/sys/settings/index.vue'),
      meta: {
        title: '个人设置',
        hideMenu: true,
        hideBreadcrumb: true,
      },
    },
  ],
};

export const ProfileRoute: AppRouteRecordRaw = {
  path: '/profile',
  name: 'Profile',
  component: LAYOUT,
  redirect: '/profile/index',
  children: [
    {
      path: 'index',
      name: 'ProfileIndex',
      component: () => import('/@/views/sys/profile/index.vue'),
      meta: {
        title: '个人中心',
        hideMenu: true,
        hideBreadcrumb: true,
      },
    },
  ],
};

export const ProductRoute: AppRouteRecordRaw = {
  path: '/product',
  name: 'ProductRoute',
  component: LAYOUT,
  children: [
    {
      path: 'info/add',
      name: 'AddProduct',
      component: () => import('/@/views/base-data/product/info/add.vue'),
      meta: {
        title: '新增商品',
      },
    },
    {
      path: 'info/modify/:id',
      name: 'ModifyProduct',
      meta: {
        title: '修改商品',
      },
      component: () => import('/@/views/base-data/product/info/modify.vue'),
    },
  ],
};

export const PurchaseRoute: AppRouteRecordRaw = {
  path: '/purchase',
  name: 'PurchaseRoute',
  component: LAYOUT,
  children: [
    {
      path: 'order/add',
      name: 'AddPurchaseOrder',
      component: () => import('/@/views/sc/purchase/order/add.vue'),
      meta: {
        title: '新增采购订单',
      },
    },
    {
      path: 'order/modify/:id',
      name: 'ModifyPurchaseOrder',
      meta: {
        title: '修改采购订单',
      },
      component: () => import('/@/views/sc/purchase/order/modify.vue'),
    },
    {
      path: 'order/approve/:id',
      name: 'ApprovePurchaseOrder',
      meta: {
        title: '审核采购订单',
      },
      component: () => import('/@/views/sc/purchase/order/approve.vue'),
    },
    {
      path: 'receive/add/require',
      name: 'AddPurchaseReceiveSheetRequire',
      component: () => import('/@/views/sc/purchase/receive/add-require.vue'),
      meta: {
        title: '新增采购收货单',
      },
    },
    {
      path: 'receive/add/un-require',
      name: 'AddPurchaseReceiveSheetUnRequire',
      component: () => import('/@/views/sc/purchase/receive/add-un-require.vue'),
      meta: {
        title: '新增采购收货单',
      },
    },
    {
      path: 'receive/modify/require/:id',
      name: 'ModifyPurchaseReceiveSheetRequire',
      meta: {
        title: '修改采购收货单',
      },
      component: () => import('/@/views/sc/purchase/receive/modify-require.vue'),
    },
    {
      path: 'receive/modify/un-require/:id',
      name: 'ModifyPurchaseReceiveSheetUnRequire',
      meta: {
        title: '修改采购收货单',
      },
      component: () => import('/@/views/sc/purchase/receive/modify-un-require.vue'),
    },
    {
      path: 'receive/approve/:id',
      name: 'ApprovePurchaseReceiveSheet',
      meta: {
        title: '审核采购收货单',
      },
      component: () => import('/@/views/sc/purchase/receive/approve.vue'),
    },
    {
      path: 'return/add/require',
      name: 'AddPurchaseReturnRequire',
      component: () => import('/@/views/sc/purchase/return/add-require.vue'),
      meta: {
        title: '新增采购退货单',
      },
    },
    {
      path: 'return/add/un-require',
      name: 'AddPurchaseReturnUnRequire',
      component: () => import('/@/views/sc/purchase/return/add-un-require.vue'),
      meta: {
        title: '新增采购退货单',
      },
    },
    {
      path: 'return/modify/require/:id',
      name: 'ModifyPurchaseReturnRequire',
      meta: {
        title: '修改采购退货单',
      },
      component: () => import('/@/views/sc/purchase/return/modify-require.vue'),
    },
    {
      path: 'return/modify/un-require/:id',
      name: 'ModifyPurchaseReturnUnRequire',
      meta: {
        title: '修改采购退货单',
      },
      component: () => import('/@/views/sc/purchase/return/modify-un-require.vue'),
    },
    {
      path: 'return/approve/:id',
      name: 'ApprovePurchaseReturn',
      meta: {
        title: '审核采购退货单',
      },
      component: () => import('/@/views/sc/purchase/return/approve.vue'),
    },
  ],
};

export const SaleRoute: AppRouteRecordRaw = {
  path: '/sale',
  name: 'SaleRoute',
  component: LAYOUT,
  children: [
    {
      path: 'order/add',
      name: 'AddSaleOrder',
      component: () => import('/@/views/sc/sale/order/add.vue'),
      meta: {
        title: '新增销售订单',
      },
    },
    {
      path: 'order/modify/:id',
      name: 'ModifySaleOrder',
      meta: {
        title: '修改销售订单',
      },
      component: () => import('/@/views/sc/sale/order/modify.vue'),
    },
    {
      path: 'order/approve/:id',
      name: 'ApproveSaleOrder',
      meta: {
        title: '审核销售订单',
      },
      component: () => import('/@/views/sc/sale/order/approve.vue'),
    },
    {
      path: 'out/add/require',
      name: 'AddSaleOutSheetRequire',
      component: () => import('/@/views/sc/sale/out/add-require.vue'),
      meta: {
        title: '新增销售出库单',
      },
    },
    {
      path: 'out/add/un-require',
      name: 'AddSaleOutSheetUnRequire',
      component: () => import('/@/views/sc/sale/out/add-un-require.vue'),
      meta: {
        title: '新增销售出库单',
      },
    },
    {
      path: 'out/modify/require/:id',
      name: 'ModifySaleOutSheetRequire',
      meta: {
        title: '修改销售出库单',
      },
      component: () => import('/@/views/sc/sale/out/modify-require.vue'),
    },
    {
      path: 'out/modify/un-require/:id',
      name: 'ModifySaleOutSheetUnRequire',
      meta: {
        title: '修改销售出库单',
      },
      component: () => import('/@/views/sc/sale/out/modify-un-require.vue'),
    },
    {
      path: 'out/approve/:id',
      name: 'ApproveSaleOutSheet',
      meta: {
        title: '审核销售出库单',
      },
      component: () => import('/@/views/sc/sale/out/approve.vue'),
    },
    {
      path: 'return/add/require',
      name: 'AddSaleReturnSheetRequire',
      component: () => import('/@/views/sc/sale/return/add-require.vue'),
      meta: {
        title: '新增销售退货单',
      },
    },
    {
      path: 'return/add/un-require',
      name: 'AddSaleReturnSheetUnRequire',
      component: () => import('/@/views/sc/sale/return/add-un-require.vue'),
      meta: {
        title: '新增销售退货单',
      },
    },
    {
      path: 'return/modify/require/:id',
      name: 'ModifySaleReturnSheetRequire',
      meta: {
        title: '修改销售退货单',
      },
      component: () => import('/@/views/sc/sale/return/modify-require.vue'),
    },
    {
      path: 'return/modify/un-require/:id',
      name: 'ModifySaleReturnSheetUnRequire',
      meta: {
        title: '修改销售退货单',
      },
      component: () => import('/@/views/sc/sale/return/modify-un-require.vue'),
    },
    {
      path: 'return/approve/:id',
      name: 'ApproveSaleReturnSheet',
      meta: {
        title: '审核销售退货单',
      },
      component: () => import('/@/views/sc/sale/return/approve.vue'),
    },
  ],
};

export const RetailRoute: AppRouteRecordRaw = {
  path: '/retail',
  name: 'RetailRoute',
  component: LAYOUT,
  children: [
    {
      path: 'out/add',
      name: 'AddRetailOutSheet',
      component: () => import('/@/views/sc/retail/out/add.vue'),
      meta: {
        title: '新增零售出库单',
      },
    },
    {
      path: 'out/modify/:id',
      name: 'ModifyRetailOutSheet',
      meta: {
        title: '修改零售出库单',
      },
      component: () => import('/@/views/sc/retail/out/modify.vue'),
    },
    {
      path: 'out/approve/:id',
      name: 'ApproveRetailOutSheet',
      meta: {
        title: '审核零售出库单',
      },
      component: () => import('/@/views/sc/retail/out/approve.vue'),
    },
    {
      path: 'return/add/require',
      name: 'AddRetailReturnRequire',
      component: () => import('/@/views/sc/retail/return/add-require.vue'),
      meta: {
        title: '新增零售退货单',
      },
    },
    {
      path: 'return/add/un-require',
      name: 'AddRetailReturnUnRequire',
      component: () => import('/@/views/sc/retail/return/add-un-require.vue'),
      meta: {
        title: '新增零售退货单',
      },
    },
    {
      path: 'return/modify/require/:id',
      name: 'ModifyRetailReturnRequire',
      meta: {
        title: '修改零售退货单',
      },
      component: () => import('/@/views/sc/retail/return/modify-require.vue'),
    },
    {
      path: 'return/modify/un-require/:id',
      name: 'ModifyRetailReturnUnRequire',
      meta: {
        title: '修改零售退货单',
      },
      component: () => import('/@/views/sc/retail/return/modify-un-require.vue'),
    },
    {
      path: 'return/approve/:id',
      name: 'ApproveRetailReturn',
      meta: {
        title: '审核零售退货单',
      },
      component: () => import('/@/views/sc/retail/return/approve.vue'),
    },
  ],
};

export const LogisticsRoute: AppRouteRecordRaw = {
  path: '/logistics',
  name: 'LogisticsRoute',
  component: LAYOUT,
  children: [
    {
      path: 'sheet/add',
      name: 'AddLogisticsSheet',
      component: () => import('/@/views/sc/logistics/sheet/add.vue'),
      meta: {
        title: '新增物流单',
      },
    },
    {
      path: 'sheet/modify/:id',
      name: 'ModifyLogisticsSheet',
      meta: {
        title: '修改物流单',
      },
      component: () => import('/@/views/sc/logistics/sheet/modify.vue'),
    },
  ],
};

export const StockRoute: AppRouteRecordRaw = {
  path: '/stock',
  name: 'StockRoute',
  component: LAYOUT,
  children: [
    {
      path: 'stock-transfer/add',
      name: 'AddScTransferSheet',
      component: () => import('/@/views/sc/stock/transfer/add.vue'),
      meta: {
        title: '新增仓库调拨单',
      },
    },
    {
      path: 'stock-transfer/modify/:id',
      name: 'ModifyScTransferSheet',
      meta: {
        title: '修改仓库调拨单',
      },
      component: () => import('/@/views/sc/stock/transfer/modify.vue'),
    },
    {
      path: 'stock-transfer/approve/:id',
      name: 'ApproveScTransferSheet',
      meta: {
        title: '审核仓库调拨单',
      },
      component: () => import('/@/views/sc/stock/transfer/approve.vue'),
    },
    {
      path: 'stock-transfer/receive/:id',
      name: 'ReceiveScTransferSheet',
      meta: {
        title: '仓库调拨单收货',
      },
      component: () => import('/@/views/sc/stock/transfer/receive.vue'),
    },

    {
      path: 'take/pre/add',
      name: 'AddPreTakeStockSheet',
      meta: {
        title: '新增预先盘点单',
      },
      component: () => import('/@/views/sc/stock/take/pre/add.vue'),
    },
    {
      path: 'take/pre/modify/:id',
      name: 'ModifyPreTakeStockSheet',
      meta: {
        title: '修改预先盘点单',
      },
      component: () => import('/@/views/sc/stock/take/pre/modify.vue'),
    },
    {
      path: 'take/sheet/add',
      name: 'AddStockTakeSheet',
      component: () => import('/@/views/sc/stock/take/sheet/add.vue'),
      meta: {
        title: '新增盘点单',
      },
    },
    {
      path: 'take/sheet/modify/:id',
      name: 'ModifyStockTakeSheet',
      meta: {
        title: '修改盘点单',
      },
      component: () => import('/@/views/sc/stock/take/sheet/modify.vue'),
    },
    {
      path: 'take/sheet/approve/:id',
      name: 'ApproveStockTakeSheet',
      meta: {
        title: '审核盘点单',
      },
      component: () => import('/@/views/sc/stock/take/sheet/approve.vue'),
    },
    {
      path: 'stock-adjust/cost/add',
      name: 'AddStockCostAdjustSheet',
      component: () => import('/@/views/sc/stock/adjust/cost/add.vue'),
      meta: {
        title: '新增库存成本调整单',
      },
    },
    {
      path: 'stock-adjust/cost/modify/:id',
      name: 'ModifyStockCostAdjustSheet',
      meta: {
        title: '修改库存成本调整单',
      },
      component: () => import('/@/views/sc/stock/adjust/cost/modify.vue'),
    },
    {
      path: 'stock-adjust/cost/approve/:id',
      name: 'ApproveStockCostAdjustSheet',
      meta: {
        title: '审核库存成本调整单',
      },
      component: () => import('/@/views/sc/stock/adjust/cost/approve.vue'),
    },
    {
      path: 'stock-adjust/add',
      name: 'AddStockAdjustSheet',
      component: () => import('/@/views/sc/stock/adjust/stock/add.vue'),
      meta: {
        title: '新增库存调整单',
      },
    },
    {
      path: 'stock-adjust/modify/:id',
      name: 'ModifyStockAdjustSheet',
      meta: {
        title: '修改库存调整单',
      },
      component: () => import('/@/views/sc/stock/adjust/stock/modify.vue'),
    },
    {
      path: 'stock-adjust/approve/:id',
      name: 'ApproveStockAdjustSheet',
      meta: {
        title: '审核库存调整单',
      },
      component: () => import('/@/views/sc/stock/adjust/stock/approve.vue'),
    },
  ],
};

export const SettleRoute: AppRouteRecordRaw = {
  path: '/settle',
  name: 'SettleRoute',
  component: LAYOUT,
  children: [
    {
      path: 'supplier/fee-sheet/add',
      name: 'AddSupplierSettleFeeSheet',
      component: () => import('/@/views/settle/fee-sheet/add.vue'),
      meta: {
        title: '新增供应商费用单',
      },
    },
    {
      path: 'supplier/fee-sheet/modify/:id',
      name: 'ModifySupplierSettleFeeSheet',
      meta: {
        title: '修改供应商费用单',
      },
      component: () => import('/@/views/settle/fee-sheet/modify.vue'),
    },
    {
      path: 'supplier/fee-sheet/approve/:id',
      name: 'ApproveSupplierSettleFeeSheet',
      meta: {
        title: '审核供应商费用单',
      },
      component: () => import('/@/views/settle/fee-sheet/approve.vue'),
    },
    {
      path: 'supplier/pre-sheet/add',
      name: 'AddSupplierSettlePreSheet',
      component: () => import('/@/views/settle/pre-sheet/add.vue'),
      meta: {
        title: '新增供应商预付款单',
      },
    },
    {
      path: 'supplier/pre-sheet/modify/:id',
      name: 'ModifySupplierSettlePreSheet',
      meta: {
        title: '修改供应商预付款单',
      },
      component: () => import('/@/views/settle/pre-sheet/modify.vue'),
    },
    {
      path: 'supplier/pre-sheet/approve/:id',
      name: 'ApproveSupplierSettlePreSheet',
      meta: {
        title: '审核供应商预付款单',
      },
      component: () => import('/@/views/settle/pre-sheet/approve.vue'),
    },
    {
      path: 'supplier/check-sheet/add',
      name: 'AddSupplierSettleCheckSheet',
      component: () => import('/@/views/settle/check-sheet/add.vue'),
      meta: {
        title: '新增供应商对账单',
      },
    },
    {
      path: 'supplier/check-sheet/modify/:id',
      name: 'ModifySupplierSettleCheckSheet',
      meta: {
        title: '修改供应商对账单',
      },
      component: () => import('/@/views/settle/check-sheet/modify.vue'),
    },
    {
      path: 'supplier/check-sheet/approve/:id',
      name: 'ApproveSupplierSettleCheckSheet',
      meta: {
        title: '审核供应商对账单',
      },
      component: () => import('/@/views/settle/check-sheet/approve.vue'),
    },
    {
      path: 'supplier/sheet/add',
      name: 'AddSupplierSettleSheet',
      component: () => import('/@/views/settle/sheet/add.vue'),
      meta: {
        title: '新增供应商结算单',
      },
    },
    {
      path: 'supplier/sheet/modify/:id',
      name: 'ModifySupplierSettleSheet',
      meta: {
        title: '修改供应商结算单',
      },
      component: () => import('/@/views/settle/sheet/modify.vue'),
    },
    {
      path: 'supplier/sheet/approve/:id',
      name: 'ApproveSupplierSettleSheet',
      meta: {
        title: '审核供应商结算单',
      },
      component: () => import('/@/views/settle/sheet/approve.vue'),
    },
  ],
};

export const CustomerSettleRoute: AppRouteRecordRaw = {
  path: '/settle',
  name: 'CustomerSettleRoute',
  component: LAYOUT,
  children: [
    {
      path: 'customer/fee-sheet/add',
      name: 'AddCustomerSettleFeeSheet',
      component: () => import('/@/views/customer-settle/fee-sheet/add.vue'),
      meta: {
        title: '新增客户费用单',
      },
    },
    {
      path: 'customer/fee-sheet/modify/:id',
      name: 'ModifyCustomerSettleFeeSheet',
      meta: {
        title: '修改客户费用单',
      },
      component: () => import('/@/views/customer-settle/fee-sheet/modify.vue'),
    },
    {
      path: 'customer/fee-sheet/approve/:id',
      name: 'ApproveCustomerSettleFeeSheet',
      meta: {
        title: '审核客户费用单',
      },
      component: () => import('/@/views/customer-settle/fee-sheet/approve.vue'),
    },
    {
      path: 'customer/pre-sheet/add',
      name: 'AddCustomerSettlePreSheet',
      component: () => import('/@/views/customer-settle/pre-sheet/add.vue'),
      meta: {
        title: '新增客户预付款单',
      },
    },
    {
      path: 'customer/pre-sheet/modify/:id',
      name: 'ModifyCustomerSettlePreSheet',
      meta: {
        title: '修改客户预付款单',
      },
      component: () => import('/@/views/customer-settle/pre-sheet/modify.vue'),
    },
    {
      path: 'customer/pre-sheet/approve/:id',
      name: 'ApproveCustomerSettlePreSheet',
      meta: {
        title: '审核客户预付款单',
      },
      component: () => import('/@/views/customer-settle/pre-sheet/approve.vue'),
    },
    {
      path: 'customer/check-sheet/add',
      name: 'AddCustomerSettleCheckSheet',
      component: () => import('/@/views/customer-settle/check-sheet/add.vue'),
      meta: {
        title: '新增客户对账单',
      },
    },
    {
      path: 'customer/check-sheet/modify/:id',
      name: 'ModifyCustomerSettleCheckSheet',
      meta: {
        title: '修改客户对账单',
      },
      component: () => import('/@/views/customer-settle/check-sheet/modify.vue'),
    },
    {
      path: 'customer/check-sheet/approve/:id',
      name: 'ApproveCustomerSettleCheckSheet',
      meta: {
        title: '审核客户对账单',
      },
      component: () => import('/@/views/customer-settle/check-sheet/approve.vue'),
    },
    {
      path: 'customer/sheet/add',
      name: 'AddCustomerSettleSheet',
      component: () => import('/@/views/customer-settle/sheet/add.vue'),
      meta: {
        title: '新增客户结算单',
      },
    },
    {
      path: 'customer/sheet/modify/:id',
      name: 'ModifyCustomerSettleSheet',
      meta: {
        title: '修改客户结算单',
      },
      component: () => import('/@/views/customer-settle/sheet/modify.vue'),
    },
    {
      path: 'customer/sheet/approve/:id',
      name: 'ApproveCustomerSettleSheet',
      meta: {
        title: '审核客户结算单',
      },
      component: () => import('/@/views/customer-settle/sheet/approve.vue'),
    },
  ],
};

// Basic routing without permission
// 未经许可的基本路由
export const basicRoutes = [
  LoginRoute,
  SettingsRoute,
  ProfileRoute,
  ProductRoute,
  PurchaseRoute,
  SaleRoute,
  RetailRoute,
  LogisticsRoute,
  StockRoute,
  SettleRoute,
  CustomerSettleRoute,
  RootRoute,
  REDIRECT_ROUTE,
  PAGE_NOT_FOUND_ROUTE,
];
