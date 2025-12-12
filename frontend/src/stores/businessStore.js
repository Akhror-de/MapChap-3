import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiService } from '../services/api.js'
import { useAuthStore } from './authStore.js'

export const useBusinessStore = defineStore('business', () => {
  const authStore = useAuthStore()
  
  // State
  const userOffers = ref([])
  const isLoading = ref(false)
  const categories = ref([
    { id: 'food', name: 'Еда и рестораны', icon: '🍕', color: '#FF6B6B' },
    { id: 'shopping', name: 'Магазины', icon: '🛍️', color: '#4ECDC4' },
    { id: 'beauty', name: 'Салоны красоты', icon: '💄', color: '#FFD166' },
    { id: 'services', name: 'Услуги', icon: '🔧', color: '#06D6A0' },
    { id: 'medical', name: 'Медицина', icon: '⚕️', color: '#118AB2' },
    { id: 'furniture', name: 'Мебель и декор', icon: '🛋️', color: '#073B4C' },
    { id: 'pharmacy', name: 'Аптеки', icon: '💊', color: '#EF476F' },
    { id: 'entertainment', name: 'Развлечения', icon: '🎭', color: '#7209B7' },
    { id: 'education', name: 'Образование', icon: '📚', color: '#F72585' },
    { id: 'auto', name: 'Автосервисы', icon: '🚗', color: '#4361EE' },
    { id: 'hotel', name: 'Отели', icon: '🏨', color: '#4CC9F0' }
  ])

  // Computed
  const getUserOffers = computed(() => userOffers.value)
  
  const getCategoryById = (id) => {
    return categories.value.find(c => c.id === id)
  }

  // Actions
  const loadUserOffers = async () => {
    if (!authStore.user?.telegram_id) return
    
    isLoading.value = true
    try {
      const result = await apiService.getUserOffers(authStore.user.telegram_id)
      userOffers.value = result.offers || []
    } catch (error) {
      console.log('Load offers error:', error)
      userOffers.value = []
    } finally {
      isLoading.value = false
    }
  }

  const createOffer = async (offerData) => {
    if (!authStore.user?.telegram_id) throw new Error('Not authenticated')
    
    try {
      const result = await apiService.createOffer(authStore.user.telegram_id, offerData)
      userOffers.value.push(result)
      return result
    } catch (error) {
      console.log('Create offer error:', error)
      // Добавляем локально
      const newOffer = {
        id: String(Date.now()),
        ...offerData,
        status: 'active',
        views: 0,
        likes: 0,
        created_at: new Date().toISOString()
      }
      userOffers.value.push(newOffer)
      return newOffer
    }
  }

  const updateOffer = async (offerId, updates) => {
    if (!authStore.user?.telegram_id) throw new Error('Not authenticated')
    
    try {
      const result = await apiService.updateOffer(offerId, authStore.user.telegram_id, updates)
      const index = userOffers.value.findIndex(o => o.id === offerId)
      if (index !== -1) {
        userOffers.value[index] = result
      }
      return result
    } catch (error) {
      console.log('Update offer error:', error)
      // Обновляем локально
      const index = userOffers.value.findIndex(o => o.id === offerId)
      if (index !== -1) {
        userOffers.value[index] = { ...userOffers.value[index], ...updates }
      }
    }
  }

  const toggleOfferStatus = async (offerId) => {
    const offer = userOffers.value.find(o => o.id === offerId)
    if (!offer) return
    
    const newStatus = offer.status === 'active' ? 'paused' : 'active'
    await updateOffer(offerId, { status: newStatus })
  }

  const deleteOffer = async (offerId) => {
    if (!authStore.user?.telegram_id) throw new Error('Not authenticated')
    
    try {
      await apiService.deleteOffer(offerId, authStore.user.telegram_id)
      userOffers.value = userOffers.value.filter(o => o.id !== offerId)
    } catch (error) {
      console.log('Delete offer error:', error)
      userOffers.value = userOffers.value.filter(o => o.id !== offerId)
    }
  }

  return {
    userOffers,
    isLoading,
    categories,
    getUserOffers,
    getCategoryById,
    loadUserOffers,
    createOffer,
    updateOffer,
    toggleOfferStatus,
    deleteOffer
  }
})
