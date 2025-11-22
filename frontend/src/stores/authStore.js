import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiService } from '../services/api.js'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const telegramAuthData = ref(null)

  // Computed
  const userRole = computed(() => user.value?.role || 'guest')
  const isBusinessOwner = computed(() => userRole.value === 'business_owner')

  // Actions
  const initTelegramAuth = () => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp
      tg.ready()
      tg.expand()
      
      const userData = tg.initDataUnsafe?.user
      if (userData) {
        telegramAuthData.value = {
          id: userData.id,
          firstName: userData.first_name,
          lastName: userData.last_name,
          username: userData.username,
          languageCode: userData.language_code,
          allowsWriteToPm: userData.allows_write_to_pm,
          photoUrl: userData.photo_url,
          authDate: userData.auth_date
        }

        // Автоматическая регистрация/логин через Telegram
        loginWithTelegram(telegramAuthData.value)
      }
    } else {
      // Fallback для разработки
      const mockUser = {
        id: 1,
        name: 'Демо Пользователь',
        username: 'demo_user',
        avatar: '👤',
        email: 'demo@mapchap.com',
        phone: '+7 (999) 123-45-67',
        role: 'business_owner',
        registrationDate: new Date('2024-01-01').toISOString(),
        stats: {
          offers: 3,
          articles: 2,
          favorites: 5
        }
      }
      setUser(mockUser)
    }
  }

  const loginWithTelegram = async (tgData) => {
    try {
      isLoading.value = true
      
      // В реальном приложении здесь будет запрос к бэкенду
      const response = await apiService.telegramAuth(tgData)
      
      const userData = {
        id: tgData.id,
        name: `${tgData.firstName} ${tgData.lastName || ''}`.trim(),
        username: tgData.username,
        avatar: '👤',
        email: `${tgData.username}@telegram.org`,
        phone: 'Не указан',
        role: 'user', // По умолчанию обычный пользователь
        registrationDate: new Date().toISOString(),
        stats: {
          offers: 0,
          articles: 0,
          favorites: 0
        }
      }

      setUser(userData)
      localStorage.setItem('mapchap-user', JSON.stringify(userData))
      
      return userData
    } catch (error) {
      console.error('Telegram auth error:', error)
      
      // Fallback на локальную аутентификацию при ошибке API
      const userData = {
        id: tgData.id,
        name: `${tgData.firstName} ${tgData.lastName || ''}`.trim(),
        username: tgData.username,
        avatar: '👤',
        email: `${tgData.username}@telegram.org`,
        phone: 'Не указан',
        role: 'user',
        registrationDate: new Date().toISOString(),
        stats: {
          offers: 0,
          articles: 0,
          favorites: 0
        }
      }

      setUser(userData)
      localStorage.setItem('mapchap-user', JSON.stringify(userData))
      
      return userData
    } finally {
      isLoading.value = false
    }
  }

  const registerAsBusiness = async (businessData) => {
    try {
      isLoading.value = true
      
      // В реальном приложении - запрос к API
      const response = await apiService.registerBusiness(user.value.id, businessData)
      
      // Обновляем роль пользователя на бизнес
      const updatedUser = {
        ...user.value,
        role: 'business_owner',
        businessInfo: businessData
      }
      
      setUser(updatedUser)
      localStorage.setItem('mapchap-user', JSON.stringify(updatedUser))
      
      return updatedUser
    } catch (error) {
      console.error('Business registration error:', error)
      
      // Fallback на локальное обновление
      const updatedUser = {
        ...user.value,
        role: 'business_owner',
        businessInfo: businessData
      }
      
      setUser(updatedUser)
      localStorage.setItem('mapchap-user', JSON.stringify(updatedUser))
      
      return updatedUser
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    telegramAuthData.value = null
    localStorage.removeItem('mapchap-user')
  }

  const checkAuth = () => {
    const savedUser = localStorage.getItem('mapchap-user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
      } catch (error) {
        console.error('Error parsing saved user data:', error)
        localStorage.removeItem('mapchap-user')
      }
    }
  }

  const updateProfile = async (profileData) => {
    try {
      isLoading.value = true
      
      const updatedUser = {
        ...user.value,
        ...profileData,
        updatedAt: new Date().toISOString()
      }
      
      setUser(updatedUser)
      localStorage.setItem('mapchap-user', JSON.stringify(updatedUser))
      
      return updatedUser
    } catch (error) {
      console.error('Profile update error:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Helper methods
  const setUser = (userData) => {
    user.value = userData
    isAuthenticated.value = !!userData
  }

  // Инициализация при загрузке store
  const initialize = () => {
    checkAuth()
  }

  // Вызываем инициализацию
  initialize()

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    telegramAuthData,
    
    // Computed
    userRole,
    isBusinessOwner,
    
    // Actions
    initTelegramAuth,
    loginWithTelegram,
    registerAsBusiness,
    logout,
    checkAuth,
    updateProfile
  }
})
