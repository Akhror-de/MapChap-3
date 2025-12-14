<template>
  <div class="side-panel modern-panel">
    <div class="panel-header">
      <div class="header-content">
        <button class="back-button" @click="closePanel">
          <span class="back-icon">←</span>
          <span class="back-text">{{ t('back') }}</span>
        </button>
        <h2 class="panel-title">
          <span class="title-icon">📝</span>
          {{ t('blog_title') }}
        </h2>
      </div>
    </div>

    <div class="panel-content">
      <!-- Фильтры блога -->
      <div class="blog-filters">
        <button 
          v-for="filter in blogFilters" 
          :key="filter.id"
          class="filter-btn"
          :class="{ active: activeFilter === filter.id }"
          @click="activeFilter = filter.id"
        >
          <span class="filter-icon">{{ filter.icon }}</span>
          <span class="filter-label">{{ filter.label }}</span>
        </button>
      </div>

      <!-- Загрузка -->
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>{{ t('blog_loading') }}</p>
      </div>

      <!-- Статьи -->
      <div v-else class="articles-container">
        <!-- Пустой стейт -->
        <div v-if="filteredArticles.length === 0" class="empty-state">
          <div class="empty-icon">📝</div>
          <h3>{{ t('blog_no_articles') }}</h3>
          <p>{{ t('blog_be_first') }}</p>
          <button v-if="isAuthenticated" class="btn btn-primary" @click="showCreateForm = true">
            {{ t('blog_write') }}
          </button>
        </div>

        <!-- Список статей -->
        <div v-else class="articles-list">
          <div 
            v-for="article in filteredArticles" 
            :key="article.id"
            class="article-card"
          >
            <div class="article-image" v-if="article.image" @click="openArticle(article)">
              <img :src="article.image" :alt="article.title" />
            </div>
            <div class="article-placeholder" v-else @click="openArticle(article)">
              <span>{{ getArticleTypeIcon(article.author_type) }}</span>
            </div>
            
            <div class="article-content">
              <div class="article-meta">
                <span class="article-type" :class="article.author_type">
                  {{ getArticleTypeName(article.author_type) }}
                </span>
                <span class="article-date">{{ formatDate(article.created_at || article.createdAt) }}</span>
              </div>
              
              <h3 class="article-title" @click="openArticle(article)">{{ article.title }}</h3>
              <p class="article-excerpt">{{ article.excerpt }}</p>
              
              <div class="article-footer">
                <div class="article-author" v-if="article.author">
                  <div class="author-avatar">
                    <img v-if="article.author.avatar && !article.author.avatar.startsWith('�')" :src="article.author.avatar" alt="" />
                    <span v-else>{{ article.author.avatar || article.author.name?.[0] || 'А' }}</span>
                  </div>
                  <span class="author-name">{{ article.author.name }}</span>
                </div>
                <div class="article-stats">
                  <span>👁️ {{ article.views || 0 }}</span>
                  <button class="like-btn" :class="{ liked: article.isLiked }" @click.stop="toggleLike(article)">
                    {{ article.isLiked ? '❤️' : '🤍' }} {{ article.likes || 0 }}
                  </button>
                  <span>💬 {{ article.comments_count || article.commentsCount || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Кнопка создания -->
        <button 
          v-if="isAuthenticated && !showCreateForm && filteredArticles.length > 0" 
          class="fab-btn"
          @click="showCreateForm = true"
        >
          <span>➕</span>
        </button>
      </div>

      <!-- Форма создания статьи -->
      <div v-if="showCreateForm" class="create-form-overlay">
        <div class="create-form">
          <div class="form-header">
            <h3>{{ t('blog_new_article') }}</h3>
            <button class="close-btn" @click="showCreateForm = false">×</button>
          </div>

          <form @submit.prevent="submitArticle">
            <div class="form-group">
              <label>{{ t('blog_article_title') }} *</label>
              <input 
                v-model="articleForm.title"
                type="text" 
                :placeholder="t('blog_article_title_placeholder')"
                required
              >
            </div>

            <div class="form-group">
              <label>{{ t('blog_article_excerpt') }} *</label>
              <input 
                v-model="articleForm.excerpt"
                type="text" 
                :placeholder="t('blog_article_excerpt_placeholder')"
                required
              >
            </div>

            <div class="form-group">
              <label>{{ t('blog_article_category') }}</label>
              <select v-model="articleForm.category">
                <option value="news">📢 {{ t('blog_cat_news') }}</option>
                <option value="tips">💡 {{ t('blog_cat_tips') }}</option>
                <option value="guide">📖 {{ t('blog_cat_guide') }}</option>
                <option value="review">⭐ {{ t('blog_cat_review') }}</option>
                <option value="success">🚀 {{ t('blog_cat_success') }}</option>
                <option value="other">🔮 {{ t('blog_cat_other') }}</option>
              </select>
            </div>

            <div class="form-group">
              <label>{{ t('blog_article_content') }} *</label>
              <textarea 
                v-model="articleForm.content"
                rows="8"
                :placeholder="t('blog_article_content_placeholder')"
                required
              ></textarea>
            </div>

            <div class="form-group">
              <label>{{ t('blog_article_tags') }}</label>
              <input 
                v-model="articleForm.tagsInput"
                type="text" 
                :placeholder="t('blog_article_tags_placeholder')"
              >
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="showCreateForm = false">
                {{ t('cancel') }}
              </button>
              <button type="submit" class="btn btn-primary" :disabled="!canSubmit || isSubmitting">
                {{ isSubmitting ? t('loading') : t('blog_publish') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive, onMounted } from 'vue'
import { useUIStore } from '../stores/uiStore'
import { useAuthStore } from '../stores/authStore'
import { useBlogStore } from '../stores/blogStore'
import { storeToRefs } from 'pinia'
import { apiService } from '../services/api'
import { useLocale } from '../composables/useLocale'

export default {
  name: 'BlogPanel',
  setup() {
    const uiStore = useUIStore()
    const authStore = useAuthStore()
    const blogStore = useBlogStore()
    const { closePanel, openPanel, showNotification } = uiStore
    const { user, isAuthenticated, isBusinessOwner } = storeToRefs(authStore)
    const { t } = useLocale()

    // State
    const isLoading = ref(false)
    const isSubmitting = ref(false)
    const activeFilter = ref('all')
    const articles = ref([])
    const showCreateForm = ref(false)
    const articleForm = reactive({
      title: '',
      excerpt: '',
      content: '',
      category: 'news',
      tagsInput: ''
    })

    // Filters
    const blogFilters = computed(() => [
      { id: 'all', label: t('blog_all'), icon: '📚' },
      { id: 'developer', label: t('blog_developers'), icon: '👨‍💻' },
      { id: 'business', label: t('blog_business'), icon: '💼' },
      { id: 'user', label: t('blog_users'), icon: '👤' }
    ])

    // Computed
    const filteredArticles = computed(() => {
      if (activeFilter.value === 'all') return articles.value
      return articles.value.filter(a => a.author_type === activeFilter.value)
    })

    const canSubmit = computed(() => {
      return articleForm.title.length > 0 &&
             articleForm.excerpt.length > 0 &&
             articleForm.content.length > 0
    })

    // Methods
    const loadArticles = async () => {
      isLoading.value = true
      try {
        const result = await apiService.getArticles({ limit: 50 })
        articles.value = result.articles || []
        
        // Если нет статей с сервера, используем демо
        if (articles.value.length === 0) {
          articles.value = blogStore.getArticles
        }
      } catch (error) {
        console.log('Articles load error:', error)
        // Используем данные из store
        articles.value = blogStore.getArticles
      } finally {
        isLoading.value = false
      }
    }

    const openArticle = (article) => {
      // Увеличиваем просмотры
      if (article.id) {
        blogStore.incrementArticleViews(article.id)
        const idx = articles.value.findIndex(a => a.id === article.id)
        if (idx !== -1) {
          articles.value[idx].views = (articles.value[idx].views || 0) + 1
        }
      }
      
      uiStore.setCurrentArticle(article)
      openPanel('article')
    }

    const toggleLike = (article) => {
      if (!isAuthenticated.value) {
        showNotification(t('profile_login_required'), 'error')
        return
      }
      
      // Обновляем локально
      article.isLiked = !article.isLiked
      article.likes = (article.likes || 0) + (article.isLiked ? 1 : -1)
      
      // Обновляем в store
      if (article.id) {
        blogStore.toggleArticleLike(article.id)
      }
      
      showNotification(article.isLiked ? t('blog_added_likes') : t('blog_removed_likes'), 'success')
    }

    const submitArticle = async () => {
      if (!canSubmit.value || isSubmitting.value) return
      
      isSubmitting.value = true
      
      try {
        const articleData = {
          title: articleForm.title,
          excerpt: articleForm.excerpt,
          content: articleForm.content,
          category: articleForm.category,
          tags: articleForm.tagsInput.split(',').map(t => t.trim()).filter(t => t),
          author_type: isBusinessOwner.value ? 'business' : 'user'
        }

        // Пробуем отправить на сервер
        try {
          await apiService.createArticle(user.value.telegram_id, articleData)
        } catch {
          // Если сервер недоступен, сохраняем локально
          await blogStore.createArticle({
            ...articleData,
            image: ''
          })
        }
        
        showNotification(t('blog_article_published'), 'success')
        showCreateForm.value = false
        resetForm()
        loadArticles()
      } catch (error) {
        showNotification(t('error'), 'error')
      } finally {
        isSubmitting.value = false
      }
    }

    const resetForm = () => {
      Object.assign(articleForm, {
        title: '',
        excerpt: '',
        content: '',
        category: 'news',
        tagsInput: ''
      })
    }

    const getArticleTypeIcon = (type) => {
      const icons = { developer: '👨‍💻', business: '💼', user: '👤' }
      return icons[type] || '📝'
    }

    const getArticleTypeName = (type) => {
      const names = { 
        developer: t('blog_developers'), 
        business: t('blog_business'), 
        user: t('blog_users') 
      }
      return names[type] || t('blog_article')
    }

    const formatDate = (dateString) => {
      if (!dateString) return ''
      return new Date(dateString).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short'
      })
    }

    onMounted(() => {
      loadArticles()
    })

    return {
      isLoading,
      isSubmitting,
      activeFilter,
      blogFilters,
      articles,
      filteredArticles,
      showCreateForm,
      articleForm,
      isAuthenticated,
      canSubmit,
      closePanel,
      openArticle,
      toggleLike,
      submitArticle,
      getArticleTypeIcon,
      getArticleTypeName,
      formatDate,
      t
    }
  }
}
</script>

<style scoped>
.blog-filters {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  margin-bottom: 20px;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border: 1px solid #2a2a2a;
  background: #141414;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  color: #888;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.filter-btn.active {
  background: #ff6b00;
  border-color: #ff6b00;
  color: #fff;
}

.filter-btn:hover:not(.active) {
  background: #1a1a1a;
  color: #fff;
}

.filter-icon {
  font-size: 14px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #2a2a2a;
  border-top-color: #ff6b00;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #fff;
}

.empty-state p {
  margin: 0 0 20px 0;
  color: #666;
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.article-card {
  background: #141414;
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.article-card:hover {
  border-color: #ff6b00;
}

.article-image {
  width: 100%;
  height: 160px;
  overflow: hidden;
  cursor: pointer;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-placeholder {
  width: 100%;
  height: 100px;
  background: linear-gradient(135deg, #ff6b00 0%, #ff8533 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  cursor: pointer;
}

.article-content {
  padding: 16px;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.article-type {
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 11px;
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

.article-date {
  font-size: 12px;
  color: #666;
}

.article-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.3;
  color: #fff;
  cursor: pointer;
}

.article-title:hover {
  color: #ff6b00;
}

.article-excerpt {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #888;
  line-height: 1.4;
}

.article-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.article-author {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #ff6b00;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-name {
  font-size: 13px;
  color: #888;
}

.article-stats {
  display: flex;
  gap: 10px;
  font-size: 12px;
  color: #666;
  align-items: center;
}

.like-btn {
  background: none;
  border: none;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: all 0.2s;
}

.like-btn:hover {
  background: rgba(255, 107, 0, 0.1);
  color: #ff6b00;
}

.like-btn.liked {
  color: #ff4444;
}

.fab-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border: none;
  background: linear-gradient(135deg, #ff6b00 0%, #ff8533 100%);
  border-radius: 50%;
  font-size: 24px;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(255, 107, 0, 0.4);
  transition: transform 0.2s;
  z-index: 100;
}

.fab-btn:hover {
  transform: scale(1.1);
}

/* Create form */
.create-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #0a0a0a;
  z-index: 1000;
  overflow-y: auto;
}

.create-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.form-header h3 {
  margin: 0;
  font-size: 20px;
  color: #fff;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  color: #666;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #888;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  background: #141414;
  color: #fff;
  font-size: 16px;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #ff6b00;
  box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 150px;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.btn {
  flex: 1;
  padding: 14px 20px;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #ff6b00 0%, #ff8533 100%);
  color: #fff;
}

.btn-secondary {
  background: #1a1a1a;
  color: #fff;
  border: 1px solid #2a2a2a;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
