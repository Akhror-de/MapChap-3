import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './authStore'

export const useBlogStore = defineStore('blog', () => {
  const articles = ref([])
  const comments = ref([])
  const authStore = useAuthStore()

  // Загрузка данных
  const loadData = () => {
    const savedArticles = localStorage.getItem('blog_articles')
    const savedComments = localStorage.getItem('blog_comments')
    
    if (savedArticles) {
      articles.value = JSON.parse(savedArticles)
    }
    if (savedComments) {
      comments.value = JSON.parse(savedComments)
    }
  }

  // Сохранение данных
  const saveData = () => {
    localStorage.setItem('blog_articles', JSON.stringify(articles.value))
    localStorage.setItem('blog_comments', JSON.stringify(comments.value))
  }

  // Инициализация демо-данных
  const initDemoData = () => {
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
        },
        {
          id: 2,
          title: 'Как эффективно продвигать бизнес на картах',
          excerpt: 'Практическое руководство по привлечению клиентов через картографические сервисы и увеличения видимости вашего бизнеса.',
          content: `# Как эффективно продвигать бизнес на картах

Картографические сервисы стали мощным инструментом для привлечения клиентов. В этой статье мы расскажем, как максимально эффективно использовать MapChap для продвижения вашего бизнеса.

## 📍 Оптимизация профиля бизнеса

### Полное заполнение информации
- Добавьте качественные фотографии
- Укажите точные часы работы
- Заполните все доступные поля

### Ключевые слова и категории
- Используйте релевантные категории
- Добавьте ключевые слова в описание
- Укажите специфические услуги

## 🎯 Привлечение клиентов

### Акции и специальные предложения
- Создавайте временные акции
- Предлагайте бонусы новым клиентам
- Используйте сезонные предложения

### Отзывы и рейтинги
- Поощряйте клиентов оставлять отзывы
- Быстро реагируйте на обратную связь
- Используйте отзывы для улучшения сервиса

## 📊 Анализ эффективности

Отслеживайте статистику просмотров и используйте эти данные для оптимизации вашей стратегии продвижения.`,
          author: {
            id: 2,
            name: 'Яна Ивченко',
            avatar: '👩‍💼',
            role: 'finance_director'
          },
          category: 'marketing',
          tags: ['маркетинг', 'продвижение', 'советы', 'бизнес'],
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
          views: 876,
          likes: 67,
          commentsCount: 15,
          readTime: 4,
          isLiked: false,
          isPublished: true,
          createdAt: new Date('2024-01-10').toISOString(),
          updatedAt: new Date('2024-01-10').toISOString()
        }
      ]
      
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
        },
        {
          id: 2,
          articleId: 1,
          author: {
            id: 4,
            name: 'Анна Смирнова',
            avatar: '👩'
          },
          content: 'Жду мобильное приложение! Будет очень удобно управлять объявлениями с телефона.',
          likes: 3,
          isLiked: false,
          createdAt: new Date('2024-01-16').toISOString()
        }
      ]
      
      saveData()
    }
  }

  // Методы для статей
  const getArticles = computed(() => {
    return articles.value.filter(article => article.isPublished)
  })

  const getDeveloperArticles = computed(() => {
    return getArticles.value.filter(article => article.author.role !== 'user')
  })

  const getUserArticles = computed(() => {
    return getArticles.value.filter(article => article.author.role === 'user')
  })

  const getArticleById = (articleId) => {
    return articles.value.find(article => article.id === parseInt(articleId))
  }

  const createArticle = (articleData) => {
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

  // Методы для комментариев
  const getCommentsByArticleId = computed(() => (articleId) => {
    return comments.value.filter(comment => comment.articleId === parseInt(articleId))
  })

  const addComment = (articleId, content) => {
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
  }

  const toggleCommentLike = (commentId) => {
    const comment = comments.value.find(comment => comment.id === commentId)
    if (comment) {
      comment.likes += comment.isLiked ? -1 : 1
      comment.isLiked = !comment.isLiked
      saveData()
    }
  }

  // Инициализация
  loadData()
  if (articles.value.length === 0) {
    initDemoData()
  }

  return {
    // State
    articles,
    comments,
    
    // Computed
    getArticles,
    getDeveloperArticles,
    getUserArticles,
    getCommentsByArticleId,
    
    // Actions
    getArticleById,
    createArticle,
    incrementArticleViews,
    toggleArticleLike,
    addComment,
    toggleCommentLike
  }
})
