<template>
  <div class="side-panel modern-panel blog-panel">
    <!-- Заголовок -->
    <div class="panel-header">
      <div class="header-content">
        <button class="back-button" @click="closePanel">
          <span class="back-icon">←</span>
          <span class="back-text">Назад</span>
        </button>
        <h2 class="panel-title">
          <span class="title-icon">📝</span>
          Блог MapChap
        </h2>
      </div>
    </div>

    <!-- Содержимое панели -->
    <div class="panel-content">
      <!-- Загрузка -->
      <div v-if="blogStore.isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Загрузка статей...</p>
      </div>

      <!-- Основной контент -->
      <div v-else class="blog-content">
        <!-- Вкладки -->
        <div class="tabs">
          <button 
            class="tab-btn"
            :class="{ active: activeTab === 'featured' }"
            @click="activeTab = 'featured'"
          >
            🌟 Рекомендуемые
          </button>
          <button 
            class="tab-btn"
            :class="{ active: activeTab === 'developers' }"
            @click="activeTab = 'developers'"
          >
            👨‍💻 От команды
          </button>
          <button 
            class="tab-btn"
            :class="{ active: activeTab === 'community' }"
            @click="activeTab = 'community'"
          >
            👥 Сообщество
          </button>
          <button 
            class="tab-btn"
            :class="{ active: activeTab === 'create' }"
            @click="activeTab = 'create'"
            v-if="authStore.isAuthenticated"
          >
            ✍️ Написать
          </button>
        </div>

        <!-- Содержимое вкладок -->
        <div class="tab-content">
          <!-- Рекомендуемые -->
          <div v-if="activeTab === 'featured'" class="featured-tab">
            <!-- Избранная статья -->
            <div class="featured-article" v-if="featuredArticle">
              <div class="featured-badge">🔥 Главная статья</div>
              <div class="article-image">
                <img :src="featuredArticle.image" :alt="featuredArticle.title" />
              </div>
              <div class="article-content">
                <div class="article-category">{{ getCategoryName(featuredArticle.category) }}</div>
                <h3 class="article-title">{{ featuredArticle.title }}</h3>
                <p class="article-excerpt">{{ featuredArticle.excerpt }}</p>
                
                <div class="article-meta">
                  <div class="article-author">
                    <div class="author-avatar">{{ featuredArticle.author.avatar }}</div>
                    <div class="author-info">
                      <strong>{{ featuredArticle.author.name }}</strong>
                      <span>{{ formatDate(featuredArticle.createdAt) }}</span>
                    </div>
                  </div>
                  <div class="article-stats">
                    <span class="stat">👁️ {{ formatViews(featuredArticle.views) }}</span>
                    <span class="stat">❤️ {{ featuredArticle.likes }}</span>
                    <span class="stat">💬 {{ featuredArticle.commentsCount }}</span>
                  </div>
                </div>

                <button class="btn btn-primary" @click="readArticle(featuredArticle)">
                  Читать статью →
                </button>
              </div>
            </div>

            <!-- Популярные статьи -->
            <div class="popular-section">
              <h4>📈 Популярные сейчас</h4>
              <div class="articles-grid">
                <div 
                  v-for="article in popularArticles" 
                  :key="article.id"
                  class="article-card featured"
                  @click="readArticle(article)"
                >
                  <div class="article-image">
                    <img :src="article.image" :alt="article.title" />
                  </div>
                  <div class="article-content">
                    <div class="article-category">{{ getCategoryName(article.category) }}</div>
                    <h4 class="article-title">{{ article.title }}</h4>
                    <p class="article-excerpt">{{ article.excerpt }}</p>
                    
                    <div class="article-meta">
                      <div class="author">
                        <span class="author-avatar small">{{ article.author.avatar }}</span>
                        <span class="author-name">{{ article.author.name }}</span>
                      </div>
                      <div class="stats">
                        <span class="stat">👁️ {{ formatViews(article.views) }}</span>
                        <span class="stat">❤️ {{ article.likes }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Все статьи -->
            <div class="all-articles-section">
              <h4>📚 Все статьи</h4>
              <div class="articles-list">
                <div 
                  v-for="article in getArticles" 
                  :key="article.id"
                  class="article-card list"
                  @click="readArticle(article)"
                >
                  <div class="article-image">
                    <img :src="article.image" :alt="article.title" />
                  </div>
                  <div class="article-content">
                    <div class="article-header">
                      <div class="article-category">{{ getCategoryName(article.category) }}</div>
                      <div class="article-date">{{ formatDate(article.createdAt) }}</div>
                    </div>
                    <h4 class="article-title">{{ article.title }}</h4>
                    <p class="article-excerpt">{{ article.excerpt }}</p>
                    
                    <div class="article-footer">
                      <div class="author">
                        <span class="author-avatar small">{{ article.author.avatar }}</span>
                        <span class="author-name">{{ article.author.name }}</span>
                      </div>
                      <div class="article-actions">
                        <button 
                          class="action-btn like-btn" 
                          :class="{ liked: article.isLiked }"
                          @click.stop="toggleLike(article.id)"
                        >
                          🤍 {{ article.likes }}
                        </button>
                        <button 
                          class="action-btn bookmark-btn" 
                          :class="{ bookmarked: article.isBookmarked }"
                          @click.stop="toggleBookmark(article.id)"
                        >
                          📑
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- От команды -->
          <div v-if="activeTab === 'developers'" class="developers-tab">
            <div class="section-header">
              <h3>👨‍💻 От команды MapChap</h3>
              <p>Официальные новости, обновления и советы от создателей платформы</p>
            </div>

            <div class="articles-list">
              <div 
                v-for="article in developerArticles" 
                :key="article.id"
                class="article-card developer"
                @click="readArticle(article)"
              >
                <div class="article-badge official">👑 Официально</div>
                <div class="article-image">
                  <img :src="article.image" :alt="article.title" />
                </div>
                <div class="article-content">
                  <div class="article-header">
                    <div class="article-category">{{ getCategoryName(article.category) }}</div>
                    <div class="article-date">{{ formatDate(article.createdAt) }}</div>
                  </div>
                  <h3 class="article-title">{{ article.title }}</h3>
                  <p class="article-excerpt">{{ article.excerpt }}</p>
                  
                  <div class="article-footer">
                    <div class="author">
                      <span class="author-avatar small">{{ article.author.avatar }}</span>
                      <span class="author-name">{{ article.author.name }}</span>
                      <span class="author-role">{{ getRoleName(article.author.role) }}</span>
                    </div>
                    <div class="article-stats">
                      <span class="stat">👁️ {{ formatViews(article.views) }}</span>
                      <span class="stat">❤️ {{ article.likes }}</span>
                      <span class="stat">⏱️ {{ article.readTime }} мин</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="developerArticles.length === 0" class="empty-state">
              <div class="empty-icon">📝</div>
              <h4>Пока нет статей от команды</h4>
              <p>Следите за обновлениями - скоро появятся новые материалы!</p>
            </div>
          </div>

          <!-- Сообщество -->
          <div v-if="activeTab === 'community'" class="community-tab">
            <div class="section-header">
              <h3>👥 Сообщество MapChap</h3>
              <p>Статьи, обзоры и опыт от наших пользователей</p>
              
              <button 
                class="btn btn-primary" 
                @click="activeTab = 'create'"
                v-if="authStore.isAuthenticated"
              >
                ✍️ Написать статью
              </button>
            </div>

            <div class="community-stats">
              <div class="stat-card">
                <div class="stat-value">{{ communityStats.totalArticles }}</div>
                <div class="stat-label">Статей от сообщества</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">{{ communityStats.totalAuthors }}</div>
                <div class="stat-label">Авторов</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">{{ communityStats.totalComments }}</div>
                <div class="stat-label">Комментариев</div>
              </div>
            </div>

            <div class="articles-list">
              <div 
                v-for="article in userArticles" 
                :key="article.id"
                class="article-card community"
                @click="readArticle(article)"
              >
                <div class="article-badge community">👥 Сообщество</div>
                <div class="article-image">
                  <img :src="article.image" :alt="article.title" />
                </div>
                <div class="article-content">
                  <div class="article-header">
                    <div class="article-category">{{ getCategoryName(article.category) }}</div>
                    <div class="article-date">{{ formatDate(article.createdAt) }}</div>
                  </div>
                  <h3 class="article-title">{{ article.title }}</h3>
                  <p class="article-excerpt">{{ article.excerpt }}</p>
                  
                  <div class="article-footer">
                    <div class="author">
                      <span class="author-avatar small">{{ article.author.avatar }}</span>
                      <span class="author-name">{{ article.author.name }}</span>
                    </div>
                    <div class="article-actions">
                      <button 
                        class="action-btn like-btn" 
                        :class="{ liked: article.isLiked }"
                        @click.stop="toggleLike(article.id)"
                      >
                        🤍 {{ article.likes }}
                      </button>
                      <button 
                        class="action-btn bookmark-btn" 
                        :class="{ bookmarked: article.isBookmarked }"
                        @click.stop="toggleBookmark(article.id)"
                      >
                        📑
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="userArticles.length === 0" class="empty-state">
              <div class="empty-icon">👥</div>
              <h4>Сообщество только начинается</h4>
              <p>Станьте первым автором и поделитесь своим опытом!</p>
              <button class="btn btn-primary" @click="activeTab = 'create'" v-if="authStore.isAuthenticated">
                Написать первую статью
              </button>
              <div v-else class="auth-prompt">
                <p>Войдите в аккаунт, чтобы написать статью</p>
                <button class="btn btn-primary" @click="initAuth">
                  Войти через Telegram
                </button>
              </div>
            </div>
          </div>

          <!-- Создание статьи -->
          <div v-if="activeTab === 'create'" class="create-tab">
            <div class="section-header">
              <h3>✍️ Написать статью</h3>
              <button v-if="editingArticle" class="btn btn-secondary" @click="cancelEdit">
                Отменить редактирование
              </button>
            </div>

            <!-- Не авторизован -->
            <div v-if="!authStore.isAuthenticated" class="auth-required">
              <div class="auth-icon">🔐</div>
              <h4>Требуется авторизация</h4>
              <p>Войдите в аккаунт, чтобы написать статью</p>
              <button class="btn btn-primary" @click="initAuth">
                Войти через Telegram
              </button>
            </div>

            <!-- Форма создания -->
            <div v-else class="create-form">
              <form @submit.prevent="publishArticle">
                <!-- Основная информация -->
                <div class="form-section">
                  <h4>📝 Основная информация</h4>
                  
                  <div class="form-group">
                    <label>Заголовок статьи *</label>
                    <input 
                      v-model="articleForm.title"
                      type="text" 
                      placeholder="Интересный заголовок, который привлечет читателей..."
                      required
                      maxlength="100"
                    >
                    <div class="char-counter">{{ articleForm.title.length }}/100</div>
                  </div>

                  <div class="form-grid">
                    <div class="form-group">
                      <label>Категория *</label>
                      <select v-model="articleForm.category" required>
                        <option value="">Выберите категорию</option>
                        <option 
                          v-for="category in blogStore.categories" 
                          :key="category.id" 
                          :value="category.id"
                        >
                          {{ category.name }}
                        </option>
                      </select>
                    </div>

                    <div class="form-group">
                      <label>Обложка статьи</label>
                      <div class="image-upload">
                        <input 
                          type="file" 
                          accept="image/*"
                          @change="handleImageUpload"
                          ref="imageInput"
                          style="display: none"
                        >
                        <button type="button" class="btn btn-outline" @click="$refs.imageInput.click()">
                          📸 Выбрать изображение
                        </button>
                        <span v-if="articleForm.image" class="image-name">
                          {{ articleForm.image.name }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="form-group">
                    <label>Краткое описание *</label>
                    <textarea 
                      v-model="articleForm.excerpt"
                      placeholder="Краткое описание, которое увидят читатели в списке статей. Постарайтесь уложиться в 1-2 предложения."
                      rows="3"
                      maxlength="200"
                      required
                    ></textarea>
                    <div class="char-counter">{{ articleForm.excerpt.length }}/200</div>
                  </div>
                </div>

                <!-- Содержание -->
                <div class="form-section">
                  <h4>📄 Содержание статьи</h4>
                  
                  <div class="form-group">
                    <label>Текст статьи *</label>
                    <textarea 
                      v-model="articleForm.content"
                      placeholder="Напишите вашу статью здесь. Используйте заголовки, списки и абзацы для лучшей читаемости."
                      rows="15"
                      required
                      minlength="500"
                    ></textarea>
                    <div class="editor-info">
                      <div class="char-counter">{{ articleForm.content.length }} символов</div>
                      <div v-if="articleForm.content.length < 500" class="warning-text">
                        Минимальная длина статьи - 500 символов
                      </div>
                      <div class="read-time">
                        Примерное время чтения: {{ Math.ceil(articleForm.content.length / 1200) }} минут
                      </div>
                    </div>
                  </div>

                  <div class="editor-tips">
                    <h5>💡 Советы по написанию:</h5>
                    <ul>
                      <li>Используйте заголовки разных уровней для структуры</li>
                      <li>Делитесь личным опытом и практическими советами</li>
                      <li>Добавляйте списки для лучшей читаемости</li>
                      <li>Проверяйте орфографию и пунктуацию</li>
                      <li>Добавьте призыв к обсуждению в конце</li>
                    </ul>
                  </div>
                </div>

                <!-- Теги и настройки -->
                <div class="form-section">
                  <h4>🏷️ Теги и настройки</h4>
                  
                  <div class="form-group">
                    <label>Теги (через запятую)</label>
                    <input 
                      v-model="articleForm.tagsInput"
                      type="text" 
                      placeholder="бизнес, успех, маркетинг, советы, опыт"
                      maxlength="100"
                    >
                    <div class="tags-preview" v-if="articleForm.tags.length > 0">
                      <span 
                        v-for="tag in articleForm.tags" 
                        :key="tag"
                        class="tag-preview"
                        @click="removeTag(tag)"
                      >
                        #{{ tag }} ×
                      </span>
                    </div>
                    <div class="help-text">
                      Добавьте до 5 тегов для лучшей discoverability
                    </div>
                  </div>

                  <div class="form-options">
                    <label class="checkbox-label">
                      <input 
                        v-model="articleForm.allowComments"
                        type="checkbox" 
                      >
                      <span class="checkmark"></span>
                      💬 Разрешить комментарии
                    </label>
                    
                    <label class="checkbox-label">
                      <input 
                        v-model="articleForm.allowLikes"
                        type="checkbox" 
                        checked
                      >
                      <span class="checkmark"></span>
                      ❤️ Разрешить лайки
                    </label>
                    
                    <label class="checkbox-label" v-if="authStore.isBusinessOwner">
                      <input 
                        v-model="articleForm.featured"
                        type="checkbox" 
                      >
                      <span class="checkmark"></span>
                      ⭐ Продвигать статью
                    </label>
                  </div>
                </div>

                <!-- Предпросмотр -->
                <div class="form-section" v-if="articleForm.content.length > 0">
                  <h4>👁️ Предпросмотр</h4>
                  <div class="preview">
                    <h4>{{ articleForm.title || 'Заголовок статьи' }}</h4>
                    <p class="preview-excerpt">{{ articleForm.excerpt || 'Краткое описание статьи...' }}</p>
                    <div class="preview-content">
                      {{ articleForm.content.substring(0, 200) }}...
                    </div>
                    <div class="preview-meta">
                      <span>👁️ 0 просмотров</span>
                      <span>❤️ 0 лайков</span>
                      <span>⏱️ {{ Math.ceil(articleForm.content.length / 1200) }} мин чтения</span>
                    </div>
                  </div>
                </div>

                <!-- Действия -->
                <div class="form-actions">
                  <button type="button" class="btn btn-secondary" @click="saveDraft">
                    💾 Сохранить черновик
                  </button>
                  
                  <div class="publish-actions">
                    <button 
                      type="button" 
                      class="btn btn-outline"
                      @click="previewArticle"
                      :disabled="!canPreview"
                    >
                      👁️ Предпросмотр
                    </button>
                    <button 
                      type="submit" 
                      class="btn btn-primary"
                      :disabled="!canPublish"
                    >
                      {{ editingArticle ? '💾 Сохранить изменения' : '🚀 Опубликовать статью' }}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUIStore } from '../stores/uiStore'
import { useAuthStore } from '../stores/authStore'
import { useBlogStore } from '../stores/blogStore'
import { storeToRefs } from 'pinia'
import { ref, computed, reactive, watch } from 'vue'

export default {
  name: 'BlogPanel',
  setup() {
    const uiStore = useUIStore()
    const authStore = useAuthStore()
    const blogStore = useBlogStore()
    
    const { closePanel, showNotification, openArticle } = uiStore
    const { initTelegramAuth } = authStore
    const { createArticle, updateArticle, toggleArticleLike, toggleArticleBookmark } = blogStore

    const { isAuthenticated, isBusinessOwner } = storeToRefs(authStore)
    const { getDeveloperArticles, getUserArticles, getFeaturedArticles, getPopularArticles, isLoading } = storeToRefs(blogStore)

    // State
    const activeTab = ref('featured')
    const editingArticle = ref(null)

    // Form data
    const articleForm = reactive({
      title: '',
      category: '',
      excerpt: '',
      content: '',
      tagsInput: '',
      tags: [],
      allowComments: true,
      allowLikes: true,
      featured: false,
      image: null
    })

    // Computed
    const developerArticles = computed(() => getDeveloperArticles.value)
    const userArticles = computed(() => getUserArticles.value)
    const featuredArticles = computed(() => getFeaturedArticles.value)
    const popularArticles = computed(() => getPopularArticles.value)

    const featuredArticle = computed(() => {
      return featuredArticles.value[0] || developerArticles.value[0] || userArticles.value[0]
    })

    const getArticles = computed(() => {
      return [...developerArticles.value, ...userArticles.value]
    })

    const communityStats = computed(() => {
      const authors = new Set(userArticles.value.map(article => article.author.id))
      const totalComments = userArticles.value.reduce((sum, article) => sum + article.commentsCount, 0)
      
      return {
        totalArticles: userArticles.value.length,
        totalAuthors: authors.size,
        totalComments: totalComments
      }
    })

    const canPublish = computed(() => {
      return articleForm.title.length > 0 &&
             articleForm.category.length > 0 &&
             articleForm.excerpt.length > 0 &&
             articleForm.content.length >= 500
    })

    const canPreview = computed(() => {
      return articleForm.title.length > 0 && articleForm.content.length > 0
    })

    // Methods
    const initAuth = () => {
      initTelegramAuth()
    }

    const getCategoryName = (categoryId) => {
      const category = blogStore.categories.find(cat => cat.id === categoryId)
      return category ? category.name : 'Другое'
    }

    const getRoleName = (role) => {
      const roles = {
        founder: 'Основатель',
        finance_director: 'Финансовый директор',
        developer: 'Разработчик',
        user: 'Пользователь'
      }
      return roles[role] || 'Автор'
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const formatViews = (views) => {
      if (views >= 1000) {
        return (views / 1000).toFixed(1) + 'k'
      }
      return views.toString()
    }

    const readArticle = (article) => {
      openArticle(article)
    }

    const toggleLike = (articleId) => {
      if (!authStore.isAuthenticated) {
        showNotification('Войдите в аккаунт, чтобы ставить лайки', 'info')
        return
      }
      toggleArticleLike(articleId)
    }

    const toggleBookmark = (articleId) => {
      if (!authStore.isAuthenticated) {
        showNotification('Войдите в аккаунт, чтобы добавлять в закладки', 'info')
        return
      }
      toggleArticleBookmark(articleId)
    }

    const handleImageUpload = (event) => {
      const file = event.target.files[0]
      if (file) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          showNotification('Изображение должно быть меньше 5MB', 'error')
          return
        }
        articleForm.image = file
      }
    }

    const removeTag = (tagToRemove) => {
      articleForm.tags = articleForm.tags.filter(tag => tag !== tagToRemove)
      articleForm.tagsInput = articleForm.tags.join(', ')
    }

    const publishArticle = async () => {
      try {
        const articleData = {
          title: articleForm.title,
          category: articleForm.category,
          excerpt: articleForm.excerpt,
          content: articleForm.content,
          tags: articleForm.tags,
          allowComments: articleForm.allowComments,
          allowLikes: articleForm.allowLikes,
          featured: articleForm.featured,
          image: articleForm.image
        }

        let newArticle
        if (editingArticle.value) {
          newArticle = await updateArticle(editingArticle.value.id, articleData)
          showNotification('Статья успешно обновлена!', 'success')
        } else {
          newArticle = await createArticle(articleData)
          showNotification('Статья успешно опубликована!', 'success')
        }

        resetForm()
        activeTab.value = 'community'
        
      } catch (error) {
        showNotification('Ошибка при публикации статьи', 'error')
      }
    }

    const saveDraft = () => {
      localStorage.setItem('blog_article_draft', JSON.stringify(articleForm))
      showNotification('Черновик сохранен!', 'success')
    }

    const previewArticle = () => {
      const previewArticle = {
        id: 'preview',
        title: articleForm.title,
        excerpt: articleForm.excerpt,
        content: articleForm.content,
        author: authStore.user,
        category: articleForm.category,
        tags: articleForm.tags,
        views: 0,
        likes: 0,
        commentsCount: 0,
        readTime: Math.ceil(articleForm.content.length / 1200),
        isLiked: false,
        isBookmarked: false,
        createdAt: new Date().toISOString()
      }
      openArticle(previewArticle)
    }

    const cancelEdit = () => {
      editingArticle.value = null
      resetForm()
      activeTab.value = 'community'
    }

    const resetForm = () => {
      editingArticle.value = null
      Object.assign(articleForm, {
        title: '',
        category: '',
        excerpt: '',
        content: '',
        tagsInput: '',
        tags: [],
        allowComments: true,
        allowLikes: true,
        featured: false,
        image: null
      })
    }

    // Watchers
    watch(() => articleForm.tagsInput, (newValue) => {
      if (newValue) {
        articleForm.tags = newValue.split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0)
          .slice(0, 5) // Максимум 5 тегов
      } else {
        articleForm.tags = []
      }
    })

    // Load draft on component mount
    const loadDraft = () => {
      const draft = localStorage.getItem('blog_article_draft')
      if (draft) {
        const draftData = JSON.parse(draft)
        Object.assign(articleForm, draftData)
      }
    }

    loadDraft()

    return {
      // Stores
      authStore,
      blogStore,
      
      // State
      activeTab,
      editingArticle,
      articleForm,
      
      // Computed
      isAuthenticated,
      isBusinessOwner,
      isLoading,
      developerArticles,
      userArticles,
      featuredArticle,
      featuredArticles,
      popularArticles,
      getArticles,
      communityStats,
      canPublish,
      canPreview,
      
      // Methods
      closePanel,
      initAuth,
      readArticle,
      toggleLike,
      toggleBookmark,
      handleImageUpload,
      removeTag,
      publishArticle,
      saveDraft,
      previewArticle,
      cancelEdit,
      getCategoryName,
      getRoleName,
      formatDate,
      formatViews
    }
  }
}
</script>

<style scoped>
.blog-panel {
  max-width: 800px;
}

.blog-content {
  padding: 0;
}

.loading-state {
  text-align: center;
  padding: 3rem 2rem;
  color: var(--text-secondary);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-top: 3px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

/* Tabs */
.tabs {
  display: flex;
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.tab-btn {
  flex: 1;
  padding: 0.75rem 0.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;
  color: var(--text-secondary);
  border-radius: 12px;
  font-weight: 500;
  min-width: 120px;
  white-space: nowrap;
}

.tab-btn.active {
  background: var(--primary);
  color: white;
  box-shadow: var(--shadow-sm);
}

.tab-btn:hover:not(.active) {
  background: var(--bg-tertiary);
}

.tab-content {
  flex: 1;
  overflow-y: auto;
}

/* Featured Tab */
.featured-tab {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.featured-article {
  position: relative;
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  color: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.featured-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  z-index: 2;
}

.article-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-content {
  padding: 1.5rem;
}

.article-category {
  display: inline-block;
  background: rgba(255, 255, 255, 0.3);
  padding: 0.4rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.article-title {
  font-size: 1.4rem;
  margin: 0 0 1rem 0;
  line-height: 1.3;
}

.article-excerpt {
  font-size: 1rem;
  line-height: 1.5;
  opacity: 0.9;
  margin-bottom: 1.5rem;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.article-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.author-avatar {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  backdrop-filter: blur(10px);
}

.author-avatar.small {
  width: 24px;
  height: 24px;
  font-size: 0.8rem;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-info strong {
  margin-bottom: 0.25rem;
}

.author-info span {
  font-size: 0.8rem;
  opacity: 0.8;
}

.article-stats {
  display: flex;
  gap: 1rem;
}

.article-stats .stat {
  font-size: 0.9rem;
  opacity: 0.9;
}

.popular-section h4,
.all-articles-section h4 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  color: var(--text-primary);
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.article-card.featured {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.article-card.featured:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.article-card.featured .article-image {
  height: 150px;
}

.article-card.featured .article-content {
  padding: 1.25rem;
}

.article-card.featured .article-title {
  font-size: 1.1rem;
  margin: 0.5rem 0;
}

.article-card.featured .article-excerpt {
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.article-card.featured .article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
}

.article-card.featured .author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.author-name {
  font-size: 0.8rem;
  font-weight: 500;
}

.article-card.featured .stats {
  display: flex;
  gap: 0.75rem;
}

.article-card.featured .stat {
  font-size: 0.7rem;
  opacity: 0.7;
}

/* Articles List */
.articles-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.article-card.list,
.article-card.developer,
.article-card.community {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.article-card.list:hover,
.article-card.developer:hover,
.article-card.community:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.article-card.developer {
  border-left: 4px solid var(--primary);
}

.article-card.community {
  border-left: 4px solid #10B981;
}

.article-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.4rem 0.8rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
}

.article-badge.official {
  background: var(--primary);
  color: white;
}

.article-badge.community {
  background: #10B981;
  color: white;
}

.article-card.list .article-image,
.article-card.developer .article-image,
.article-card.community .article-image {
  width: 100px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  float: left;
  margin-right: 1rem;
  margin-bottom: 1rem;
}

.article-card.list .article-content,
.article-card.developer .article-content,
.article-card.community .article-content {
  padding: 0;
  overflow: hidden;
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.article-date {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.article-card.list .article-title,
.article-card.developer .article-title,
.article-card.community .article-title {
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
}

.article-card.list .article-excerpt,
.article-card.developer .article-excerpt,
.article-card.community .article-excerpt {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.4;
  margin-bottom: 1rem;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.article-footer .author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.author-role {
  font-size: 0.7rem;
  color: var(--text-secondary);
  background: var(--bg-tertiary);
  padding: 0.2rem 0.5rem;
  border-radius: 8px;
}

.article-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.4rem 0.75rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;
  color: var(--text-primary);
}

.action-btn:hover {
  background: var(--bg-tertiary);
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

/* Developers & Community Tabs */
.developers-tab,
.community-tab {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-header {
  text-align: center;
  padding: 1rem;
}

.section-header h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.4rem;
  color: var(--text-primary);
}

.section-header p {
  margin: 0 0 1rem 0;
  color: var(--text-secondary);
}

.community-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.stat-card {
  text-align: center;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary);
  display: block;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h4 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.auth-prompt {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

/* Create Tab */
.create-tab {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.auth-required {
  text-align: center;
  padding: 3rem 2rem;
  color: var(--text-secondary);
}

.auth-required .auth-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.auth-required h4 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.create-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: 16px;
  border: 1px solid var(--border-color);
}

.form-section h4 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  color: var(--text-primary);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-primary);
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.char-counter {
  text-align: right;
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.image-upload {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.image-name {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.editor-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.warning-text {
  color: #ef4444;
  font-size: 0.8rem;
  font-weight: 500;
}

.read-time {
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.editor-tips {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1rem;
}

.editor-tips h5 {
  margin: 0 0 0.75rem 0;
  font-size: 1rem;
  color: var(--text-primary);
}

.editor-tips ul {
  margin: 0;
  padding-left: 1.5rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.editor-tips li {
  margin-bottom: 0.5rem;
}

.help-text {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.tags-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tag-preview {
  background: var(--primary);
  color: white;
  padding: 0.4rem 0.75rem;
  border-radius: 16px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tag-preview:hover {
  background: #ef4444;
  transform: scale(1.05);
}

.form-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.checkbox-label input {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-color);
  border-radius: 4px;
  position: relative;
  transition: all 0.3s ease;
}

.checkbox-label input:checked + .checkmark {
  background: var(--primary);
  border-color: var(--primary);
}

.checkbox-label input:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.preview {
  padding: 1.5rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
}

.preview h4 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
}

.preview-excerpt {
  color: var(--text-secondary);
  font-style: italic;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.preview-content {
  color: var(--text-primary);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.preview-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
  flex-wrap: wrap;
  gap: 1rem;
}

.publish-actions {
  display: flex;
  gap: 1rem;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  text-decoration: none;
  justify-content: center;
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-secondary);
}

.btn-outline {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-outline:hover:not(:disabled) {
  background: var(--bg-tertiary);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .blog-panel {
    max-width: 100%;
  }
  
  .tabs {
    flex-direction: column;
  }
  
  .section-header {
    text-align: left;
  }
  
  .articles-grid {
    grid-template-columns: 1fr;
  }
  
  .community-stats {
    grid-template-columns: 1fr;
  }
  
  .article-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .article-footer {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .article-stats {
    flex-wrap: wrap;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .publish-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .article-card.list .article-image,
  .article-card.developer .article-image,
  .article-card.community .article-image {
    float: none;
    width: 100%;
    height: 150px;
    margin-right: 0;
    margin-bottom: 1rem;
  }
}

@media (max-width: 480px) {
  .featured-article .article-meta {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .article-stats {
    gap: 0.75rem;
  }
  
  .image-upload {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .publish-actions {
    flex-direction: column;
  }
  
  .editor-info {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
