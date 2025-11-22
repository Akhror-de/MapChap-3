<template>
  <div class="side-panel modern-panel article-panel" v-if="article">
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
        <!-- Шапка статьи -->
        <header class="article-header">
          <div class="article-meta">
            <div class="article-author">
              <div class="author-avatar large">{{ article.author.avatar }}</div>
              <div class="author-info">
                <div class="author-main">
                  <strong class="author-name">{{ article.author.name }}</strong>
                  <span class="author-badge" :class="article.author.role">
                    {{ getRoleDisplayName(article.author.role) }}
                  </span>
                </div>
                <div class="article-dates">
                  <span class="publish-date">Опубликовано {{ formatDate(article.createdAt) }}</span>
                  <span v-if="showUpdatedDate" class="update-date">
                    • Обновлено {{ formatDate(article.updatedAt) }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="article-actions-header">
              <button class="action-btn" @click="toggleLike" :class="{ liked: article.isLiked }">
                <span class="action-icon">{{ article.isLiked ? '❤️' : '🤍' }}</span>
                <span class="action-count">{{ article.likes }}</span>
              </button>
              <button class="action-btn" @click="toggleBookmark" :class="{ bookmarked: isBookmarked }">
                <span class="action-icon">{{ isBookmarked ? '🔖' : '📑' }}</span>
              </button>
              <button class="action-btn" @click="shareArticle">
                <span class="action-icon">🔗</span>
              </button>
            </div>
          </div>

          <h1 class="article-title">{{ article.title }}</h1>
          
          <div class="article-excerpt" v-if="article.excerpt">
            {{ article.excerpt }}
          </div>

          <div class="article-stats-header">
            <div class="stat-item">
              <span class="stat-icon">👁️</span>
              <span class="stat-value">{{ formattedViews }}</span>
              <span class="stat-label">просмотров</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">❤️</span>
              <span class="stat-value">{{ article.likes }}</span>
              <span class="stat-label">лайков</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">💬</span>
              <span class="stat-value">{{ article.commentsCount }}</span>
              <span class="stat-label">комментариев</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">⏱️</span>
              <span class="stat-value">{{ article.readTime }}</span>
              <span class="stat-label">мин чтения</span>
            </div>
          </div>

          <div class="article-tags" v-if="article.tags && article.tags.length > 0">
            <span 
              v-for="tag in article.tags" 
              :key="tag"
              class="tag"
            >
              #{{ tag }}
            </span>
          </div>

          <div class="article-image" v-if="article.image">
            <img :src="article.image" :alt="article.title" />
            <div class="image-caption" v-if="article.imageCaption">
              {{ article.imageCaption }}
            </div>
          </div>
        </header>

        <!-- Содержание статьи -->
        <div class="article-content">
          <div v-html="formatContent(article.content)"></div>
        </div>

        <!-- Действия под статьей -->
        <footer class="article-actions-footer">
          <div class="actions-main">
            <button class="btn like-btn" @click="toggleLike" :class="{ liked: article.isLiked }">
              <span class="btn-icon">{{ article.isLiked ? '❤️' : '🤍' }}</span>
              <span class="btn-text">Нравится</span>
              <span class="btn-count">{{ article.likes }}</span>
            </button>
            
            <button class="btn comment-btn" @click="scrollToComments">
              <span class="btn-icon">💬</span>
              <span class="btn-text">Комментировать</span>
              <span class="btn-count">{{ article.commentsCount }}</span>
            </button>
            
            <button class="btn share-btn" @click="shareArticle">
              <span class="btn-icon">🔗</span>
              <span class="btn-text">Поделиться</span>
            </button>
            
            <button class="btn bookmark-btn" @click="toggleBookmark" :class="{ bookmarked: isBookmarked }">
              <span class="btn-icon">{{ isBookmarked ? '🔖' : '📑' }}</span>
              <span class="btn-text">{{ isBookmarked ? 'В закладках' : 'В закладки' }}</span>
            </button>
          </div>
        </footer>

        <!-- Информация об авторе -->
        <div class="author-card">
          <div class="author-avatar large">{{ article.author.avatar }}</div>
          <div class="author-details">
            <h3 class="author-name">{{ article.author.name }}</h3>
            <p class="author-role">{{ getRoleDescription(article.author.role) }}</p>
            <p class="author-bio" v-if="article.author.bio">
              {{ article.author.bio }}
            </p>
            <div class="author-stats">
              <span class="author-stat">
                <strong>{{ authorStats.articles }}</strong> статей
              </span>
              <span class="author-stat">
                <strong>{{ authorStats.followers }}</strong> подписчиков
              </span>
              <span class="author-stat">
                <strong>{{ authorStats.rating }}</strong> рейтинг
              </span>
            </div>
            <button class="btn btn-outline follow-btn" @click="toggleFollow">
              <span class="btn-icon">{{ isFollowing ? '✓' : '➕' }}</span>
              <span class="btn-text">{{ isFollowing ? 'Вы подписаны' : 'Подписаться' }}</span>
            </button>
          </div>
        </div>

        <!-- Рекомендации -->
        <div class="recommendations-section" v-if="relatedArticles.length > 0">
          <h3>📚 Вам может понравиться</h3>
          <div class="recommendations-grid">
            <div 
              v-for="related in relatedArticles" 
              :key="related.id"
              class="recommendation-card"
              @click="readArticle(related)"
            >
              <div class="rec-category">{{ getCategoryName(related.category) }}</div>
              <h4 class="rec-title">{{ related.title }}</h4>
              <p class="rec-excerpt">{{ related.excerpt }}</p>
              <div class="rec-meta">
                <span class="rec-author">{{ related.author.name }}</span>
                <span class="rec-date">{{ formatDate(related.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Комментарии -->
        <div class="comments-section">
          <div class="comments-header">
            <h3>💬 Комментарии ({{ article.commentsCount }})</h3>
            <button class="btn btn-primary" @click="focusCommentInput" v-if="authStore.isAuthenticated">
              Написать комментарий
            </button>
            <button class="btn btn-outline" @click="initAuth" v-else>
              Войти, чтобы комментировать
            </button>
          </div>

          <!-- Форма комментария -->
          <div class="comment-form" v-if="authStore.isAuthenticated">
            <div class="comment-author">
              <div class="author-avatar small">{{ authStore.user.avatar }}</div>
              <div class="author-name">{{ authStore.user.name }}</div>
            </div>
            <div class="comment-input-container">
              <textarea 
                v-model="newComment"
                placeholder="Напишите ваш комментарий..."
                rows="3"
                maxlength="1000"
                ref="commentInput"
                class="comment-input"
              ></textarea>
              <div class="comment-actions">
                <div class="char-counter">{{ newComment.length }}/1000</div>
                <button 
                  class="btn btn-primary" 
                  @click="addComment"
                  :disabled="!canAddComment"
                >
                  Отправить
                </button>
              </div>
            </div>
          </div>

          <!-- Список комментариев -->
          <div class="comments-list" v-if="comments.length > 0">
            <div 
              v-for="comment in comments" 
              :key="comment.id"
              class="comment-item"
            >
              <div class="comment-header">
                <div class="comment-author">
                  <div class="author-avatar small">{{ comment.author.avatar }}</div>
                  <div class="author-info">
                    <strong class="author-name">{{ comment.author.name }}</strong>
                    <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
                  </div>
                </div>
                <div class="comment-actions">
                  <button 
                    class="action-btn like-btn" 
                    @click="toggleCommentLike(comment.id)"
                    :class="{ liked: comment.isLiked }"
                  >
                    <span class="action-icon">{{ comment.isLiked ? '❤️' : '🤍' }}</span>
                    <span class="action-count">{{ comment.likes }}</span>
                  </button>
                </div>
              </div>
              
              <div class="comment-content">
                {{ comment.content }}
              </div>
              
              <div class="comment-footer">
                <button class="reply-btn" @click="replyToComment(comment)">
                  Ответить
                </button>
              </div>
            </div>
          </div>

          <div v-else class="empty-comments">
            <div class="empty-icon">💬</div>
            <h4>Пока нет комментариев</h4>
            <p>Будьте первым, кто оставит комментарий!</p>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
import { useUIStore } from '../stores/uiStore'
import { useAuthStore } from '../stores/authStore'
import { useBlogStore } from '../stores/blogStore'
import { storeToRefs } from 'pinia'
import { ref, computed, onMounted, nextTick } from 'vue'

export default {
  name: 'ArticlePanel',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const uiStore = useUIStore()
    const authStore = useAuthStore()
    const blogStore = useBlogStore()
    
    const { isAuthenticated } = storeToRefs(authStore)
    const { getCommentsByArticleId } = storeToRefs(blogStore)
    
    const { closePanel, showNotification, openArticle } = uiStore
    const { initTelegramAuth } = authStore
    const { 
      incrementArticleViews, 
      toggleArticleLike, 
      addComment: addCommentToStore,
      toggleCommentLike 
    } = blogStore

    // State
    const newComment = ref('')
    const isBookmarked = ref(false)
    const isFollowing = ref(false)
    const commentInput = ref(null)

    // Computed
    const comments = computed(() => getCommentsByArticleId.value(props.article.id))
    
    const showUpdatedDate = computed(() => {
      return props.article.updatedAt && 
             props.article.updatedAt !== props.article.createdAt &&
             new Date(props.article.updatedAt) > new Date(props.article.createdAt)
    })

    const formattedViews = computed(() => {
      const views = props.article.views
      if (views >= 1000) {
        return (views / 1000).toFixed(1) + 'k'
      }
      return views.toString()
    })

    const canAddComment = computed(() => {
      return newComment.value.trim().length > 0 && 
             newComment.value.length <= 1000
    })

    const authorStats = computed(() => {
      return {
        articles: 12,
        followers: 456,
        rating: 4.8
      }
    })

    const relatedArticles = computed(() => {
      // В реальном приложении здесь была бы логика получения связанных статей
      const allArticles = [...blogStore.getDeveloperArticles, ...blogStore.getUserArticles]
      return allArticles
        .filter(article => article.id !== props.article.id)
        .slice(0, 3)
    })

    // Methods
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const formatContent = (content) => {
      // Простое форматирование текста в HTML
      return content
        .replace(/\n/g, '<br>')
        .replace(/^# (.*$)/gim, '<h2>$1</h2>')
        .replace(/^## (.*$)/gim, '<h3>$1</h3>')
        .replace(/^### (.*$)/gim, '<h4>$1</h4>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^- (.*$)/gim, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    }

    const getRoleDisplayName = (role) => {
      const roles = {
        founder: '👑 Основатель',
        finance_director: '💰 Финансовый директор',
        developer: '👨‍💻 Разработчик',
        user: '👥 Пользователь'
      }
      return roles[role] || '👤 Автор'
    }

    const getRoleDescription = (role) => {
      const descriptions = {
        founder: 'Основатель платформы MapChap',
        finance_director: 'Финансовый директор MapChap',
        developer: 'Разработчик платформы',
        user: 'Активный участник сообщества'
      }
      return descriptions[role] || 'Автор сообщества'
    }

    const getCategoryName = (categoryId) => {
      const category = blogStore.categories.find(cat => cat.id === categoryId)
      return category ? category.name : 'Другое'
    }

    const toggleLike = () => {
      if (!isAuthenticated.value) {
        showNotification('Войдите в аккаунт, чтобы ставить лайки', 'info')
        return
      }
      toggleArticleLike(props.article.id)
    }

    const toggleBookmark = () => {
      if (!isAuthenticated.value) {
        showNotification('Войдите в аккаунт, чтобы добавлять в закладки', 'info')
        return
      }
      isBookmarked.value = !isBookmarked.value
      showNotification(
        isBookmarked.value ? 'Статья добавлена в закладки' : 'Статья удалена из закладок',
        'success'
      )
    }

    const toggleFollow = () => {
      if (!isAuthenticated.value) {
        showNotification('Войдите в аккаунт, чтобы подписываться на авторов', 'info')
        return
      }
      isFollowing.value = !isFollowing.value
      showNotification(
        isFollowing.value ? 'Вы подписались на автора' : 'Вы отписались от автора',
        'success'
      )
    }

    const shareArticle = () => {
      if (navigator.share) {
        navigator.share({
          title: props.article.title,
          text: props.article.excerpt,
          url: window.location.href
        }).catch(() => {
          copyToClipboard()
        })
      } else {
        copyToClipboard()
      }
    }

    const copyToClipboard = () => {
      navigator.clipboard.writeText(window.location.href)
      showNotification('Ссылка скопирована в буфер обмена', 'success')
    }

    const scrollToComments = () => {
      const commentsSection = document.querySelector('.comments-section')
      if (commentsSection) {
        commentsSection.scrollIntoView({ behavior: 'smooth' })
      }
    }

    const focusCommentInput = () => {
      if (commentInput.value) {
        commentInput.value.focus()
      }
    }

    const addComment = async () => {
      if (!canAddComment.value) return

      try {
        await addCommentToStore(props.article.id, newComment.value)
        newComment.value = ''
        showNotification('Комментарий добавлен', 'success')
      } catch (error) {
        showNotification('Ошибка при добавлении комментария', 'error')
      }
    }

    const toggleCommentLike = (commentId) => {
      if (!isAuthenticated.value) {
        showNotification('Войдите в аккаунт, чтобы ставить лайки', 'info')
        return
      }
      toggleCommentLike(commentId)
    }

    const replyToComment = (comment) => {
      newComment.value = `@${comment.author.name}, `
      focusCommentInput()
    }

    const readArticle = (article) => {
      openArticle(article)
    }

    const initAuth = () => {
      initTelegramAuth()
    }

    // Увеличиваем счетчик просмотров при открытии
    onMounted(() => {
      incrementArticleViews(props.article.id)
    })

    return {
      // Stores
      authStore,
      
      // State
      newComment,
      isBookmarked,
      isFollowing,
      commentInput,
      
      // Computed
      isAuthenticated,
      comments,
      showUpdatedDate,
      formattedViews,
      canAddComment,
      authorStats,
      relatedArticles,
      
      // Methods
      closePanel,
      formatDate,
      formatContent,
      getRoleDisplayName,
      getRoleDescription,
      getCategoryName,
      toggleLike,
      toggleBookmark,
      toggleFollow,
      shareArticle,
      scrollToComments,
      focusCommentInput,
      addComment,
      toggleCommentLike,
      replyToComment,
      readArticle,
      initAuth
    }
  }
}
</script>

<style scoped>
.article-panel {
  max-width: 800px;
}

.article-full {
  padding: 0;
}

/* Шапка статьи */
.article-header {
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 2rem;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.article-author {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  flex: 1;
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
  flex-shrink: 0;
}

.author-avatar.small {
  width: 32px;
  height: 32px;
  background: var(--primary-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.author-info {
  flex: 1;
}

.author-main {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.author-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.author-badge {
  padding: 0.3rem 0.75rem;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 600;
}

.author-badge.founder {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #000;
}

.author-badge.finance_director {
  background: linear-gradient(135deg, #10b981, #34d399);
  color: white;
}

.author-badge.developer {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  color: white;
}

.author-badge.user {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.article-dates {
  display: flex;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
  flex-wrap: wrap;
}

.article-actions-header {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.action-btn:hover {
  background: var(--bg-secondary);
  transform: translateY(-1px);
}

.action-btn.liked {
  background: #fecaca;
  color: #dc2626;
  border-color: #fecaca;
}

.action-btn.bookmarked {
  background: #fef3c7;
  color: #d97706;
  border-color: #fef3c7;
}

.action-icon {
  font-size: 1rem;
}

.action-count {
  font-weight: 600;
}

.article-title {
  font-size: 2rem;
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  line-height: 1.2;
  font-weight: 700;
}

.article-excerpt {
  font-size: 1.1rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-style: italic;
}

.article-stats-header {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.stat-item {
  text-align: center;
}

.stat-icon {
  font-size: 1.25rem;
  display: block;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--primary);
  display: block;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tag {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.tag:hover {
  background: var(--primary);
  color: white;
  transform: translateY(-1px);
}

.article-image {
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.article-image img {
  width: 100%;
  height: auto;
  display: block;
}

.image-caption {
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-style: italic;
  margin-top: 0.5rem;
  padding: 0 1rem;
}

/* Содержание статьи */
.article-content {
  padding: 2rem 0;
  line-height: 1.8;
  color: var(--text-primary);
  font-size: 1.1rem;
}

.article-content :deep(h2) {
  font-size: 1.8rem;
  margin: 2.5rem 0 1.5rem 0;
  color: var(--text-primary);
  font-weight: 700;
  line-height: 1.3;
}

.article-content :deep(h3) {
  font-size: 1.5rem;
  margin: 2rem 0 1rem 0;
  color: var(--text-primary);
  font-weight: 600;
  line-height: 1.4;
}

.article-content :deep(h4) {
  font-size: 1.25rem;
  margin: 1.5rem 0 0.75rem 0;
  color: var(--text-primary);
  font-weight: 600;
}

.article-content :deep(strong) {
  font-weight: 700;
  color: var(--text-primary);
}

.article-content :deep(em) {
  font-style: italic;
}

.article-content :deep(ul) {
  margin: 1rem 0;
  padding-left: 2rem;
}

.article-content :deep(li) {
  margin-bottom: 0.5rem;
  position: relative;
}

.article-content :deep(li::before) {
  content: '•';
  color: var(--primary);
  font-weight: bold;
  position: absolute;
  left: -1rem;
}

.article-content :deep(br) {
  content: '';
  display: block;
  margin-bottom: 0.75rem;
}

/* Действия под статьей */
.article-actions-footer {
  padding: 2rem 0;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  margin: 2rem 0;
}

.actions-main {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 1rem;
  justify-content: center;
  text-decoration: none;
}

.like-btn {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.like-btn:hover {
  background: var(--bg-secondary);
  transform: translateY(-2px);
}

.like-btn.liked {
  background: #fecaca;
  color: #dc2626;
  border-color: #fecaca;
}

.comment-btn, .share-btn, .bookmark-btn {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.comment-btn:hover, .share-btn:hover, .bookmark-btn:hover {
  background: var(--bg-secondary);
  transform: translateY(-2px);
}

.bookmark-btn.bookmarked {
  background: #fef3c7;
  color: #d97706;
  border-color: #fef3c7;
}

.btn-icon {
  font-size: 1.25rem;
}

.btn-text {
  flex: 1;
  text-align: center;
}

.btn-count {
  background: rgba(255, 255, 255, 0.3);
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 700;
}

/* Информация об авторе */
.author-card {
  display: flex;
  gap: 1.5rem;
  padding: 2rem;
  background: var(--bg-secondary);
  border-radius: 20px;
  border: 1px solid var(--border-color);
  margin: 2rem 0;
}

.author-details {
  flex: 1;
}

.author-details .author-name {
  font-size: 1.3rem;
  margin: 0 0 0.5rem 0;
}

.author-role {
  color: var(--primary);
  font-weight: 600;
  margin: 0 0 1rem 0;
  font-size: 1rem;
}

.author-bio {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.author-stats {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.author-stat {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.author-stat strong {
  color: var(--text-primary);
  font-size: 1.1rem;
}

.follow-btn {
  align-self: flex-start;
}

/* Рекомендации */
.recommendations-section {
  margin: 3rem 0;
}

.recommendations-section h3 {
  font-size: 1.5rem;
  margin: 0 0 1.5rem 0;
  color: var(--text-primary);
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.recommendation-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.recommendation-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.rec-category {
  background: var(--primary);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 1rem;
}

.rec-title {
  font-size: 1.1rem;
  margin: 0 0 0.75rem 0;
  color: var(--text-primary);
  line-height: 1.3;
}

.rec-excerpt {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.rec-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* Комментарии */
.comments-section {
  margin: 3rem 0;
}

.comments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.comments-header h3 {
  font-size: 1.5rem;
  margin: 0;
  color: var(--text-primary);
}

.comment-form {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.comment-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.comment-author .author-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
}

.comment-input-container {
  position: relative;
}

.comment-input {
  width: 100%;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.9rem;
  resize: vertical;
  min-height: 80px;
  transition: all 0.3s ease;
}

.comment-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.comment-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.75rem;
}

.char-counter {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.comment-item {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.comment-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
}

.comment-author .author-info {
  display: flex;
  flex-direction: column;
}

.comment-author .author-name {
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.comment-date {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.comment-actions .action-btn {
  padding: 0.4rem 0.75rem;
  font-size: 0.8rem;
}

.comment-content {
  color: var(--text-primary);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.comment-footer {
  display: flex;
  justify-content: flex-end;
}

.reply-btn {
  background: none;
  border: none;
  color: var(--primary);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.reply-btn:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

.empty-comments {
  text-align: center;
  padding: 3rem 2rem;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-comments h4 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

/* Кнопки */
.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-outline {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-outline:hover {
  background: var(--bg-tertiary);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

/* Responsive */
@media (max-width: 768px) {
  .article-panel {
    max-width: 100%;
  }
  
  .article-meta {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .article-actions-header {
    width: 100%;
    justify-content: flex-end;
  }
  
  .article-title {
    font-size: 1.6rem;
  }
  
  .article-stats-header {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .actions-main {
    grid-template-columns: 1fr;
  }
  
  .author-card {
    flex-direction: column;
    text-align: center;
  }
  
  .author-stats {
    justify-content: center;
  }
  
  .recommendations-grid {
    grid-template-columns: 1fr;
  }
  
  .comments-header {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .article-title {
    font-size: 1.4rem;
  }
  
  .article-stats-header {
    grid-template-columns: 1fr;
  }
  
  .author-stats {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .comment-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .comment-actions {
    align-self: flex-end;
  }
}
</style>
