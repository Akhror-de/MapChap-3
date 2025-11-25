import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const isBurgerMenuOpen = ref(false)
  const isDarkTheme = ref(false)
  const activePanel = ref(null)
  const currentArticle = ref(null)
  const notification = ref(null)

  const isAnyPanelOpen = computed(() => activePanel.value !== null)

  const toggleBurgerMenu = () => {
    isBurgerMenuOpen.value = !isBurgerMenuOpen.value
    if (!isBurgerMenuOpen.value) {
      activePanel.value = null
      currentArticle.value = null
    }
  }

  const openPanel = (panelName) => {
    activePanel.value = panelName
  }

  const closePanel = () => {
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

  const toggleTheme = () => {
    isDarkTheme.value = !isDarkTheme.value
    localStorage.setItem('mapchap-theme', isDarkTheme.value ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark-theme', isDarkTheme.value)
  }

  // Инициализация темы
  const saved = localStorage.getItem('mapchap-theme')
  isDarkTheme.value = saved === 'dark'
  document.documentElement.classList.toggle('dark-theme', isDarkTheme.value)

  return {
    isBurgerMenuOpen,
    isDarkTheme,
    activePanel,
    currentArticle,
    notification,
    isAnyPanelOpen,
    toggleBurgerMenu,
    openPanel,
    closePanel,
    openArticle,
    showNotification,
    toggleTheme
  }
})
