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
          icon: 'dashboard',
          sync: true
        },
        component: BlankView,
        children: [
          {
            path: 'dashboard/workplace',
            name: '工作台',
            meta: {
              page: {
                closable: false
              }
            },
            component: () => import('@/views/dashboard/index')
          },
          {
            path: 'profile',
            name: '个人中心',
            meta: {
              sync: true
            },
            component: () => import('@/views/profile/index')
          },
          {
            path: 'settings',
            name: '个人设置',
            meta: {
              sync: true
            },
            component: () => import('@/views/settings/index')
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
