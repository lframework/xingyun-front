import routerMap from './router.map'
import { parseRoutes } from '@/utils/routerUtil'
import TabsView from '@/layouts/tabs/TabsView'
import BlankView from '@/layouts/BlankView'

// 异步路由配置
const routesConfig = [
  'login',
  'root',
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
    name: '首页',
    component: TabsView,
    redirect: '/login',
    children: [
      {
        path: 'dashboard',
        name: '首页',
        meta: {
          icon: 'dashboard'
        },
        component: BlankView,
        children: [
          {
            path: 'workplace',
            name: '工作台',
            meta: {
              page: {
                closable: false
              }
            },
            component: () => import('@/views/dashboard/index')
          }
        ]
      },
      {
        path: 'profile',
        name: '个人中心',
        meta: {
          invisible: true
        },
        component: () => import('@/views/profile/index')
      },
      {
        path: 'settings',
        name: '个人设置',
        meta: {
          invisible: true
        },
        component: () => import('@/views/settings/index')
      }
    ]
  }
]

const options = {
  routes: parseRoutes(routesConfig, routerMap)
}

export default options
