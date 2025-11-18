import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useOffersStore = defineStore('offers', () => {
  // State
  const offers = ref([])
  const selectedCategory = ref('all')
  const userLocation = ref(null)
  const isLoading = ref(false)
  const mapCenter = ref([55.7558, 37.6173])
  const mapZoom = ref(10)
  const selectedOffer = ref(null)
  const searchQuery = ref('')
  const isMapLoading = ref(false)

  // Getters
  const filteredOffers = computed(() => {
    let filtered = offers.value

    if (selectedCategory.value !== 'all') {
      filtered = filtered.filter(offer => offer.category === selectedCategory.value)
    }

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(offer => 
        offer.title.toLowerCase().includes(query) ||
        offer.description.toLowerCase().includes(query) ||
        offer.address.toLowerCase().includes(query)
      )
    }

    return filtered
  })

  const categories = computed(() => [
    { id: 'all', name: 'Все категории', icon: '🗺️', color: '#667eea' },
    { id: 'food', name: '🍕 Еда и рестораны', icon: '🍕', color: '#FF6B6B' },
    { id: 'shopping', name: '🛍️ Покупки', icon: '🛍️', color: '#4ECDC4' },
    { id: 'beauty', name: '💄 Салоны красоты', icon: '💄', color: '#FFD166' },
    { id: 'services', name: '🔧 Услуги', icon: '🔧', color: '#06D6A0' },
    { id: 'medical', name: '⚕️ Медицина', icon: '⚕️', color: '#118AB2' },
    { id: 'furniture', name: '🛋️ Мебель', icon: '🛋️', color: '#073B4C' },
    { id: 'pharmacy', name: '💊 Аптеки', icon: '💊', color: '#EF476F' }
  ])

  const selectedCategoryInfo = computed(() => {
    return categories.value.find(cat => cat.id === selectedCategory.value) || categories.value[0]
  })

  // Actions
  const setSelectedCategory = (category) => {
    selectedCategory.value = category
  }

  const setUserLocation = (location) => {
    userLocation.value = location
    if (location) {
      mapCenter.value = [location.lat, location.lng]
      mapZoom.value = 14
    }
  }

  const setMapCenter = (center) => {
    mapCenter.value = center
  }

  const setMapZoom = (zoom) => {
    mapZoom.value = zoom
  }

  const setSelectedOffer = (offer) => {
    selectedOffer.value = offer
    if (offer && offer.coordinates) {
      mapCenter.value = offer.coordinates
      mapZoom.value = 15
    }
  }

  const setSearchQuery = (query) => {
    searchQuery.value = query
  }

  const addOffer = async (offer) => {
    try {
      const newOffer = {
        id: Date.now(),
        ...offer,
        createdAt: new Date().toISOString(),
        rating: 0,
        reviews: 0
      }
      offers.value.push(newOffer)
      return newOffer
    } catch (error) {
      console.error('Ошибка добавления предложения:', error)
      throw error
    }
  }

  const fetchOffers = async () => {
    isLoading.value = true
    try {
      // TODO: Заменить на реальный API вызов
      const mockOffers = [
        {
          id: 1,
          title: "Кофейня 'Уют'",
          category: "food",
          coordinates: [55.7558, 37.6176],
          address: "ул. Тверская, 1",
          description: "Лучший кофе в городе с домашней атмосферой",
          phone: "+7 (999) 821-47-58",
          workingHours: "09:00-22:00",
          rating: 4.8,
          reviews: 124,
          image: "https://via.placeholder.com/300x200/FF6B6B/white?text=Кофейня+Уют"
        },
        {
          id: 2,
          title: "Магазин электроники 'ТехноМир'",
          category: "shopping",
          coordinates: [55.7517, 37.6178],
          address: "ул. Арбат, 15",
          description: "Широкий выбор техники и гаджетов",
          phone: "+7 (999) 821-47-58",
          workingHours: "10:00-21:00",
          rating: 4.5,
          reviews: 89,
          image: "https://via.placeholder.com/300x200/4ECDC4/white?text=ТехноМир"
        },
        {
          id: 3,
          title: "Салон красоты 'Элегант'",
          category: "beauty",
          coordinates: [55.7597, 37.6172],
          address: "ул. Петровка, 25",
          description: "Профессиональные услуги красоты",
          phone: "+7 (999) 821-47-58",
          workingHours: "09:00-20:00",
          rating: 4.9,
          reviews: 67,
          image: "https://via.placeholder.com/300x200/FFD166/white?text=Элегант"
        }
      ]
      offers.value = mockOffers
    } catch (error) {
      console.error('Ошибка загрузки предложений:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const searchByAddress = async (address) => {
    isMapLoading.value = true
    try {
      // TODO: Реализовать поиск через Яндекс.Карты API
      console.log('Поиск адреса:', address)
      const randomOffset = () => (Math.random() - 0.5) * 0.02
      mapCenter.value = [
        mapCenter.value[0] + randomOffset(),
        mapCenter.value[1] + randomOffset()
      ]
    } catch (error) {
      console.error('Ошибка поиска адреса:', error)
      throw error
    } finally {
      isMapLoading.value = false
    }
  }

  return {
    // State
    offers,
    selectedCategory,
    userLocation,
    isLoading,
    mapCenter,
    mapZoom,
    selectedOffer,
    searchQuery,
    isMapLoading,
    
    // Getters
    filteredOffers,
    categories,
    selectedCategoryInfo,
    
    // Actions
    setSelectedCategory,
    setUserLocation,
    setMapCenter,
    setMapZoom,
    setSelectedOffer,
    setSearchQuery,
    addOffer,
    fetchOffers,
    searchByAddress
  }
})
