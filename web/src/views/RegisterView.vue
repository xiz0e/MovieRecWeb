<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import type { UserRegistration } from '../types/user'

const router = useRouter()
const userStore = useUserStore()

const userData = ref<UserRegistration>({
  username: '',
  email: '',
  password: '',
  gender: '',
  age: 25,
  profession: ''
})

const confirmPassword = ref('')
const isSubmitting = ref(false)
const showPassword = ref(false)
const agreeTerms = ref(false)

const professions = [
  { value: 'academic/educator', label: '学术/教育工作者' },
  { value: 'artist', label: '艺术家' },
  { value: 'technician/engineer', label: '技术人员/工程师' },
  { value: 'student', label: '学生' },
  { value: 'business', label: '商业/金融' },
  { value: 'healthcare', label: '医疗保健' },
  { value: 'other', label: '其他' }
]

const passwordsMatch = computed(() => {
  return userData.value.password === confirmPassword.value
})

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleSubmit = async () => {
  if (!userData.value.username || !userData.value.email || !userData.value.password || 
      !userData.value.gender || !userData.value.profession || !agreeTerms.value || 
      !passwordsMatch.value) {
    return
  }
  
  isSubmitting.value = true
  const success = await userStore.register(userData.value)
  isSubmitting.value = false
  
  if (success) {
    router.push('/')
  }
}
</script>

<template>
  <div class="container auth-container">
    <div class="auth-card">
      <h1 class="auth-title">注册账号</h1>
      
      <div v-if="userStore.registrationError" class="error-message">
        {{ userStore.registrationError }}
      </div>
      
      <form class="auth-form" @submit.prevent="handleSubmit">
        <div class="form-row">
          <div class="form-group">
            <label for="username" class="form-label">用户名</label>
            <input 
              id="username"
              v-model="userData.username"
              type="text"
              class="form-input"
              placeholder="请输入用户名"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="email" class="form-label">电子邮箱</label>
            <input 
              id="email"
              v-model="userData.email"
              type="email"
              class="form-input"
              placeholder="your@email.com"
              required
            />
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="password" class="form-label">密码</label>
            <div class="password-input-container">
              <input 
                id="password"
                v-model="userData.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="至少8个字符"
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
          
          <div class="form-group">
            <label for="confirmPassword" class="form-label">确认密码</label>
            <input 
              id="confirmPassword"
              v-model="confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              class="form-input"
              placeholder="再次输入密码"
              required
            />
            <div v-if="confirmPassword && !passwordsMatch" class="input-error">
              密码不匹配
            </div>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="gender" class="form-label">性别</label>
            <select 
              id="gender"
              v-model="userData.gender"
              class="form-input"
              required
            >
              <option value="" disabled>请选择</option>
              <option value="男">男</option>
              <option value="女">女</option>
              <option value="其他">其他</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="age" class="form-label">年龄</label>
            <input 
              id="age"
              v-model.number="userData.age"
              type="number"
              class="form-input"
              min="1"
              max="120"
              required
            />
          </div>
        </div>
        
        <div class="form-group">
          <label for="profession" class="form-label">职业</label>
          <select 
            id="profession"
            v-model="userData.profession"
            class="form-input"
            required
          >
            <option value="" disabled>请选择</option>
            <option 
              v-for="profession in professions" 
              :key="profession.value" 
              :value="profession.value"
            >
              {{ profession.label }}
            </option>
          </select>
        </div>
        
        <div class="form-group terms-container">
          <div class="checkbox-container">
            <input 
              id="terms" 
              v-model="agreeTerms" 
              type="checkbox" 
              class="form-checkbox" 
              required
            />
            <label for="terms" class="terms-label">
              我已阅读并同意<a href="#" class="terms-link">用户协议</a>和<a href="#" class="terms-link">隐私政策</a>
            </label>
          </div>
        </div>
        
        <button 
          type="submit" 
          class="auth-btn btn-primary"
          :disabled="isSubmitting || !userData.username || !userData.email || 
                    !userData.password || !userData.gender || !userData.profession || 
                    !passwordsMatch || !agreeTerms"
        >
          {{ isSubmitting ? '注册中...' : '注册' }}
        </button>
      </form>
      
      <div class="auth-links">
        <p>已有账号？ <router-link to="/login">立即登录</router-link></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
}

.auth-card {
  width: 100%;
  max-width: 600px;
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

.form-row {
  display: flex;
  gap: 16px;
  margin-bottom: 0;
}

.form-row .form-group {
  flex: 1;
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

.input-error {
  color: var(--color-error);
  font-size: 0.9rem;
  margin-top: 6px;
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

.terms-container {
  margin-top: 16px;
}

.checkbox-container {
  display: flex;
  align-items: flex-start;
}

.form-checkbox {
  margin-right: 8px;
  margin-top: 3px;
}

.terms-label {
  font-size: 0.9rem;
  line-height: 1.4;
  color: var(--color-text-secondary);
}

.terms-link {
  color: var(--color-primary);
  text-decoration: none;
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
  margin-top: 16px;
}

.auth-links a {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .auth-card {
    padding: 30px 20px;
  }
}
</style>