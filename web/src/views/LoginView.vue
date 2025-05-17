<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const email = ref('')
const password = ref('')
const isSubmitting = ref(false)
const showPassword = ref(false)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleSubmit = async () => {
  if (!email.value || !password.value) return
  
  isSubmitting.value = true
  const success = await userStore.login(email.value, password.value)
  isSubmitting.value = false
  
  if (success) {
    router.push('/')
  }
}
</script>

<template>
  <div class="container auth-container">
    <div class="auth-card">
      <h1 class="auth-title">登录</h1>
      
      <div v-if="userStore.loginError" class="error-message">
        {{ userStore.loginError }}
      </div>
      
      <form class="auth-form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email" class="form-label">电子邮箱</label>
          <input 
            id="email"
            v-model="email"
            type="email"
            class="form-input"
            placeholder="your@email.com"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password" class="form-label">密码</label>
          <div class="password-input-container">
            <input 
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="form-input"
              placeholder="请输入密码"
              required
            />
            <button 
              type="button"
              class="toggle-password-btn"
              @click="togglePasswordVisibility"
            >
              {{ showPassword ? '隐藏' : '显示' }}
            </button>
          </div>
        </div>
        
        <div class="form-footer">
          <div class="remember-me">
            <input id="remember" type="checkbox" class="form-checkbox" />
            <label for="remember">记住我</label>
          </div>
          
          <a href="#" class="forgot-password">忘记密码？</a>
        </div>
        
        <button 
          type="submit" 
          class="auth-btn btn-primary"
          :disabled="isSubmitting || !email || !password"
        >
          {{ isSubmitting ? '登录中...' : '登录' }}
        </button>
      </form>
      
      <div class="auth-links">
        <p>还没有账号？ <router-link to="/register">立即注册</router-link></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
  padding: 40px 20px;
}

.auth-card {
  width: 100%;
  max-width: 450px;
  background-color: var(--color-surface);
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.auth-title {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 32px;
}

.error-message {
  background-color: rgba(244, 67, 54, 0.1);
  color: var(--color-error);
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 24px;
  text-align: center;
}

.auth-form {
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 12px;
  background-color: var(--color-surface-variant);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: var(--color-text-primary);
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.password-input-container {
  position: relative;
}

.toggle-password-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  font-size: 0.9rem;
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.remember-me {
  display: flex;
  align-items: center;
}

.form-checkbox {
  margin-right: 8px;
}

.forgot-password {
  color: var(--color-primary);
  text-decoration: none;
  font-size: 0.9rem;
}

.auth-btn {
  width: 100%;
  padding: 12px;
  background-color: var(--color-primary);
  color: black;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.auth-btn:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
}

.auth-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-links {
  text-align: center;
  color: var(--color-text-secondary);
}

.auth-links a {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
}

@media (max-width: 480px) {
  .auth-card {
    padding: 30px 20px;
  }
  
  .auth-title {
    font-size: 1.8rem;
  }
}
</style>