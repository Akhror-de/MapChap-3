<template>
  <div class="side-panel modern-panel">
    <div class="panel-header">
      <div class="header-content">
        <button class="back-button" @click="closePanel">
          <span class="back-icon">←</span>
          <span class="back-text">Назад</span>
        </button>
        <h2 class="panel-title">
          <span class="title-icon">📝</span>
          Блог
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
        <p>Загрузка статей...</p>
      </div>

      <!-- Статьи -->
      <div v-else class="articles-container">
        <!-- Пустой стейт -->
        <div v-if="filteredArticles.length === 0" class="empty-state">
          <div class="empty-icon">📝</div>
          <h3>Пока нет статей</h3>
          <p>{{ getEmptyMessage }}</p>
          <button v-if="canCreateArticle" class="btn btn-primary" @click="showCreateForm = true">
            Написать статью
          </button>
        </div>

        <!-- Список статей -->
        <div v-else class="articles-list">
          <div 
            v-for="article in filteredArticles" 
            :key="article.id"
            class="article-card"
            @click="openArticle(article)"
          >
            <div class="article-image" v-if="article.image">
              <img :src="article.image" :alt="article.title" />
            </div>
            <div class="article-placeholder" v-else>
              <span>{{ getArticleTypeIcon(article.author_type) }}</span>
            </div>
            
            <div class="article-content">
              <div class="article-meta">
                <span class="article-type" :class="article.author_type">
                  {{ getArticleTypeName(article.author_type) }}
                </span>
                <span class="article-date">{{ formatDate(article.created_at) }}</span>
              </div>
              
              <h3 class="article-title">{{ article.title }}</h3>
              <p class="article-excerpt">{{ article.excerpt }}</p>
              
              <div class="article-footer">
                <div class="article-author" v-if="article.author">
                  <div class="author-avatar">
                    <img v-if="article.author.avatar" :src="article.author.avatar" alt="" />
                    <span v-else>{{ article.author.name?.[0] || 'А' }}</span>
                  </div>
                  <span class="author-name">{{ article.author.name }}</span>
                </div>
                <div class="article-stats">
                  <span>👁️ {{ article.views || 0 }}</span>
                  <span>❤️ {{ article.likes || 0 }}</span>
                  <span>💬 {{ article.comments_count || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Кнопка создания -->
        <button 
          v-if="canCreateArticle && !showCreateForm && filteredArticles.length > 0" 
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
            <h3>Новая статья</h3>
            <button class="close-btn" @click="showCreateForm = false">×</button>
          </div>

          <form @submit.prevent="submitArticle">
            <div class="form-group">
              <label>Заголовок *</label>
              <input 
                v-model="articleForm.title"
                type="text" 
                placeholder="Введите заголовок"
                required
              >
            </div>

            <div class="form-group">
              <label>Краткое описание *</label>
              <input 
                v-model="articleForm.excerpt"
                type="text" 
                placeholder="Кратко о чем статья"
                required
              >
            </div>

            <div class="form-group">
              <label>Категория</label>
              <select v-model="articleForm.category">
                <option value="news">Новости</option>
                <option value="tips">Советы</option>
                <option value="guide">Гайды</option>
                <option value="review">Обзоры</option>
                <option value="other">Другое</option>
              </select>
            </div>

            <div class="form-group">
              <label>Содержание *</label>
              <textarea 
                v-model="articleForm.content"
                rows="6"
                placeholder="Напишите вашу статью..."
                required
              ></textarea>
            </div>

            <div class="form-group">
              <label>Теги (через запятую)</label>
              <input 
                v-model="articleForm.tagsInput"
                type="text" 
                placeholder="бизнес, советы, развитие"
              >
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="showCreateForm = false">
                Отмена
              </button>
              <button type="submit" class="btn btn-primary" :disabled="!canSubmit">
                Опубликовать
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
import { storeToRefs } from 'pinia'
import { apiService } from '../services/api'

export default {
  name: 'BlogPanel',
  setup() {
    const uiStore = useUIStore()
    const authStore = useAuthStore()
    const { closePanel, openPanel, showNotification } = uiStore
    const { user, isAuthenticated, isBusinessOwner } = storeToRefs(authStore)

    // State
    const isLoading = ref(false)
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
    const blogFilters = [
      { id: 'all', label: 'Все', icon: '📚' },
      { id: 'developer', label: 'От разработчиков', icon: '👨‍💻' },
      { id: 'business', label: 'От бизнеса', icon: '💼' },
      { id: 'user', label: 'От пользователей', icon: '👤' }
    ]

    // Computed
    const filteredArticles = computed(() => {
      if (activeFilter.value === 'all') return articles.value
      return articles.value.filter(a => a.author_type === activeFilter.value)
    })

    const canCreateArticle = computed(() => {
      return isAuthenticated.value
    })

    const canSubmit = computed(() => {
      return articleForm.title.length > 0 &&
             articleForm.excerpt.length > 0 &&
             articleForm.content.length > 0
    })

    const getEmptyMessage = computed(() => {
      const messages = {
        all: 'Будьте первым, кто напишет статью!',
        developer: 'Статей от разработчиков пока нет',
        business: 'Статей от бизнеса пока нет',
        user: 'Статей от пользователей пока нет'
      }
      return messages[activeFilter.value]
    })

    // Methods
    const loadArticles = async () => {
      isLoading.value = true
      try {
        const result = await apiService.getArticles({ limit: 50 })
        articles.value = result.articles || []
      } catch (error) {
        console.log('Articles load error:', error)
        // Заглушка для демо
        articles.value = [
          {
            id: '1',
            title: 'Добро пожаловать в MapChap!',
            excerpt: 'Наше приложение для поиска локального бизнеса',
            content: 'Полное содержание статьи...',
            author_type: 'developer',
            author: { name: 'Команда MapChap', avatar: '' },
            created_at: new Date().toISOString(),
            views: 256,
            likes: 45,
            comments_count: 12
          },
          {
            id: '2',
            title: 'Как привлечь клиентов через MapChap',
            excerpt: 'Советы по продвижению вашего бизнеса',
            content: 'Полное содержание статьи...',
            author_type: 'business',
            author: { name: 'Иван Петров', avatar: '' },
            created_at: new Date(Date.now() - 86400000).toISOString(),
            views: 128,
            likes: 23,
            comments_count: 5
          },
          {
            id: '3',
            title: 'Мой опыт использования приложения',
            excerpt: 'Делюсь впечатлениями от MapChap',
            content: 'Полное содержание статьи...',
            author_type: 'user',
            author: { name: 'Мария Сидорова', avatar: '' },
            created_at: new Date(Date.now() - 172800000).toISOString(),
            views: 64,
            likes: 18,
            comments_count: 3
          }
        ]
      } finally {
        isLoading.value = false
      }
    }

    const openArticle = (article) => {
      uiStore.setCurrentArticle(article)
      openPanel('article')
    }

    const submitArticle = async () => {
      try {
        const articleData = {
          title: articleForm.title,
          excerpt: articleForm.excerpt,
          content: articleForm.content,
          category: articleForm.category,
          tags: articleForm.tagsInput.split(',').map(t => t.trim()).filter(t => t),
          author_type: isBusinessOwner.value ? 'business' : 'user'
        }

        await apiService.createArticle(user.value.telegram_id, articleData)
        
        showNotification('Статья опубликована!', 'success')
        showCreateForm.value = false
        resetForm()
        loadArticles()
      } catch (error) {
        showNotification('Ошибка при публикации', 'error')
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
      const names = { developer: 'От разработчиков', business: 'От бизнеса', user: 'От пользователя' }
      return names[type] || 'Статья'
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
      activeFilter,
      blogFilters,
      articles,
      filteredArticles,
      showCreateForm,
      articleForm,
      canCreateArticle,
      canSubmit,
      getEmptyMessage,
      closePanel,
      openArticle,
      submitArticle,
      getArticleTypeIcon,
      getArticleTypeName,
      formatDate
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
  border: none;
  background: var(--tg-secondary-bg-color);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  color: var(--tg-text-color);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.filter-btn.active {
  background: var(--tg-button-color);
  color: white;
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
  border: 3px solid var(--tg-border-color);
  border-top-color: var(--tg-button-color);
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
}

.empty-state p {
  margin: 0 0 20px 0;
  color: var(--tg-hint-color);
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.article-card {
  background: var(--tg-secondary-bg-color);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.article-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--tg-shadow-2);
}

.article-image {
  width: 100%;
  height: 160px;
  overflow: hidden;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-placeholder {
  width: 100%;
  height: 100px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
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

.article-date {
  font-size: 12px;
  color: var(--tg-hint-color);
}

.article-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.3;
}

.article-excerpt {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: var(--tg-hint-color);
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
  background: var(--tg-button-color);
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
  color: var(--tg-hint-color);
}

.article-stats {
  display: flex;
  gap: 10px;
  font-size: 12px;
  color: var(--tg-hint-color);
}

.fab-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border: none;
  background: var(--tg-button-color);
  border-radius: 50%;
  font-size: 24px;
  color: white;
  cursor: pointer;
  box-shadow: var(--tg-shadow-3);
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
  background: var(--tg-bg-color);
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
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  color: var(--tg-hint-color);
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
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--tg-border-color);
  border-radius: 10px;
  background: var(--tg-secondary-bg-color);
  color: var(--tg-text-color);
  font-size: 16px;
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
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
  background: var(--tg-button-color);
  color: var(--tg-button-text-color);
}

.btn-secondary {
  background: var(--tg-secondary-bg-color);
  color: var(--tg-text-color);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
