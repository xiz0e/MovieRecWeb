<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMoviesStore } from '../stores/movies'
import MovieGrid from '../components/movie/MovieGrid.vue'

const moviesStore = useMoviesStore()
const loading = ref(true)

onMounted(async () => {
  if (moviesStore.allMovies.length === 0) {
    await moviesStore.fetchMovies()
  }
  if (moviesStore.popularMovies.length === 0) {
    await moviesStore.fetchPopularMovies()
  }
  loading.value = false
})
</script>

<template>
  <div class="container">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">发现精彩电影</h1>
        <p class="hero-subtitle">浏览、评分、获得个性化推荐</p>
        <div class="hero-cta">
          <router-link to="/popular" class="hero-btn btn-primary">热门电影</router-link>
          <router-link to="/categories" class="hero-btn">浏览分类</router-link>
        </div>
      </div>
    </section>
    
    <!-- Popular Movies Section -->
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">热门电影</h2>
        <router-link to="/popular" class="section-link">查看全部</router-link>
      </div>
      <MovieGrid 
        :movies="moviesStore.popularMovies" 
        :loading="loading" 
        :showRating="true" 
      />
    </section>
    
    <!-- Recent Movies Section -->
    <section class="section">
      <div class="section-header">
        <h2 class="section-title">最新上映</h2>
        <router-link to="/recent" class="section-link">查看全部</router-link>
      </div>
      <MovieGrid 
        :movies="moviesStore.allMovies.slice(0, 4)" 
        :loading="loading" 
        :showRating="true" 
      />
    </section>
  </div>
</template>

<style scoped>
.hero-section {
  position: relative;
  height: 500px;
  background-image: url('https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');
  background-size: cover;
  background-position: center;
  border-radius: 16px;
  margin-bottom: 48px;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 100%);
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 600px;
  padding: 0 48px;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: white;
}

.hero-subtitle {
  font-size: 1.2rem;
  margin-bottom: 32px;
  color: rgba(255, 255, 255, 0.9);
}

.hero-cta {
  display: flex;
  gap: 16px;
}

.hero-btn {
  padding: 12px 24px;
  border-radius: 4px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
}

.hero-btn.btn-primary {
  background-color: var(--color-primary);
  color: black;
}

.hero-btn.btn-primary:hover {
  background-color: var(--color-primary-dark);
}

.hero-btn:not(.btn-primary) {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.hero-btn:not(.btn-primary):hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.section {
  margin-bottom: 48px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 600;
}

.section-link {
  color: var(--color-primary);
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
}

.section-link:hover {
  color: var(--color-primary-dark);
}

@media (max-width: 768px) {
  .hero-section {
    height: 400px;
  }
  
  .hero-content {
    padding: 0 24px;
  }
  
  .hero-title {
    font-size: 2.2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .hero-section {
    height: 350px;
  }
  
  .hero-title {
    font-size: 1.8rem;
  }
  
  .hero-cta {
    flex-direction: column;
    gap: 12px;
  }
  
  .hero-btn {
    text-align: center;
  }
}
</style>