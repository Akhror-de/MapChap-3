<template>
  <div class="side-panel modern-panel" v-if="article">
    <!-- Заголовок -->
    <div class="panel-header">
      <div class="header-content">
        <button class="back-button" @click="closePanel">
          <span class="back-icon">←</span>
          <span class="back-text">Назад</span>
        </button>
        <h2 class="panel-title">
          <span class="title-icon">📝</span>
          Статья
        </h2>
      </div>
    </div>

    <!-- Содержимое панели -->
    <div class="panel-content">
      <article class="article-full">
        <header class="article-full-header">
          <div class="article-meta">
            <div class="article-author">
              <div class="author-avatar large">{{ article.author.avatar }}</div>
              <div class="author-info">
                <strong>{{ article.author.name }}</strong>
                <span class="article-date">{{ formatDate(article.createdAt) }}</span>
                <span class="article-badge" :class="article.author.role">
                  {{ article.author.role === 'user' ? '👥 Пользователь' : '👨‍💻 Официально' }}
                </span>
              </div>
            </div>
          </div>

          <h1 class="article-full-title">{{ article.title }}</h1>
          
          <div class="article-full-meta">
            <div class="meta-item">
              <span class="meta-icon">👁️</span>
              <span class="meta-value">{{ article.views }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-icon">❤️</span>
              <span class="meta-value">{{ article.likes }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-icon">💬</span>
              <span class="meta-value">{{ article.commentsCount }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-icon">⏱️</span>
              <span class="meta-value">{{ article.readTime }} мин чтения</span>
            </div>
          </div>

          <div class="article-tags">
            <span 
              v-for="tag in article.tags" 
              :key="tag"
              class="tag"
            >
              #{{ tag }}
            </span>
          </div>
        </header>

        <div class="article-content">
          <div v-html="formatContent(article.content)"></div>
        </div>

        <footer class="article-actions">
          <button class="action-btn" @click="toggleLike" :class="{ liked: article.isLiked }">
            <span class="action-icon">{{ article.isLiked ? '❤️' : '🤍' }}</span>
            <span class="action-text">{{ article.likes }}</span>
          </button>
          <button class="action-btn" @click="toggleComments">
            <span class="action-icon">💬</span>
            <span class="action-text">{{ article.commentsCount }}</span>
          </button>
          <button class="action-btn" @click="shareArticle">
            <span class="action-icon">🔗</span>
            <span class="action-text">Поделиться</span>
          </button>
        </footer>
      </article>
    </div>
  </div>
</template>

<script>
import { useUIStore } from '../stores/uiStore'
import { useBlogStore } from '../stores/blogStore'
import { useAuthStore } from '../stores/authStore'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'

export default {
  name: 'ArticlePanel',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const blogStore = useBlogStore()
    const authStore = useAuthStore()
    const uiStore = useUIStore()
    
    const { isAuthenticated } = storeToRefs(authStore)
    
    const { closePanel, showNotification } = uiStore
    const { incrementArticleViews, toggleArticleLike } = blogStore

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const formatContent = (content) => {
      // Простое форматирование текста в HTML
      return content
        .replace(/\n/g, '<br>')
        .replace(/# (.*?)(?=\n|$)/g, '<h2>$1</h2>')
        .replace(/## (.*?)(?=\n|$)/g, '<h3>$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
    }

    const toggleLike = () => {
      if (!isAuthenticated.value) {
        showNotification('Войдите в аккаунт, чтобы ставить лайки', 'info')
        return
      }
      toggleArticleLike(props.article.id)
    }

    const toggleComments = () => {
      showNotification('Комментарии будут доступны в следующем обновлении', 'info')
    }

    const shareArticle = () => {
      if (navigator.share) {
        navigator.share({
          title: props.article.title,
          text: props.article.excerpt,
          url: window.location.href
        })
      } else {
        navigator.clipboard.writeText(window.location.href)
        showNotification('Ссылка скопирована в буфер обмена', 'success')
      }
    }

    // Увеличиваем счетчик просмотров при открытии
    onMounted(() => {
      incrementArticleViews(props.article.id)
    })

    return {
      isAuthenticated,
      closePanel,
      formatDate,
      formatContent,
      toggleLike,
      toggleComments,
      shareArticle
    }
  }
}
</script>

<style scoped>
.article-full {
  padding: 0;
}

.article-full-header {
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 1.5rem;
}

.article-meta {
  margin-bottom: 1.5rem;
}

.article-author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar.large {
  width: 60px;
  height: 60px;
  background: var(--primary-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.author-info strong {
  font-size: 1.1rem;
}

.article-date {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.article-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.article-badge.user {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.article-badge.founder, .article-badge.finance_director {
  background: var(--primary);
  color: white;
}

.article-full-title {
  font-size: 1.8rem;
  margin: 0 0 1.5rem 0;
  color: var(--text-primary);
  line-height: 1.3;
}

.article-full-meta {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.meta-icon {
  font-size: 1rem;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  border: 1px solid var(--border-color);
}

.article-content {
  padding: 1.5rem 0;
  line-height: 1.8;
  color: var(--text-primary);
}

.article-content :deep(h2) {
  font-size: 1.5rem;
  margin: 2rem 0 1rem 0;
  color: var(--text-primary);
}

.article-content :deep(h3) {
  font-size: 1.25rem;
  margin: 1.5rem 0 0.75rem 0;
  color: var(--text-primary);
}

.article-content :deep(strong) {
  font-weight: 600;
  color: var(--text-primary);
}

.article-content :deep(em) {
  font-style: italic;
}

.article-content :deep(br) {
  content: '';
  display: block;
  margin-bottom: 0.5rem;
}

.article-actions {
  display: flex;
  gap: 1rem;
  padding: 1.5rem 0;
  border-top: 1px solid var(--border-color);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-primary);
}

.action-btn:hover {
  background: var(--bg-secondary);
  transform: translateY(-1px);
}

.action-btn.liked {
  background: #ff6b6b;
  color: white;
  border-color: #ff6b6b;
}

/* Адаптивность */
@media (max-width: 768px) {
  .article-full-title {
    font-size: 1.5rem;
  }
  
  .article-full-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .article-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .article-full {
    padding: 0;
  }
  
  .article-author {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
}
</style>
