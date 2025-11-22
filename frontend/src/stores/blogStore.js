import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './authStore'

export const useBlogStore = defineStore('blog', () => {
  const authStore = useAuthStore()
  
  // State
  const articles = ref([])
  const comments = ref([])
  const isLoading = ref(false)
  const categories = ref([
    { id: 'business', name: '💼 Бизнес-советы', icon: '💼' },
    { id: 'success', name: '🚀 Истории успеха', icon: '🚀' },
    { id: 'marketing', name: '📈 Маркетинг', icon: '📈' },
    { id: 'technology', name: '🤖 Технологии', icon: '🤖' },
    { id: 'news', name: '📢 Новости платформы', icon: '📢' },
    { id: 'review', name: '⭐ Обзоры', icon: '⭐' },
    { id: 'other', name: '🔮 Другое', icon: '🔮' }
  ])

  // Computed
  const getArticles = computed(() => {
    return articles.value.filter(article => article.isPublished)
  })

  const getDeveloperArticles = computed(() => {
    return getArticles.value.filter(article => article.author.role !== 'user')
  })

  const getUserArticles = computed(() => {
    return getArticles.value.filter(article => article.author.role === 'user')
  })

  const getArticleById = computed(() => (articleId) => {
    return articles.value.find(article => article.id === parseInt(articleId))
  })

  const getCommentsByArticleId = computed(() => (articleId) => {
    return comments.value.filter(comment => comment.articleId === parseInt(articleId))
  })

  // Actions
  const loadInitialData = () => {
    const savedArticles = localStorage.getItem('mapchap-articles')
    const savedComments = localStorage.getItem('mapchap-comments')
    
    if (savedArticles) {
      articles.value = JSON.parse(savedArticles)
    }
    if (savedComments) {
      comments.value = JSON.parse(savedComments)
    }

    // Демо данные если нет сохраненных
    if (articles.value.length === 0) {
      articles.value = [
        {
          id: 1,
          title: 'MapChap v3.0: Новая эра бизнес-карт',
          excerpt: 'Представляем полностью переработанную платформу для бизнес-объявлений на карте с фокусом на пользовательский опыт и функциональность для бизнеса.',
          content: `# MapChap v3.0: Новая эра бизнес-карт

Мы рады представить вам MapChap v3.0 - полностью переработанную платформу для бизнес-объявлений на карте. В этой версии мы уделили особое внимание пользовательскому опыту и функциональности для бизнеса.

## 🚀 Основные нововведения

### Улучшенный интерфейс
- Современный дизайн с поддержкой темной темы
- Glass morphism эффекты
- Адаптивная верстка для всех устройств

### Функциональность для бизнеса
- Полноценная панель управления объявлениями
- Статистика просмотров и взаимодействий
- Управление несколькими филиалами

### Интеграция с Telegram
- Быстрая авторизация через Telegram Web App
- Уведомления о новых отзывах
- Чат с клиентами (в разработке)

## 📈 Что дальше?

В планах на ближайшие обновления:
- Система бронирования и записи
- Онлайн-оплаты через платформу
- Расширенная аналитика
- Мобильное приложение

Присоединяйтесь к нашему сообществу и делитесь обратной связью!`,
          author: {
            id: 1,
            name: 'Ахрор Хабибуллаев',
            avatar: '👨‍💼',
            role: 'founder'
          },
          category: 'news',
          tags: ['обновление', 'платформа', 'бизнес', 'дизайн'],
          image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800',
          views: 1245,
          likes: 89,
          commentsCount: 23,
          readTime: 5,
          isLiked: false,
          isPublished: true,
          createdAt: new Date('2024-01-15').toISOString(),
          updatedAt: new Date('2024-01-15').toISOString()
        }
      ]
    }

    if (comments.value.length === 0) {
      comments.value = [
        {
          id: 1,
          articleId: 1,
          author: {
            id: 3,
            name: 'Михаил Петров',
            avatar: '👨‍🍳'
          },
          content: 'Отличное обновление! Особенно понравился новый дизайн и улучшенная панель для бизнеса.',
          likes: 5,
          isLiked: false,
          createdAt: new Date('2024-01-16').toISOString()
        }
      ]
    }

    saveData()
  }

  const createArticle = async (articleData) => {
    try {
      isLoading.value = true
      
      const newArticle = {
        id: Date.now(),
        ...articleData,
        author: {
          id: authStore.user?.id || 0,
          name: authStore.user?.name || 'Пользователь',
          avatar: authStore.user?.avatar || '👤',
          role: 'user'
        },
        views: 0,
        likes: 0,
        commentsCount: 0,
        readTime: Math.ceil(articleData.content.length / 1200),
        isLiked: false,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      articles.value.unshift(newArticle)
      saveData()
      
      return newArticle
    } catch (error) {
      console.error('Create article error:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateArticle = async (articleId, articleData) => {
    try {
      isLoading.value = true
      
      const index = articles.value.findIndex(article => article.id === articleId)
      if (index !== -1) {
        articles.value[index] = {
          ...articles.value[index],
          ...articleData,
          updatedAt: new Date().toISOString()
        }
        saveData()
        return articles.value[index]
      }
      throw new Error('Article not found')
    } catch (error) {
      console.error('Update article error:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const deleteArticle = async (articleId) => {
    try {
      isLoading.value = true
      articles.value = articles.value.filter(article => article.id !== articleId)
      // Также удаляем комментарии к статье
      comments.value = comments.value.filter(comment => comment.articleId !== articleId)
      saveData()
    } catch (error) {
      console.error('Delete article error:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const incrementArticleViews = (articleId) => {
    const article = articles.value.find(article => article.id === articleId)
    if (article) {
      article.views++
      saveData()
    }
  }

  const toggleArticleLike = (articleId) => {
    const article = articles.value.find(article => article.id === articleId)
    if (article) {
      article.likes += article.isLiked ? -1 : 1
      article.isLiked = !article.isLiked
      saveData()
    }
  }

  const addComment = async (articleId, content) => {
    try {
      const newComment = {
        id: Date.now(),
        articleId: parseInt(articleId),
        author: {
          id: authStore.user?.id || 0,
          name: authStore.user?.name || 'Пользователь',
          avatar: authStore.user?.avatar || '👤'
        },
        content,
        likes: 0,
        isLiked: false,
        createdAt: new Date().toISOString()
      }
      
      comments.value.unshift(newComment)
      
      // Обновляем счетчик комментариев в статье
      const article = articles.value.find(article => article.id === parseInt(articleId))
      if (article) {
        article.commentsCount++
        saveData()
      }
      
      return newComment
    } catch (error) {
      console.error('Add comment error:', error)
      throw error
    }
  }

  const toggleCommentLike = (commentId) => {
    const comment = comments.value.find(comment => comment.id === commentId)
    if (comment) {
      comment.likes += comment.isLiked ? -1 : 1
      comment.isLiked = !comment.isLiked
      saveData()
    }
  }

  // Helpers
  const saveData = () => {
    localStorage.setItem('mapchap-articles', JSON.stringify(articles.value))
    localStorage.setItem('mapchap-comments', JSON.stringify(comments.value))
  }

  // Инициализация
  loadInitialData()

  return {
    // State
    articles,
    comments,
    isLoading,
    categories,
    
    // Computed
    getArticles,
    getDeveloperArticles,
    getUserArticles,
    getArticleById,
    getCommentsByArticleId,
    
    // Actions
    createArticle,
    updateArticle,
    deleteArticle,
    incrementArticleViews,
    toggleArticleLike,
    addComment,
    toggleCommentLike
  }
})
