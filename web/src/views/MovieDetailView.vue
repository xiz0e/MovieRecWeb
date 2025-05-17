<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMoviesStore } from '../stores/movies'
import { useUserStore } from '../stores/user'
import RatingStars from '../components/movie/RatingStars.vue'
import CommentSection from '../components/movie/CommentSection.vue'
import MovieGrid from '../components/movie/MovieGrid.vue'
import type { Movie, Comment } from '../types/movie'

const route = useRoute()
const moviesStore = useMoviesStore()
const userStore = useUserStore()

const movieId = computed(() => route.params.id as string)
const movie = ref<Movie | null>(null)
const loading = ref(true)
const comments = ref<Comment[]>([])
const commentsLoading = ref(true)
const similarMovies = ref<Movie[]>([])
const userRating = ref(0)

// Fetch movie details
const fetchMovieDetails = async () => {
  loading.value = true
  movie.value = await moviesStore.getMovie(movieId.value)
  loading.value = false
  
  if (movie.value) {
    fetchSimilarMovies()
    fetchMovieComments()
    
    // Check if user has rated this movie
    const ratingHistory = moviesStore.ratingHistory
    const userRatingRecord = ratingHistory.find(r => r.movieId === movieId.value)
    if (userRatingRecord) {
      userRating.value = userRatingRecord.rating
    }
  }
}

// Fetch similar movies
const fetchSimilarMovies = async () => {
  if (!movie.value) return
  
  const allMovies = moviesStore.allMovies
  similarMovies.value = allMovies
    .filter(m => 
      m.id !== movie.value?.id && 
      m.categories.some(c => movie.value?.categories.includes(c))
    )
    .slice(0, 4)
}

// Fetch movie comments
const fetchMovieComments = async () => {
  commentsLoading.value = true
  comments.value = await moviesStore.fetchComments(movieId.value)
  commentsLoading.value = false
}

// Handle user rating
const handleRating = async (rating: number) => {
  if (!userStore.isLoggedIn) {
    alert('请先登录再评分')
    return
  }
  
  userRating.value = rating
  await moviesStore.rateMovie(movieId.value, rating)
}

// Handle adding a comment
const handleAddComment = async (comment: Omit<Comment, 'id' | 'date'>) => {
  const newComment = await moviesStore.addComment(comment)
  if (newComment) {
    comments.value = [newComment, ...comments.value]
  }
}

// Fetch data when component is mounted
onMounted(() => {
  fetchMovieDetails()
})
</script>

<template>
  <div v-if="loading" class="container loading-container">
    <div class="loading-spinner"></div>
    <p>加载电影详情...</p>
  </div>
  
  <div v-else-if="!movie" class="container error-container">
    <p>未找到电影</p>
    <router-link to="/" class="back-btn">返回首页</router-link>
  </div>
  
  <template v-else>
    <!-- Movie Backdrop -->
    <div class="movie-backdrop" :style="{ backgroundImage: `url(${movie.backdrop})` }">
      <div class="backdrop-overlay"></div>
    </div>
    
    <div class="container movie-detail-container">
      <!-- Movie Header -->
      <div class="movie-header">
        <div class="movie-poster-container">
          <img :src="movie.poster" :alt="movie.title" class="movie-poster" />
        </div>
        
        <div class="movie-info">
          <h1 class="movie-title">{{ movie.title }}</h1>
          <p v-if="movie.originalTitle" class="movie-original-title">{{ movie.originalTitle }}</p>
          
          <div class="movie-meta">
            <span class="movie-year">{{ movie.year }}</span>
            <span class="meta-separator">•</span>
            <span v-for="(categoryId, index) in movie.categories" :key="categoryId" class="movie-category">
              {{ moviesStore.categories.find(c => c.id === categoryId)?.name }}
              <span v-if="index < movie.categories.length - 1" class="category-separator">/</span>
            </span>
          </div>
          
          <div class="movie-rating">
            <div class="rating-display">
              <RatingStars :rating="movie.rating" :maxRating="5" readonly />
              <span class="rating-value">{{ movie.rating.toFixed(1) }}</span>
            </div>
            
            <div v-if="userStore.isLoggedIn" class="user-rating">
              <p class="rating-label">我的评分:</p>
              <RatingStars 
                :rating="userRating" 
                :maxRating="5" 
                @update:rating="handleRating" 
              />
            </div>
          </div>
          
          <div class="movie-description">
            <h3>剧情简介</h3>
            <p>{{ movie.description }}</p>
          </div>
        </div>
      </div>
      
      <!-- Comment Section -->
      <CommentSection 
        :movieId="movieId"
        :comments="comments"
        :loading="commentsLoading"
        @add-comment="handleAddComment"
      />
      
      <!-- Similar Movies Section -->
      <div v-if="similarMovies.length > 0" class="similar-movies-section">
        <h3 class="section-title">相似电影</h3>
        <MovieGrid :movies="similarMovies" :showRating="true" />
      </div>
    </div>
  </template>
</template>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.1);
  border-left-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 24px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-container {
  text-align: center;
  padding: 100px 0;
}

.back-btn {
  display: inline-block;
  margin-top: 24px;
  padding: 10px 20px;
  background-color: var(--color-primary);
  color: black;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
}

.movie-backdrop {
  position: absolute;
  top: 64px; /* 调整这里，让背景图从导航栏下方开始 */
  left: 0;
  width: 100%;
  height: 500px;
  background-size: cover;
  background-position: center;
  z-index: -1;
}

.backdrop-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(18, 18, 18, 0.5) 0%, var(--color-background) 100%);
}

.movie-detail-container {
  padding-top: 300px;
}

.movie-header {
  display: flex;
  gap: 32px;
  margin-bottom: 48px;
}

.movie-poster-container {
  flex-shrink: 0;
  width: 250px;
}

.movie-poster {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.movie-info {
  flex: 1;
}

.movie-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.movie-original-title {
  font-size: 1.2rem;
  color: var(--color-text-secondary);
  margin-bottom: 16px;
}

.movie-meta {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  color: var(--color-text-secondary);
}

.meta-separator {
  margin: 0 8px;
}

.category-separator {
  margin: 0 4px;
}

.movie-rating {
  margin-bottom: 32px;
}

.rating-display {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.rating-value {
  margin-left: 8px;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-primary);
}

.user-rating {
  display: flex;
  align-items: center;
}

.rating-label {
  margin-right: 12px;
  font-weight: 500;
}

.movie-description {
  color: var(--color-text-primary);
}

.movie-description h3 {
  font-size: 1.3rem;
  margin-bottom: 12px;
}

.movie-description p {
  line-height: 1.7;
}

.similar-movies-section {
  margin-top: 60px;
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 24px;
}

@media (max-width: 768px) {
  .movie-backdrop {
    top: 56px; /* 移动端导航栏高度较小 */
    height: 300px;
  }
  
  .movie-detail-container {
    padding-top: 150px;
  }
  
  .movie-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 24px;
  }
  
  .movie-poster-container {
    width: 200px;
  }
  
  .movie-title {
    font-size: 2rem;
  }
  
  .user-rating {
    justify-content: center;
  }
  
  .movie-meta {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .rating-display {
    justify-content: center;
  }
}
</style>