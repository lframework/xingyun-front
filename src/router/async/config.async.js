import routerMap from './router.map'
import { parseRoutes } from '@/utils/routerUtil'
import TabsView from '@/layouts/tabs/TabsView'
import BlankView from '@/layouts/BlankView'

// 异步路由配置
const routesConfig = [
  'login',
  'forgetPsw',
  {
    router: 'exp404',
    path: '*',
    name: '404'
  },
  {
    router: 'exp403',
    path: '/403',
    name: '403'
  },
  {
    path: '/',
    component: TabsView,
    redirect: '/dashboard/workplace',
    children: [
      {
        path: '/',
        name: '首页',
        meta: {
          id: 'dashboard',
          icon: 'a-dashboard',
          sync: true,
          invisible: true
        },
        component: BlankView,
        children: [
          {
            path: 'dashboard/workplace',
            name: '工作台',
            meta: {
              page: {
                closable: false
              },
              invisible: true
            },
            component: () => import('@/views/dashboard/index')
          },
          {
            path: 'profile',
            name: '个人中心',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/profile/index')
          },
          {
            path: 'settings',
            name: '个人设置',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/settings/index')
          },
          {
            path: 'product/info/add',
            name: '新增商品',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/base-data/product/info/add')
          },
          {
            path: 'product/info/modify/:id',
            name: '修改商品',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/base-data/product/info/modify')
          },
          {
            path: 'purchase/order/add',
            name: '新增采购订单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/purchase/order/add')
          },
          {
            path: 'purchase/order/modify/:id',
            name: '修改采购订单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/purchase/order/modify')
          },
          {
            path: 'purchase/order/approve/:id',
            name: '审核采购订单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/purchase/order/approve')
          },
          {
            path: 'purchase/receive/add/require',
            name: '新增采购收货单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/purchase/receive/add-require')
          },
          {
            path: 'purchase/receive/add/un-require',
            name: '新增采购收货单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/purchase/receive/add-un-require')
          },
          {
            path: 'purchase/receive/modify/require/:id',
            name: '修改采购收货单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/purchase/receive/modify-require')
          },
          {
            path: 'purchase/receive/modify/un-require/:id',
            name: '修改采购收货单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/purchase/receive/modify-un-require')
          },
          {
            path: 'purchase/receive/approve/:id',
            name: '审核采购收货单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/purchase/receive/approve')
          },
          {
            path: 'purchase/return/add/require',
            name: '新增采购退货单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/purchase/return/add-require')
          },
          {
            path: 'purchase/return/add/un-require',
            name: '新增采购退货单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/purchase/return/add-un-require')
          },
          {
            path: 'purchase/return/modify/require/:id',
            name: '修改采购退货单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/purchase/return/modify-require')
          },
          {
            path: 'purchase/return/modify/un-require/:id',
            name: '修改采购退货单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/purchase/return/modify-un-require')
          },
          {
            path: 'purchase/return/approve/:id',
            name: '审核采购退货单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/purchase/return/approve')
          },
          {
            path: 'sale/order/add',
            name: '新增销售订单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/sale/order/add')
          },
          {
            path: 'sale/order/modify/:id',
            name: '修改销售订单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/sale/order/modify')
          },
          {
            path: 'sale/order/approve/:id',
            name: '审核销售订单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/sale/order/approve')
          },
          {
            path: 'sale/out/add/require',
            name: '新增销售出库单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/sale/out/add-require')
          },
          {
            path: 'sale/out/add/un-require',
            name: '新增销售出库单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/sale/out/add-un-require')
          },
          {
            path: 'sale/out/modify/require/:id',
            name: '修改销售出库单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/sale/out/modify-require')
          },
          {
            path: 'sale/out/modify/un-require/:id',
            name: '修改销售出库单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/sale/out/modify-un-require')
          },
          {
            path: 'sale/out/approve/:id',
            name: '审核销售出库单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/sale/out/approve')
          },
          {
            path: 'sale/return/add/require',
            name: '新增销售退货单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/sale/return/add-require')
          },
          {
            path: 'sale/return/add/un-require',
            name: '新增销售退货单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/sale/return/add-un-require')
          },
          {
            path: 'sale/return/modify/require/:id',
            name: '修改销售退货单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/sale/return/modify-require')
          },
          {
            path: 'sale/return/modify/un-require/:id',
            name: '修改销售退货单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/sale/return/modify-un-require')
          },
          {
            path: 'sale/return/approve/:id',
            name: '审核销售退货单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/sale/return/approve')
          },
          {
            path: 'retail/out/add',
            name: '新增零售出库单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/retail/out/add')
          },
          {
            path: 'retail/out/modify/:id',
            name: '修改零售出库单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/retail/out/modify')
          },
          {
            path: 'retail/out/approve/:id',
            name: '审核零售出库单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/retail/out/approve')
          },
          {
            path: 'retail/return/add/require',
            name: '新增零售退货单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/retail/return/add-require')
          },
          {
            path: 'retail/return/add/un-require',
            name: '新增零售退货单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/retail/return/add-un-require')
          },
          {
            path: 'retail/return/modify/require/:id',
            name: '修改零售退货单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/retail/return/modify-require')
          },
          {
            path: 'retail/return/modify/un-require/:id',
            name: '修改零售退货单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/retail/return/modify-un-require')
          },
          {
            path: 'retail/return/approve/:id',
            name: '审核零售退货单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/retail/return/approve')
          },
          {
            path: 'take/pre/add',
            name: '新增预先盘点单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/stock/take/pre/add')
          },
          {
            path: 'take/pre/modify/:id',
            name: '修改预先盘点单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/stock/take/pre/modify')
          },
          {
            path: 'take/sheet/add',
            name: '新增盘点单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/stock/take/sheet/add')
          },
          {
            path: 'take/sheet/modify/:id',
            name: '修改盘点单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/stock/take/sheet/modify')
          },
          {
            path: 'take/sheet/approve/:id',
            name: '审核盘点单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/stock/take/sheet/approve')
          },
          {
            path: 'stock-adjust/cost/add',
            name: '新增库存成本调整单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/stock/adjust/cost/add')
          },
          {
            path: 'stock-adjust/cost/modify/:id',
            name: '修改库存成本调整单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/stock/adjust/cost/modify')
          },
          {
            path: 'stock-adjust/cost/approve/:id',
            name: '审核库存成本调整单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/stock/adjust/cost/approve')
          },
          {
            path: 'settle/supplier/fee-sheet/add',
            name: '新增供应商费用单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/settle/fee-sheet/add')
          },
          {
            path: 'settle/supplier/fee-sheet/modify/:id',
            name: '修改供应商费用单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/settle/fee-sheet/modify')
          },
          {
            path: 'settle/supplier/fee-sheet/approve/:id',
            name: '审核供应商费用单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/settle/fee-sheet/approve')
          },
          {
            path: 'settle/supplier/pre-sheet/add',
            name: '新增供应商预付款单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/settle/pre-sheet/add')
          },
          {
            path: 'settle/supplier/pre-sheet/modify/:id',
            name: '修改供应商预付款单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/settle/pre-sheet/modify')
          },
          {
            path: 'settle/supplier/pre-sheet/approve/:id',
            name: '审核供应商预付款单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/settle/pre-sheet/approve')
          },
          {
            path: 'settle/supplier/check-sheet/add',
            name: '新增供应商对账单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/settle/check-sheet/add')
          },
          {
            path: 'settle/supplier/check-sheet/modify/:id',
            name: '修改供应商对账单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/settle/check-sheet/modify')
          },
          {
            path: 'settle/supplier/check-sheet/approve/:id',
            name: '审核供应商对账单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/settle/check-sheet/approve')
          },
          {
            path: 'settle/supplier/sheet/add',
            name: '新增供应商结算单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/settle/sheet/add')
          },
          {
            path: 'settle/supplier/sheet/modify/:id',
            name: '修改供应商结算单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/settle/sheet/modify')
          },
          {
            path: 'settle/supplier/sheet/approve/:id',
            name: '审核供应商结算单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/settle/sheet/approve')
          },
          {
            path: 'settle/customer/fee-sheet/add',
            name: '新增客户费用单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/customer-settle/fee-sheet/add')
          },
          {
            path: 'settle/customer/fee-sheet/modify/:id',
            name: '修改客户费用单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/customer-settle/fee-sheet/modify')
          },
          {
            path: 'settle/customer/fee-sheet/approve/:id',
            name: '审核客户费用单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/customer-settle/fee-sheet/approve')
          },
          {
            path: 'settle/customer/pre-sheet/add',
            name: '新增客户预付款单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/customer-settle/pre-sheet/add')
          },
          {
            path: 'settle/customer/pre-sheet/modify/:id',
            name: '修改客户预付款单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/customer-settle/pre-sheet/modify')
          },
          {
            path: 'settle/customer/pre-sheet/approve/:id',
            name: '审核客户预付款单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/customer-settle/pre-sheet/approve')
          },
          {
            path: 'settle/customer/check-sheet/add',
            name: '新增客户对账单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/customer-settle/check-sheet/add')
          },
          {
            path: 'settle/customer/check-sheet/modify/:id',
            name: '修改客户对账单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/customer-settle/check-sheet/modify')
          },
          {
            path: 'settle/customer/check-sheet/approve/:id',
            name: '审核客户对账单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/customer-settle/check-sheet/approve')
          },
          {
            path: 'settle/customer/sheet/add',
            name: '新增客户结算单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/customer-settle/sheet/add')
          },
          {
            path: 'settle/customer/sheet/modify/:id',
            name: '修改客户结算单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/customer-settle/sheet/modify')
          },
          {
            path: 'settle/customer/sheet/approve/:id',
            name: '审核客户结算单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/customer-settle/sheet/approve')
          },
          {
            path: 'stock-adjust/add',
            name: '新增库存调整单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/stock/adjust/stock/add')
          },
          {
            path: 'stock-adjust/modify/:id',
            name: '修改库存调整单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/stock/adjust/stock/modify')
          },
          {
            path: 'stock-adjust/approve/:id',
            name: '审核库存调整单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/stock/adjust/stock/approve')
          },
          {
            path: 'stock-transfer/add',
            name: '新增仓库调拨单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/stock/transfer/add')
          },
          {
            path: 'stock-transfer/modify/:id',
            name: '修改仓库调拨单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/stock/transfer/modify')
          },
          {
            path: 'stock-transfer/approve/:id',
            name: '审核仓库调拨单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/stock/transfer/approve')
          },
          {
            path: 'stock-transfer/receive/:id',
            name: '仓库调拨单收货',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/stock/transfer/receive')
          },
          {
            path: 'logistics/sheet/add',
            name: '新增物流单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/logistics/sheet/add')
          },
          {
            path: 'logistics/sheet/modify/:id',
            name: '修改物流单',
            meta: {
              sync: true,
              invisible: true
            },
            component: () => import('@/views/sc/logistics/sheet/modify')
          }
        ]
      }
    ]
  },
  {
    router: 'onlineExcel',
    path: '/online-excel',
    name: 'online-excel'
  }
]

const options = {
  routes: parseRoutes(routesConfig, routerMap)
}

export default options
