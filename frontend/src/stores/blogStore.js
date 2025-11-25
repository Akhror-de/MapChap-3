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
    { id: 'business', name: '💼 Бизнес-советы', icon: '💼', color: '#3B82F6' },
    { id: 'success', name: '🚀 Истории успеха', icon: '🚀', color: '#10B981' },
    { id: 'marketing', name: '📈 Маркетинг', icon: '📈', color: '#F59E0B' },
    { id: 'technology', name: '🤖 Технологии', icon: '🤖', color: '#8B5CF6' },
    { id: 'news', name: '📢 Новости платформы', icon: '📢', color: '#EF4444' },
    { id: 'review', name: '⭐ Обзоры', icon: '⭐', color: '#F97316' },
    { id: 'other', name: '🔮 Другое', icon: '🔮', color: '#6B7280' }
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

  const getFeaturedArticles = computed(() => {
    return getArticles.value.filter(article => article.isFeatured)
  })

  const getPopularArticles = computed(() => {
    return [...getArticles.value]
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
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
            role: 'founder',
            bio: 'Основатель платформы MapChap. Увлечен созданием продуктов, которые делают жизнь предпринимателей проще.'
          },
          category: 'news',
          tags: ['обновление', 'платформа', 'бизнес', 'дизайн'],
          image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800',
          views: 1245,
          likes: 89,
          commentsCount: 23,
          readTime: 5,
          isLiked: false,
          isBookmarked: false,
          isFeatured: true,
          isPublished: true,
          createdAt: new Date('2024-01-15').toISOString(),
          updatedAt: new Date('2024-01-15').toISOString()
        },
        {
          id: 2,
          title: 'Как привлечь первых клиентов: 5 работающих стратегий',
          excerpt: 'Практические советы по привлечению клиентов для малого бизнеса без большого бюджета на рекламу.',
          content: `# Как привлечь первых клиентов: 5 работающих стратегий

Привлечение первых клиентов - одна из самых сложных задач для начинающего предпринимателя. Вот проверенные стратегии, которые работают даже с минимальным бюджетом.

## 1. Используйте силу локального маркетинга

### Что делать:
- Разместите свое заведение на MapChap
- Участвуйте в местных мероприятиях
- Сотрудничайте с другими местными бизнесами

### Результат:
+30% к узнаваемости в вашем районе

## 2. Создайте уникальное торговое предложение

Ваше УТП должно отвечать на вопрос: "Почему клиенты должны выбрать именно вас?"

Примеры успешных УТП:
- "Самая быстрая доставка в городе - 15 минут или бесплатно"
- "Кофе с индивидуальным профилем для каждого клиента"
- "Бесплатная диагностика перед любым ремонтом"

## 3. Работайте с отзывами

Отзывы - это социальное доказательство, которое работает лучше любой рекламы.

Как получать отзывы:
- Предлагайте небольшие бонусы за отзывы
- Создайте простую систему оставления отзывов
- Отвечайте на все отзывы, даже негативные

## 4. Используйте социальные сети

Не пытайтесь быть везде сразу. Выберите 1-2 платформы, где ваша целевая аудитория проводит больше всего времени.

Контент-план для начала:
- Понедельник: Полезный совет
- Среда: Закулисье бизнеса
- Пятница: Акция недели

## 5. Создайте систему рекомендаций

Лучшие клиенты приходят по рекомендациям.

Как стимулировать рекомендации:
- Программа лояльности для постоянных клиентов
- Реферальные бонусы
- Партнерские программы

## Заключение

Начните с 1-2 стратегий и постепенно масштабируйтесь. Помните: последовательность важнее скорости.`,
          author: {
            id: 2,
            name: 'Яна Ивченко',
            avatar: '👩‍💼',
            role: 'finance_director',
            bio: 'Финансовый директор MapChap. Помогаю бизнесу увеличивать прибыль через эффективные маркетинговые стратегии.'
          },
          category: 'marketing',
          tags: ['маркетинг', 'клиенты', 'стартап', 'советы'],
          image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
          views: 892,
          likes: 67,
          commentsCount: 15,
          readTime: 7,
          isLiked: false,
          isBookmarked: false,
          isFeatured: true,
          isPublished: true,
          createdAt: new Date('2024-01-10').toISOString(),
          updatedAt: new Date('2024-01-10').toISOString()
        },
        {
          id: 3,
          title: 'Мой путь от домашней кофейни до сети из 5 заведений',
          excerpt: 'Личная история предпринимателя о том, как любовь к кофе превратилась в успешный бизнес.',
          content: `# Мой путь от домашней кофейни до сети из 5 заведений

## Начало: кухня и мечта

Все началось 5 лет назад на маленькой кухне моей квартиры. У меня была обычная кофеварка и огромное желание делиться с людьми тем, что я действительно люблю - качественным кофе.

### Первые шаги:
- Закупка зерен у местных обжарщиков
- Постепенное изучение тонкостей приготовления
- Первые клиенты - друзья и знакомые

## Первое помещение: 25 квадратов надежды

Через год я накопил enough денег, чтобы арендовать маленькое помещение в центре города. 25 квадратных метров, которые стали моим первым кофейным пространством.

### Что помогло выжить:
- **Качество превыше всего** - никогда не экономил на зернах
- **Персонализированный подход** - запоминал предпочтения постоянных клиентов
- **Честность** - если что-то шло не так, признавал ошибки

## Расширение: уроки первых филиалов

Открытие второго заведения стало самым сложным испытанием. Пришлось учиться делегировать и строить процессы.

### Ключевые ошибки:
1. **Слишком быстрый рост** - не успевал контролировать качество
2. **Неправильный подбор персонала** - нанимал по симпатии, а не по компетенциям
3. **Отсутствие стандартов** - каждый бариста готовил по-своему

### Что сработало:
- Внедрение четких стандартов приготовления
- Система обучения новых сотрудников
- Единая система закупок и учета

## MapChap - поворотный момент

Когда я добавил свои кофейни на MapChap, произошло чудо. За первый месяц:
- 📈 +40% новых клиентов
- 💬 +25 отзывов
- 🎯 Увеличилась узнаваемость бренда

Платформа помогла мне не просто показать местоположение, а рассказать историю каждого заведения.

## Советы начинающим

1. **Начинайте с малого** - не пытайтесь сразу открыть сеть
2. **Слушайте клиентов** - они лучшие советчики
3. **Используйте технологии** - такие как MapChap
4. **Не бойтесь ошибок** - они лучшие учителя
5. **Любите свое дело** - без этого никакой успех не будет в радость

## Взгляд в будущее

Сейчас у меня 5 кофеен и планы на расширение. Но самое главное - я до сих пор люблю то, что делаю, и каждый день нахожу в этом вдохновение.`,
          author: {
            id: 3,
            name: 'Михаил Петров',
            avatar: '👨‍🍳',
            role: 'user',
            bio: 'Владелец сети кофеен "Кофейная география". Верю, что хороший кофе может изменить день к лучшему.'
          },
          category: 'success',
          tags: ['кофе', 'история успеха', 'рестораны', 'предпринимательство'],
          image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800',
          views: 1567,
          likes: 124,
          commentsCount: 28,
          readTime: 8,
          isLiked: false,
          isBookmarked: false,
          isFeatured: false,
          isPublished: true,
          createdAt: new Date('2024-01-05').toISOString(),
          updatedAt: new Date('2024-01-05').toISOString()
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
          content: 'Отличное обновление! Особенно понравился новый дизайн и улучшенная панель для бизнеса. Жду не дождусь, когда появится система бронирования.',
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
            avatar: '👩‍💻'
          },
          content: 'Очень рада обновлению! Удобно, что теперь можно управлять несколькими филиалами в одном аккаунте.',
          likes: 3,
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
          role: authStore.user?.role || 'user',
          bio: authStore.user?.bio || ''
        },
        views: 0,
        likes: 0,
        commentsCount: 0,
        readTime: Math.ceil(articleData.content.length / 1200),
        isLiked: false,
        isBookmarked: false,
        isFeatured: false,
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

  const toggleArticleBookmark = (articleId) => {
    const article = articles.value.find(article => article.id === articleId)
    if (article) {
      article.isBookmarked = !article.isBookmarked
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

  const getArticlesByCategory = (categoryId) => {
    return getArticles.value.filter(article => article.category === categoryId)
  }

  const getArticlesByAuthor = (authorId) => {
    return getArticles.value.filter(article => article.author.id === authorId)
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
    getFeaturedArticles,
    getPopularArticles,
    getArticleById,
    getCommentsByArticleId,
    
    // Actions
    createArticle,
    updateArticle,
    deleteArticle,
    incrementArticleViews,
    toggleArticleLike,
    toggleArticleBookmark,
    addComment,
    toggleCommentLike,
    getArticlesByCategory,
    getArticlesByAuthor
  }
})
