import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './authStore'
import { apiService } from '../services/api'

export const useBusinessStore = defineStore('business', () => {
  const authStore = useAuthStore()
  
  // State
  const offers = ref([])
  const categories = ref([])
  const isLoading = ref(false)
  const stats = ref({
    totalOffers: 0,
    activeOffers: 0,
    totalViews: 0,
    totalLikes: 0,
    categoryStats: {}
  })

  // Computed
  const getUserOffers = computed(() => {
    if (!authStore.isAuthenticated) return []
    return offers.value.filter(offer => offer.userId === authStore.user.id)
  })

  const getBusinessStats = computed(() => {
    const userOffers = getUserOffers.value
    const categoryStats = {}
    
    userOffers.forEach(offer => {
      categoryStats[offer.category] = (categoryStats[offer.category] || 0) + offer.views
    })

    return {
      totalOffers: userOffers.length,
      activeOffers: userOffers.filter(o => o.status === 'active').length,
      totalViews: userOffers.reduce((sum, offer) => sum + offer.views, 0),
      totalLikes: userOffers.reduce((sum, offer) => sum + offer.likes, 0),
      categoryStats
    }
  })

  const getActiveOffers = computed(() => {
    return offers.value.filter(offer => offer.status === 'active')
  })

  // Actions
  const loadInitialData = () => {
    // Загрузка категорий
    categories.value = [
      { id: 'food', name: '🍕 Рестораны и кафе', icon: '🍕', color: '#FF6B6B' },
      { id: 'shopping', name: '🛍️ Магазины', icon: '🛍️', color: '#4ECDC4' },
      { id: 'beauty', name: '💄 Красота и здоровье', icon: '💄', color: '#FFD166' },
      { id: 'services', name: '🔧 Услуги', icon: '🔧', color: '#06D6A0' },
      { id: 'medical', name: '⚕️ Медицина', icon: '⚕️', color: '#118AB2' },
      { id: 'furniture', name: '🛋️ Мебель и декор', icon: '🛋️', color: '#073B4C' },
      { id: 'pharmacy', name: '💊 Аптеки', icon: '💊', color: '#EF476F' },
      { id: 'entertainment', name: '🎭 Развлечения', icon: '🎭', color: '#7209B7' },
      { id: 'education', name: '📚 Образование', icon: '📚', color: '#F72585' },
      { id: 'auto', name: '🚗 Автосервисы', icon: '🚗', color: '#4361EE' }
    ]

    // Загрузка демо-предложений
    const savedOffers = localStorage.getItem('mapchap-offers')
    if (savedOffers) {
      offers.value = JSON.parse(savedOffers)
    } else {
      // Демо данные
      offers.value = [
        {
          id: 1,
          userId: 1,
          title: 'Кофейня "Уютный уголок"',
          category: 'food',
          description: 'Лучший кофе в городе, свежая выпечка, уютная атмосфера. Работаем с 2018 года.',
          address: 'ул. Примерная, 123',
          phone: '+7 (999) 123-45-67',
          email: 'coffee@example.com',
          website: 'https://coffee-example.com',
          priceLevel: 'medium',
          hours: '8:00-23:00',
          features: ['wi-fi', 'takeaway', 'outdoor'],
          coordinates: [55.751244, 37.618423],
          status: 'active',
          views: 1245,
          likes: 89,
          rating: 4.8,
          reviews: 34,
          images: ['https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400'],
          createdAt: new Date('2024-01-15').toISOString(),
          updatedAt: new Date('2024-01-15').toISOString()
        }
      ]
      saveOffers()
    }
  }

  const createOffer = async (offerData) => {
    try {
      isLoading.value = true
      
      const newOffer = {
        id: Date.now(),
        userId: authStore.user.id,
        ...offerData,
        coordinates: [55.751244, 37.618423], // В реальном приложении геокодирование
        status: 'active',
        views: 0,
        likes: 0,
        rating: 0,
        reviews: 0,
        images: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      offers.value.unshift(newOffer)
      saveOffers()
      
      return newOffer
    } catch (error) {
      console.error('Create offer error:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateOffer = async (offerId, offerData) => {
    try {
      isLoading.value = true
      
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
      throw new Error('Offer not found')
    } catch (error) {
      console.error('Update offer error:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const deleteOffer = async (offerId) => {
    try {
      isLoading.value = true
      offers.value = offers.value.filter(offer => offer.id !== offerId)
      saveOffers()
    } catch (error) {
      console.error('Delete offer error:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const toggleOfferStatus = async (offerId) => {
    try {
      const offer = offers.value.find(offer => offer.id === offerId)
      if (offer) {
        offer.status = offer.status === 'active' ? 'paused' : 'active'
        offer.updatedAt = new Date().toISOString()
        saveOffers()
      }
    } catch (error) {
      console.error('Toggle offer status error:', error)
      throw error
    }
  }

  const incrementOfferViews = (offerId) => {
    const offer = offers.value.find(offer => offer.id === offerId)
    if (offer) {
      offer.views++
      saveOffers()
    }
  }

  const toggleOfferLike = (offerId) => {
    const offer = offers.value.find(offer => offer.id === offerId)
    if (offer) {
      offer.likes += offer.isLiked ? -1 : 1
      offer.isLiked = !offer.isLiked
      saveOffers()
    }
  }

  const getCategoryById = (categoryId) => {
    return categories.value.find(cat => cat.id === categoryId)
  }

  // Helpers
  const saveOffers = () => {
    localStorage.setItem('mapchap-offers', JSON.stringify(offers.value))
  }

  // Инициализация
  loadInitialData()

  return {
    // State
    offers,
    categories,
    isLoading,
    stats,
    
    // Computed
    getUserOffers,
    getBusinessStats,
    getActiveOffers,
    
    // Actions
    createOffer,
    updateOffer,
    deleteOffer,
    toggleOfferStatus,
    incrementOfferViews,
    toggleOfferLike,
    getCategoryById
  }
})
