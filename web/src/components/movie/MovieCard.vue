<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import RatingStars from './RatingStars.vue'
import type { Movie } from '../../types/movie'

const props = defineProps<{
  movie: Movie
  showRating?: boolean
}>()

const router = useRouter()

const imageUrl = computed(() => {
  return props.movie.poster || 'https://via.placeholder.com/300x450?text=无海报'
})

const goToDetail = () => {
  router.push({ name: 'movie-detail', params: { id: props.movie.id } })
}
</script>

<template>
  <div class="movie-card" @click="goToDetail">
    <div class="poster-wrapper">
      <img :src="imageUrl" :alt="movie.title" class="movie-poster" />
      <div class="movie-overlay">
        <button class="view-details-btn">查看详情</button>
      </div>
    </div>
    <div class="movie-info">
      <h3 class="movie-title">{{ movie.title }}</h3>
      <p class="movie-year">{{ movie.year }}</p>
      <div v-if="showRating" class="movie-rating">
        <RatingStars :rating="movie.rating" readonly />
        <span class="rating-value">{{ movie.rating.toFixed(1) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.movie-card {
  background-color: var(--color-surface);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.movie-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.poster-wrapper {
  position: relative;
  overflow: hidden;
  aspect-ratio: 2/3;
}

.movie-poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.movie-card:hover .movie-poster {
  transform: scale(1.05);
}

.movie-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  opacity: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s;
}

.movie-card:hover .movie-overlay {
  opacity: 1;
}

.view-details-btn {
  background-color: var(--color-primary);
  color: black;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-weight: 500;
  transform: translateY(20px);
  transition: transform 0.3s;
}

.movie-card:hover .view-details-btn {
  transform: translateY(0);
}

.movie-info {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.movie-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.movie-year {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.movie-rating {
  display: flex;
  align-items: center;
  margin-top: auto;
}

.rating-value {
  margin-left: 6px;
  font-weight: 600;
  color: var(--color-primary);
}
</style>