<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMoviesStore } from '../stores/movies'
import { useUserStore } from '../stores/user'
import MovieGrid from '../components/movie/MovieGrid.vue'

const router = useRouter()
const moviesStore = useMoviesStore()
const userStore = useUserStore()

const loading = ref(true)

onMounted(async () => {
  // Check if user is logged in
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  
  // Fetch recommendations
  if (moviesStore.recommendations.length === 0) {
    await moviesStore.fetchRecommendations()
  }
  
  loading.value = false
})
</script>

<template>
  <div class="container">
    <div class="page-header">
      <h1 class="page-title">为您推荐</h1>
      <p class="page-description">根据您的观影偏好，我们精心挑选了以下电影</p>
    </div>
    
    <div v-if="!userStore.isLoggedIn" class="login-prompt">
      <p>请<router-link to="/login">登录</router-link>后查看为您推荐的电影</p>
    </div>
    
    <template v-else>
      <div class="recommendation-info">
        <div class="user-info">
          <span class="info-label">用户：</span>
          <span class="info-value">{{ userStore.user?.username }}</span>
        </div>
        <div class="user-info">
          <span class="info-label">职业：</span>
          <span class="info-value">
            {{ 
              {'academic/educator': '学术/教育工作者', 
               'artist': '艺术家', 
               'technician/engineer': '技术人员/工程师',
               'student': '学生',
               'business': '商业/金融',
               'healthcare': '医疗保健',
               'other': '其他'}[userStore.user?.profession || ''] || userStore.user?.profession 
            }}
          </span>
        </div>
      </div>
      
      <MovieGrid 
        :movies="moviesStore.recommendations" 
        :loading="loading" 
        :showRating="true" 
      />
    </template>
  </div>
</template>

<style scoped>
.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 2.5rem;
  margin-bottom: 12px;
}

.page-description {
  color: var(--color-text-secondary);
  font-size: 1.1rem;
}

.login-prompt {
  text-align: center;
  padding: 100px 0;
  font-size: 1.2rem;
}

.login-prompt a {
  color: var(--color-primary);
  font-weight: 600;
}

.recommendation-info {
  background-color: var(--color-surface);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 32px;
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.user-info {
  display: flex;
  align-items: center;
}

.info-label {
  font-weight: 600;
  margin-right: 8px;
}

.info-value {
  color: var(--color-primary);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .page-description {
    font-size: 1rem;
  }
}
</style>