import { createRouter, createWebHistory } from 'vue-router'
import ProfilePage from '../views/ProfilePage.vue'

const routes = [
  {
    path: '/',
    redirect: '/profile'
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
    meta: {
      requiresAuth: true
    }
  },
  // Добавьте другие маршруты по мере необходимости
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
