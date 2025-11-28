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
    if (favorites.value.length === 0) return 0
    const sum = favorites.value.reduce((acc, fav) => acc + (fav.rating || 0), 0)
    return (sum / favorites.value.length).toFixed(1)
  })

  // Actions
  const getFavorites = () => {
    // Mock data - в реальном приложении будет API запрос
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
      },
      {
        id: 2,
        name: 'Ресторан "Вкусно"',
        category: 'restaurant',
        address: 'ул. Примерная, 2',
        rating: 4.8,
        distance: 1.2,
        image: null,
        added_at: '2024-01-14T15:30:00Z'
      }
    ]
  }

  const removeFavorite = async (favoriteId) => {
    // Mock implementation
    favorites.value = favorites.value.filter(fav => fav.id !== favoriteId)
    return Promise.resolve()
  }

  const updateUserProfile = async (profileData) => {
    // Mock implementation
    console.log('Updating profile with:', profileData)
    return Promise.resolve()
  }

  const loadUserStats = () => {
    // Mock data
    userStats.value = {
      totalFavorites: favorites.value.length,
      totalViews: 124,
      totalComments: 12,
      daysActive: 45,
      categoryDistribution: [
        { name: 'Кафе', icon: '☕', count: 5 },
        { name: 'Рестораны', icon: '🍕', count: 3 },
        { name: 'Магазины', icon: '🛍️', count: 2 },
        { name: 'Услуги', icon: '🔧', count: 1 }
      ],
      monthlyActivity: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
        activity: Math.floor(Math.random() * 10)
      })).reverse(),
      achievements: [
        {
          id: 1,
          name: 'Первое избранное',
          description: 'Добавьте первое место в избранное',
          icon: '⭐',
          unlocked: true,
          unlockedAt: '2024-01-10T12:00:00Z'
        },
        {
          id: 2,
          name: 'Исследователь',
          description: 'Добавьте 10 мест в избранное',
          icon: '🧭',
          unlocked: false,
          progress: 70
        },
        {
          id: 3,
          name: 'Критик',
          description: 'Оставьте 5 комментариев',
          icon: '💬',
          unlocked: false,
          progress: 40
        }
      ]
    }
  }

  // Initialize store
  const init = () => {
    getFavorites()
    loadUserStats()
  }

  return {
    // State
    favorites,
    userStats,
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
