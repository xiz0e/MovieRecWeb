<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'

const router = useRouter()
const userStore = useUserStore()

const searchQuery = ref('')
const isMenuOpen = ref(false)

const isLoggedIn = computed(() => userStore.isLoggedIn)
const username = computed(() => userStore.user?.username || '')

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const search = () => {
  if (searchQuery.value.trim()) {
    router.push({
      name: 'search',
      query: { q: searchQuery.value }
    })
    searchQuery.value = ''
  }
}

const logout = () => {
  userStore.logout()
  router.push({ name: 'home' })
}
</script>

<template>
  <header class="header">
    <div class="container header-container">
      <div class="logo-container">
        <router-link to="/" class="logo">
          <span class="logo-text">影视推荐</span>
        </router-link>
      </div>

      <div class="search-container">
        <input 
          type="text" 
          v-model="searchQuery" 
          @keyup.enter="search"
          placeholder="搜索电影..." 
          class="search-input" 
        />
        <button class="search-btn" @click="search">搜索</button>
      </div>

      <nav class="desktop-nav">
        <ul class="nav-list">
          <li><router-link to="/">首页</router-link></li>
          <li><router-link to="/categories">电影分类</router-link></li>
          <li><router-link to="/popular">热门电影</router-link></li>
          <li v-if="isLoggedIn"><router-link to="/recommendations">推荐列表</router-link></li>
          <li v-if="isLoggedIn"><router-link to="/history">评分历史</router-link></li>
        </ul>
      </nav>

      <div class="user-actions">
        <template v-if="isLoggedIn">
          <div class="user-menu">
            <button class="user-btn">{{ username }}</button>
            <div class="dropdown-menu">
              <router-link to="/user" class="dropdown-item">个人资料</router-link>
              <button @click="logout" class="dropdown-item logout-btn">退出登录</button>
            </div>
          </div>
        </template>
        <template v-else>
          <router-link to="/login" class="login-btn">登录</router-link>
          <router-link to="/register" class="register-btn btn-primary">注册</router-link>
        </template>
      </div>

      <button class="mobile-menu-btn" @click="toggleMenu">
        <span class="menu-icon"></span>
      </button>
    </div>

    <div class="mobile-nav" :class="{ 'open': isMenuOpen }">
      <ul class="mobile-nav-list">
        <li><router-link to="/" @click="isMenuOpen = false">首页</router-link></li>
        <li><router-link to="/categories" @click="isMenuOpen = false">电影分类</router-link></li>
        <li><router-link to="/popular" @click="isMenuOpen = false">热门电影</router-link></li>
        <li v-if="isLoggedIn"><router-link to="/recommendations" @click="isMenuOpen = false">推荐列表</router-link></li>
        <li v-if="isLoggedIn"><router-link to="/history" @click="isMenuOpen = false">评分历史</router-link></li>
        <li v-if="!isLoggedIn"><router-link to="/login" @click="isMenuOpen = false">登录</router-link></li>
        <li v-if="!isLoggedIn"><router-link to="/register" @click="isMenuOpen = false">注册</router-link></li>
        <li v-if="isLoggedIn"><router-link to="/user" @click="isMenuOpen = false">个人资料</router-link></li>
        <li v-if="isLoggedIn"><button @click="logout" class="logout-mobile-btn">退出登录</button></li>
      </ul>
    </div>
  </header>
</template>

<style scoped>
.header {
  background-color: var(--color-surface);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 16px;
}

.logo-container {
  flex-shrink: 0;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-left: 8px;
}

.search-container {
  flex: 1;
  max-width: 500px;
  margin: 0 24px;
  display: flex;
}

.search-input {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 4px 0 0 4px;
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
  font-size: 0.9rem;
}

.search-input:focus {
  outline: none;
  background-color: rgba(255, 255, 255, 0.15);
}

.search-btn {
  padding: 8px 16px;
  background-color: var(--color-primary);
  color: black;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.search-btn:hover {
  background-color: var(--color-primary-dark);
}

.nav-list {
  display: flex;
  list-style: none;
}

.nav-list li {
  margin: 0 12px;
}

.nav-list a {
  color: var(--color-text-primary);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: color 0.2s;
}

.nav-list a:hover,
.nav-list a.router-link-active {
  color: var(--color-primary);
}

.user-actions {
  display: flex;
  align-items: center;
  margin-left: 24px;
}

.login-btn, .register-btn {
  padding: 6px 12px;
  margin-left: 8px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.login-btn {
  color: var(--color-text-primary);
}

.register-btn {
  color: black;
}

.user-menu {
  position: relative;
}

.user-btn {
  padding: 6px 12px;
  background-color: transparent;
  color: var(--color-text-primary);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.user-btn:hover {
  border-color: var(--color-primary);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  width: 160px;
  margin-top: 8px;
  background-color: var(--color-surface-variant);
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s;
}

.user-menu:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  display: block;
  padding: 12px 16px;
  text-decoration: none;
  color: var(--color-text-primary);
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.logout-btn {
  width: 100%;
  text-align: left;
  background-color: transparent;
  border: none;
  color: var(--color-error);
  cursor: pointer;
  padding: 12px 16px;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
}

.menu-icon {
  display: block;
  width: 24px;
  height: 2px;
  background-color: var(--color-text-primary);
  position: relative;
  transition: background-color 0.3s;
}

.menu-icon::before,
.menu-icon::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 2px;
  background-color: var(--color-text-primary);
  transition: transform 0.3s;
}

.menu-icon::before {
  top: -6px;
}

.menu-icon::after {
  bottom: -6px;
}

.mobile-nav {
  display: none;
  background-color: var(--color-surface);
  padding: 16px;
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.3s ease-out;
}

.mobile-nav.open {
  max-height: 500px;
}

.mobile-nav-list {
  list-style: none;
}

.mobile-nav-list li {
  margin: 16px 0;
}

.mobile-nav-list a {
  color: var(--color-text-primary);
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 500;
}

.logout-mobile-btn {
  background: none;
  border: none;
  color: var(--color-error);
  font-size: 1.1rem;
  font-weight: 500;
  padding: 0;
  cursor: pointer;
}

@media (max-width: 1024px) {
  .search-container {
    max-width: 300px;
    margin: 0 16px;
  }
}

@media (max-width: 768px) {
  .desktop-nav, .user-actions {
    display: none;
  }

  .mobile-menu-btn {
    display: block;
  }

  .search-container {
    flex: 1;
    margin: 0 12px;
  }

  .mobile-nav {
    display: block;
  }

  .header-container {
    height: 56px;
  }
}
</style>