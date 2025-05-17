import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('../views/CategoriesView.vue')
    },
    {
      path: '/popular',
      name: 'popular',
      component: () => import('../views/PopularView.vue')
    },
    {
      path: '/recommendations',
      name: 'recommendations',
      component: () => import('../views/RecommendationsView.vue')
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('../views/HistoryView.vue')
    },
    {
      path: '/movie/:id',
      name: 'movie-detail',
      component: () => import('../views/MovieDetailView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/user',
      name: 'user-profile',
      component: () => import('../views/UserProfileView.vue')
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/SearchView.vue')
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router