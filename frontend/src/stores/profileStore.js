import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProfileStore = defineStore('profile', () => {
  // State
  const favorites = ref([])
  const userStats = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const totalFavorites = computed(() => favorites.value.length)
  const favoriteCategories = computed(() => {
    const categories = favorites.value.map(fav => fav.category)
    return [...new Set(categories)].length
  })
  const avgRating = computed(() => {
    if (favorites.value.length === 0) return '0.0'
    const ratedFavorites = favorites.value.filter(fav => fav.rating)
    if (ratedFavorites.length === 0) return '0.0'
    const sum = ratedFavorites.reduce((acc, fav) => acc + fav.rating, 0)
    return (sum / ratedFavorites.length).toFixed(1)
  })

  // Actions
  const getFavorites = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      favorites.value = [
        {
          id: 1,
          name: 'Кофейня "Уютная"',
          category: 'cafe',
          address: 'ул. Примерная, 1',
          rating: 4.5,
          distance: 0.5,
          image: null,
          added_at: '2024-01-15T10:00:00Z'
        }
      ]
    } catch (err) {
      error.value = 'Не удалось загрузить избранное'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const removeFavorite = async (favoriteId) => {
    try {
      const initialLength = favorites.value.length
      favorites.value = favorites.value.filter(fav => fav.id !== favoriteId)
      
      if (favorites.value.length === initialLength) {
        throw new Error('Избранное не найдено')
      }
    } catch (err) {
      error.value = 'Не удалось удалить из избранного'
      throw err
    }
  }

  const updateUserProfile = async (profileData) => {
    isLoading.value = true
    error.value = null
    
    try {
      // Simulate API call with validation
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate server-side validation
          if (profileData.email && !profileData.email.includes('@')) {
            reject(new Error('Некорректный email адрес'))
            return
          }
          resolve(profileData)
        }, 1000)
      })
      
      return profileData
    } catch (err) {
      error.value = err.message || 'Ошибка при обновлении профиля'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const loadUserStats = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      userStats.value = {
        totalFavorites: favorites.value.length,
        totalViews: 124,
        totalComments: 12,
        daysActive: 45,
        categoryDistribution: [
          { name: 'Кафе', icon: '☕', count: 5 },
          { name: 'Рестораны', icon: '🍕', count: 3 }
        ],
        monthlyActivity: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU'),
          activity: Math.floor(Math.random() * 10) + 1
        })),
        achievements: [
          {
            id: 1,
            name: 'Первое избранное',
            description: 'Добавьте первое место в избранное',
            icon: '⭐',
            unlocked: true,
            unlockedAt: '2024-01-10T12:00:00Z'
          }
        ]
      }
    } catch (err) {
      error.value = 'Не удалось загрузить статистику'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const init = async () => {
    try {
      await Promise.all([
        getFavorites(),
        loadUserStats()
      ])
    } catch (err) {
      console.error('Profile initialization error:', err)
      throw err
    }
  }

  return {
    // State
    favorites,
    userStats,
    isLoading,
    error,
    
    // Getters
    totalFavorites,
    favoriteCategories,
    avgRating,
    
    // Actions
    getFavorites,
    removeFavorite,
    updateUserProfile,
    loadUserStats,
    init
  }
})
