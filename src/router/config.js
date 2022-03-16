// 路由配置
const options = {
  routes: [
    {
      path: '/login',
      name: '登录页',
      component: () => import('@/views/login')
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/views/exception/404')
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/views/exception/403')
    }
  ]
}

export default options
