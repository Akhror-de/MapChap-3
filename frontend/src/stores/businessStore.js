import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useBusinessStore = defineStore('business', () => {
  const offers = ref([])
  const categories = ref([
    { id: 'food', name: '🍕 Еда и рестораны', icon: '🍕', color: '#FF6B6B' },
    { id: 'shopping', name: '🛍️ Покупки', icon: '🛍️', color: '#4ECDC4' },
    { id: 'beauty', name: '💄 Салоны красоты', icon: '💄', color: '#FFD93D' },
    { id: 'services', name: '🔧 Услуги', icon: '🔧', color: '#6BCF7F' },
    { id: 'medical', name: '⚕️ Медицина', icon: '⚕️', color: '#4D96FF' },
    { id: 'furniture', name: '🛋️ Мебель', icon: '🛋️', color: '#9B5DE5' },
    { id: 'pharmacy', name: '💊 Аптеки', icon: '💊', color: '#F15BB5' },
    { id: 'education', name: '🎓 Образование', icon: '🎓', color: '#00BBF9' },
    { id: 'entertainment', name: '🎭 Развлечения', icon: '🎭', color: '#FB5607' },
    { id: 'sports', name: '⚽ Спорт', icon: '⚽', color: '#8338EC' }
  ])

  // Загрузка данных из localStorage
  const loadOffers = () => {
    const saved = localStorage.getItem('business_offers')
    if (saved) {
      offers.value = JSON.parse(saved)
    }
  }

  // Сохранение данных в localStorage
  const saveOffers = () => {
    localStorage.setItem('business_offers', JSON.stringify(offers.value))
  }

  // Инициализация демо-данных
  const initDemoData = () => {
    if (offers.value.length === 0) {
      offers.value = [
        {
          id: 1,
          title: 'Кофейня "Уютный уголок"',
          category: 'food',
          description: 'Лучший кофе в городе, свежая выпечка и уютная атмосфера. Работаем с 2018 года.',
          address: 'г. Москва, ул. Арбат, 25',
          phone: '+7 (999) 123-45-67',
          email: 'coffee@example.com',
          website: 'https://coffee.example.com',
          coords: [55.751244, 37.618423],
          priceLevel: 'medium',
          hours: '08:00-23:00',
          images: [],
          status: 'active',
          views: 156,
          likes: 23,
          rating: 4.5,
          features: ['wi-fi', 'takeaway', 'breakfast'],
          createdAt: new Date('2024-01-15').toISOString(),
          updatedAt: new Date('2024-01-15').toISOString()
        },
        {
          id: 2,
          title: 'Салон красоты "Элегант"',
          category: 'beauty',
          description: 'Полный спектр парикмахерских услуг, маникюр, педикюр, визаж. Профессиональные мастера.',
          address: 'г. Москва, пр. Мира, 42',
          phone: '+7 (999) 765-43-21',
          email: 'elegant@example.com',
          website: '',
          coords: [55.781244, 37.628423],
          priceLevel: 'premium',
          hours: '10:00-20:00',
          images: [],
          status: 'active',
          views: 89,
          likes: 15,
          rating: 4.8,
          features: ['parking', 'online_booking'],
          createdAt: new Date('2024-01-10').toISOString(),
          updatedAt: new Date('2024-01-10').toISOString()
        }
      ]
      saveOffers()
    }
  }

  // Методы для работы с объявлениями
  const createOffer = (offerData) => {
    const newOffer = {
      id: Date.now(),
      ...offerData,
      status: 'active',
      views: 0,
      likes: 0,
      rating: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    offers.value.unshift(newOffer)
    saveOffers()
    return newOffer
  }

  const updateOffer = (offerId, offerData) => {
    const index = offers.value.findIndex(offer => offer.id === offerId)
    if (index !== -1) {
      offers.value[index] = {
        ...offers.value[index],
        ...offerData,
        updatedAt: new Date().toISOString()
      }
      saveOffers()
      return offers.value[index]
    }
    return null
  }

  const deleteOffer = (offerId) => {
    offers.value = offers.value.filter(offer => offer.id !== offerId)
    saveOffers()
  }

  const toggleOfferStatus = (offerId) => {
    const offer = offers.value.find(offer => offer.id === offerId)
    if (offer) {
      offer.status = offer.status === 'active' ? 'paused' : 'active'
      offer.updatedAt = new Date().toISOString()
      saveOffers()
    }
  }

  const incrementViews = (offerId) => {
    const offer = offers.value.find(offer => offer.id === offerId)
    if (offer) {
      offer.views++
      saveOffers()
    }
  }

  const toggleLike = (offerId) => {
    const offer = offers.value.find(offer => offer.id === offerId)
    if (offer) {
      offer.likes += offer.isLiked ? -1 : 1
      offer.isLiked = !offer.isLiked
      saveOffers()
    }
  }

  const getCategoryById = (categoryId) => {
    return categories.value.find(cat => cat.id === categoryId) || categories.value[0]
  }

  const getUserOffers = computed(() => {
    // В реальном приложении здесь будет фильтрация по пользователю
    return offers.value
  })

  const getActiveOffers = computed(() => {
    return offers.value.filter(offer => offer.status === 'active')
  })

  // Статистика
  const getBusinessStats = computed(() => {
    const userOffers = getUserOffers.value
    const totalViews = userOffers.reduce((sum, offer) => sum + offer.views, 0)
    const totalLikes = userOffers.reduce((sum, offer) => sum + offer.likes, 0)
    const activeOffers = userOffers.filter(offer => offer.status === 'active').length
    
    const categoryStats = {}
    userOffers.forEach(offer => {
      if (!categoryStats[offer.category]) {
        categoryStats[offer.category] = 0
      }
      categoryStats[offer.category] += offer.views
    })

    return {
      totalViews,
      totalLikes,
      activeOffers,
      totalOffers: userOffers.length,
      categoryStats
    }
  })

  // Инициализация
  loadOffers()
  if (offers.value.length === 0) {
    initDemoData()
  }

  return {
    offers,
    categories,
    getUserOffers,
    getActiveOffers,
    getBusinessStats,
    createOffer,
    updateOffer,
    deleteOffer,
    toggleOfferStatus,
    incrementViews,
    toggleLike,
    getCategoryById
  }
})
