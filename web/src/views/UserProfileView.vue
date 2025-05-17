<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useMoviesStore } from '../stores/movies'
import type { User } from '../types/user'

const router = useRouter()
const userStore = useUserStore()
const moviesStore = useMoviesStore()

const loading = ref(true)
const isEditing = ref(false)
const updateSuccess = ref(false)
const updateError = ref(false)
const activeTab = ref('overview')

const userProfile = ref<User | null>(null)

// Calculate registration date
const registrationDate = computed(() => {
  return new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long'
  })
})

// Calculate average rating
const averageRating = computed(() => {
  if (!moviesStore.ratingHistory.length) return 0
  const sum = moviesStore.ratingHistory.reduce((acc, curr) => acc + curr.rating, 0)
  return (sum / moviesStore.ratingHistory.length).toFixed(1)
})

// Calculate rating distribution
const ratingDistribution = computed(() => {
  const distribution = new Array(10).fill(0)
  moviesStore.ratingHistory.forEach(rating => {
    const index = Math.floor(rating.rating * 2) - 1
    distribution[index]++
  })
  return distribution
})

// Calculate favorite genres
const favoriteGenres = computed(() => {
  const genreCounts: Record<string, number> = {}
  moviesStore.ratingHistory.forEach(rating => {
    const movie = moviesStore.allMovies.find(m => m.id === rating.movieId)
    if (movie) {
      movie.categories.forEach(categoryId => {
        const category = moviesStore.categories.find(c => c.id === categoryId)
        if (category) {
          genreCounts[category.name] = (genreCounts[category.name] || 0) + 1
        }
      })
    }
  })
  
  return Object.entries(genreCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }))
})

// Get user avatar letter
const avatarLetter = computed(() => {
  return userProfile.value?.username.charAt(0).toUpperCase() || '?'
})

const professions = [
  { value: 'academic/educator', label: '学术/教育工作者' },
  { value: 'artist', label: '艺术家' },
  { value: 'technician/engineer', label: '技术人员/工程师' },
  { value: 'student', label: '学生' },
  { value: 'business', label: '商业/金融' },
  { value: 'healthcare', label: '医疗保健' },
  { value: 'other', label: '其他' }
]

onMounted(async () => {
  if (!userStore.isLoggedIn) {
    router.push('/login')
    return
  }
  
  userProfile.value = { ...userStore.user! }
  await moviesStore.fetchRatingHistory()
  loading.value = false
})

const saveProfile = async () => {
  if (!userProfile.value) return
  
  const success = await userStore.updateProfile(userProfile.value)
  
  if (success) {
    updateSuccess.value = true
    updateError.value = false
    isEditing.value = false
    
    setTimeout(() => {
      updateSuccess.value = false
    }, 3000)
  } else {
    updateError.value = true
    updateSuccess.value = false
  }
}

const logout = () => {
  userStore.logout()
  router.push('/')
}
</script>

<template>
  <div v-if="!userStore.isLoggedIn" class="login-prompt">
    <p>请<router-link to="/login">登录</router-link>后查看您的个人资料</p>
  </div>
  
  <div v-else-if="loading" class="loading-container">
    <div class="loading-spinner"></div>
    <p>加载个人资料...</p>
  </div>
  
  <template v-else-if="userProfile">
    <!-- User Header -->
    <div class="user-header">
      <div class="container">
        <div class="user-header-content">
          <div class="user-avatar" :style="{ backgroundColor: '#F5C518' }">
            {{ avatarLetter }}
          </div>
          
          <div class="user-info">
            <h1 class="username">{{ userProfile.username }}</h1>
            <div class="user-stats">
              <span class="stat-item">
                注册于 {{ registrationDate }}
              </span>
              <span class="stat-separator">•</span>
              <span class="stat-item">
                平均评分 <strong>{{ averageRating }}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Navigation Bar -->
    <div class="nav-bar">
      <div class="container">
        <div class="nav-items">
          <div class="nav-group">
            <button 
              class="nav-item" 
              :class="{ active: activeTab === 'overview' }"
              @click="activeTab = 'overview'"
            >
              概览
            </button>
            <button 
              class="nav-item"
              :class="{ active: activeTab === 'ratings' }"
              @click="activeTab = 'ratings'"
            >
              评分记录
            </button>
            <button 
              class="nav-item"
              :class="{ active: activeTab === 'comments' }"
              @click="activeTab = 'comments'"
            >
              评论记录
            </button>
          </div>
          
          <div class="nav-group">
            <button 
              class="nav-item edit-profile"
              @click="isEditing = true"
            >
              编辑个人资料
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Main Content -->
    <div class="container main-content">
      <!-- Overview Tab -->
      <div v-if="activeTab === 'overview'" class="overview-tab">
        <div class="stats-grid">
          <div class="stat-card">
            <h3>评分统计</h3>
            <div class="stat-number">{{ moviesStore.ratingHistory.length }}</div>
            <div class="stat-label">总评分次数</div>
          </div>
          
          <div class="stat-card">
            <h3>评论统计</h3>
            <div class="stat-number">0</div>
            <div class="stat-label">总评论次数</div>
          </div>
          
          <div class="stat-card">
            <h3>平均评分</h3>
            <div class="stat-number">{{ averageRating }}</div>
            <div class="stat-label">分 / 5分</div>
          </div>
        </div>
        
        <div class="detailed-stats">
          <div class="rating-distribution">
            <h3>评分分布</h3>
            <div class="distribution-chart">
              <div 
                v-for="(count, index) in ratingDistribution" 
                :key="index"
                class="distribution-bar"
                :style="{ 
                  height: `${count ? (count / Math.max(...ratingDistribution)) * 100 : 0}%`,
                  backgroundColor: '#F5C518'
                }"
              >
                <div class="bar-label">{{ (index + 1) / 2 }}</div>
              </div>
            </div>
          </div>
          
          <div class="favorite-genres">
            <h3>最关注类型</h3>
            <div class="genre-list">
              <div 
                v-for="genre in favoriteGenres" 
                :key="genre.name"
                class="genre-item"
              >
                <span class="genre-name">{{ genre.name }}</span>
                <span class="genre-count">{{ genre.count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Ratings Tab -->
      <div v-else-if="activeTab === 'ratings'" class="ratings-tab">
        <router-view name="ratings" />
      </div>
      
      <!-- Comments Tab -->
      <div v-else-if="activeTab === 'comments'" class="comments-tab">
        <router-view name="comments" />
      </div>
    </div>
  </template>
</template>

<style scoped>
.user-header {
  background-color: var(--color-surface);
  padding: 40px 0;
  margin-bottom: 1px;
}

.user-header-content {
  display: flex;
  align-items: center;
  gap: 24px;
}

.user-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: 700;
  color: black;
}

.username {
  font-size: 2.5rem;
  margin-bottom: 8px;
}

.user-stats {
  color: var(--color-text-secondary);
}

.stat-separator {
  margin: 0 12px;
}

.nav-bar {
  background-color: var(--color-surface);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 40px;
}

.nav-items {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-group {
  display: flex;
  gap: 4px;
}

.nav-item {
  padding: 16px 24px;
  background: none;
  border: none;
  color: var(--color-text-secondary);
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-item:hover {
  color: var(--color-text-primary);
}

.nav-item.active {
  color: var(--color-primary);
  box-shadow: inset 0 -2px var(--color-primary);
}

.nav-item.edit-profile {
  color: var(--color-primary);
}

.main-content {
  padding-bottom: 60px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.stat-card {
  background-color: var(--color-surface);
  padding: 24px;
  border-radius: 8px;
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-primary);
  margin: 16px 0;
}

.stat-label {
  color: var(--color-text-secondary);
}

.detailed-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.rating-distribution, .favorite-genres {
  background-color: var(--color-surface);
  padding: 24px;
  border-radius: 8px;
}

.distribution-chart {
  height: 200px;
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 20px 0;
}

.distribution-bar {
  flex: 1;
  min-height: 4px;
  position: relative;
  transition: height 0.3s;
}

.bar-label {
  position: absolute;
  bottom: -24px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

.genre-list {
  margin-top: 16px;
}

.genre-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.genre-item:last-child {
  border-bottom: none;
}

.genre-count {
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

.login-prompt {
  text-align: center;
  padding: 100px 0;
  font-size: 1.2rem;
}

.login-prompt a {
  color: var(--color-primary);
  font-weight: 600;
}

@media (max-width: 768px) {
  .user-header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .username {
    font-size: 2rem;
  }
  
  .nav-items {
    flex-direction: column;
    gap: 8px;
  }
  
  .nav-group {
    width: 100%;
    justify-content: center;
  }
  
  .detailed-stats {
    grid-template-columns: 1fr;
  }
}
</style>