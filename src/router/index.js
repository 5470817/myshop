// 导入createRouter, createWebHashHistory
import { createRouter, createWebHashHistory } from 'vue-router'

// 实例化
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      component: () => import('../components/MyHome.vue'),
      redirect: '/welcome',
      children: [
        {
          path: '/welcome',
          component: () => import('../components/Welcome.vue'),
        },
        {
          path: '/users',
          component: () => import('../components/users/Users.vue'),
        },
        {
          path: '/rights',
          component: () => import('../components/power/Rights.vue'),
        },
        {
          path: '/roles',
          component: () => import('../components/power/Roles.vue'),
        },
        {
          path: '/goods',
          component: () => import('../components/goods/Goods.vue'),
        },
        {
          path: '/goods/add',
          component: () => import('../components/goods/Add.vue'),
        },
        {
          path: '/categories',
          component: () => import('../components/goods/Cate.vue'),
        },
        {
          path: '/params',
          component: () => import('../components/goods/Params.vue'),
        },
        {
          path: '/orders',
          component: () => import('../components/order/Order.vue'),
        },
        {
          path: '/orders',
          component: () => import('../components/order/Order.vue'),
        },
        {
          path: '/reports',
          component: () => import('../components/Report.vue'),
        },
      ],
    },
    {
      path: '/login',
      component: () => import('../components/Login.vue'),
    },
  ],
})

// 如果没有登录就跳转登录页面，登录了就放行
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const token = localStorage.getItem('token')
  if (!token) {
    next('/login')
  } else {
    next()
  }
})

// 向外共享
export default router
