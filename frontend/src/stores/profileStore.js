import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProfileStore = defineStore('profile', () => {
  // State
  const favorites = ref([])
  const userStats = ref({
    totalFavorites: 0,
    totalViews: 0,
    totalComments: 0,
    daysActive: 0,
    categoryDistribution: [],
    monthlyActivity: [],
    achievements: []
  })

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
  const getFavorites = () => {
    // Mock data
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
  }

  const removeFavorite = async (favoriteId) => {
    favorites.value = favorites.value.filter(fav => fav.id !== favoriteId)
    return Promise.resolve()
  }

  const updateUserProfile = async (profileData) => {
    console.log('Updating profile with:', profileData)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(profileData)
      }, 1000)
    })
  }

  const loadUserStats = () => {
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
  }

  const init = () => {
    getFavorites()
    loadUserStats()
  }

  return {
    favorites,
    userStats,
    totalFavorites,
    favoriteCategories,
    avgRating,
    getFavorites,
    removeFavorite,
    updateUserProfile,
    loadUserStats,
    init
  }
})
