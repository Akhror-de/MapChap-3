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
  const mapMarkers = ref([])
  const mapBounds = ref(null)
  const currentZoom = ref(10)

  // Categories
  const categories = ref([
    { id: 'all', name: 'Все категории', icon: '🗺️', color: '#667eea' },
    { id: 'food', name: '🍕 Еда и рестораны', icon: '🍕', color: '#FF6B6B' },
    { id: 'shopping', name: '🛍️ Магазины', icon: '🛍️', color: '#4ECDC4' },
    { id: 'beauty', name: '💄 Салоны красоты', icon: '💄', color: '#FFD166' },
    { id: 'services', name: '🔧 Услуги', icon: '🔧', color: '#06D6A0' },
    { id: 'medical', name: '⚕️ Медицина', icon: '⚕️', color: '#118AB2' },
    { id: 'furniture', name: '🛋️ Мебель и декор', icon: '🛋️', color: '#073B4C' },
    { id: 'pharmacy', name: '💊 Аптеки', icon: '💊', color: '#EF476F' },
    { id: 'entertainment', name: '🎭 Развлечения', icon: '🎭', color: '#7209B7' },
    { id: 'education', name: '📚 Образование', icon: '📚', color: '#F72585' },
    { id: 'auto', name: '🚗 Автосервисы', icon: '🚗', color: '#4361EE' },
    { id: 'hotel', name: '🏨 Отели', icon: '🏨', color: '#4CC9F0' }
  ])

  // Utils functions (copied from yandexMaps.js to avoid import issues)
  const MapUtils = {
    calculateDistance(coords1, coords2) {
      const [lat1, lon1] = coords1
      const [lat2, lon2] = coords2

      const R = 6371 // Радиус Земли в км
      const dLat = (lat2 - lat1) * Math.PI / 180
      const dLon = (lon2 - lon1) * Math.PI / 180
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      return R * c
    },

    isPointInBounds(point, bounds) {
      if (!bounds || !point) return false
      const [[south, west], [north, east]] = bounds
      const [lat, lng] = point
      
      return (
        lat >= south &&
        lat <= north &&
        lng >= west &&
        lng <= east
      )
    }
  }

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
        offer.address.toLowerCase().includes(query) ||
        (offer.tags && offer.tags.some(tag => tag.toLowerCase().includes(query)))
      )
    }

    // Filter by map bounds if available
    if (mapBounds.value) {
      filtered = filtered.filter(offer => 
        offer.coordinates && 
        MapUtils.isPointInBounds(offer.coordinates, mapBounds.value)
      )
    }

    return filtered
  })

  const selectedCategoryInfo = computed(() => {
    return categories.value.find(cat => cat.id === selectedCategory.value) || categories.value[0]
  })

  const offersStats = computed(() => {
    const total = offers.value.length
    const active = offers.value.filter(offer => offer.status === 'active').length
    const featured = offers.value.filter(offer => offer.featured).length
    
    const categoryStats = {}
    offers.value.forEach(offer => {
      categoryStats[offer.category] = (categoryStats[offer.category] || 0) + 1
    })

    return {
      total,
      active,
      featured,
      categoryStats
    }
  })

  const nearbyOffers = computed(() => {
    if (!userLocation.value) return []
    
    return offers.value
      .filter(offer => offer.coordinates)
      .map(offer => ({
        ...offer,
        distance: MapUtils.calculateDistance(userLocation.value, offer.coordinates)
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10)
  })

  // Actions
  const fetchOffers = async () => {
    isLoading.value = true
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data with more realistic offers
      offers.value = [
        {
          id: 1,
          title: 'Кофейня "Уютный уголок"',
          description: 'Лучший кофе в городе, свежая выпечка, уютная атмосфера. Работаем с 2018 года.',
          category: 'food',
          address: 'ул. Примерная, 123',
          phone: '+7 (999) 123-45-67',
          email: 'coffee@example.com',
          website: 'https://coffee-example.com',
          workingHours: '8:00-23:00',
          priceLevel: 'medium',
          rating: 4.8,
          reviews: 34,
          views: 1245,
          likes: 89,
          image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400',
          images: [
            'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400',
            'https://images.unsplash.com/photo-1542181961-9590d0c79dab?w=400'
          ],
          coordinates: [55.751244, 37.618423],
          tags: ['кофе', 'выпечка', 'завтраки', 'wi-fi'],
          features: ['wi-fi', 'takeaway', 'outdoor', 'cards'],
          status: 'active',
          featured: true,
          verified: true,
          createdAt: new Date('2024-01-15').toISOString(),
          updatedAt: new Date('2024-01-15').toISOString()
        },
        {
          id: 2,
          title: 'ТЦ "Мега"',
          description: 'Крупный торговый центр с множеством магазинов известных брендов.',
          category: 'shopping',
          address: 'ул. Торговая, 456',
          phone: '+7 (999) 234-56-78',
          workingHours: '10:00-22:00',
          priceLevel: 'medium',
          rating: 4.5,
          reviews: 89,
          views: 2456,
          likes: 156,
          image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400',
          coordinates: [55.753215, 37.622504],
          tags: ['торговый центр', 'магазины', 'бренды'],
          features: ['parking', 'cards', 'kids'],
          status: 'active',
          featured: false,
          verified: true,
          createdAt: new Date('2024-01-10').toISOString(),
          updatedAt: new Date('2024-01-10').toISOString()
        },
        {
          id: 3,
          title: 'Салон красоты "Элегант"',
          description: 'Парикмахерские услуги, маникюр, педикюр, косметология.',
          category: 'beauty',
          address: 'ул. Красивая, 789',
          phone: '+7 (999) 345-67-89',
          workingHours: '9:00-21:00',
          priceLevel: 'premium',
          rating: 4.9,
          reviews: 23,
          views: 567,
          likes: 45,
          image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400',
          coordinates: [55.749762, 37.621594],
          tags: ['парикмахерская', 'маникюр', 'косметология'],
          features: ['online_booking', 'cards'],
          status: 'active',
          featured: true,
          verified: false,
          createdAt: new Date('2024-01-20').toISOString(),
          updatedAt: new Date('2024-01-20').toISOString()
        }
      ]

      // Load offers from localStorage if available
      const savedOffers = localStorage.getItem('mapchap-offers')
      if (savedOffers) {
        const parsedOffers = JSON.parse(savedOffers)
        // Merge with mock data, giving priority to saved offers
        const mergedOffers = [...offers.value]
        parsedOffers.forEach(savedOffer => {
          const existingIndex = mergedOffers.findIndex(o => o.id === savedOffer.id)
          if (existingIndex !== -1) {
            mergedOffers[existingIndex] = { ...mergedOffers[existingIndex], ...savedOffer }
          } else {
            mergedOffers.push(savedOffer)
          }
        })
        offers.value = mergedOffers
      }

      saveOffersToStorage()
      
    } catch (error) {
      console.error('Error fetching offers:', error)
      // Fallback to localStorage data
      const savedOffers = localStorage.getItem('mapchap-offers')
      if (savedOffers) {
        offers.value = JSON.parse(savedOffers)
      }
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

  const setMapBounds = (bounds) => {
    mapBounds.value = bounds
  }

  const setCurrentZoom = (zoom) => {
    currentZoom.value = zoom
  }

  const searchByAddress = async (address) => {
    isLoading.value = true
    try {
      // Simulate geocoding
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock geocoding result for common addresses
      const mockGeocoding = {
        'москва': [55.7558, 37.6173],
        'санкт-петербург': [59.9343, 30.3351],
        'казань': [55.8304, 49.0661]
      }
      
      const normalizedAddress = address.toLowerCase()
      let coordinates = [55.7558, 37.6173] // Default to Moscow
      
      for (const [key, coords] of Object.entries(mockGeocoding)) {
        if (normalizedAddress.includes(key)) {
          coordinates = coords
          break
        }
      }
      
      // Update search query
      searchQuery.value = address
      
      return {
        coordinates,
        address: address,
        bounds: [[coordinates[0]-0.1, coordinates[1]-0.1], [coordinates[0]+0.1, coordinates[1]+0.1]]
      }
    } catch (error) {
      console.error('Error searching by address:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const createBalloonContent = (offer) => {
    return `
      <div class="map-balloon">
        <h3>${offer.title}</h3>
        <p>${offer.description}</p>
        <div class="balloon-category">${getCategoryName(offer.category)}</div>
        <div class="balloon-address">📍 ${offer.address}</div>
        <div class="balloon-phone">📞 ${offer.phone}</div>
        <div class="balloon-rating">⭐ ${offer.rating} (${offer.reviews} отзывов)</div>
        <div class="balloon-actions">
          <button class="balloon-btn" onclick="window.offersStore.setSelectedOffer(${offer.id})">
            Подробнее
          </button>
        </div>
      </div>
    `
  }

  const getCategoryName = (categoryId) => {
    const category = categories.value.find(cat => cat.id === categoryId)
    return category ? category.name : 'Неизвестно'
  }

  const getCategoryColor = (categoryId) => {
    const category = categories.value.find(cat => cat.id === categoryId)
    return category ? category.color : '#667eea'
  }

  const addOffer = async (offerData) => {
    try {
      const newOffer = {
        id: Date.now(),
        ...offerData,
        status: 'active',
        rating: 0,
        reviews: 0,
        views: 0,
        likes: 0,
        featured: false,
        verified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      offers.value.unshift(newOffer)
      saveOffersToStorage()

      return newOffer
    } catch (error) {
      console.error('Error adding offer:', error)
      throw error
    }
  }

  const updateOffer = async (offerId, offerData) => {
    try {
      const index = offers.value.findIndex(offer => offer.id === offerId)
      if (index !== -1) {
        offers.value[index] = {
          ...offers.value[index],
          ...offerData,
          updatedAt: new Date().toISOString()
        }
        saveOffersToStorage()
        return offers.value[index]
      }
      throw new Error('Offer not found')
    } catch (error) {
      console.error('Error updating offer:', error)
      throw error
    }
  }

  const deleteOffer = async (offerId) => {
    try {
      offers.value = offers.value.filter(offer => offer.id !== offerId)
      saveOffersToStorage()
    } catch (error) {
      console.error('Error deleting offer:', error)
      throw error
    }
  }

  const toggleOfferLike = (offerId) => {
    const offer = offers.value.find(offer => offer.id === offerId)
    if (offer) {
      offer.likes += offer.isLiked ? -1 : 1
      offer.isLiked = !offer.isLiked
      saveOffersToStorage()
    }
  }

  const incrementOfferViews = (offerId) => {
    const offer = offers.value.find(offer => offer.id === offerId)
    if (offer) {
      offer.views++
      saveOffersToStorage()
    }
  }

  const getOffersByCategory = (categoryId) => {
    return offers.value.filter(offer => offer.category === categoryId)
  }

  const getFeaturedOffers = () => {
    return offers.value.filter(offer => offer.featured)
  }

  const getNearbyOffers = (coordinates, radius = 5) => {
    return offers.value
      .filter(offer => offer.coordinates)
      .map(offer => ({
        ...offer,
        distance: MapUtils.calculateDistance(coordinates, offer.coordinates)
      }))
      .filter(offer => offer.distance <= radius)
      .sort((a, b) => a.distance - b.distance)
  }

  const saveOffersToStorage = () => {
    localStorage.setItem('mapchap-offers', JSON.stringify(offers.value))
  }

  const clearFilters = () => {
    selectedCategory.value = 'all'
    searchQuery.value = ''
    selectedOffer.value = null
    mapBounds.value = null
  }

  // Initialize store
  const initialize = () => {
    fetchOffers()
    
    // Make store available globally for balloon callbacks
    if (typeof window !== 'undefined') {
      window.offersStore = {
        setSelectedOffer: (offerId) => {
          const offer = offers.value.find(o => o.id === offerId)
          if (offer) {
            setSelectedOffer(offer)
          }
        }
      }
    }
  }

  // Call initialization
  initialize()

  return {
    // State
    offers,
    selectedCategory,
    searchQuery,
    selectedOffer,
    isLoading,
    userLocation,
    mapMarkers,
    mapBounds,
    currentZoom,
    categories,
    
    // Computed
    filteredOffers,
    selectedCategoryInfo,
    offersStats,
    nearbyOffers,
    
    // Actions
    fetchOffers,
    setSelectedCategory,
    setSearchQuery,
    setSelectedOffer,
    setUserLocation,
    setMapBounds,
    setCurrentZoom,
    searchByAddress,
    addOffer,
    updateOffer,
    deleteOffer,
    toggleOfferLike,
    incrementOfferViews,
    getOffersByCategory,
    getFeaturedOffers,
    getNearbyOffers,
    clearFilters,
    getCategoryName,
    getCategoryColor
  }
})
