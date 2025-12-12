import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUIStore = defineStore('ui', () => {
  // State
  const activePanel = ref(null)
  const notification = ref(null)
  const currentArticle = ref(null)
  const selectedOffer = ref(null)
  const isMapReady = ref(false)

  // Actions
  const openPanel = (panelName) => {
    activePanel.value = panelName
    console.log(`📂 Panel opened: ${panelName}`)
  }

  const closePanel = () => {
    activePanel.value = null
    console.log('📁 Panel closed')
  }

  const setCurrentArticle = (article) => {
    currentArticle.value = article
  }

  const setSelectedOffer = (offer) => {
    selectedOffer.value = offer
  }

  const showNotification = (message, type = 'info') => {
    notification.value = { message, type }
    
    setTimeout(() => {
      notification.value = null
    }, 3000)
  }

  const setMapReady = (ready) => {
    isMapReady.value = ready
  }

  return {
    activePanel,
    notification,
    currentArticle,
    selectedOffer,
    isMapReady,
    openPanel,
    closePanel,
    setCurrentArticle,
    setSelectedOffer,
    showNotification,
    setMapReady
  }
})
