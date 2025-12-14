<template>
  <div class="side-panel modern-panel">
    <div class="panel-header">
      <div class="header-content">
        <button class="back-button" @click="goBack">
          <span class="back-icon">←</span>
          <span class="back-text">{{ t('back') }}</span>
        </button>
        <h2 class="panel-title">
          <span class="title-icon">📝</span>
          {{ t('article_title') }}
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
            <span class="article-read-time">🕑 {{ article.read_time || 3 }} {{ t('article_min') }}</span>
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
              {{ t('article_like') }}
            </button>
            <button class="action-btn" @click="shareArticle">
              <span>🔗</span>
              {{ t('article_share') }}
            </button>
          </div>
        </div>
      </div>

      <div v-else class="no-article">
        <p>{{ t('article_not_found') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useUIStore } from '../stores/uiStore'
import { useLocale } from '../composables/useLocale'

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
    const { t } = useLocale()
    const isLiked = ref(false)

    const goBack = () => {
      openPanel('blog')
    }

    const formattedContent = computed(() => {
      if (!props.article?.content) return ''
      return props.article.content
        .split('\n\n')
        .map(p => `<p>${p}</p>`)
        .join('')
    })

    const getArticleTypeName = (type) => {
      const names = { 
        developer: t('article_from_developers'), 
        business: t('article_from_business'), 
        user: t('article_from_user') 
      }
      return names[type] || t('blog_article')
    }

    const getRoleName = (role) => {
      const roles = {
        business_owner: t('profile_business'),
        user: t('nav_profile'),
        admin: 'Admin'
      }
      return roles[role] || t('article_author')
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
      showNotification(isLiked.value ? t('article_added_likes') : t('article_removed_likes'), 'success')
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
        showNotification(t('article_link_copied'), 'success')
      }
    }

    return {
      t,
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
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
}

.article-type.business {
  background: rgba(255, 107, 0, 0.15);
  color: #ff6b00;
}

.article-type.user {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
}

.article-date,
.article-read-time {
  font-size: 13px;
  color: #888;
}

.article-title {
  margin: 0 0 12px 0;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.3;
  color: #fff;
}

.article-excerpt {
  margin: 0 0 20px 0;
  font-size: 16px;
  color: #888;
  line-height: 1.5;
}

.article-author {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #141414;
  border-radius: 12px;
}

.author-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #ff6b00;
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
  color: #fff;
}

.author-role {
  font-size: 13px;
  color: #888;
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
  color: #ccc;
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
  background: #141414;
  border-radius: 16px;
  font-size: 13px;
  color: #ff6b00;
  font-weight: 500;
}

.article-actions {
  padding: 20px;
  border-top: 1px solid #2a2a2a;
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
  color: #888;
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
  border: 1px solid #2a2a2a;
  background: #141414;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #888;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #1a1a1a;
  border-color: #ff6b00;
  color: #fff;
}

.action-btn.liked {
  background: rgba(255, 68, 68, 0.1);
  border-color: rgba(255, 68, 68, 0.3);
  color: #ff4444;
}

.no-article {
  text-align: center;
  padding: 40px 20px;
  color: #888;
}
</style>
