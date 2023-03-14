import { useUserStore } from '@/stores/user'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: { name: 'Dashboard' }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/results/:eventId',
      name: 'Results',
      component: () => import('../views/ResultsView.vue')
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/DashboardView.vue')
    },
  ]
})

router.beforeEach((to) => {
  const userStore = useUserStore()
  if (!userStore.isAuthenticated && to.name !== 'Login') {
    return { name: 'Login' }
  }
})

export default router
