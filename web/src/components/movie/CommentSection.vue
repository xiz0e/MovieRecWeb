<script setup lang="ts">
import { ref } from 'vue'
import type { Comment } from '../../types/movie'
import { useUserStore } from '../../stores/user'

const props = defineProps<{
  movieId: string
  comments: Comment[]
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'add-comment', comment: Omit<Comment, 'id' | 'date'>): void
}>()

const userStore = useUserStore()
const commentText = ref('')
const isSubmitting = ref(false)

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleSubmit = () => {
  if (!commentText.value.trim() || !userStore.isLoggedIn) return
  
  isSubmitting.value = true
  
  const newComment = {
    movieId: props.movieId,
    userId: userStore.user?.id || '',
    username: userStore.user?.username || '',
    content: commentText.value.trim()
  }
  
  emit('add-comment', newComment)
  
  // Clear the form
  commentText.value = ''
  isSubmitting.value = false
}
</script>

<template>
  <div class="comment-section">
    <h3 class="section-title">观影评论 ({{ comments.length }})</h3>
    
    <div v-if="loading" class="comments-loading">
      <div class="loading-spinner"></div>
      <p>加载评论中...</p>
    </div>
    
    <div v-else>
      <div v-if="userStore.isLoggedIn" class="comment-form">
        <textarea 
          v-model="commentText"
          class="comment-input"
          placeholder="写下您的观影感受..."
          rows="3"
        ></textarea>
        <button 
          class="submit-btn" 
          :disabled="!commentText.trim() || isSubmitting"
          @click="handleSubmit"
        >
          发表评论
        </button>
      </div>
      
      <div v-else class="login-prompt">
        <p>请<router-link to="/login">登录</router-link>后发表评论</p>
      </div>
      
      <div class="comments-list">
        <div v-if="comments.length === 0" class="no-comments">
          <p>暂无评论，成为第一个评论的人吧！</p>
        </div>
        
        <div v-else>
          <div v-for="comment in comments" :key="comment.id" class="comment-item">
            <div class="comment-header">
              <div class="comment-user">{{ comment.username }}</div>
              <div class="comment-date">{{ formatDate(comment.date) }}</div>
            </div>
            <div class="comment-content">{{ comment.content }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comment-section {
  margin-top: 40px;
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 24px;
  color: var(--color-text-primary);
}

.comment-form {
  margin-bottom: 32px;
}

.comment-input {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  background-color: var(--color-surface-variant);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s;
}

.comment-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.submit-btn {
  margin-top: 12px;
  padding: 10px 20px;
  background-color: var(--color-primary);
  color: black;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.login-prompt {
  text-align: center;
  padding: 24px;
  background-color: var(--color-surface-variant);
  border-radius: 8px;
  margin-bottom: 32px;
}

.login-prompt a {
  color: var(--color-primary);
  font-weight: 600;
}

.comments-list {
  margin-top: 24px;
}

.no-comments {
  text-align: center;
  padding: 32px;
  color: var(--color-text-secondary);
}

.comment-item {
  padding: 20px;
  background-color: var(--color-surface-variant);
  border-radius: 8px;
  margin-bottom: 16px;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.comment-user {
  font-weight: 600;
  color: var(--color-primary);
}

.comment-date {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.comment-content {
  line-height: 1.6;
}

.comments-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255, 255, 255, 0.1);
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

@media (max-width: 768px) {
  .comment-header {
    flex-direction: column;
  }
  
  .comment-date {
    margin-top: 4px;
  }
}
</style>