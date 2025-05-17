<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMoviesStore } from '../stores/movies'
import MovieGrid from '../components/movie/MovieGrid.vue'

const moviesStore = useMoviesStore()
const loading = ref(true)

onMounted(async () => {
  if (moviesStore.popularMovies.length === 0) {
    await moviesStore.fetchPopularMovies()
  }
  loading.value = false
})
</script>

<template>
  <div class="container">
    <div class="page-header">
      <h1 class="page-title">热门电影</h1>
      <p class="page-description">当下最受欢迎的电影，不容错过</p>
    </div>
    
    <MovieGrid 
      :movies="moviesStore.popularMovies" 
      :loading="loading" 
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

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .page-description {
    font-size: 1rem;
  }
}
</style>