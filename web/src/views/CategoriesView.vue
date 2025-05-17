<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMoviesStore } from '../stores/movies'
import MovieGrid from '../components/movie/MovieGrid.vue'
import type { Movie } from '../types/movie'

const moviesStore = useMoviesStore()
const loading = ref(true)
const selectedCategory = ref('')
const categoryMovies = ref<Movie[]>([])
const categoryLoading = ref(false)

onMounted(async () => {
  if (moviesStore.categories.length === 0) {
    await moviesStore.fetchCategories()
  }
  
  loading.value = false
  
  if (moviesStore.categories.length > 0) {
    selectCategory(moviesStore.categories[0].id)
  }
})

const selectCategory = async (categoryId: string) => {
  if (selectedCategory.value === categoryId) return
  
  selectedCategory.value = categoryId
  categoryLoading.value = true
  categoryMovies.value = await moviesStore.fetchMoviesByCategory(categoryId)
  categoryLoading.value = false
}
</script>

<template>
  <div class="container">
    <div class="page-header">
      <h1 class="page-title">电影分类</h1>
      <p class="page-description">浏览不同类型的电影，找到您喜欢的风格</p>
    </div>
    
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>加载分类...</p>
    </div>
    
    <div v-else class="categories-view">
      <div class="categories-tabs">
        <button 
          v-for="category in moviesStore.categories" 
          :key="category.id"
          class="category-tab"
          :class="{ 'active': selectedCategory === category.id }"
          @click="selectCategory(category.id)"
        >
          {{ category.name }}
        </button>
      </div>
      
      <div class="category-content">
        <h2 class="category-title">
          {{ moviesStore.categories.find(c => c.id === selectedCategory)?.name || '' }}
        </h2>
        
        <MovieGrid 
          :movies="categoryMovies" 
          :loading="categoryLoading" 
          :showRating="true" 
        />
      </div>
    </div>
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

.categories-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 32px;
}

.category-tab {
  padding: 10px 20px;
  background-color: var(--color-surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.2s;
}

.category-tab:hover {
  background-color: var(--color-surface-variant);
}

.category-tab.active {
  background-color: var(--color-primary);
  color: black;
  border-color: var(--color-primary);
}

.category-content {
  margin-top: 24px;
}

.category-title {
  font-size: 1.8rem;
  margin-bottom: 24px;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .categories-tabs {
    justify-content: center;
  }
  
  .category-tab {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
}
</style>