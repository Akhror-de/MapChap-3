import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUIStore = defineStore('ui', () => {
  // State
  const isDarkTheme = ref(false)
  const activePanel = ref(null)
  const currentArticle = ref(null)
  const notification = ref(null)
  const isLoading = ref(false)

  // Computed
  const isAnyPanelOpen = computed(() => activePanel.value !== null)

  // Actions
  const openPanel = (panelName) => {
    console.log('🎯 Opening panel:', panelName)
    activePanel.value = panelName
  }

  const closePanel = () => {
    console.log('📪 Closing panel')
    activePanel.value = null
    currentArticle.value = null
  }

  const openArticle = (article) => {
    currentArticle.value = article
    activePanel.value = 'article'
  }

  const showNotification = (message, type = 'info', duration = 3000) => {
    notification.value = { message, type }
    setTimeout(() => {
      notification.value = null
    }, duration)
  }

  const initTheme = () => {
    const saved = localStorage.getItem('mapchap-theme')
    isDarkTheme.value = saved === 'dark'
    document.documentElement.classList.toggle('dark-theme', isDarkTheme.value)
  }

  const toggleTheme = () => {
    isDarkTheme.value = !isDarkTheme.value
    localStorage.setItem('mapchap-theme', isDarkTheme.value ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark-theme', isDarkTheme.value)
  }

  const setLoading = (loading) => {
    isLoading.value = loading
  }

  // Инициализация
  initTheme()

  return {
    // State
    isDarkTheme,
    activePanel,
    currentArticle,
    notification,
    isLoading,
    
    // Computed
    isAnyPanelOpen,
    
    // Actions
    openPanel,
    closePanel,
    openArticle,
    showNotification,
    toggleTheme,
    initTheme,
    setLoading
  }
})
