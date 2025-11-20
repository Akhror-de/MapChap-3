import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)
  const telegramAuthData = ref(null)

  // Имитация Telegram Web App аутентификации
  const initTelegramAuth = () => {
    // В реальном приложении здесь будет интеграция с Telegram Web App
    const mockTelegramUser = {
      id: 123456789,
      first_name: 'Ахрор',
      last_name: 'Хабибуллаев',
      username: 'akhror_dev',
      photo_url: 'https://via.placeholder.com/100',
      auth_date: Math.floor(Date.now() / 1000),
      hash: 'mock_hash_for_development'
    }
    
    telegramAuthData.value = mockTelegramUser
    user.value = {
      id: mockTelegramUser.id,
      name: `${mockTelegramUser.first_name} ${mockTelegramUser.last_name}`,
      username: mockTelegramUser.username,
      avatar: '👨‍💼',
      email: 'khabibullaevakhrorjon@gmail.com',
      phone: '+7 (999) 821-47-58',
      registrationDate: new Date().toISOString(),
      role: 'business_owner'
    }
    isAuthenticated.value = true
    
    localStorage.setItem('telegram_auth', JSON.stringify(mockTelegramUser))
    console.log('Telegram auth initialized:', mockTelegramUser)
  }

  const checkAuth = () => {
    const savedAuth = localStorage.getItem('telegram_auth')
    if (savedAuth) {
      telegramAuthData.value = JSON.parse(savedAuth)
      user.value = {
        id: telegramAuthData.value.id,
        name: `${telegramAuthData.value.first_name} ${telegramAuthData.value.last_name}`,
        username: telegramAuthData.value.username,
        avatar: '👨‍💼',
        email: 'khabibullaevakhrorjon@gmail.com',
        phone: '+7 (999) 821-47-58',
        registrationDate: new Date().toISOString(),
        role: 'business_owner'
      }
      isAuthenticated.value = true
    }
    return isAuthenticated.value
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    telegramAuthData.value = null
    localStorage.removeItem('telegram_auth')
  }

  const updateProfile = (profileData) => {
    if (user.value) {
      user.value = { ...user.value, ...profileData }
    }
  }

  return {
    user,
    isAuthenticated,
    telegramAuthData,
    initTelegramAuth,
    checkAuth,
    logout,
    updateProfile
  }
})
