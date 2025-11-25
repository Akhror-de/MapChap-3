import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUIStore = defineStore('ui', () => {
  // State
  const isBurgerMenuOpen = ref(false)
  const isDarkTheme = ref(false)
  const activePanel = ref(null)
  const currentArticle = ref(null)
  const notification = ref(null)
  const isLoading = ref(false)

  // Computed
  const isAnyPanelOpen = computed(() => isBurgerMenuOpen.value || activePanel.value !== null)

  // Actions
  const toggleBurgerMenu = () => {
    console.log('🔄 Toggling burger menu, current state:', isBurgerMenuOpen.value)
    isBurgerMenuOpen.value = !isBurgerMenuOpen.value
    if (!isBurgerMenuOpen.value) {
      activePanel.value = null
      currentArticle.value = null
    }
  }

  const openPanel = (panelName) => {
    console.log('🎯 Opening panel:', panelName)
    activePanel.value = panelName
    isBurgerMenuOpen.value = true
    console.log('✅ Panel state after open:', activePanel.value, 'Menu open:', isBurgerMenuOpen.value)
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
    isBurgerMenuOpen,
    isDarkTheme,
    activePanel,
    currentArticle,
    notification,
    isLoading,
    
    // Computed
    isAnyPanelOpen,
    
    // Actions
    toggleBurgerMenu,
    openPanel,
    closePanel,
    openArticle,
    showNotification,
    toggleTheme,
    initTheme,
    setLoading
  }
})
