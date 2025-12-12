import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiService } from '../services/api.js'

export const useOffersStore = defineStore('offers', () => {
  // State
  const offers = ref([])
  const selectedCategory = ref('all')
  const searchQuery = ref('')
  const userLocation = ref(null)
  const mapBounds = ref(null)
  const selectedOffer = ref(null)
  const isLoading = ref(false)

  // Categories
  const categories = ref([
    { id: 'food', name: 'Еда и рестораны', icon: '🍕', color: '#FF6B6B' },
    { id: 'shopping', name: 'Магазины', icon: '🛍️', color: '#4ECDC4' },
    { id: 'beauty', name: 'Салоны красоты', icon: '💄', color: '#FFD166' },
    { id: 'services', name: 'Услуги', icon: '🔧', color: '#06D6A0' },
    { id: 'medical', name: 'Медицина', icon: '⚕️', color: '#118AB2' },
    { id: 'furniture', name: 'Мебель и декор', icon: '🛋️', color: '#073B4C' },
    { id: 'pharmacy', name: 'Аптеки', icon: '💊', color: '#EF476F' },
    { id: 'entertainment', name: 'Развлечения', icon: '🎭', color: '#7209B7' },
    { id: 'education', name: 'Образование', icon: '📚', color: '#F72585' },
    { id: 'auto', name: 'Автосервисы', icon: '🚗', color: '#4361EE' },
    { id: 'hotel', name: 'Отели', icon: '🏨', color: '#4CC9F0' }
  ])

  // Computed
  const filteredOffers = computed(() => {
    let result = offers.value
    
    if (selectedCategory.value && selectedCategory.value !== 'all') {
      result = result.filter(o => o.category === selectedCategory.value)
    }
    
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(o => 
        o.title?.toLowerCase().includes(query) ||
        o.description?.toLowerCase().includes(query) ||
        o.address?.toLowerCase().includes(query)
      )
    }
    
    return result
  })

  // Actions
  const fetchOffers = async (params = {}) => {
    isLoading.value = true
    try {
      const result = await apiService.getOffers(params)
      offers.value = result.offers || []
      console.log(`📍 Loaded ${offers.value.length} offers`)
    } catch (error) {
      console.log('Fetch offers error:', error)
      // Заглушка с демо-данными
      offers.value = [
        {
          id: '1',
          title: 'Кофейня "Уютный уголок"',
          description: 'Лучший кофе в городе и свежая выпечка',
          category: 'food',
          address: 'ул. Примерная, 123',
          phone: '+7 (999) 123-45-67',
          coordinates: { type: 'Point', coordinates: [37.618423, 55.751244] },
          views: 1245,
          likes: 89,
          rating: 4.8,
          status: 'active'
        },
        {
          id: '2',
          title: 'Салон красоты "Прима"',
          description: 'Профессиональный уход за вашей красотой',
          category: 'beauty',
          address: 'пр. Мира, 45',
          phone: '+7 (999) 234-56-78',
          coordinates: { type: 'Point', coordinates: [37.628423, 55.761244] },
          views: 856,
          likes: 67,
          rating: 4.6,
          status: 'active'
        },
        {
          id: '3',
          title: 'Автосервис "Мастер"',
          description: 'Качественный ремонт автомобилей любых марок',
          category: 'auto',
          address: 'ул. Гаражная, 12',
          phone: '+7 (999) 345-67-89',
          coordinates: { type: 'Point', coordinates: [37.608423, 55.741244] },
          views: 543,
          likes: 45,
          rating: 4.9,
          status: 'active'
        }
      ]
    } finally {
      isLoading.value = false
    }
  }

  const setSelectedCategory = (category) => {
    selectedCategory.value = category
    console.log(`🏷️ Category selected: ${category}`)
  }

  const setSearchQuery = (query) => {
    searchQuery.value = query
  }

  const searchByAddress = (address) => {
    console.log(`🔍 Searching: ${address}`)
    // TODO: Implement geocoding search
  }

  const setUserLocation = (location) => {
    userLocation.value = location
    console.log('📍 User location updated')
  }

  const setMapBounds = (bounds) => {
    mapBounds.value = bounds
  }

  const setSelectedOffer = (offer) => {
    selectedOffer.value = offer
  }

  return {
    offers,
    selectedCategory,
    searchQuery,
    userLocation,
    mapBounds,
    selectedOffer,
    isLoading,
    categories,
    filteredOffers,
    fetchOffers,
    setSelectedCategory,
    setSearchQuery,
    searchByAddress,
    setUserLocation,
    setMapBounds,
    setSelectedOffer
  }
})
