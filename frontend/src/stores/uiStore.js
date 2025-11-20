import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const isBurgerMenuOpen = ref(false)
  const activePanel = ref(null) // 'profile', 'business', 'blog', 'about', 'article'
  const isDarkTheme = ref(false)
  const currentArticle = ref(null)
  const notification = ref(null)

  // Действия
  const toggleBurgerMenu = () => {
    isBurgerMenuOpen.value = !isBurgerMenuOpen.value
  }

  const openPanel = (panelName) => {
    activePanel.value = panelName
    isBurgerMenuOpen.value = false
  }

  const closePanel = () => {
    activePanel.value = null
    currentArticle.value = null
  }

  const openArticle = (article) => {
    currentArticle.value = article
    activePanel.value = 'article'
    isBurgerMenuOpen.value = false
  }

  const showNotification = (message, type = 'info') => {
    notification.value = { message, type }
    setTimeout(() => {
      notification.value = null
    }, 3000)
  }

  const toggleTheme = () => {
    isDarkTheme.value = !isDarkTheme.value
    localStorage.setItem('mapchap-theme', isDarkTheme.value ? 'dark' : 'light')
    
    if (isDarkTheme.value) {
      document.body.classList.add('dark-theme')
    } else {
      document.body.classList.remove('dark-theme')
    }
  }

  // Инициализация темы
  const initTheme = () => {
    const savedTheme = localStorage.getItem('mapchap-theme')
    if (savedTheme) {
      isDarkTheme.value = savedTheme === 'dark'
      if (isDarkTheme.value) {
        document.body.classList.add('dark-theme')
      }
    }
  }

  // Computed
  const isPanelOpen = computed(() => activePanel.value !== null)
  const currentPanel = computed(() => activePanel.value)

  return {
    // State
    isBurgerMenuOpen,
    activePanel,
    isDarkTheme,
    currentArticle,
    notification,
    
    // Computed
    isPanelOpen,
    currentPanel,
    
    // Actions
    toggleBurgerMenu,
    openPanel,
    closePanel,
    openArticle,
    showNotification,
    toggleTheme,
    initTheme
  }
})
