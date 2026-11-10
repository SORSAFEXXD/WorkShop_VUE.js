import Vue from 'vue'
import VueRouter from 'vue-router'
import { getAuthSession } from '../workshop03/api'

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    component: () => import('../views/Toolbar.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('../workshop01/ProfileView.vue'),
        meta: { workshop: 'WORKSHOP 01' },
      },
      {
        path: '/workshop2',
        name: 'workshop2',
        component: () => import('../workshop02/GradeView.vue'),
        meta: { workshop: 'WORKSHOP 02' },
      },
      {
        path: '/workshop3',
        component: () => import('../workshop03/Workshop03Layout.vue'),
        meta: { workshop: 'WORKSHOP 03' },
        children: [
          {
            path: '',
            name: 'workshop3-shop',
            component: () => import('../workshop03/CatalogView.vue'),
          },
          {
            path: 'login',
            name: 'workshop3-login',
            component: () => import('../workshop03/AuthView.vue'),
            meta: { authMode: 'login' },
          },
          {
            path: 'admin/login',
            name: 'workshop3-admin-login',
            component: () => import('../workshop03/AuthView.vue'),
            meta: { authMode: 'admin-login' },
          },
          {
            path: 'register',
            name: 'workshop3-register',
            component: () => import('../workshop03/AuthView.vue'),
            meta: { authMode: 'register' },
          },
          {
            path: 'orders',
            name: 'workshop3-orders',
            component: () => import('../workshop03/OrdersView.vue'),
            meta: { requiresAuth: true },
          },
          {
            path: 'manage',
            name: 'workshop3-manage',
            component: () => import('../workshop03/ManagementView.vue'),
            meta: { requiresAdmin: true },
          },
        ],
      },
    ],
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
  const requiresAdmin = to.matched.some(route => route.meta.requiresAdmin)
  const requiresAuth = to.matched.some(route => route.meta.requiresAuth)
  if (!requiresAdmin && !requiresAuth) {
    next()
    return
  }

  const session = getAuthSession()
  if (!session) {
    next(requiresAdmin
      ? '/workshop3/admin/login'
      : { path: '/workshop3/login', query: { redirect: to.fullPath } })
    return
  }

  if (requiresAdmin && session.store.status !== 'admin') {
    next('/workshop3')
    return
  }

  next()
})

export default router
