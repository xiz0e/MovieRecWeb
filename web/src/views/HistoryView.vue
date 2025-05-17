<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMoviesStore } from '../stores/movies'
import { useUserStore } from '../stores/user'
import RatingStars from '../components/movie/RatingStars.vue'

const router = useRouter()
const moviesStore = useMoviesStore()
const userStore = useUserStore()

const loading = ref(true)

// Computed property to merge rating history with movie details
const ratingHistoryWithMovies = computed(() => {
  return moviesStore.ratingHistory.map(rating => {
    const movie = moviesStore.allMovies.find(m => m.id === rating.movieId)
    return {
      ...rating,
      movie
    }
  }).sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(async () => {
  // Check if user is logged in
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  
  // Fetch all movies if not already loaded
  if (moviesStore.allMovies.length === 0) {
    await moviesStore.fetchMovies()
  }
  
  // Fetch rating history
  await moviesStore.fetchRatingHistory()
  
  loading.value = false
})

const goToMovie = (movieId: string) => {
  router.push({ name: 'movie-detail', params: { id: movieId } })
}
</script>

<template>
  <div class="container">
    <div class="page-header">
      <h1 class="page-title">评分历史</h1>
      <p class="page-description">查看您过去对电影的评分记录</p>
    </div>
    
    <div v-if="!userStore.isLoggedIn" class="login-prompt">
      <p>请<router-link to="/login">登录</router-link>后查看您的评分历史</p>
    </div>
    
    <div v-else-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>加载评分历史...</p>
    </div>
    
    <template v-else>
      <div v-if="ratingHistoryWithMovies.length === 0" class="empty-state">
        <p>您还没有对任何电影进行评分</p>
        <router-link to="/popular" class="browse-btn">浏览热门电影</router-link>
      </div>
      
      <div v-else class="rating-history">
        <div 
          v-for="item in ratingHistoryWithMovies" 
          :key="`${item.movieId}-${item.date}`"
          class="rating-item"
          @click="goToMovie(item.movieId)"
        >
          <div class="movie-info">
            <img 
              v-if="item.movie?.poster" 
              :src="item.movie.poster" 
              :alt="item.movie?.title"
              class="movie-thumbnail"
            />
            <div class="movie-details">
              <h3 class="movie-title">{{ item.movie?.title || '未知电影' }}</h3>
              <p class="movie-year">{{ item.movie?.year || '--' }}</p>
            </div>
          </div>
          
          <div class="rating-info">
            <div class="rating-date">{{ formatDate(item.date) }}</div>
            <div class="rating-stars">
              <RatingStars :rating="item.rating" readonly />
              <span class="rating-value">{{ item.rating.toFixed(1) }}</span>
            </div>
          </div>
        </div>
      </div>
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

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-left-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  text-align: center;
  padding: 64px 0;
  color: var(--color-text-secondary);
}

.browse-btn {
  display: inline-block;
  margin-top: 16px;
  padding: 10px 20px;
  background-color: var(--color-primary);
  color: black;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
}

.rating-history {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.rating-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-surface);
  border-radius: 8px;
  padding: 16px;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.rating-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.movie-info {
  display: flex;
  align-items: center;
}

.movie-thumbnail {
  width: 60px;
  height: 90px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 16px;
}

.movie-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.movie-year {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

.rating-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.rating-date {
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.rating-stars {
  display: flex;
  align-items: center;
}

.rating-value {
  margin-left: 8px;
  font-weight: 600;
  color: var(--color-primary);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .rating-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .rating-info {
    margin-top: 16px;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  
  .rating-date {
    margin-bottom: 0;
  }
}
</style>