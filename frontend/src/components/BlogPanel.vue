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
          Блог MapChap
        </h2>
      </div>
    </div>

    <div class="panel-content">
      <!-- Загрузка -->
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Загрузка статей...</p>
      </div>

      <!-- Основной контент -->
      <div v-else class="blog-content">
        <!-- Вкладки -->
        <div class="tabs">
          <button 
            class="tab-btn"
            :class="{ active: activeTab === 'all' }"
            @click="activeTab = 'all'"
          >
            📰 Все статьи
          </button>
          <button 
            class="tab-btn"
            :class="{ active: activeTab === 'official' }"
            @click="activeTab = 'official'"
          >
            👑 Официальные
          </button>
          <button 
            class="tab-btn"
            :class="{ active: activeTab === 'community' }"
            @click="activeTab = 'community'"
          >
            👥 Сообщество
          </button>
          <button 
            v-if="authStore.isAuthenticated"
            class="tab-btn"
            :class="{ active: activeTab === 'my' }"
            @click="activeTab = 'my'"
          >
            ✍️ Мои статьи
          </button>
        </div>

        <!-- Содержимое вкладок -->
        <div class="tab-content">
          <!-- Все статьи -->
          <div v-if="activeTab === 'all'" class="articles-tab">
            <div class="section-header">
              <h3>📰 Все статьи</h3>
              <p>Актуальные материалы от команды и сообщества</p>
            </div>

            <!-- Фильтры -->
            <div class="filters">
              <div class="filter-group">
                <select v-model="filters.category" @change="applyFilters">
                  <option value="">Все категории</option>
                  <option 
                    v-for="category in categories" 
                    :key="category.id" 
                    :value="category.id"
                  >
                    {{ category.name }}
                  </option>
                </select>
              </div>
              <div class="filter-group">
                <select v-model="filters.sort" @change="applyFilters">
                  <option value="newest">Сначала новые</option>
                  <option value="popular">По популярности</option>
                  <option value="rating">По рейтингу</option>
                </select>
              </div>
            </div>

            <!-- Список статей -->
            <div class="articles-list">
              <article 
                v-for="article in filteredArticles" 
                :key="article.id"
                class="article-card"
                @click="readArticle(article)"
              >
                <div class="article-header">
                  <div class="article-author">
                    <div class="author-avatar">
                      <img v-if="article.author.avatar" :src="article.author.avatar" :alt="article.author.name" />
                      <span v-else>{{ article.author.name.charAt(0) }}</span>
                    </div>
                    <div class="author-info">
                      <strong>{{ article.author.name }}</strong>
                      <span class="article-date">{{ formatDate(article.created_at) }}</span>
                      <span v-if="article.author.role !== 'user'" class="author-badge official">
                        {{ getRoleBadge(article.author.role) }}
                      </span>
                    </div>
                  </div>
                  <div class="article-category">{{ getCategoryName(article.category) }}</div>
                </div>

                <div class="article-image" v-if="article.image">
                  <img :src="article.image" :alt="article.title" />
                </div>

                <h3 class="article-title">{{ article.title }}</h3>
                <p class="article-excerpt">{{ article.excerpt }}</p>

                <div class="article-stats">
                  <div class="stat">
                    <span class="stat-icon">👁️</span>
                    <span class="stat-value">{{ formatViews(article.views) }}</span>
                  </div>
                  <div class="stat">
                    <span class="stat-icon">❤️</span>
                    <span class="stat-value">{{ article.likes }}</span>
                  </div>
                  <div class="stat">
                    <span class="stat-icon">💬</span>
                    <span class="stat-value">{{ article.comments_count }}</span>
                  </div>
                  <div class="stat">
                    <span class="stat-icon">⏱️</span>
                    <span class="stat-value">{{ article.read_time }} мин</span>
                  </div>
                </div>

                <div class="article-tags" v-if="article.tags && article.tags.length > 0">
                  <span 
                    v-for="tag in article.tags.slice(0, 3)" 
                    :key="tag"
                    class="tag"
                  >
                    #{{ tag }}
                  </span>
                  <span v-if="article.tags.length > 3" class="tag-more">
                    +{{ article.tags.length - 3 }}
                  </span>
                </div>
              </article>
            </div>

            <!-- Пагинация -->
            <div class="pagination" v-if="totalPages > 1">
              <button 
                class="pagination-btn" 
                :disabled="currentPage === 1"
                @click="changePage(currentPage - 1)"
              >
                ←
              </button>
              <span class="pagination-info">
                Страница {{ currentPage }} из {{ totalPages }}
              </span>
              <button 
                class="pagination-btn" 
                :disabled="currentPage === totalPages"
                @click="changePage(currentPage + 1)"
              >
                →
              </button>
            </div>

            <div v-if="filteredArticles.length === 0" class="empty-state">
              <div class="empty-icon">📝</div>
              <h4>Статьи не найдены</h4>
              <p>Попробуйте изменить фильтры или зайти позже</p>
            </div>
          </div>

          <!-- Официальные статьи -->
          <div v-if="activeTab === 'official'" class="official-tab">
            <div class="section-header">
              <h3>👑 Официальные статьи</h3>
              <p>Новости, обновления и анонсы от команды MapChap</p>
            </div>

            <div class="articles-list">
              <article 
                v-for="article in officialArticles" 
                :key="article.id"
                class="article-card featured"
                @click="readArticle(article)"
              >
                <div class="featured-badge">Официально</div>
                <div class="article-image" v-if="article.image">
                  <img :src="article.image" :alt="article.title" />
                </div>
                <div class="article-content">
                  <div class="article-category">{{ getCategoryName(article.category) }}</div>
                  <h3 class="article-title">{{ article.title }}</h3>
                  <p class="article-excerpt">{{ article.excerpt }}</p>
                  
                  <div class="article-meta">
                    <div class="article-author">
                      <div class="author-avatar">
                        <img v-if="article.author.avatar" :src="article.author.avatar" :alt="article.author.name" />
                        <span v-else>{{ article.author.name.charAt(0) }}</span>
                      </div>
                      <div class="author-info">
                        <strong>{{ article.author.name }}</strong>
                        <span>{{ formatDate(article.created_at) }}</span>
                      </div>
                    </div>
                    <div class="article-stats">
                      <span class="stat">👁️ {{ formatViews(article.views) }}</span>
                      <span class="stat">❤️ {{ article.likes }}</span>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            <div v-if="officialArticles.length === 0" class="empty-state">
              <div class="empty-icon">👑</div>
              <h4>Пока нет официальных статей</h4>
              <p>Следите за обновлениями - скоро появятся новости!</p>
            </div>
          </div>

          <!-- Сообщество -->
          <div v-if="activeTab === 'community'" class="community-tab">
            <div class="section-header">
              <h3>👥 Сообщество</h3>
              <p>Статьи, обзоры и опыт от наших пользователей</p>
              <button 
                v-if="authStore.isAuthenticated"
                class="btn btn-primary"
                @click="startWriting"
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
              <article 
                v-for="article in communityArticles" 
                :key="article.id"
                class="article-card community"
                @click="readArticle(article)"
              >
                <div class="article-header">
                  <div class="article-author">
                    <div class="author-avatar">
                      <img v-if="article.author.avatar" :src="article.author.avatar" :alt="article.author.name" />
                      <span v-else>{{ article.author.name.charAt(0) }}</span>
                    </div>
                    <div class="author-info">
                      <strong>{{ article.author.name }}</strong>
                      <span class="article-date">{{ formatDate(article.created_at) }}</span>
                      <span class="author-badge user">👥 Сообщество</span>
                    </div>
                  </div>
                  <div class="article-rating" v-if="article.rating">
                    ⭐ {{ article.rating }}
                  </div>
                </div>

                <h3 class="article-title">{{ article.title }}</h3>
                <p class="article-excerpt">{{ article.excerpt }}</p>

                <div class="article-footer">
                  <div class="article-stats">
                    <div class="stat">
                      <span class="stat-icon">👁️</span>
                      <span class="stat-value">{{ formatViews(article.views) }}</span>
                    </div>
                    <div class="stat">
                      <span class="stat-icon">❤️</span>
                      <span class="stat-value">{{ article.likes }}</span>
                    </div>
                    <div class="stat">
                      <span class="stat-icon">💬</span>
                      <span class="stat-value">{{ article.comments_count }}</span>
                    </div>
                  </div>

                  <button 
                    class="btn btn-small like-btn" 
                    :class="{ liked: article.is_liked }"
                    @click.stop="toggleLike(article.id)"
                  >
                    <span class="btn-icon">{{ article.is_liked ? '❤️' : '🤍' }}</span>
                    {{ article.likes }}
                  </button>
                </div>
              </article>
            </div>

            <div v-if="communityArticles.length === 0" class="empty-state">
              <div class="empty-icon">👥</div>
              <h4>Сообщество только начинается</h4>
              <p>Станьте первым автором и поделитесь своим опытом!</p>
              <button 
                v-if="authStore.isAuthenticated"
                class="btn btn-primary" 
                @click="startWriting"
              >
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

          <!-- Мои статьи -->
          <div v-if="activeTab === 'my'" class="my-articles-tab">
            <div class="section-header">
              <h3>✍️ Мои статьи</h3>
              <button class="btn btn-primary" @click="startWriting">
                📝 Новая статья
              </button>
            </div>

            <div v-if="!authStore.isAuthenticated" class="auth-required">
              <div class="auth-icon">🔐</div>
              <h4>Требуется авторизация</h4>
              <p>Войдите в аккаунт для управления статьями</p>
              <button class="btn btn-primary" @click="initAuth">
                Войти через Telegram
              </button>
            </div>

            <div v-else class="my-articles-content">
              <!-- Статистика автора -->
              <div class="author-stats">
                <div class="stat-card">
                  <div class="stat-value">{{ authorStats.published || 0 }}</div>
                  <div class="stat-label">Опубликовано</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">{{ authorStats.drafts || 0 }}</div>
                  <div class="stat-label">Черновиков</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">{{ authorStats.totalViews || 0 }}</div>
                  <div class="stat-label">Просмотров</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">{{ authorStats.totalLikes || 0 }}</div>
                  <div class="stat-label">Лайков</div>
                </div>
              </div>

              <!-- Вкладки моих статей -->
              <div class="sub-tabs">
                <button 
                  class="sub-tab-btn"
                  :class="{ active: myArticlesFilter === 'published' }"
                  @click="myArticlesFilter = 'published'"
                >
                  📢 Опубликованные
                </button>
                <button 
                  class="sub-tab-btn"
                  :class="{ active: myArticlesFilter === 'drafts' }"
                  @click="myArticlesFilter = 'drafts'"
                >
                  📝 Черновики
                </button>
                <button 
                  class="sub-tab-btn"
                  :class="{ active: myArticlesFilter === 'pending' }"
                  @click="myArticlesFilter = 'pending'"
                >
                  ⏳ На модерации
                </button>
              </div>

              <!-- Список моих статей -->
              <div class="my-articles-list">
                <div 
                  v-for="article in myArticles" 
                  :key="article.id"
                  class="my-article-card"
                  :class="article.status"
                >
                  <div class="article-main">
                    <h4 class="article-title">{{ article.title || 'Без названия' }}</h4>
                    <p class="article-excerpt">{{ article.excerpt || 'Нет описания' }}</p>
                    
                    <div class="article-meta">
                      <span class="article-status" :class="article.status">
                        {{ getStatusText(article.status) }}
                      </span>
                      <span class="article-date">{{ formatDate(article.updated_at) }}</span>
                      <span class="article-category">{{ getCategoryName(article.category) }}</span>
                    </div>

                    <div class="article-stats" v-if="article.status === 'published'">
                      <span class="stat">👁️ {{ article.views || 0 }}</span>
                      <span class="stat">❤️ {{ article.likes || 0 }}</span>
                      <span class="stat">💬 {{ article.comments_count || 0 }}</span>
                    </div>
                  </div>

                  <div class="article-actions">
                    <button class="btn btn-small" @click.stop="editArticle(article)">
                      ✏️
                    </button>
                    <button 
                      v-if="article.status === 'published'"
                      class="btn btn-small" 
                      @click.stop="toggleArticleStatus(article.id)"
                    >
                      ⏸️
                    </button>
                    <button 
                      v-else-if="article.status === 'draft'"
                      class="btn btn-small btn-success" 
                      @click.stop="publishArticle(article.id)"
                    >
                      📢
                    </button>
                    <button 
                      class="btn btn-small btn-danger" 
                      @click.stop="deleteArticle(article.id)"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="myArticles.length === 0" class="empty-state">
                <div class="empty-icon">📝</div>
                <h4 v-if="myArticlesFilter === 'published'">У вас нет опубликованных статей</h4>
                <h4 v-else-if="myArticlesFilter === 'drafts'">У вас нет черновиков</h4>
                <h4 v-else>Нет статей на модерации</h4>
                <p>Начните писать свою первую статью!</p>
                <button class="btn btn-primary" @click="startWriting">
                  Написать статью
                </button>
              </div>
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
import { ref, computed, onMounted, reactive } from 'vue'

export default {
  name: 'BlogPanel',
  setup() {
    const uiStore = useUIStore()
    const authStore = useAuthStore()

    const { closePanel, showNotification, openPanel, openArticle } = uiStore
    const { initTelegramAuth } = authStore

    // State
    const activeTab = ref('all')
    const isLoading = ref(false)
    const currentPage = ref(1)
    const totalPages = ref(1)
    const myArticlesFilter = ref('published')

    const filters = reactive({
      category: '',
      sort: 'newest',
      search: ''
    })

    // Mock data - в реальном приложении будет загружаться из API
    const articles = ref([])
    const categories = ref([
      { id: 'news', name: '📰 Новости', icon: '📰' },
      { id: 'updates', name: '🔄 Обновления', icon: '🔄' },
      { id: 'guides', name: '📚 Гайды', icon: '📚' },
      { id: 'business', name: '💼 Бизнес-советы', icon: '💼' },
      { id: 'success', name: '🚀 Истории успеха', icon: '🚀' },
      { id: 'technology', name: '🤖 Технологии', icon: '🤖' },
      { id: 'marketing', name: '📈 Маркетинг', icon: '📈' },
      { id: 'other', name: '🔮 Другое', icon: '🔮' }
    ])

    // Computed
    const filteredArticles = computed(() => {
      let filtered = articles.value

      // Фильтрация по категории
      if (filters.category) {
        filtered = filtered.filter(article => article.category === filters.category)
      }

      // Сортировка
      switch (filters.sort) {
        case 'newest':
          filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          break
        case 'popular':
          filtered.sort((a, b) => b.views - a.views)
          break
        case 'rating':
          filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
          break
      }

      return filtered
    })

    const officialArticles = computed(() => {
      return articles.value.filter(article => 
        article.author.role !== 'user' && article.status === 'published'
      )
    })

    const communityArticles = computed(() => {
      return articles.value.filter(article => 
        article.author.role === 'user' && article.status === 'published'
      )
    })

    const myArticles = computed(() => {
      if (!authStore.isAuthenticated) return []
      
      return articles.value.filter(article => {
        const isMyArticle = article.author.id === authStore.user.id
        return isMyArticle && article.status === myArticlesFilter.value
      })
    })

    const communityStats = computed(() => {
      const communityArticlesList = communityArticles.value
      const authors = new Set(communityArticlesList.map(article => article.author.id))
      const totalComments = communityArticlesList.reduce((sum, article) => sum + article.comments_count, 0)
      
      return {
        totalArticles: communityArticlesList.length,
        totalAuthors: authors.size,
        totalComments: totalComments
      }
    })

    const authorStats = computed(() => {
      if (!authStore.isAuthenticated) return {}
      
      const myArticlesList = articles.value.filter(article => article.author.id === authStore.user.id)
      
      return {
        published: myArticlesList.filter(a => a.status === 'published').length,
        drafts: myArticlesList.filter(a => a.status === 'draft').length,
        pending: myArticlesList.filter(a => a.status === 'pending').length,
        totalViews: myArticlesList.reduce((sum, article) => sum + (article.views || 0), 0),
        totalLikes: myArticlesList.reduce((sum, article) => sum + (article.likes || 0), 0)
      }
    })

    // Methods
    const initAuth = () => {
      initTelegramAuth()
    }

    const formatDate = (dateString) => {
      if (!dateString) return 'Недавно'
      return new Date(dateString).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    }

    const formatViews = (views) => {
      if (views >= 1000) {
        return (views / 1000).toFixed(1) + 'k'
      }
      return views.toString()
    }

    const getCategoryName = (categoryId) => {
      const category = categories.value.find(cat => cat.id === categoryId)
      return category ? category.name : 'Другое'
    }

    const getRoleBadge = (role) => {
      const badges = {
        admin: '👑 Админ',
        moderator: '🛡️ Модератор',
        editor: '✏️ Редактор',
        author: '📝 Автор'
      }
      return badges[role] || '👥 Команда'
    }

    const getStatusText = (status) => {
      const statuses = {
        published: '✅ Опубликовано',
        draft: '📝 Черновик',
        pending: '⏳ На модерации',
        rejected: '❌ Отклонено'
      }
      return statuses[status] || status
    }

    const readArticle = (article) => {
      openArticle(article)
    }

    const startWriting = () => {
      if (!authStore.isAuthenticated) {
        showNotification('Войдите в аккаунт, чтобы написать статью', 'info')
        return
      }
      showNotification('Редактор статей будет доступен в следующем обновлении', 'info')
    }

    const toggleLike = (articleId) => {
      if (!authStore.isAuthenticated) {
        showNotification('Войдите в аккаунт, чтобы ставить лайки', 'info')
        return
      }
      showNotification('Лайк добавлен!', 'success')
    }

    const editArticle = (article) => {
      showNotification(`Редактирование статьи: "${article.title}"`, 'info')
    }

    const toggleArticleStatus = (articleId) => {
      showNotification('Статус статьи изменен', 'success')
    }

    const publishArticle = (articleId) => {
      showNotification('Статья отправлена на модерацию', 'success')
    }

    const deleteArticle = (articleId) => {
      if (confirm('Вы уверены, что хотите удалить эту статью?')) {
        showNotification('Статья удалена', 'success')
      }
    }

    const applyFilters = () => {
      // В реальном приложении здесь будет запрос к API
      console.log('Applying filters:', filters)
    }

    const changePage = (page) => {
      currentPage.value = page
      // В реальном приложении здесь будет загрузка данных для страницы
    }

    // Load initial data
    const loadArticles = () => {
      isLoading.value = true
      
      // Mock data - в реальном приложении будет API запрос
      setTimeout(() => {
        articles.value = [
          {
            id: 1,
            title: 'MapChap v3.0: Новая эра бизнес-карт',
            excerpt: 'Представляем полностью переработанную платформу для бизнес-объявлений на карте с фокусом на пользовательский опыт.',
            content: 'Полное содержание статьи...',
            category: 'news',
            image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800',
            author: {
              id: 1,
              name: 'Ахрор Хабибуллаев',
              avatar: null,
              role: 'admin'
            },
            status: 'published',
            views: 1245,
            likes: 89,
            comments_count: 23,
            read_time: 5,
            is_liked: false,
            rating: 4.8,
            tags: ['обновление', 'платформа', 'бизнес'],
            created_at: '2024-01-15T10:00:00Z',
            updated_at: '2024-01-15T10:00:00Z'
          }
        ]
        isLoading.value = false
      }, 1000)
    }

    onMounted(() => {
      loadArticles()
    })

    return {
      // State
      activeTab,
      isLoading,
      currentPage,
      totalPages,
      myArticlesFilter,
      filters,
      
      // Computed
      filteredArticles,
      officialArticles,
      communityArticles,
      myArticles,
      communityStats,
      authorStats,
      categories,
      
      // Stores
      authStore,
      
      // Methods
      closePanel,
      initAuth,
      readArticle,
      startWriting,
      toggleLike,
      editArticle,
      toggleArticleStatus,
      publishArticle,
      deleteArticle,
      applyFilters,
      changePage,
      formatDate,
      formatViews,
      getCategoryName,
      getRoleBadge,
      getStatusText
    }
  }
}
</script>

<style scoped>
/* Стили для вкладок */
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

.sub-tabs {
  display: flex;
  background: var(--bg-tertiary);
  border-radius: 12px;
  padding: 0.25rem;
  margin-bottom: 1.5rem;
}

.sub-tab-btn {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;
  color: var(--text-secondary);
  border-radius: 8px;
  font-weight: 500;
}

.sub-tab-btn.active {
  background: var(--primary);
  color: white;
}

/* Секции */
.section-header {
  text-align: center;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
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

/* Фильтры */
.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.filter-group select {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.9rem;
}

/* Статистика */
.community-stats,
.author-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
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

/* Карточки статей */
.articles-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.article-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.article-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.article-card.featured {
  border-left: 4px solid var(--primary);
}

.article-card.community {
  border-left: 4px solid var(--secondary);
}

.featured-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--primary);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
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
  background: var(--primary-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.author-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-info strong {
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.article-date {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.author-badge {
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  margin-top: 0.25rem;
}

.author-badge.official {
  background: var(--primary);
  color: white;
}

.author-badge.user {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.article-category {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  padding: 0.4rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.article-rating {
  background: var(--accent);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.article-image {
  width: 100%;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-title {
  font-size: 1.2rem;
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  line-height: 1.3;
}

.article-excerpt {
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 1rem;
}

.article-stats {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.article-stats .stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.stat-icon {
  font-size: 1rem;
}

.stat-value {
  font-weight: 500;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  border: 1px solid var(--border-color);
}

.tag-more {
  background: var(--primary);
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

/* Мои статьи */
.my-articles-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.my-article-card {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  transition: all 0.3s ease;
  gap: 1rem;
}

.my-article-card:hover {
  background: var(--bg-tertiary);
}

.article-main {
  flex: 1;
}

.my-article-card .article-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.my-article-card .article-excerpt {
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
}

.article-meta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.article-status {
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
}

.article-status.published {
  background: #dcfce7;
  color: #166534;
}

.article-status.draft {
  background: #fef3c7;
  color: #92400e;
}

.article-status.pending {
  background: #dbeafe;
  color: #1e40af;
}

.article-status.rejected {
  background: #fecaca;
  color: #dc2626;
}

.article-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

/* Пагинация */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: var(--bg-tertiary);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* Состояния */
.loading-state,
.empty-state,
.auth-required {
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

.empty-icon,
.auth-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h4,
.auth-required h4 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.auth-prompt {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

/* Кнопки */
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

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover {
  background: #059669;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

.btn-small {
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
}

.like-btn {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
}

.like-btn.liked {
  background: #fecaca;
  color: #dc2626;
  border-color: #fecaca;
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

/* Адаптивность */
@media (max-width: 768px) {
  .tabs {
    flex-direction: column;
  }
  
  .filters {
    flex-direction: column;
  }
  
  .article-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .article-footer {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .my-article-card {
    flex-direction: column;
  }
  
  .article-actions {
    align-self: flex-end;
  }
  
  .community-stats,
  .author-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .article-stats {
    flex-wrap: wrap;
    gap: 0.75rem;
  }
  
  .article-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .community-stats,
  .author-stats {
    grid-template-columns: 1fr;
  }
  
  .sub-tabs {
    flex-direction: column;
  }
}
</style>
