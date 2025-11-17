import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useOffersStore = defineStore('offers', () => {
  // State
  const offers = ref([])
  const selectedCategory = ref('all')
  const userLocation = ref(null)
  const isLoading = ref(false)

  // Getters
  const filteredOffers = computed(() => {
    if (selectedCategory.value === 'all') return offers.value
    return offers.value.filter(offer => offer.category === selectedCategory.value)
  })

  const categories = computed(() => [
    { id: 'all', name: 'Все категории', icon: '🗺️' },
    { id: 'food', name: '🍕 Еда и рестораны', icon: '🍕' },
    { id: 'shopping', name: '🛍️ Покупки', icon: '🛍️' },
    { id: 'beauty', name: '💄 Салоны красоты', icon: '💄' },
    { id: 'services', name: '🔧 Услуги', icon: '🔧' },
    { id: 'medical', name: '⚕️ Медицина', icon: '⚕️' },
    { id: 'furniture', name: '🛋️ Мебель', icon: '🛋️' },
    { id: 'pharmacy', name: '💊 Аптеки', icon: '💊' }
  ])

  // Actions
  const setSelectedCategory = (category) => {
    selectedCategory.value = category
  }

  const setUserLocation = (location) => {
    userLocation.value = location
  }

  const addOffer = (offer) => {
    offers.value.push({
      id: Date.now(),
      ...offer,
      createdAt: new Date().toISOString()
    })
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
          coordinates: [55.7558, 37.6173],
          address: "ул. Примерная, 1",
          description: "Лучший кофе в городе",
          phone: "+7 (999) 123-45-67",
          workingHours: "09:00-22:00"
        }
      ]
      offers.value = mockOffers
    } catch (error) {
      console.error('Ошибка загрузки предложений:', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    offers,
    selectedCategory,
    userLocation,
    isLoading,
    
    // Getters
    filteredOffers,
    categories,
    
    // Actions
    setSelectedCategory,
    setUserLocation,
    addOffer,
    fetchOffers
  }
})
