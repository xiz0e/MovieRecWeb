<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useMoviesStore } from '../stores/movies'
import MovieGrid from '../components/movie/MovieGrid.vue'

const route = useRoute()
const moviesStore = useMoviesStore()
const searchResults = ref([])
const isLoading = ref(false)
const error = ref('')

watchEffect(async () => {
  const query = route.query.q as string
  if (!query) return

  try {
    isLoading.value = true
    error.value = ''
    searchResults.value = await moviesStore.searchMovies(query)
  } catch (e) {
    error.value = '搜索时发生错误，请稍后重试'
    console.error('Search error:', e)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="container">
    <div class="page-header">
      <h1 class="page-title">搜索结果: "{{ $route.query.q }}"</h1>
      <p class="page-description">找到 {{ searchResults.length }} 个相关结果</p>
    </div>
    
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在搜索...</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
    </div>
    
    <MovieGrid 
      v-else 
      :movies="searchResults" 
      :showRating="true"
    />
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

.error-container {
  text-align: center;
  padding: 48px;
  color: var(--color-error);
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