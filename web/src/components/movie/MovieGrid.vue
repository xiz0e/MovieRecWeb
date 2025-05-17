<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import MovieCard from './MovieCard.vue'
import type { Movie } from '../../types/movie'

const props = defineProps<{
  movies: Movie[]
  loading?: boolean
  showRating?: boolean
}>()
</script>

<template>
  <div class="movie-grid-container">
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <div v-else-if="movies.length === 0" class="empty-state">
      <p>没有找到电影</p>
    </div>

    <div v-else class="movie-grid">
      <div v-for="movie in movies" :key="movie.id" class="movie-grid-item">
        <MovieCard :movie="movie" :showRating="showRating" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.movie-grid-container {
  width: 100%;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 24px;
  width: 100%;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
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
  padding: 48px 0;
  color: var(--color-text-secondary);
}

@media (max-width: 768px) {
  .movie-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .movie-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
  }
}
</style>