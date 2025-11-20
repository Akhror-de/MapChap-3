import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const isBurgerMenuOpen = ref(false)
  const activeModal = ref(null)
  const isDarkTheme = ref(false)
  const currentArticle = ref(null)
  const notification = ref(null)

  // Действия
  const toggleBurgerMenu = () => {
    isBurgerMenuOpen.value = !isBurgerMenuOpen.value
  }

  const openModal = (modalName) => {
    activeModal.value = modalName
    isBurgerMenuOpen.value = false
  }

  const closeModal = () => {
    activeModal.value = null
    currentArticle.value = null
  }

  const openArticle = (article) => {
    currentArticle.value = article
    activeModal.value = 'article'
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

  return {
    isBurgerMenuOpen,
    activeModal,
    isDarkTheme,
    currentArticle,
    notification,
    toggleBurgerMenu,
    openModal,
    closeModal,
    openArticle,
    showNotification,
    toggleTheme,
    initTheme
  }
})
