<template>
  <div class="side-panel modern-panel">
    <div class="panel-header">
      <div class="header-content">
        <button class="back-button" @click="goBack">
          <span class="back-icon">←</span>
          <span class="back-text">Назад</span>
        </button>
        <h2 class="panel-title">
          <span class="title-icon">📝</span>
          Статья
        </h2>
      </div>
    </div>

    <div class="panel-content article-content">
      <div v-if="article">
        <!-- Шапка статьи -->
        <div class="article-header">
          <div class="article-meta">
            <span class="article-type" :class="article.author_type">
              {{ getArticleTypeName(article.author_type) }}
            </span>
            <span class="article-date">{{ formatDate(article.created_at) }}</span>
            <span class="article-read-time">🕑 {{ article.read_time || 3 }} мин</span>
          </div>
          
          <h1 class="article-title">{{ article.title }}</h1>
          <p class="article-excerpt">{{ article.excerpt }}</p>

          <div class="article-author" v-if="article.author">
            <div class="author-avatar">
              <img v-if="article.author.avatar" :src="article.author.avatar" alt="" />
              <span v-else>{{ article.author.name?.[0] || 'А' }}</span>
            </div>
            <div class="author-info">
              <span class="author-name">{{ article.author.name }}</span>
              <span class="author-role">{{ getRoleName(article.author.role) }}</span>
            </div>
          </div>
        </div>

        <!-- Изображение -->
        <div class="article-image" v-if="article.image">
          <img :src="article.image" :alt="article.title" />
        </div>

        <!-- Содержание -->
        <div class="article-body">
          <div v-html="formattedContent"></div>
        </div>

        <!-- Теги -->
        <div class="article-tags" v-if="article.tags && article.tags.length">
          <span v-for="tag in article.tags" :key="tag" class="tag">
            #{{ tag }}
          </span>
        </div>

        <!-- Статистика и действия -->
        <div class="article-actions">
          <div class="article-stats">
            <div class="stat">
              <span class="stat-icon">👁️</span>
              <span class="stat-value">{{ article.views || 0 }}</span>
            </div>
            <div class="stat">
              <span class="stat-icon">❤️</span>
              <span class="stat-value">{{ article.likes || 0 }}</span>
            </div>
            <div class="stat">
              <span class="stat-icon">💬</span>
              <span class="stat-value">{{ article.comments_count || 0 }}</span>
            </div>
          </div>

          <div class="action-buttons">
            <button class="action-btn" :class="{ liked: isLiked }" @click="toggleLike">
              <span>{{ isLiked ? '❤️' : '🤍' }}</span>
              {{ isLiked ? 'Нравится' : 'Нравится' }}
            </button>
            <button class="action-btn" @click="shareArticle">
              <span>🔗</span>
              Поделиться
            </button>
          </div>
        </div>
      </div>

      <div v-else class="no-article">
        <p>Статья не найдена</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useUIStore } from '../stores/uiStore'

export default {
  name: 'ArticlePanel',
  props: {
    article: {
      type: Object,
      default: null
    }
  },
  setup(props) {
    const uiStore = useUIStore()
    const { openPanel, showNotification } = uiStore
    const isLiked = ref(false)

    const goBack = () => {
      openPanel('blog')
    }

    const formattedContent = computed(() => {
      if (!props.article?.content) return ''
      // Простая разбивка на абзацы
      return props.article.content
        .split('\n\n')
        .map(p => `<p>${p}</p>`)
        .join('')
    })

    const getArticleTypeName = (type) => {
      const names = { 
        developer: 'От разработчиков', 
        business: 'От бизнеса', 
        user: 'От пользователя' 
      }
      return names[type] || 'Статья'
    }

    const getRoleName = (role) => {
      const roles = {
        business_owner: 'Бизнес',
        user: 'Пользователь',
        admin: 'Администратор'
      }
      return roles[role] || 'Автор'
    }

    const formatDate = (dateString) => {
      if (!dateString) return ''
      return new Date(dateString).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    }

    const toggleLike = () => {
      isLiked.value = !isLiked.value
      showNotification(isLiked.value ? 'Добавлено в понравившиеся' : 'Удалено из понравившихся', 'success')
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
        showNotification('Ссылка скопирована', 'success')
      }
    }

    return {
      isLiked,
      formattedContent,
      goBack,
      getArticleTypeName,
      getRoleName,
      formatDate,
      toggleLike,
      shareArticle
    }
  }
}
</script>

<style scoped>
.article-content {
  padding: 0;
}

.article-header {
  padding: 0 20px 20px;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.article-type {
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}

.article-type.developer {
  background: #dbeafe;
  color: #1d4ed8;
}

.article-type.business {
  background: #fef3c7;
  color: #b45309;
}

.article-type.user {
  background: #dcfce7;
  color: #166534;
}

.article-date,
.article-read-time {
  font-size: 13px;
  color: var(--tg-hint-color);
}

.article-title {
  margin: 0 0 12px 0;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.3;
}

.article-excerpt {
  margin: 0 0 20px 0;
  font-size: 16px;
  color: var(--tg-hint-color);
  line-height: 1.5;
}

.article-author {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--tg-secondary-bg-color);
  border-radius: 12px;
}

.author-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--tg-button-color);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-size: 18px;
  font-weight: 600;
  color: white;
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-size: 15px;
  font-weight: 600;
}

.author-role {
  font-size: 13px;
  color: var(--tg-hint-color);
}

.article-image {
  margin: 20px 0;
}

.article-image img {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 0;
}

.article-body {
  padding: 0 20px;
  font-size: 16px;
  line-height: 1.7;
}

.article-body :deep(p) {
  margin: 0 0 16px 0;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 20px;
}

.tag {
  padding: 6px 12px;
  background: var(--tg-secondary-bg-color);
  border-radius: 16px;
  font-size: 13px;
  color: var(--tg-button-color);
  font-weight: 500;
}

.article-actions {
  padding: 20px;
  border-top: 1px solid var(--tg-border-color);
  margin-top: 20px;
}

.article-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 6px;
}

.stat-icon {
  font-size: 18px;
}

.stat-value {
  font-size: 14px;
  color: var(--tg-hint-color);
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border: 1px solid var(--tg-border-color);
  background: var(--tg-bg-color);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: var(--tg-secondary-bg-color);
}

.action-btn.liked {
  background: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
}

.no-article {
  text-align: center;
  padding: 40px 20px;
  color: var(--tg-hint-color);
}
</style>
