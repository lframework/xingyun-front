// 视图组件
const view = {
  tabs: () => import('@/layouts/tabs'),
  blank: () => import('@/layouts/BlankView'),
  page: () => import('@/layouts/PageView')
}

// 路由组件注册
const routerMap = {
  login: {
    authority: '*',
    name: '登录',
    path: '/login',
    component: () => import('@/views/login/Login')
  },
  forgetPsw: {
    path: '/forget-psw',
    name: '忘记密码',
    component: () => import('@/views/login/components/ForgetPsw')
  },
  root: {
    path: '/',
    name: '首页',
    redirect: '/login',
    component: view.tabs
  },
  dashboard: {
    name: 'Dashboard',
    component: view.blank
  },
  workplace: {
    name: '工作台',
    component: () => import('@/views/dashboard')
  },
  form: {
    name: '表单页',
    icon: 'form',
    component: view.page
  },
  result: {
    name: '结果页',
    icon: 'check-circle-o',
    component: view.page
  },
  exception: {
    name: '异常页',
    icon: 'warning',
    component: view.blank
  },
  exp403: {
    authority: '*',
    name: 'exp403',
    path: '403',
    component: () => import('@/views/exception/403')
  },
  exp404: {
    name: 'exp404',
    path: '404',
    component: () => import('@/views/exception/404')
  },
  exp500: {
    name: 'exp500',
    path: '500',
    component: () => import('@/views/exception/500')
  },
  onlineExcel: {
    name: '在线Excel',
    path: 'online-excel',
    component: () => import('@/components/LuckySheet')
  }
}
export default routerMap

