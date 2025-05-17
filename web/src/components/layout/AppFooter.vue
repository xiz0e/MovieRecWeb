<script setup lang="ts">
import { ref } from 'vue'

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container footer-container">
      <div class="footer-section">
        <h3 class="footer-title">影视推荐</h3>
        <p class="footer-description">您的专属观影指南，发现更多优质电影</p>
      </div>
      
      <div class="footer-section">
        <h4 class="footer-subtitle">快速链接</h4>
        <ul class="footer-links">
          <li><router-link to="/">首页</router-link></li>
          <li><router-link to="/categories">电影分类</router-link></li>
          <li><router-link to="/popular">热门电影</router-link></li>
          <li><router-link to="/recommendations">推荐列表</router-link></li>
        </ul>
      </div>
      
      <div class="footer-section">
        <h4 class="footer-subtitle">帮助</h4>
        <ul class="footer-links">
          <li><a href="#">使用文档</a></li>

        </ul>
      </div>
    </div>
    
<!--    <div class="footer-bottom">-->
<!--      <div class="container">-->
<!--        <p class="copyright">© xiz0e. 保留所有权利.</p>-->
<!--      </div>-->
<!--    </div>-->
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--color-surface);
  padding-top: 48px;
  margin-top: auto;
}

.footer-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 40px;
  padding-bottom: 40px;
}

.footer-section {
  flex: 1;
  min-width: 200px;
}

.footer-title {
  color: var(--color-primary);
  font-size: 1.5rem;
  margin-bottom: 16px;
}

.footer-description {
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: 24px;
}

.footer-subtitle {
  color: var(--color-text-primary);
  font-size: 1.1rem;
  margin-bottom: 16px;
}

.footer-links {
  list-style: none;
}

.footer-links li {
  margin-bottom: 12px;
}

.footer-links a {
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: var(--color-primary);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px 0;
}

.copyright {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  text-align: center;
}

@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
    gap: 32px;
  }
  
  .footer-section {
    min-width: 100%;
  }
}
</style>