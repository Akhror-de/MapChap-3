import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useOffersStore = defineStore('offers', () => {
  const selectedCategory = ref('all')
  const searchQuery = ref('')
  const userLocation = ref(null)
  
  // Моковые данные для тестирования
  const offers = ref([
    {
      id: 1,
      title: 'Кофейня "Уютная"',
      category: 'food',
      description: 'Лучший кофе в городе и домашняя выпечка',
      address: 'г. Москва, ул. Примерная, 15',
      phone: '+7 (999) 123-45-67',
      coords: [55.751244, 37.618423],
      rating: 4.5
    },
    {
      id: 2,
      title: 'ТЦ "Мега"',
      category: 'shopping',
      description: 'Крупный торговый центр с множеством магазинов',
      address: 'г. Москва, пр. Центральный, 42',
      phone: '+7 (999) 765-43-21',
      coords: [55.753215, 37.622504],
      rating: 4.2
    }
  ])

  // Действия
  const setSelectedCategory = (category) => {
    selectedCategory.value = category
  }

  const setSearchQuery = (query) => {
    searchQuery.value = query
  }

  const setUserLocation = (location) => {
    userLocation.value = location
  }

  const searchByAddress = (address) => {
    console.log('Searching by address:', address)
    // Здесь будет логика поиска по адресу
  }

  const getFilteredOffers = () => {
    let filtered = offers.value
    
    if (selectedCategory.value !== 'all') {
      filtered = filtered.filter(offer => offer.category === selectedCategory.value)
    }
    
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(offer => 
        offer.title.toLowerCase().includes(query) ||
        offer.address.toLowerCase().includes(query)
      )
    }
    
    return filtered
  }

  return {
    selectedCategory,
    searchQuery,
    userLocation,
    offers,
    setSelectedCategory,
    setSearchQuery,
    setUserLocation,
    searchByAddress,
    getFilteredOffers
  }
})
