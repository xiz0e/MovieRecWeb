import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../api'
import type { User, UserRegistration } from '../types/user'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const isLoggedIn = computed(() => !!user.value)
  const loginError = ref('')
  const registrationError = ref('')
  const isLoading = ref(false)
  
  // Check if user is logged in by looking for token in localStorage
  const checkAuth = async () => {
    const token = localStorage.getItem('auth_token')
    if (!token) return
    
    try {
      isLoading.value = true
      const response = await api.get('/users/me')
      user.value = response.data
    } catch (error) {
      localStorage.removeItem('auth_token')
      user.value = null
    } finally {
      isLoading.value = false
    }
  }
  
  const login = async (email: string, password: string) => {
    try {
      isLoading.value = true
      loginError.value = ''
      
      const response = await api.post('/login', { email, password })
      
      // Store token in localStorage
      localStorage.setItem('auth_token', response.data.token)
      user.value = response.data.user
      
      return true
    } catch (error: any) {
      loginError.value = error.response?.data?.message || '登录失败，请检查您的凭据'
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  const register = async (userData: UserRegistration) => {
    try {
      isLoading.value = true
      registrationError.value = ''
      
      const response = await api.post('/register', userData)
      
      // Log in user automatically after registration
      localStorage.setItem('auth_token', response.data.token)
      user.value = response.data.user
      
      return true
    } catch (error: any) {
      registrationError.value = error.response?.data?.message || '注册失败，请稍后再试'
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  const logout = () => {
    localStorage.removeItem('auth_token')
    user.value = null
  }
  
  const updateProfile = async (userData: Partial<User>) => {
    try {
      isLoading.value = true
      
      const response = await api.put('/users/update', userData)
      user.value = response.data
      
      return true
    } catch (error) {
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  // Initialize auth state
  checkAuth()
  
  return {
    user,
    isLoggedIn,
    loginError,
    registrationError,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    checkAuth
  }
})