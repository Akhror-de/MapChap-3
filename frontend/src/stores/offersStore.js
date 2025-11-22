import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useOffersStore = defineStore('offers', () => {
  // State
  const offers = ref([])
  const selectedCategory = ref('all')
  const searchQuery = ref('')
  const selectedOffer = ref(null)
  const isLoading = ref(false)
  const userLocation = ref(null)

  // Categories
  const categories = ref([
    { id: 'all', name: 'Все категории', icon: '🗺️', color: '#667eea' },
    { id: 'food', name: '🍕 Еда и рестораны', icon: '🍕', color: '#FF6B6B' },
    { id: 'shopping', name: '🛍️ Магазины', icon: '🛍️', color: '#4ECDC4' },
    { id: 'beauty', name: '💄 Салоны красоты', icon: '💄', color: '#FFD166' },
    { id: 'services', name: '🔧 Услуги', icon: '🔧', color: '#06D6A0' },
    { id: 'medical', name: '⚕️ Медицина', icon: '⚕️', color: '#118AB2' },
    { id: 'furniture', name: '🛋️ Мебель и декор', icon: '🛋️', color: '#073B4C' },
    { id: 'pharmacy', name: '💊 Аптеки', icon: '💊', color: '#EF476F' }
  ])

  // Computed
  const filteredOffers = computed(() => {
    let filtered = offers.value

    // Filter by category
    if (selectedCategory.value !== 'all') {
      filtered = filtered.filter(offer => offer.category === selectedCategory.value)
    }

    // Filter by search query
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

  const selectedCategoryInfo = computed(() => {
    return categories.value.find(cat => cat.id === selectedCategory.value) || categories.value[0]
  })

  // Actions
  const fetchOffers = async () => {
    isLoading.value = true
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data
      offers.value = [
        {
          id: 1,
          title: 'Кофейня "Уютный уголок"',
          description: 'Лучший кофе в городе, свежая выпечка, уютная атмосфера',
          category: 'food',
          address: 'ул. Примерная, 123',
          phone: '+7 (999) 123-45-67',
          workingHours: '8:00-23:00',
          rating: 4.8,
          reviews: 34,
          image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400',
          coordinates: [55.751244, 37.618423]
        },
        {
          id: 2,
          title: 'ТЦ "Мега"',
          description: 'Крупный торговый центр с множеством магазинов',
          category: 'shopping',
          address: 'ул. Торговая, 456',
          phone: '+7 (999) 234-56-78',
          workingHours: '10:00-22:00',
          rating: 4.5,
          reviews: 89,
          image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400',
          coordinates: [55.753215, 37.622504]
        }
      ]
    } catch (error) {
      console.error('Error fetching offers:', error)
    } finally {
      isLoading.value = false
    }
  }

  const setSelectedCategory = (categoryId) => {
    selectedCategory.value = categoryId
  }

  const setSearchQuery = (query) => {
    searchQuery.value = query
  }

  const setSelectedOffer = (offer) => {
    selectedOffer.value = offer
  }

  const setUserLocation = (location) => {
    userLocation.value = location
  }

  const searchByAddress = async (address) => {
    isLoading.value = true
    try {
      // In a real app, this would geocode the address
      console.log('Searching for address:', address)
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      console.error('Error searching by address:', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    offers,
    selectedCategory,
    searchQuery,
    selectedOffer,
    isLoading,
    userLocation,
    categories,
    
    // Computed
    filteredOffers,
    selectedCategoryInfo,
    
    // Actions
    fetchOffers,
    setSelectedCategory,
    setSearchQuery,
    setSelectedOffer,
    setUserLocation,
    searchByAddress
  }
})
